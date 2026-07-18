from __future__ import annotations

from fastapi import APIRouter

from ..risk_engine.rules import all_phrase_rules
from ..schemas import RuleExplorerEntry

router = APIRouter(tags=["rules"])


@router.get("/rules", response_model=list[RuleExplorerEntry])
def list_rules() -> list[RuleExplorerEntry]:
    return [
        RuleExplorerEntry(
            rule_id=rule.rule_id,
            typology=rule.typology,
            indicator=rule.indicator,
            weight=rule.weight,
            rationale=rule.rationale,
            source=rule.source,
            enabled=rule.enabled,
            effective_date=rule.effective_date,
            version=rule.version,
            last_reviewed=rule.last_reviewed,
        )
        for rule in all_phrase_rules()
    ]
