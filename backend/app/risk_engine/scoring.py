"""Deterministic 0-100 scoring functions.

Ported from the original Streamlit MVP (``app.py``) and extended so that
structured intake fields (not just free narrative text) can contribute
points. Every contribution is appended to a visible ``factors`` list with a
human-readable label and a signed point value, which the API returns
verbatim as the score-contribution table.
"""

from __future__ import annotations

import math
from datetime import date
from typing import Any

from .classifier import normalize_text
from .rules import (
    DISPUTE_FRICTION_RULES,
    FRAUD_RISK_NARRATIVE_INDICATORS,
    PAYMENT_CHANNEL_RISK,
    RECOVERY_TEMPORAL_INDICATORS,
    RECOVERY_URGENT_CHANNELS,
    TYPOLOGY_BASE_RISK,
    TYPOLOGY_RECOVERY_SENSITIVE,
    VULNERABILITY_INDICATORS,
)

SEVERITY_ORDER = ["Low", "Moderate", "High", "Critical"]


def clamp(value: float, minimum: int = 0, maximum: int = 100) -> int:
    return int(round(max(minimum, min(maximum, value))))


def _contains(text: str, phrase: str) -> bool:
    return normalize_text(phrase) in text


def score_band(score: int) -> str:
    if score >= 85:
        return "Critical"
    if score >= 70:
        return "High"
    if score >= 45:
        return "Moderate"
    return "Low"


def _amount_value(amount_lost: Any) -> float:
    try:
        if amount_lost is None:
            return 0.0
        return max(0.0, float(amount_lost))
    except (TypeError, ValueError):
        return 0.0


def calculate_fraud_risk(
    narrative: str,
    typology: str,
    amount_lost: float = 0,
    payment_channel: str = "unknown",
    outcome: str = "",
    structured: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Calculate fraud risk from typology, transaction, and deception indicators."""
    structured = structured or {}
    text = normalize_text(narrative)
    amount = _amount_value(amount_lost)
    channel = normalize_text(payment_channel)
    score = float(TYPOLOGY_BASE_RISK.get(typology, 20))
    factors = [{"factor": f"Base risk for {typology}", "effect": int(score)}]

    for phrase, points, label in FRAUD_RISK_NARRATIVE_INDICATORS:
        if _contains(text, phrase):
            score += points
            factors.append({"factor": label, "effect": points})

    channel_points = 2
    for known_channel, points in PAYMENT_CHANNEL_RISK.items():
        if known_channel in channel:
            channel_points = points
            break
    if channel_points:
        score += channel_points
        factors.append({"factor": f"Payment channel: {payment_channel}", "effect": channel_points})

    amount_points = 0
    if amount >= 100_000:
        amount_points = 15
    elif amount >= 25_000:
        amount_points = 11
    elif amount >= 5_000:
        amount_points = 7
    elif amount >= 1_000:
        amount_points = 4
    if amount_points:
        score += amount_points
        factors.append({"factor": f"Loss amount: ${amount:,.0f}", "effect": amount_points})

    outcome_normalized = normalize_text(outcome)
    if any(_contains(outcome_normalized, term) for term in ["confirmed fraud", "account closed for fraud"]):
        score += 6
        factors.append({"factor": "Outcome indicates confirmed fraud concern", "effect": 6})

    if structured.get("credentials_shared") is True:
        score += 10
        factors.append({"factor": "Structured intake: credentials or authentication code shared", "effect": 10})
    if structured.get("remote_access_provided") is True:
        score += 12
        factors.append({"factor": "Structured intake: remote-device access provided", "effect": 12})
    if structured.get("impersonation_reported") is True:
        score += 8
        factors.append({"factor": "Structured intake: impersonation reported", "effect": 8})
    if structured.get("payment_instructions_changed") is True:
        score += 8
        factors.append({"factor": "Structured intake: payment instructions changed", "effect": 8})

    return {"score": clamp(score), "factors": factors}


def calculate_consumer_harm(
    narrative: str,
    typology: str,
    amount_lost: float = 0,
    payment_channel: str = "unknown",
    outcome: str = "",
    structured: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Estimate financial, vulnerability, and essential-service consumer harm."""
    structured = structured or {}
    text = normalize_text(narrative)
    amount = _amount_value(amount_lost)
    score = 8.0
    factors = [{"factor": "Baseline consumer impact", "effect": 8}]

    if amount >= 100_000:
        amount_points = 65
    elif amount >= 50_000:
        amount_points = 56
    elif amount >= 10_000:
        amount_points = 45
    elif amount >= 5_000:
        amount_points = 36
    elif amount >= 1_000:
        amount_points = 27
    elif amount > 0:
        amount_points = 16
    else:
        amount_points = 5
    score += amount_points
    factors.append({"factor": f"Magnitude of reported loss: ${amount:,.0f}", "effect": amount_points})

    for phrases, points, label in VULNERABILITY_INDICATORS:
        if any(_contains(text, phrase) for phrase in phrases):
            score += points
            factors.append({"factor": label, "effect": points})

    if typology in {"Romance scam", "Investment scam"}:
        score += 5
        factors.append({"factor": "Typology often involves extended manipulation", "effect": 5})

    if structured.get("essential_expense_impact") is True:
        score += 12
        factors.append({"factor": "Structured intake: essential-expense impact reported", "effect": 12})

    outcome_normalized = normalize_text(outcome)
    if any(_contains(outcome_normalized, term) for term in ["denied", "no refund", "unrecovered", "closed without reimbursement"]):
        score += 8
        factors.append({"factor": "Reported loss remains unrecovered", "effect": 8})
    elif any(_contains(outcome_normalized, term) for term in ["full refund", "fully recovered", "resolved with reimbursement"]):
        score -= 12
        factors.append({"factor": "Reported full recovery reduces continuing harm", "effect": -12})

    return {"score": clamp(score), "factors": factors}


def calculate_dispute_friction(
    narrative: str,
    typology: str,
    amount_lost: float = 0,
    payment_channel: str = "unknown",
    outcome: str = "",
    structured: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Measure reported difficulty obtaining review, communication, or remediation."""
    structured = structured or {}
    text = normalize_text(narrative)
    outcome_normalized = normalize_text(outcome)
    score = 10.0
    factors = [{"factor": "Baseline dispute handling effort", "effect": 10}]

    combined = f"{text} {outcome_normalized}"
    for phrases, points, label in DISPUTE_FRICTION_RULES:
        if any(_contains(combined, phrase) for phrase in phrases):
            score += points
            factors.append({"factor": label, "effect": points})

    if structured.get("dispute_submitted") is True and structured.get("dispute_status") in ("denied", "no response"):
        score += 10
        factors.append({"factor": "Structured intake: dispute status is unresolved or denied", "effect": 10})

    if any(_contains(outcome_normalized, term) for term in ["full refund", "resolved", "reimbursed", "recovered"]):
        score -= 14
        factors.append({"factor": "Reported resolution reduces continuing friction", "effect": -14})

    return {"score": clamp(score), "factors": factors}


def _parse_case_date(case_date: Any) -> date | None:
    if case_date is None:
        return None
    if isinstance(case_date, date):
        return case_date
    try:
        from datetime import datetime

        return datetime.fromisoformat(str(case_date)).date()
    except (ValueError, TypeError):
        return None


def calculate_recovery_urgency(
    narrative: str,
    typology: str,
    fraud_risk_score: int,
    amount_lost: float = 0,
    payment_channel: str = "unknown",
    outcome: str = "",
    case_date: Any = None,
    structured: dict[str, Any] | None = None,
    today: date | None = None,
) -> dict[str, Any]:
    """Estimate the time sensitivity of freeze, recall, tracing, or preservation steps."""
    structured = structured or {}
    text = normalize_text(narrative)
    outcome_normalized = normalize_text(outcome)
    amount = _amount_value(amount_lost)
    channel = normalize_text(payment_channel)
    score = 12.0
    factors = [{"factor": "Baseline recovery time sensitivity", "effect": 12}]

    for known_channel, points in RECOVERY_URGENT_CHANNELS.items():
        if known_channel in channel:
            score += points
            factors.append({"factor": f"Recovery-sensitive channel: {payment_channel}", "effect": points})
            break

    if typology in TYPOLOGY_RECOVERY_SENSITIVE:
        score += 15
        factors.append({"factor": "Typology may benefit from rapid tracing or receiving-side action", "effect": 15})

    if fraud_risk_score >= 80:
        score += 15
        factors.append({"factor": "Very high fraud risk score", "effect": 15})
    elif fraud_risk_score >= 65:
        score += 9
        factors.append({"factor": "High fraud risk score", "effect": 9})

    for phrases, points, label in RECOVERY_TEMPORAL_INDICATORS:
        if any(_contains(text, phrase) for phrase in phrases):
            score += points
            factors.append({"factor": label, "effect": points})

    if structured.get("payment_pending") is True:
        score += 16
        factors.append({"factor": "Structured intake: payment reported as pending", "effect": 16})

    parsed_date = _parse_case_date(case_date)
    reference_today = today or date.today()
    if parsed_date:
        days_old = (reference_today - parsed_date).days
        if 0 <= days_old <= 3:
            score += 14
            factors.append({"factor": f"Case date is {days_old} day(s) old", "effect": 14})
        elif 4 <= days_old <= 14:
            score += 8
            factors.append({"factor": f"Case date is {days_old} days old", "effect": 8})

    if amount >= 25_000:
        score += 10
        factors.append({"factor": "Large amount may justify accelerated coordination", "effect": 10})
    elif amount >= 5_000:
        score += 5
        factors.append({"factor": "Material loss amount", "effect": 5})

    if any(_contains(outcome_normalized, term) for term in ["full refund", "fully recovered", "funds recalled"]):
        score -= 35
        factors.append({"factor": "Reported recovery reduces active urgency", "effect": -35})
    elif any(_contains(outcome_normalized, term) for term in ["pending", "unresolved", "no refund", "denied"]):
        score += 6
        factors.append({"factor": "Outcome remains unresolved", "effect": 6})

    return {"score": clamp(score), "factors": factors}
