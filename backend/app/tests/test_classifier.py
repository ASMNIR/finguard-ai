from app.risk_engine.classifier import classify_typology, detect_conflicts, missing_information

BANK_IMPERSONATION_NARRATIVE = (
    "A caller claimed to be from the bank fraud department and the caller ID "
    "showed my bank. I was told to move money to a safe account and provide a "
    "one-time passcode."
)

APP_SCAM_NARRATIVE = "I authorized the transfer myself using an instant payment after a call."

MARKETPLACE_NARRATIVE = "I bought a laptop from an online marketplace. The seller requested payment outside the platform for a shipping fee and then stopped responding. The item never arrived."

ROMANCE_NARRATIVE = "I met someone on a dating app and developed an online relationship. They said they loved me and needed money for a travel emergency."

INVESTMENT_NARRATIVE = "An investment platform promised a guaranteed return. It was a pig butchering scheme and I paid a withdrawal fee before I could take money out."

AML_NARRATIVE = "I received funds for someone else and was told to forward the money and keep a commission. This looked like a pass-through account."

MEDICAL_NARRATIVE = "A hospital bill was placed as a medical collection on my credit report even though it was a billing error."

MORTGAGE_NARRATIVE = "My mortgage servicer misapplied payments and sent a foreclosure warning after a payment was misapplied."

BEC_NARRATIVE = "A vendor email said payment instructions changed and accounts payable used new bank details from a business email compromise."

DISCLOSURE_NARRATIVE = "The financial statements contain misstated revenue and an undisclosed related party was omitted from the investor disclosure."


def test_bank_impersonation_classification():
    result = classify_typology(BANK_IMPERSONATION_NARRATIVE)
    assert result["primary_typology"] == "Bank impersonation scam"
    assert result["evidence_strength"] > 20
    assert any(m["rule_id"].startswith("BIS-") for m in result["matched_indicators"])


def test_app_scam_classification():
    result = classify_typology(APP_SCAM_NARRATIVE)
    assert result["primary_typology"] == "APP scam"


def test_marketplace_classification():
    result = classify_typology(MARKETPLACE_NARRATIVE)
    assert result["primary_typology"] == "Marketplace scam"


def test_romance_classification():
    result = classify_typology(ROMANCE_NARRATIVE)
    assert result["primary_typology"] == "Romance scam"


def test_investment_classification():
    result = classify_typology(INVESTMENT_NARRATIVE)
    assert result["primary_typology"] == "Investment scam"


def test_aml_classification():
    result = classify_typology(AML_NARRATIVE)
    assert result["primary_typology"] == "AML or mule-account risk"


def test_medical_classification():
    result = classify_typology(MEDICAL_NARRATIVE)
    assert result["primary_typology"] == "Medical debt or credit stress"


def test_mortgage_classification():
    result = classify_typology(MORTGAGE_NARRATIVE)
    assert result["primary_typology"] == "Mortgage or insurance stress"


def test_bec_classification():
    result = classify_typology(BEC_NARRATIVE)
    assert result["primary_typology"] == "Invoice redirection or business email compromise"


def test_disclosure_classification():
    result = classify_typology(DISCLOSURE_NARRATIVE)
    assert result["primary_typology"] == "Financial reporting or disclosure-integrity concern"


def test_empty_narrative_is_insufficient_evidence():
    result = classify_typology("")
    assert result["primary_typology"] == "Insufficient evidence"
    assert result["insufficient_evidence"] is True


def test_short_ambiguous_narrative_is_insufficient_evidence():
    result = classify_typology("Something bad happened with money.")
    assert result["primary_typology"] in ("Insufficient evidence", "Other")


def test_negation_suppresses_positive_match():
    negated_text = "The caller did not claim to be from my bank and never asked for a one-time passcode."
    positive_text = "The caller claimed to be from my bank and asked for a one-time passcode."

    negated_result = classify_typology(negated_text)
    positive_result = classify_typology(positive_text)

    assert positive_result["category_scores"]["Bank impersonation scam"] > 0
    assert (
        negated_result["category_scores"]["Bank impersonation scam"]
        < positive_result["category_scores"]["Bank impersonation scam"]
    )


def test_negated_indicator_is_reported_but_not_scored():
    result = classify_typology("The caller never claimed to be from the bank.")
    assert any("claimed to be from the bank" in n["indicator"] for n in result["negated_indicators"])
    assert result["category_scores"]["Bank impersonation scam"] == 0


def test_spelling_tolerance_single_word_indicator():
    exact = classify_typology("The scam involved structuring of deposits and a pass-through account.")
    typo = classify_typology("The scam involved structurng of deposits and a pass-through account.")
    assert exact["category_scores"]["AML or mule-account risk"] > 0
    assert typo["category_scores"]["AML or mule-account risk"] > 0


def test_multi_typology_detection_when_scores_are_close():
    mixed_narrative = (
        "A caller claimed to be from the bank fraud department and told me to move money to a safe "
        "account using a one-time passcode. Separately, an investment platform promised a guaranteed "
        "return and this looked like a pig butchering scheme with a withdrawal fee."
    )
    result = classify_typology(mixed_narrative)
    assert result["primary_typology"] in ("Bank impersonation scam", "Investment scam")


def test_conflict_detection_authorized_vs_denial():
    conflicts = detect_conflicts(
        "I never approved the transfer and did not authorize it.",
        {"payment_authorized": True},
    )
    assert len(conflicts) == 1
    assert conflicts[0]["field"] == "payment_authorized"


def test_no_conflict_when_consistent():
    conflicts = detect_conflicts(
        "I authorized the transfer myself after the call.",
        {"payment_authorized": True},
    )
    assert conflicts == []


def test_missing_information_flags_gaps():
    missing = missing_information("short", {"amount_lost": 0, "payment_channel": "unknown"})
    assert any("payment channel" in m.lower() for m in missing)
