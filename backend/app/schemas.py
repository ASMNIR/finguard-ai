"""Pydantic request/response schemas for the FinGuard-AI API."""

from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, field_validator

PaymentChannel = Literal[
    "instant_payment",
    "p2p_application",
    "wire_transfer",
    "ach",
    "debit_card",
    "credit_card",
    "cryptocurrency",
    "gift_card",
    "check",
    "cash",
    "marketplace_payment",
    "unknown",
    "not_applicable",
]

InstitutionType = Literal[
    "bank",
    "credit_union",
    "card_issuer",
    "payment_application",
    "cryptocurrency_exchange",
    "mortgage_servicer",
    "insurance_company",
    "debt_collector",
    "marketplace",
    "investment_provider",
    "other",
    "unknown",
]


class UrgencyScreening(BaseModel):
    money_already_left: bool | None = None
    payment_status: Literal["pending", "completed", "unknown"] | None = None
    password_or_code_shared: bool | None = None
    remote_access_provided: bool | None = None
    institution_already_contacted: bool | None = None
    account_locked_or_compromised: bool | None = None
    essential_expense_impact: bool | None = None


class StructuredIntake(BaseModel):
    incident_date: date | None = None
    state: str = Field(default="unknown", max_length=64)
    amount_lost: float = Field(default=0, ge=0, le=100_000_000)
    currency: str = Field(default="USD", max_length=8)
    payment_channel: PaymentChannel = "unknown"
    institution_type: InstitutionType = "unknown"
    contact_channel: str = Field(default="unknown", max_length=64)
    contact_initiated_by: Literal["consumer", "other_party", "unknown"] = "unknown"
    payment_authorized: bool | None = None
    impersonation_reported: bool | None = None
    impersonated_organization_type: str = Field(default="", max_length=128)
    payment_instructions_changed: bool | None = None
    credentials_shared: bool | None = None
    remote_access_provided: bool | None = None
    dispute_submitted: bool | None = None
    dispute_submission_date: date | None = None
    dispute_status: Literal["pending", "denied", "partial", "resolved", "no_response", "unknown"] = "unknown"
    reported_outcome: str = Field(default="unresolved", max_length=64)
    essential_expense_impact: bool | None = None
    payment_pending: bool | None = None


class AnalyzeRequest(BaseModel):
    narrative: str = Field(default="", max_length=8000)
    structured: StructuredIntake = Field(default_factory=StructuredIntake)
    language: Literal["en", "es", "bn"] = "en"

    @field_validator("narrative")
    @classmethod
    def strip_narrative(cls, value: str) -> str:
        return value.strip()


class ScoreFactor(BaseModel):
    factor: str
    effect: int


class ScoreResult(BaseModel):
    score: int = Field(ge=0, le=100)
    band: Literal["Low", "Moderate", "High", "Critical"]
    factors: list[ScoreFactor]


class MatchedIndicator(BaseModel):
    rule_id: str
    indicator: str
    weight: int
    fuzzy_match: bool


class AlternativeTypology(BaseModel):
    typology: str
    rule_score: int


class RedactionSummary(BaseModel):
    category: str
    label: str
    count: int


class AnalyzeResponse(BaseModel):
    case_reference: str
    analysis_timestamp: str
    rules_engine_version: str

    sanitized_narrative: str
    redactions_applied: list[RedactionSummary]

    primary_typology: str
    secondary_typology: str | None
    is_multi_typology: bool
    evidence_strength: int
    insufficient_evidence: bool

    fraud_risk: ScoreResult
    consumer_harm: ScoreResult
    dispute_friction: ScoreResult
    recovery_urgency: ScoreResult
    overall_severity: Literal["Low", "Moderate", "High", "Critical"]

    matched_indicators: list[MatchedIndicator]
    negated_indicators: list[MatchedIndicator]
    alternative_typologies: list[AlternativeTypology]
    missing_information: list[str]
    conflicts_detected: list[dict[str, str]]

    recommendation: str
    action_plan: dict[str, list[str]]
    evidence_checklist: list[dict]
    official_resources: list[dict[str, str]]

    non_probability_notice: str = (
        "Evidence strength and rule confidence are heuristic indicators, not "
        "statistical probabilities, and do not determine that fraud occurred."
    )


class RedactionPreviewRequest(BaseModel):
    narrative: str = Field(default="", max_length=8000)


class RedactionPreviewResponse(BaseModel):
    sanitized_narrative: str
    redactions_applied: list[RedactionSummary]
    warning: str


class DisputeLetterRequest(BaseModel):
    template_id: str
    case_reference: str = "FGA-DRAFT"
    structured: StructuredIntake = Field(default_factory=StructuredIntake)
    sanitized_narrative: str = ""
    typology: str = "Other"


class DisputeLetterResponse(BaseModel):
    template_id: str
    subject: str
    body: str
    disclaimer: str = (
        "This letter is an editable, plain-language template generated from "
        "sanitized case facts. It is informational only, does not constitute "
        "legal advice, and does not cite laws or regulations."
    )


class FeedbackRequest(BaseModel):
    case_reference: str = "anonymous"
    typology_understandable: bool | None = None
    indicators_reflect_case: bool | None = None
    action_plan_useful: bool | None = None
    missed_information: bool | None = None
    would_choose_different_typology: bool | None = None
    language_clear: bool | None = None
    comments: str = Field(default="", max_length=1000)


class RuleExplorerEntry(BaseModel):
    rule_id: str
    typology: str
    indicator: str
    weight: int
    rationale: str
    source: str
    enabled: bool
    effective_date: str
    version: str
    last_reviewed: str


class HealthResponse(BaseModel):
    status: Literal["ok"]
    rules_engine_version: str
    environment: str
