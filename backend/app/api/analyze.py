from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..risk_engine.redaction import redact_narrative
from ..schemas import AnalyzeRequest, AnalyzeResponse, RedactionPreviewRequest, RedactionPreviewResponse
from ..services.analysis_service import run_case_analysis

router = APIRouter(tags=["analysis"])


@router.post("/redact-preview", response_model=RedactionPreviewResponse)
def redact_preview(payload: RedactionPreviewRequest) -> RedactionPreviewResponse:
    sanitized, matches = redact_narrative(payload.narrative)
    return RedactionPreviewResponse(
        sanitized_narrative=sanitized,
        redactions_applied=[{"category": m.category, "label": m.label, "count": m.count} for m in matches],
        warning=(
            "Review the sanitized text below before continuing. Do not re-enter "
            "any redacted sensitive information."
        ),
    )


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_case(payload: AnalyzeRequest) -> AnalyzeResponse:
    if not payload.narrative and payload.structured.amount_lost == 0:
        raise HTTPException(status_code=400, detail="Provide a narrative or structured case details to analyze.")
    result = run_case_analysis(payload.narrative, payload.structured.model_dump())
    return AnalyzeResponse(**result)
