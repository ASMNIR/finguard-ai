from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import Response

from ..config import get_settings
from ..reports.pdf_generator import build_case_report_pdf
from ..schemas import AnalyzeResponse

router = APIRouter(tags=["reports"])


@router.post("/reports/pdf")
def generate_case_pdf(payload: AnalyzeResponse) -> Response:
    settings = get_settings()
    pdf_bytes = build_case_report_pdf(payload.model_dump(), settings.public_attribution())
    filename = f"{payload.case_reference}-finguard-ai-report.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
