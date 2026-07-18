"""Automatic privacy redaction.

Runs before any analysis, logging, or persistence. Nothing downstream of this
module should ever see raw sensitive substrings for the categories below.
See docs/privacy.md and docs/security.md.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

_PATTERNS: list[tuple[str, str, re.Pattern[str]]] = [
    ("email", "Email address", re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")),
    ("phone", "Telephone number", re.compile(r"(?<!\d)(\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}(?!\d)")),
    ("ssn", "Social Security number pattern", re.compile(r"(?<!\d)\d{3}-\d{2}-\d{4}(?!\d)")),
    ("card_number", "Payment-card-like sequence", re.compile(r"(?<!\d)(?:\d[ \-]?){13,19}(?!\d)")),
    ("routing_number", "Routing-number-like sequence", re.compile(r"(?<!\d)\d{9}(?!\d)")),
    ("long_account_number", "Long account-number-like sequence", re.compile(r"(?<!\d)\d{8,12}(?!\d)")),
]

_SENSITIVE_PHRASE_PATTERNS: list[tuple[str, str, re.Pattern[str]]] = [
    (
        "verification_code_statement",
        "Statement disclosing a verification code",
        re.compile(r"\b(?:otp|one[\s\-]?time (?:pass)?code|verification code)\s*(?:is|was|:)?\s*[:#]?\s*\d{4,8}\b", re.IGNORECASE),
    ),
    (
        "pin_statement",
        "Statement disclosing a PIN",
        re.compile(r"\bpin\s*(?:is|was|:)?\s*[:#]?\s*\d{3,6}\b", re.IGNORECASE),
    ),
    (
        "password_statement",
        "Statement disclosing a password",
        re.compile(r"\bpassword\s*(?:is|was|:)?\s*[:#]?\s*\S{3,32}\b", re.IGNORECASE),
    ),
    (
        "street_address",
        "Street address",
        re.compile(
            r"\b\d{1,6}\s+([A-Za-z0-9]+\s){1,4}(street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|way|place|pl)\b",
            re.IGNORECASE,
        ),
    ),
]


@dataclass(frozen=True)
class RedactionMatch:
    category: str
    label: str
    count: int


def redact_narrative(narrative: str) -> tuple[str, list[RedactionMatch]]:
    """Redact sensitive substrings and return (sanitized_text, matches_by_category)."""
    text = narrative or ""
    matches: list[RedactionMatch] = []

    for category, label, pattern in _SENSITIVE_PHRASE_PATTERNS:
        count = len(pattern.findall(text))
        if count:
            text = pattern.sub("[REDACTED]", text)
            matches.append(RedactionMatch(category=category, label=label, count=count))

    for category, label, pattern in _PATTERNS:
        count = len(pattern.findall(text))
        if count:
            text = pattern.sub(f"[REDACTED-{category.upper()}]", text)
            matches.append(RedactionMatch(category=category, label=label, count=count))

    return text, matches


def contains_prohibited_information(narrative: str) -> bool:
    """Best-effort check used to warn the user before submission, not a guarantee."""
    _, matches = redact_narrative(narrative)
    return len(matches) > 0


PROHIBITED_INFORMATION_NOTICE = (
    "Do not enter passwords, PINs, Social Security numbers, full bank-account "
    "numbers, full payment-card numbers, routing numbers, private "
    "authentication codes, or other highly sensitive information. FinGuard-AI "
    "applies automatic pattern-based redaction, but this is a best-effort "
    "safeguard, not a guarantee -- please remove sensitive details yourself "
    "before submitting."
)
