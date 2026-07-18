from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert "rules_engine_version" in body


def test_analyze_endpoint_happy_path():
    payload = {
        "narrative": "A caller claimed to be from the bank fraud department and asked for a one-time passcode.",
        "structured": {
            "amount_lost": 5000,
            "payment_channel": "instant_payment",
            "reported_outcome": "unresolved",
        },
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["primary_typology"] == "Bank impersonation scam"
    for key in ("fraud_risk", "consumer_harm", "dispute_friction", "recovery_urgency"):
        assert 0 <= body[key]["score"] <= 100
    assert body["case_reference"].startswith("FGA-")


def test_analyze_endpoint_rejects_empty_case():
    response = client.post("/api/analyze", json={"narrative": "", "structured": {"amount_lost": 0}})
    assert response.status_code == 400


def test_analyze_endpoint_redacts_pii_in_response():
    payload = {
        "narrative": "Contact me at jane.doe@example.com or 212-555-0148 about the scam.",
        "structured": {"amount_lost": 100},
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "jane.doe@example.com" not in body["sanitized_narrative"]
    assert "212-555-0148" not in body["sanitized_narrative"]


def test_analyze_endpoint_rejects_oversized_narrative():
    response = client.post("/api/analyze", json={"narrative": "a" * 9000, "structured": {"amount_lost": 100}})
    assert response.status_code == 422
    body = response.json()
    assert "errors" in body
    assert body["detail"] == "Validation failed."


def test_redact_preview_endpoint():
    response = client.post("/api/redact-preview", json={"narrative": "My SSN is 123-45-6789."})
    assert response.status_code == 200
    body = response.json()
    assert "123-45-6789" not in body["sanitized_narrative"]


def test_rule_explorer_endpoint_returns_rules():
    response = client.get("/api/rules")
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 50
    assert all("rule_id" in rule for rule in body)


def test_dashboard_sample_summary_endpoint():
    response = client.get("/api/dashboard/sample-summary")
    assert response.status_code == 200
    body = response.json()
    assert body["total_cases"] == 30
    assert body["notice"].startswith("Synthetic")


def test_dashboard_sample_csv_download():
    response = client.get("/api/dashboard/sample-data.csv")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")


def test_letters_generate_endpoint():
    response = client.post(
        "/api/letters/generate",
        json={
            "template_id": "initial_dispute",
            "case_reference": "FGA-TEST0001",
            "structured": {"amount_lost": 500, "payment_channel": "wire_transfer"},
            "sanitized_narrative": "A sanitized summary of events.",
            "typology": "APP scam",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert "FGA-TEST0001" in body["subject"]
    assert "does not constitute legal advice" in body["disclaimer"]


def test_letters_generate_endpoint_rejects_unknown_template():
    response = client.post(
        "/api/letters/generate",
        json={"template_id": "not-a-real-template", "structured": {}},
    )
    assert response.status_code == 400


def test_reports_pdf_endpoint_returns_pdf_bytes():
    analyze_response = client.post(
        "/api/analyze",
        json={
            "narrative": "A caller claimed to be from the bank fraud department.",
            "structured": {"amount_lost": 2500, "payment_channel": "instant_payment"},
        },
    ).json()
    response = client.post("/api/reports/pdf", json=analyze_response)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content[:4] == b"%PDF"


def test_feedback_endpoint_accepts_and_does_not_echo_storage_claim():
    response = client.post("/api/feedback", json={"comments": "The action plan was clear."})
    assert response.status_code == 200
    assert "not stored" in response.json()["message"]


def test_contact_endpoint_accepts_valid_submission():
    response = client.post(
        "/api/contact",
        json={"inquiry_type": "research", "name": "Jane", "email": "jane@example.com", "message": "Interested in collaborating."},
    )
    assert response.status_code == 200
    assert "not store" in response.json()["message"]


def test_contact_endpoint_rejects_honeypot_fill():
    response = client.post(
        "/api/contact",
        json={"message": "hello", "website": "http://spam.example"},
    )
    assert response.status_code == 400


def test_contact_endpoint_rejects_empty_message():
    response = client.post("/api/contact", json={"message": ""})
    assert response.status_code == 400


def test_security_headers_present():
    response = client.get("/api/health")
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert "content-security-policy" in response.headers
