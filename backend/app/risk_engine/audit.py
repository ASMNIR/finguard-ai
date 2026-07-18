"""Audit-trail construction.

The audit trail is designed to be safe to log, display, and export: it never
contains raw narrative text, only rule identifiers, scores, redaction
category counts, and timestamps.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from .versioning import RULES_ENGINE_VERSION


def build_audit_trail(
    *,
    case_reference: str,
    matched_rule_ids: list[str],
    redaction_categories: list[str],
    conflicts_detected: list[str],
    insufficient_evidence: bool,
) -> dict[str, Any]:
    return {
        "case_reference": case_reference,
        "analysis_timestamp": datetime.now(timezone.utc).isoformat(),
        "rules_engine_version": RULES_ENGINE_VERSION,
        "matched_rule_ids": matched_rule_ids,
        "redaction_categories_applied": redaction_categories,
        "conflicts_detected": conflicts_detected,
        "insufficient_evidence": insufficient_evidence,
        "contains_raw_narrative": False,
    }
