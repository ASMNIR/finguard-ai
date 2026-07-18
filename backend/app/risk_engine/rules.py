"""Public, inspectable rule tables for the FinGuard-AI risk engine.

Every rule below is deliberately visible so that a researcher, reviewer, or
auditor can see exactly which phrase or structured condition contributed to a
result, and how much. Nothing in this module is a black box: the rule
explorer page in the frontend renders this table directly (minus fields
flagged as security-sensitive, of which there are none here).

Rule identifiers use the pattern ``<TYPOLOGY-CODE>-<NNN>``.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

RULE_SOURCE = "FinGuard-AI legacy MVP phrase dictionary (app.py, v1.0.0), reviewed and extended v1.1.0"
EFFECTIVE_DATE = "2026-07-18"
LAST_REVIEWED = "2026-07-18"
RULESET_VERSION = "1.1.0"

Typology = Literal[
    "APP scam",
    "Bank impersonation scam",
    "Invoice redirection or business email compromise",
    "Marketplace scam",
    "Romance scam",
    "Investment scam",
    "AML or mule-account risk",
    "Medical debt or credit stress",
    "Mortgage or insurance stress",
    "Financial reporting or disclosure-integrity concern",
    "Other",
    "Insufficient evidence",
]

ALL_TYPOLOGIES: list[Typology] = [
    "APP scam",
    "Bank impersonation scam",
    "Invoice redirection or business email compromise",
    "Marketplace scam",
    "Romance scam",
    "Investment scam",
    "AML or mule-account risk",
    "Medical debt or credit stress",
    "Mortgage or insurance stress",
    "Financial reporting or disclosure-integrity concern",
    "Other",
    "Insufficient evidence",
]


@dataclass(frozen=True)
class PhraseRule:
    rule_id: str
    typology: Typology
    indicator: str
    weight: int
    rationale: str
    source: str = RULE_SOURCE
    enabled: bool = True
    effective_date: str = EFFECTIVE_DATE
    version: str = RULESET_VERSION
    last_reviewed: str = LAST_REVIEWED
    fuzzy_eligible: bool = field(default=True)


def _rules(typology: Typology, code: str, entries: list[tuple[str, int, str]]) -> list[PhraseRule]:
    out = []
    for index, (phrase, weight, rationale) in enumerate(entries, start=1):
        out.append(
            PhraseRule(
                rule_id=f"{code}-{index:03d}",
                typology=typology,
                indicator=phrase,
                weight=weight,
                rationale=rationale,
                fuzzy_eligible=" " not in phrase,
            )
        )
    return out


TYPOLOGY_PHRASE_RULES: dict[Typology, list[PhraseRule]] = {
    "APP scam": _rules(
        "APP scam",
        "APP",
        [
            ("authorized push payment", 8, "Direct reference to the APP scam mechanism."),
            ("authorized the transfer", 6, "Consumer states they personally authorized the transfer."),
            ("sent the money myself", 5, "Consumer-initiated transfer, consistent with APP scam pattern."),
            ("peer to peer", 4, "P2P rails are commonly used in APP scams."),
            ("p2p", 4, "P2P rails are commonly used in APP scams."),
            ("real time payment", 4, "Instant, hard-to-reverse payment rail."),
            ("instant payment", 4, "Instant, hard-to-reverse payment rail."),
            ("payment app", 3, "Consumer payment application referenced."),
            ("zelle-like", 3, "Instant P2P transfer service referenced."),
            ("transfer was authorized", 5, "Explicit authorization language."),
        ],
    ),
    "Bank impersonation scam": _rules(
        "Bank impersonation scam",
        "BIS",
        [
            ("pretended to be my bank", 9, "Direct impersonation statement."),
            ("claimed to be from the bank", 8, "Direct impersonation statement."),
            ("bank fraud department", 7, "Common impersonation pretext."),
            ("spoofed bank number", 8, "Caller ID spoofing indicator."),
            ("caller id showed my bank", 7, "Caller ID spoofing indicator."),
            ("one-time passcode", 5, "Authentication-code compromise indicator."),
            ("otp", 5, "Authentication-code compromise indicator."),
            ("verification code", 4, "Authentication-code compromise indicator."),
            ("move money to a safe account", 9, "Classic bank-impersonation instruction."),
            ("safe account", 6, "Classic bank-impersonation instruction."),
            ("bank security team", 6, "Common impersonation pretext."),
        ],
    ),
    "Invoice redirection or business email compromise": _rules(
        "Invoice redirection or business email compromise",
        "BEC",
        [
            ("invoice", 4, "Business payment context."),
            ("vendor email", 6, "Compromised or spoofed vendor communication."),
            ("supplier email", 6, "Compromised or spoofed supplier communication."),
            ("business email compromise", 10, "Direct reference to BEC."),
            ("payment instructions changed", 9, "Core BEC / invoice redirection indicator."),
            ("wire instructions changed", 9, "Core BEC / invoice redirection indicator."),
            ("new bank details", 7, "Redirected payment destination."),
            ("closing agent email", 7, "Real-estate closing impersonation."),
            ("title company email", 7, "Real-estate closing impersonation."),
            ("accounts payable", 5, "Business payment process referenced."),
            ("ceo requested", 6, "Executive-impersonation pressure tactic."),
        ],
    ),
    "Marketplace scam": _rules(
        "Marketplace scam",
        "MKT",
        [
            ("online marketplace", 8, "Marketplace transaction context."),
            ("marketplace seller", 7, "Marketplace transaction context."),
            ("marketplace buyer", 7, "Marketplace transaction context."),
            ("item never arrived", 6, "Non-delivery indicator."),
            ("fake listing", 7, "Fraudulent listing indicator."),
            ("shipping fee", 4, "Common secondary-payment lure."),
            ("deposit for the item", 5, "Common secondary-payment lure."),
            ("classified ad", 5, "Marketplace transaction context."),
            ("payment outside the platform", 7, "Off-platform payment risk indicator."),
            ("rental listing", 5, "Fraudulent rental listing indicator."),
        ],
    ),
    "Romance scam": _rules(
        "Romance scam",
        "ROM",
        [
            ("dating app", 7, "Online relationship origin."),
            ("romantic relationship", 8, "Online relationship origin."),
            ("online relationship", 7, "Online relationship origin."),
            ("said they loved me", 7, "Manipulation-tactic indicator."),
            ("military deployment", 5, "Common romance-scam narrative device."),
            ("travel emergency", 4, "Common romance-scam narrative device."),
            ("future together", 5, "Manipulation-tactic indicator."),
            ("romance scam", 10, "Direct reference."),
            ("fiance", 4, "Online relationship origin."),
            ("partner overseas", 5, "Common romance-scam narrative device."),
        ],
    ),
    "Investment scam": _rules(
        "Investment scam",
        "INV",
        [
            ("investment platform", 8, "Investment-scam transaction context."),
            ("guaranteed return", 7, "Implausible-return red flag."),
            ("crypto investment", 8, "Investment-scam transaction context."),
            ("trading coach", 6, "Recruitment / social-engineering pattern."),
            ("investment opportunity", 5, "Investment-scam transaction context."),
            ("profits shown", 5, "Manipulated dashboard indicator."),
            ("withdrawal fee", 7, "Classic advance-fee extraction tactic."),
            ("tax before withdrawal", 7, "Classic advance-fee extraction tactic."),
            ("pig butchering", 10, "Direct reference to a known investment-scam pattern."),
            ("broker was not licensed", 7, "Regulatory-status red flag."),
        ],
    ),
    "AML or mule-account risk": _rules(
        "AML or mule-account risk",
        "AML",
        [
            ("received funds for someone else", 9, "Possible mule-account indicator, not a finding of criminal activity."),
            ("forward the money", 8, "Possible mule-account indicator, not a finding of criminal activity."),
            ("keep a commission", 7, "Mule-recruitment incentive indicator."),
            ("money mule", 10, "Direct reference."),
            ("multiple incoming transfers", 7, "Pass-through account indicator."),
            ("rapidly sent onward", 8, "Pass-through account indicator."),
            ("cash out", 5, "Pass-through account indicator."),
            ("new account", 3, "Recently opened account referenced."),
            ("structuring", 8, "Reference to structuring-type activity."),
            ("source of funds", 5, "Source-of-funds concern referenced."),
            ("pass-through account", 9, "Direct reference."),
        ],
    ),
    "Medical debt or credit stress": _rules(
        "Medical debt or credit stress",
        "MED",
        [
            ("medical debt", 9, "Medical-debt context."),
            ("hospital bill", 7, "Medical-debt context."),
            ("medical collection", 8, "Medical-debt context."),
            ("credit report", 4, "Credit-reporting context."),
            ("debt collector", 5, "Debt-collection context."),
            ("insurance adjustment", 4, "Billing-dispute context."),
            ("billing error", 4, "Billing-dispute context."),
            ("credit score dropped", 6, "Reported credit-score impact."),
            ("unexpected medical bill", 7, "Medical-debt context."),
            ("collection account", 5, "Debt-collection context."),
        ],
    ),
    "Mortgage or insurance stress": _rules(
        "Mortgage or insurance stress",
        "MTG",
        [
            ("mortgage servicer", 8, "Mortgage-servicing context."),
            ("foreclosure", 8, "Housing-stability risk indicator."),
            ("escrow", 5, "Mortgage-servicing context."),
            ("loan modification", 6, "Mortgage-servicing context."),
            ("home insurance", 6, "Insurance-servicing context."),
            ("insurance claim", 5, "Insurance-servicing context."),
            ("premium increased", 4, "Insurance-servicing context."),
            ("lapse notice", 5, "Insurance-servicing context."),
            ("force-placed insurance", 8, "Servicing-practice red flag."),
            ("payment was misapplied", 6, "Servicing-error indicator."),
        ],
    ),
    "Financial reporting or disclosure-integrity concern": _rules(
        "Financial reporting or disclosure-integrity concern",
        "FRD",
        [
            ("financial statements", 7, "Disclosure-integrity context."),
            ("misstated revenue", 9, "Disclosure-integrity red flag."),
            ("undisclosed related party", 9, "Disclosure-integrity red flag."),
            ("material omission", 8, "Disclosure-integrity red flag."),
            ("false disclosure", 8, "Disclosure-integrity red flag."),
            ("earnings report", 6, "Disclosure-integrity context."),
            ("audit concern", 7, "Disclosure-integrity context."),
            ("internal controls", 6, "Disclosure-integrity context."),
            ("valuation was inflated", 8, "Disclosure-integrity red flag."),
            ("investor disclosure", 6, "Disclosure-integrity context."),
        ],
    ),
}

# Negation cues used to suppress a positive phrase match found in a nearby
# window of text. This is intentionally simple pattern-based negation, not a
# full dependency parse. See docs/methodology.md, "Negation handling".
NEGATION_CUES: list[str] = [
    "not",
    "never",
    "didn't",
    "did not",
    "wasn't",
    "was not",
    "weren't",
    "were not",
    "no ",
    "denies",
    "denied that",
    "did not claim",
    "never claimed",
    "did not authorize",
    "never authorized",
    "did not approve",
    "never approved",
    "without my authorization",
    "did not receive",
]

NEGATION_WINDOW_CHARS = 28

FRAUD_RISK_NARRATIVE_INDICATORS: list[tuple[str, int, str]] = [
    ("one-time passcode", 10, "Credential or authentication-code compromise"),
    ("verification code", 8, "Authentication-code disclosure"),
    ("remote access", 12, "Remote-device control"),
    ("screen sharing", 10, "Screen-sharing or device-control indicator"),
    ("spoofed", 9, "Spoofed identity or communication channel"),
    ("urgent", 5, "Pressure or urgency tactic"),
    ("safe account", 9, "False safe-account instruction"),
    ("password", 7, "Credential exposure"),
    ("account takeover", 14, "Account-takeover indicator"),
    ("changed payment instructions", 9, "Payment-redirection indicator"),
    ("guaranteed return", 7, "Implausible return promise"),
    ("keep a commission", 9, "Mule recruitment incentive"),
]

TYPOLOGY_BASE_RISK: dict[str, int] = {
    "APP scam": 58,
    "Bank impersonation scam": 72,
    "Invoice redirection or business email compromise": 74,
    "Marketplace scam": 50,
    "Romance scam": 65,
    "Investment scam": 68,
    "AML or mule-account risk": 80,
    "Medical debt or credit stress": 24,
    "Mortgage or insurance stress": 28,
    "Financial reporting or disclosure-integrity concern": 56,
    "Other": 20,
    "Insufficient evidence": 0,
}

PAYMENT_CHANNEL_RISK: dict[str, int] = {
    "wire transfer": 14,
    "instant payment": 13,
    "p2p application": 13,
    "cryptocurrency": 15,
    "gift card": 14,
    "cash": 12,
    "ach": 9,
    "debit card": 7,
    "credit card": 4,
    "check": 6,
    "marketplace payment": 8,
    "not applicable": 0,
    "unknown": 2,
}

RECOVERY_URGENT_CHANNELS: dict[str, int] = {
    "wire transfer": 27,
    "instant payment": 27,
    "p2p application": 25,
    "cryptocurrency": 26,
    "gift card": 24,
    "cash": 22,
    "ach": 16,
    "debit card": 13,
    "credit card": 8,
    "check": 10,
    "marketplace payment": 12,
}

VULNERABILITY_INDICATORS: list[tuple[list[str], int, str]] = [
    (["elderly", "senior", "retired", "fixed income"], 12, "Potential age or fixed-income vulnerability"),
    (["disability", "disabled"], 10, "Disability-related vulnerability"),
    (["limited english", "language barrier"], 8, "Potential language-access barrier"),
    (["medical treatment", "hospital", "medication", "medical debt"], 10, "Health-related financial stress"),
    (["mortgage", "foreclosure", "rent", "eviction"], 11, "Housing stability impact"),
    (["food", "utilities", "paycheck", "life savings"], 10, "Essential funds or savings affected"),
    (["account drained", "entire balance", "all my savings"], 14, "Severe depletion of available funds"),
    (["repeat victim", "second time", "again"], 8, "Repeat-victimization indicator"),
    (["anxiety", "distress", "could not sleep", "embarrassed"], 6, "Reported emotional or behavioral harm"),
]

DISPUTE_FRICTION_RULES: list[tuple[list[str], int, str]] = [
    (["denied", "claim denied"], 28, "Claim or reimbursement denial"),
    (["closed the case", "case was closed", "closed without"], 20, "Case closure without satisfactory resolution"),
    (["no response", "never responded", "no call back"], 20, "No timely response reported"),
    (["called repeatedly", "multiple calls", "contacted them several times", "five calls"], 14, "Repeated consumer contacts"),
    (["transferred", "passed between departments"], 10, "Repeated transfers or fragmented ownership"),
    (["requested the same documents", "resubmit", "submitted documents again"], 12, "Duplicative evidence requests"),
    (["appeal", "reconsideration"], 11, "Escalation or appeal required"),
    (["provisional credit removed", "temporary credit reversed"], 17, "Provisional credit reversal"),
    (["complaint", "regulator"], 7, "External complaint or escalation"),
    (["more than 30 days", "60 days", "90 days", "months"], 12, "Extended resolution timeline"),
]

RECOVERY_TEMPORAL_INDICATORS: list[tuple[list[str], int, str]] = [
    (["today", "this morning", "just happened", "minutes ago"], 20, "Narrative indicates very recent activity"),
    (["yesterday", "last night", "within 24 hours"], 14, "Narrative indicates recent activity"),
    (["pending", "still processing"], 16, "Transaction may still be pending"),
    (["freeze", "recall", "stop payment"], 8, "Immediate recovery action is contemplated"),
]

TYPOLOGY_RECOVERY_SENSITIVE: set[str] = {
    "APP scam",
    "Bank impersonation scam",
    "Invoice redirection or business email compromise",
    "AML or mule-account risk",
}

INSUFFICIENT_EVIDENCE_MIN_CHARS = 25
INSUFFICIENT_EVIDENCE_SCORE_THRESHOLD = 3


def all_phrase_rules() -> list[PhraseRule]:
    """Flatten every phrase rule for the public rule-explorer endpoint."""
    flattened: list[PhraseRule] = []
    for rules in TYPOLOGY_PHRASE_RULES.values():
        flattened.extend(rules)
    return flattened
