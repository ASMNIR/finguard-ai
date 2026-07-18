"""Deterministic recommendation, action-plan, and evidence-checklist generation.

All text here is informational guidance, never a legal conclusion, and never
a promise that any action will succeed. See docs/governance.md and the
website's core disclaimers.
"""

from __future__ import annotations

from typing import Any

from .classifier import normalize_text

OFFICIAL_RESOURCES: list[dict[str, str]] = [
    {
        "name": "ReportFraud.ftc.gov",
        "url": "https://reportfraud.ftc.gov",
        "description": "Federal Trade Commission fraud-reporting portal.",
    },
    {
        "name": "IdentityTheft.gov",
        "url": "https://identitytheft.gov",
        "description": "Federal Trade Commission identity-theft recovery portal.",
    },
    {
        "name": "CFPB Consumer Complaint Portal",
        "url": "https://www.consumerfinance.gov/complaint/",
        "description": "Consumer Financial Protection Bureau complaint intake.",
    },
    {
        "name": "FBI Internet Crime Complaint Center (IC3)",
        "url": "https://www.ic3.gov",
        "description": "FBI portal for reporting internet-facilitated crime.",
    },
    {
        "name": "State Attorney General consumer-protection offices",
        "url": "https://www.usa.gov/state-consumer",
        "description": "Directory of state-level consumer-protection resources.",
    },
    {
        "name": "Eldercare Locator (Adult Protective Services)",
        "url": "https://eldercare.acl.gov",
        "description": "Federal directory for adult protective services, relevant where elder financial exploitation may be involved.",
    },
]


def generate_recommendation(
    typology: str,
    fraud_risk_score: int,
    consumer_harm_score: int,
    dispute_friction_score: int,
    recovery_urgency_score: int,
    narrative: str = "",
    payment_channel: str = "unknown",
    outcome: str = "",
) -> str:
    """Generate a concise, case-oriented recommendation from visible rules."""
    text = normalize_text(narrative)
    channel = normalize_text(payment_channel)
    outcome_text = normalize_text(outcome)

    primary_by_typology = {
        "AML or mule-account risk": "Check receiving-side mule-account indicators and preserve transaction tracing records. Manual review is recommended.",
        "Bank impersonation scam": "The reported circumstances may warrant escalation for bank-impersonation and APP-scam review.",
        "APP scam": "The reported circumstances may warrant escalation for APP-scam review and a reimbursement-eligibility review by the institution.",
        "Invoice redirection or business email compromise": "Consider beneficiary-bank outreach and a wire-recall review through official channels.",
        "Marketplace scam": "Request platform, payment, listing, and communications evidence to support a review.",
        "Romance scam": "Monitor for repeat victimization and review linked payment recipients.",
        "Investment scam": "Review investment-solicitation evidence and trace destination accounts or wallets where possible.",
        "Medical debt or credit stress": "Validate billing, collection authority, and credit-reporting accuracy through the relevant institution.",
        "Mortgage or insurance stress": "Consider escalating the servicing or claims review and request a complete transaction history.",
        "Financial reporting or disclosure-integrity concern": "Preserve supporting records and route for disclosure-integrity review by qualified professionals.",
        "Insufficient evidence": "Evidence is currently insufficient for a stronger classification. Additional detail is recommended before further action.",
        "Other": "Additional evidence is recommended, and manual review is suggested for this case.",
    }
    primary = primary_by_typology.get(typology, "Manual review is recommended.")

    actions: list[str] = [primary]
    if recovery_urgency_score >= 70 and not any(term in outcome_text for term in ["full refund", "fully recovered"]):
        actions.append("The case may benefit from prompt contact with the institution to ask about freeze, recall, or stop-payment options where operationally available.")
    if dispute_friction_score >= 65:
        actions.append("A senior-level dispute-handling review, with documented rationale, may be appropriate.")
    if consumer_harm_score >= 75:
        actions.append("Heightened consumer-harm handling and monitoring for repeat victimization is suggested.")
    if fraud_risk_score >= 80 and typology != "AML or mule-account risk":
        actions.append("Reviewing receiving-side account, device, and beneficiary risk indicators may be relevant.")
    if any(term in text for term in ["otp", "one-time passcode", "password", "remote access"]):
        actions.append("Assessing credential compromise and securing affected access channels is recommended.")
    if "cryptocurrency" in channel:
        actions.append("Preserving wallet addresses, transaction hashes, and exchange details is recommended.")

    return " ".join(actions[:3])


def build_action_plan(
    typology: str,
    structured: dict[str, Any],
    narrative: str = "",
) -> dict[str, list[str]]:
    """Build a categorized, channel- and typology-aware action plan."""
    text = normalize_text(narrative)
    channel = normalize_text(str(structured.get("payment_channel", "unknown")))
    credentials_shared = structured.get("credentials_shared") is True
    remote_access = structured.get("remote_access_provided") is True
    payment_pending = structured.get("payment_pending") is True
    dispute_submitted = structured.get("dispute_submitted") is True
    essential_impact = structured.get("essential_expense_impact") is True

    act_now = [
        "Contact the relevant financial institution, payment provider, or card issuer through an official channel (official app, official website, or the number on the back of a card).",
        "Ask whether fraud escalation is available for this case type.",
    ]
    if payment_pending:
        act_now.append("Ask specifically whether the pending payment can still be recalled, frozen, or stopped before it settles.")
    else:
        act_now.append("Ask whether a transaction review, recall request, or dispute can still be opened even though the payment has completed.")
    if remote_access:
        act_now.append("If remote-access or screen-sharing software is still installed, consider disconnecting it and removing it from the device.")
    if credentials_shared:
        act_now.append("Treat any shared password, PIN, or one-time code as compromised and plan to change it immediately through an official channel.")

    secure_accounts = [
        "Change any potentially compromised credentials directly through the official website or app of the institution involved (not through a link received by phone, text, or email).",
        "Review recent account access and connected devices for anything unrecognized.",
        "Consider enabling stronger authentication (e.g., an authenticator app) where available.",
    ]
    if credentials_shared or remote_access:
        secure_accounts.append("Monitor linked accounts and cards for additional unauthorized activity in the days following the incident.")
    if "cryptocurrency" in channel:
        secure_accounts.append("Secure the associated exchange account and any connected wallet credentials separately.")

    preserve_evidence = [
        "Save the transaction confirmation, date, time, and amount.",
        "Save any available recipient information (name, account identifier, or wallet address).",
        "Save screenshots of the app, website, listing, or messages involved.",
        "Save emails, including headers where possible, and text messages or call logs.",
    ]
    if "cryptocurrency" in channel:
        preserve_evidence.append("Save the transaction ID / hash and the destination wallet address.")
    if dispute_submitted:
        preserve_evidence.append("Save the dispute or case number and any written acknowledgment received.")
    if typology == "Marketplace scam":
        preserve_evidence.append("Save the original marketplace listing (a screenshot or archived copy) before it can be removed.")

    contact_institution = [
        "Request a case or reference number for every contact.",
        "Submit a clear, written, factual timeline of what happened.",
        "Request written acknowledgment of the report or dispute.",
        "Ask what additional evidence, if any, is needed to support a review.",
        "Record the date, time, representative name (if given), and outcome of every contact.",
    ]

    follow_up = [
        "Keep a written record of every case number received.",
        "Set a reminder to follow up if no response is received within the institution's stated timeframe.",
        "Watch for signs of repeat victimization or secondary identity misuse.",
        "Keep the case timeline updated as new information arrives.",
        "Keep copies of every written response received.",
    ]
    if essential_impact:
        follow_up.append("If essential expenses (housing, medical, utilities) are affected, consider asking the institution about any hardship or expedited-review options they may offer.")

    return {
        "act_now": act_now,
        "secure_accounts": secure_accounts,
        "preserve_evidence": preserve_evidence,
        "contact_institution": contact_institution,
        "follow_up": follow_up,
    }


EVIDENCE_CATALOG: list[dict[str, Any]] = [
    {"id": "transaction_confirmation", "label": "Transaction confirmation (date, time, amount)", "sensitive": False,
     "why": "Establishes the basic facts of the transaction for any review."},
    {"id": "recipient_information", "label": "Recipient name, account identifier, or wallet address", "sensitive": False,
     "why": "May support tracing or recall requests."},
    {"id": "transaction_id", "label": "Transaction ID or confirmation number", "sensitive": False,
     "why": "Allows the institution to locate the exact transaction."},
    {"id": "wallet_address", "label": "Cryptocurrency wallet address", "sensitive": False,
     "why": "Relevant only for cryptocurrency payment channels; supports tracing."},
    {"id": "transaction_hash", "label": "Cryptocurrency transaction hash", "sensitive": False,
     "why": "Relevant only for cryptocurrency payment channels; supports tracing."},
    {"id": "screenshots", "label": "Screenshots of the app, website, or listing", "sensitive": False,
     "why": "Preserves visual evidence that may otherwise disappear."},
    {"id": "emails", "label": "Emails, including headers if available", "sensitive": False,
     "why": "May show sender domain, spoofing, or timeline details."},
    {"id": "text_messages", "label": "Text messages", "sensitive": False,
     "why": "Preserves the communications that led to the payment."},
    {"id": "call_logs", "label": "Call logs and voicemail", "sensitive": False,
     "why": "Establishes contact timeline and frequency."},
    {"id": "marketplace_listing", "label": "Marketplace or classified listing (archived or screenshotted)", "sensitive": False,
     "why": "Listings can be removed quickly; preserve before that happens."},
    {"id": "dispute_number", "label": "Dispute or case number", "sensitive": False,
     "why": "Required for any follow-up with the institution."},
    {"id": "written_denial", "label": "Written denial or decision letter", "sensitive": False,
     "why": "Needed to request reconsideration or escalate."},
    {"id": "official_report", "label": "Police report or agency report number, if filed", "sensitive": False,
     "why": "Some institutions request this for certain claim types."},
    {"id": "account_statements", "label": "Account or card statements showing the transaction", "sensitive": False,
     "why": "Supports the timeline and amount of loss."},
]

SENSITIVE_ITEMS_WARNING = (
    "Do not upload or paste passwords, PINs, full account numbers, full card "
    "numbers, Social Security numbers, or one-time authentication codes, even "
    "when building this checklist."
)


def build_evidence_checklist(structured: dict[str, Any]) -> list[dict[str, Any]]:
    """Return the evidence catalog annotated with a best-guess relevance status."""
    channel = normalize_text(str(structured.get("payment_channel", "unknown")))
    dispute_submitted = structured.get("dispute_submitted") is True
    typology = structured.get("typology", "")

    checklist = []
    for item in EVIDENCE_CATALOG:
        relevant = True
        if item["id"] in ("wallet_address", "transaction_hash") and "cryptocurrency" not in channel:
            relevant = False
        if item["id"] == "marketplace_listing" and typology != "Marketplace scam":
            relevant = False
        if item["id"] in ("dispute_number", "written_denial") and not dispute_submitted:
            relevant = False
        entry = dict(item)
        entry["relevant"] = relevant
        checklist.append(entry)
    return checklist
