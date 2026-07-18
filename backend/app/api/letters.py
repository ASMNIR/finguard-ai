from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..schemas import DisputeLetterRequest, DisputeLetterResponse
from ..services.letter_service import TEMPLATE_TITLES, generate_letter

router = APIRouter(tags=["letters"])


@router.get("/letters/templates")
def list_templates() -> dict[str, str]:
    return TEMPLATE_TITLES


@router.post("/letters/generate", response_model=DisputeLetterResponse)
def generate_letter_endpoint(payload: DisputeLetterRequest) -> DisputeLetterResponse:
    try:
        letter = generate_letter(
            payload.template_id,
            payload.case_reference,
            payload.structured.model_dump(),
            payload.sanitized_narrative,
            payload.typology,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return DisputeLetterResponse(**letter)
