"""Orchestrates the deterministic risk_engine modules into one API response.

This is the single place that composes classification, scoring,
recommendation, evidence-checklist, and audit-trail generation. It never
persists raw narrative text; the sanitized (redacted) narrative is the only
version of the narrative that leaves this function.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime, timezone
from typing import Any

from ..risk_engine.audit import build_audit_trail
from ..risk_engine.classifier import classify_typology, detect_conflicts, missing_information
from ..risk_engine.recommendations import (
    OFFICIAL_RESOURCES,
    build_action_plan,
    build_evidence_checklist,
    generate_recommendation,
)
from ..risk_engine.redaction import redact_narrative
from ..risk_engine.scoring import (
    calculate_consumer_harm,
    calculate_dispute_friction,
    calculate_fraud_risk,
    calculate_recovery_urgency,
    score_band,
)
from ..risk_engine.versioning import RULES_ENGINE_VERSION


def _new_case_reference() -> str:
    return f"FGA-{uuid.uuid4().hex[:10].upper()}"


def run_case_analysis(narrative: str, structured: dict[str, Any]) -> dict[str, Any]:
    sanitized_narrative, redaction_matches = redact_narrative(narrative)

    typology_result = classify_typology(sanitized_narrative)
    typology = typology_result["primary_typology"]

    amount = float(structured.get("amount_lost") or 0)
    payment_channel = str(structured.get("payment_channel", "unknown")).replace("_", " ")
    outcome = str(structured.get("reported_outcome", ""))
    incident_date = structured.get("incident_date")
    if isinstance(incident_date, str):
        try:
            incident_date = date.fromisoformat(incident_date)
        except ValueError:
            incident_date = None

    fraud = calculate_fraud_risk(sanitized_narrative, typology, amount, payment_channel, outcome, structured)
    harm = calculate_consumer_harm(sanitized_narrative, typology, amount, payment_channel, outcome, structured)
    friction = calculate_dispute_friction(sanitized_narrative, typology, amount, payment_channel, outcome, structured)
    urgency = calculate_recovery_urgency(
        sanitized_narrative,
        typology,
        fraud["score"],
        amount,
        payment_channel,
        outcome,
        incident_date,
        structured,
    )

    recommendation = generate_recommendation(
        typology,
        fraud["score"],
        harm["score"],
        friction["score"],
        urgency["score"],
        sanitized_narrative,
        payment_channel,
        outcome,
    )

    conflicts = detect_conflicts(sanitized_narrative, structured)
    missing = missing_information(sanitized_narrative, {**structured, "typology": typology})
    action_plan = build_action_plan(typology, structured, sanitized_narrative)
    evidence_checklist = build_evidence_checklist({**structured, "typology": typology})

    case_reference = _new_case_reference()
    overall_severity = score_band(max(fraud["score"], harm["score"], urgency["score"]))

    audit_trail = build_audit_trail(
        case_reference=case_reference,
        matched_rule_ids=[m["rule_id"] for m in typology_result["matched_indicators"]],
        redaction_categories=[m.category for m in redaction_matches],
        conflicts_detected=[c["field"] for c in conflicts],
        insufficient_evidence=typology_result["insufficient_evidence"],
    )

    return {
        "case_reference": case_reference,
        "analysis_timestamp": datetime.now(timezone.utc).isoformat(),
        "rules_engine_version": RULES_ENGINE_VERSION,
        "sanitized_narrative": sanitized_narrative,
        "redactions_applied": [
            {"category": m.category, "label": m.label, "count": m.count} for m in redaction_matches
        ],
        "primary_typology": typology,
        "secondary_typology": typology_result["secondary_typology"],
        "is_multi_typology": typology_result["is_multi_typology"],
        "evidence_strength": typology_result["evidence_strength"],
        "insufficient_evidence": typology_result["insufficient_evidence"],
        "fraud_risk": {"score": fraud["score"], "band": score_band(fraud["score"]), "factors": fraud["factors"]},
        "consumer_harm": {"score": harm["score"], "band": score_band(harm["score"]), "factors": harm["factors"]},
        "dispute_friction": {"score": friction["score"], "band": score_band(friction["score"]), "factors": friction["factors"]},
        "recovery_urgency": {"score": urgency["score"], "band": score_band(urgency["score"]), "factors": urgency["factors"]},
        "overall_severity": overall_severity,
        "matched_indicators": typology_result["matched_indicators"],
        "negated_indicators": typology_result["negated_indicators"],
        "alternative_typologies": typology_result["alternative_typologies"],
        "missing_information": missing,
        "conflicts_detected": conflicts,
        "recommendation": recommendation,
        "action_plan": action_plan,
        "evidence_checklist": evidence_checklist,
        "official_resources": OFFICIAL_RESOURCES,
        "audit_trail": audit_trail,
    }
