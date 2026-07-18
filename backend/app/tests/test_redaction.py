from app.risk_engine.redaction import redact_narrative


def test_redacts_email():
    text, matches = redact_narrative("Contact me at jane.doe@example.com about this.")
    assert "jane.doe@example.com" not in text
    assert any(m.category == "email" for m in matches)


def test_redacts_phone_number():
    text, matches = redact_narrative("Call me at 212-555-0148 tomorrow.")
    assert "212-555-0148" not in text
    assert any(m.category == "phone" for m in matches)


def test_redacts_ssn_pattern():
    text, matches = redact_narrative("My SSN is 123-45-6789 for verification.")
    assert "123-45-6789" not in text
    assert any(m.category == "ssn" for m in matches)


def test_redacts_card_like_sequence():
    text, matches = redact_narrative("The card number is 4111111111111111 on the statement.")
    assert "4111111111111111" not in text
    assert any(m.category == "card_number" for m in matches)


def test_redacts_verification_code_statement():
    text, matches = redact_narrative("The verification code is 483920 and I read it to them.")
    assert "483920" not in text
    assert any(m.category == "verification_code_statement" for m in matches)


def test_redacts_password_statement():
    text, matches = redact_narrative("My password is hunter22 and I typed it in.")
    assert "hunter22" not in text
    assert any(m.category == "password_statement" for m in matches)


def test_redacts_street_address():
    text, matches = redact_narrative("They asked me to confirm 123 Main Street before continuing.")
    assert "123 Main Street" not in text
    assert any(m.category == "street_address" for m in matches)


def test_clean_narrative_has_no_redactions():
    text, matches = redact_narrative("I lost money to a scam caller yesterday.")
    assert matches == []
    assert text == "I lost money to a scam caller yesterday."


def test_empty_narrative_does_not_error():
    text, matches = redact_narrative("")
    assert text == ""
    assert matches == []
