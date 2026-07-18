from datetime import date

import pytest

from app.risk_engine.scoring import (
    calculate_consumer_harm,
    calculate_dispute_friction,
    calculate_fraud_risk,
    calculate_recovery_urgency,
    score_band,
)

TYPOLOGIES = [
    "APP scam",
    "Bank impersonation scam",
    "Invoice redirection or business email compromise",
    "Marketplace scam",
    "Romance scam",
    "Investment scam",
    "AML or mule-account risk",
    "Medical debt or credit stress",
    "Mortgage or insurance stress",
    "Financial reporting or disclosure-integrity concern",
    "Other",
    "Insufficient evidence",
]


@pytest.mark.parametrize("typology", TYPOLOGIES)
def test_fraud_risk_score_within_bounds(typology):
    result = calculate_fraud_risk(
        "remote access screen sharing password account takeover guaranteed return",
        typology,
        amount_lost=250_000,
        payment_channel="wire transfer",
        outcome="confirmed fraud",
    )
    assert 0 <= result["score"] <= 100


@pytest.mark.parametrize("typology", TYPOLOGIES)
def test_consumer_harm_score_within_bounds(typology):
    result = calculate_consumer_harm(
        "elderly disability account drained all my savings anxiety",
        typology,
        amount_lost=500_000,
        outcome="denied",
    )
    assert 0 <= result["score"] <= 100


@pytest.mark.parametrize("typology", TYPOLOGIES)
def test_dispute_friction_score_within_bounds(typology):
    result = calculate_dispute_friction(
        "denied closed the case no response called repeatedly transferred appeal",
        typology,
        outcome="denied",
    )
    assert 0 <= result["score"] <= 100


@pytest.mark.parametrize("typology", TYPOLOGIES)
def test_recovery_urgency_score_within_bounds(typology):
    result = calculate_recovery_urgency(
        "today pending freeze recall",
        typology,
        fraud_risk_score=95,
        amount_lost=250_000,
        payment_channel="cryptocurrency",
        outcome="unresolved",
        case_date=date.today().isoformat(),
    )
    assert 0 <= result["score"] <= 100


def test_zero_amount_and_minimal_narrative_still_in_bounds():
    fraud = calculate_fraud_risk("", "Other", amount_lost=0, payment_channel="unknown", outcome="")
    harm = calculate_consumer_harm("", "Other", amount_lost=0, payment_channel="unknown", outcome="")
    friction = calculate_dispute_friction("", "Other", amount_lost=0, payment_channel="unknown", outcome="")
    urgency = calculate_recovery_urgency("", "Other", fraud["score"], amount_lost=0, payment_channel="unknown", outcome="")
    for result in (fraud, harm, friction, urgency):
        assert 0 <= result["score"] <= 100


def test_full_recovery_reduces_harm_and_urgency():
    unresolved = calculate_consumer_harm("account drained", "APP scam", amount_lost=10_000, outcome="denied")
    resolved = calculate_consumer_harm("account drained", "APP scam", amount_lost=10_000, outcome="full refund")
    assert resolved["score"] < unresolved["score"]

    unresolved_urgency = calculate_recovery_urgency(
        "pending", "APP scam", fraud_risk_score=80, amount_lost=10_000, outcome="unresolved"
    )
    resolved_urgency = calculate_recovery_urgency(
        "pending", "APP scam", fraud_risk_score=80, amount_lost=10_000, outcome="full refund"
    )
    assert resolved_urgency["score"] < unresolved_urgency["score"]


def test_score_band_thresholds():
    assert score_band(0) == "Low"
    assert score_band(44) == "Low"
    assert score_band(45) == "Moderate"
    assert score_band(69) == "Moderate"
    assert score_band(70) == "High"
    assert score_band(84) == "High"
    assert score_band(85) == "Critical"
    assert score_band(100) == "Critical"


def test_extremely_long_narrative_does_not_break_scoring():
    long_narrative = "guaranteed return " * 2000
    result = calculate_fraud_risk(long_narrative, "Investment scam", amount_lost=1000)
    assert 0 <= result["score"] <= 100


def test_pending_transaction_increases_recovery_urgency():
    pending = calculate_recovery_urgency(
        "pending", "APP scam", fraud_risk_score=50, amount_lost=1000, structured={"payment_pending": True}
    )
    not_pending = calculate_recovery_urgency(
        "", "APP scam", fraud_risk_score=50, amount_lost=1000, structured={"payment_pending": False}
    )
    assert pending["score"] > not_pending["score"]


def test_credentials_shared_increases_fraud_risk():
    with_creds = calculate_fraud_risk("", "APP scam", structured={"credentials_shared": True})
    without_creds = calculate_fraud_risk("", "APP scam", structured={"credentials_shared": False})
    assert with_creds["score"] > without_creds["score"]
