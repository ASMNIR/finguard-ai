"""Synthetic-portfolio CSV loading and batch analysis for the dashboard."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd

from ..risk_engine.classifier import classify_typology
from ..risk_engine.recommendations import generate_recommendation
from ..risk_engine.scoring import (
    calculate_consumer_harm,
    calculate_dispute_friction,
    calculate_fraud_risk,
    calculate_recovery_urgency,
    score_band,
)

REQUIRED_COLUMNS = [
    "case_id",
    "date",
    "state",
    "narrative",
    "amount_lost",
    "payment_channel",
    "institution_type",
    "outcome",
]

_PROJECT_ROOT = Path(__file__).resolve().parents[3]
SAMPLE_DATA_PATH = _PROJECT_ROOT / "data" / "sample_data.csv"

_TYPOLOGY_DISPLAY_MAP = {
    "app scam": "APP scam",
    "bank impersonation scam": "Bank impersonation scam",
    "invoice redirection / business email compromise": "Invoice redirection or business email compromise",
    "marketplace scam": "Marketplace scam",
    "romance scam": "Romance scam",
    "investment scam": "Investment scam",
    "aml / mule-account risk": "AML or mule-account risk",
    "medical debt / credit stress": "Medical debt or credit stress",
    "mortgage or insurance stress": "Mortgage or insurance stress",
    "financial reporting / disclosure integrity concern": "Financial reporting or disclosure-integrity concern",
    "other": "Other",
}


def load_sample_dataframe() -> pd.DataFrame:
    return pd.read_csv(SAMPLE_DATA_PATH)


def _analyze_row(row: dict[str, Any]) -> dict[str, Any]:
    narrative = str(row.get("narrative", ""))
    amount = float(row.get("amount_lost") or 0)
    payment_channel = str(row.get("payment_channel", "unknown"))
    outcome = str(row.get("outcome", ""))
    case_date = row.get("date")

    typology_result = classify_typology(narrative)
    typology = typology_result["primary_typology"]

    fraud = calculate_fraud_risk(narrative, typology, amount, payment_channel, outcome)
    harm = calculate_consumer_harm(narrative, typology, amount, payment_channel, outcome)
    friction = calculate_dispute_friction(narrative, typology, amount, payment_channel, outcome)
    urgency = calculate_recovery_urgency(narrative, typology, fraud["score"], amount, payment_channel, outcome, case_date)
    recommendation = generate_recommendation(
        typology, fraud["score"], harm["score"], friction["score"], urgency["score"], narrative, payment_channel, outcome
    )

    result = dict(row)
    result.update(
        {
            "typology": typology,
            "evidence_strength": typology_result["evidence_strength"],
            "fraud_risk_score": fraud["score"],
            "consumer_harm_score": harm["score"],
            "dispute_friction_score": friction["score"],
            "recovery_urgency_score": urgency["score"],
            "overall_severity": score_band(max(fraud["score"], harm["score"], urgency["score"])),
            "recommendation": recommendation,
            "matched_indicators": ", ".join(m["indicator"] for m in typology_result["matched_indicators"])
            or "No category-specific phrase matched",
        }
    )
    return result


def analyze_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    clean = df.copy()
    clean.columns = [str(column).strip().lower() for column in clean.columns]
    missing = [column for column in REQUIRED_COLUMNS if column not in clean.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")

    clean = clean[REQUIRED_COLUMNS].copy()
    clean["amount_lost"] = pd.to_numeric(clean["amount_lost"], errors="coerce").fillna(0)
    records = [_analyze_row(row) for row in clean.to_dict(orient="records")]
    return pd.DataFrame(records)


def dashboard_summary(analyzed: pd.DataFrame) -> dict[str, Any]:
    total_cases = int(len(analyzed))
    high_risk = analyzed[
        (analyzed["fraud_risk_score"] >= 70)
        | (analyzed["consumer_harm_score"] >= 75)
        | (analyzed["recovery_urgency_score"] >= 75)
    ]
    return {
        "total_cases": total_cases,
        "high_risk_cases": int(len(high_risk)),
        "average_fraud_risk_score": round(float(analyzed["fraud_risk_score"].mean()), 1) if total_cases else 0,
        "average_consumer_harm_score": round(float(analyzed["consumer_harm_score"].mean()), 1) if total_cases else 0,
        "average_dispute_friction_score": round(float(analyzed["dispute_friction_score"].mean()), 1) if total_cases else 0,
        "average_recovery_urgency_score": round(float(analyzed["recovery_urgency_score"].mean()), 1) if total_cases else 0,
        "total_amount_lost": round(float(analyzed["amount_lost"].sum()), 2),
        "typology_distribution": analyzed["typology"].value_counts().to_dict(),
        "payment_channel_distribution": analyzed["payment_channel"].value_counts().to_dict(),
        "severity_distribution": analyzed["overall_severity"].value_counts().to_dict(),
        "state_distribution": analyzed["state"].value_counts().to_dict(),
        "high_risk_cases_table": high_risk.sort_values(
            ["recovery_urgency_score", "fraud_risk_score", "consumer_harm_score"], ascending=False
        ).to_dict(orient="records"),
        "all_cases": analyzed.to_dict(orient="records"),
    }
