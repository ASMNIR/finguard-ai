from __future__ import annotations

import io

import pandas as pd
from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from ..services.csv_service import REQUIRED_COLUMNS, analyze_dataframe, dashboard_summary, load_sample_dataframe

router = APIRouter(tags=["dashboard"])

MAX_UPLOAD_BYTES = 1_000_000  # 1 MB, synthetic-scale portfolios only


@router.get("/dashboard/sample-summary")
def sample_dashboard_summary() -> dict:
    analyzed = analyze_dataframe(load_sample_dataframe())
    summary = dashboard_summary(analyzed)
    summary["data_source"] = "synthetic_sample"
    summary["notice"] = "Synthetic demonstration data - not real consumer records."
    return summary


@router.get("/dashboard/required-columns")
def required_columns() -> dict[str, list[str]]:
    return {"required_columns": REQUIRED_COLUMNS}


@router.post("/dashboard/upload-summary")
async def upload_dashboard_summary(file: UploadFile) -> dict:
    if file.content_type not in ("text/csv", "application/vnd.ms-excel", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")
    raw = await file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the maximum accepted size for this prototype.")
    try:
        df = pd.read_csv(io.BytesIO(raw))
        analyzed = analyze_dataframe(df)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 - surface a safe, generic parse error
        raise HTTPException(status_code=400, detail="Could not parse the uploaded CSV file.") from exc
    summary = dashboard_summary(analyzed)
    summary["data_source"] = "uploaded_file"
    summary["notice"] = "Uploaded data is processed in memory for this request only and is not stored."
    return summary


@router.get("/dashboard/sample-data.csv")
def download_sample_csv() -> StreamingResponse:
    analyzed = analyze_dataframe(load_sample_dataframe())
    export_columns = REQUIRED_COLUMNS + [
        "typology",
        "evidence_strength",
        "fraud_risk_score",
        "consumer_harm_score",
        "dispute_friction_score",
        "recovery_urgency_score",
        "overall_severity",
        "matched_indicators",
        "recommendation",
    ]
    buffer = io.StringIO()
    analyzed[export_columns].to_csv(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=finguard_ai_analyzed_cases.csv"},
    )
