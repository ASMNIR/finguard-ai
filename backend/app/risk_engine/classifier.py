"""Deterministic typology classification.

Design goals (see docs/methodology.md for the full write-up):

* No embeddings, no generative model, no hidden state.
* Every match is a visible phrase or a one-edit spelling variant of a
  single-word indicator.
* Negation is detected with a nearby-window cue check so that "the caller did
  not claim to be from my bank" does not score the same as "the caller
  claimed to be from my bank".
* When no category has meaningful evidence, the engine abstains rather than
  forcing a classification ("Insufficient evidence").
"""

from __future__ import annotations

import re
from typing import Any

from .rules import (
    INSUFFICIENT_EVIDENCE_MIN_CHARS,
    INSUFFICIENT_EVIDENCE_SCORE_THRESHOLD,
    NEGATION_CUES,
    NEGATION_WINDOW_CHARS,
    PhraseRule,
    TYPOLOGY_PHRASE_RULES,
    Typology,
)


def normalize_text(text: Any) -> str:
    """Normalize free text for transparent phrase matching."""
    normalized = str(text or "").lower()
    normalized = normalized.replace("’", "'").replace("–", "-").replace("—", "-")
    normalized = re.sub(r"[^a-z0-9$%\s\-']", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return normalized


def _edit_distance_le_1(a: str, b: str) -> bool:
    """Return True if two tokens differ by at most one insert/delete/substitute."""
    if a == b:
        return True
    if abs(len(a) - len(b)) > 1:
        return False
    if len(a) == len(b):
        mismatches = sum(1 for x, y in zip(a, b) if x != y)
        return mismatches <= 1
    shorter, longer = (a, b) if len(a) < len(b) else (b, a)
    i = j = 0
    skipped = False
    while i < len(shorter) and j < len(longer):
        if shorter[i] == longer[j]:
            i += 1
            j += 1
        else:
            if skipped:
                return False
            skipped = True
            j += 1
    return True


def _is_negated(text: str, match_start: int) -> bool:
    window_start = max(0, match_start - NEGATION_WINDOW_CHARS)
    window = text[window_start:match_start]
    return any(cue in window for cue in NEGATION_CUES)


def _find_phrase_matches(text: str, phrase: str, fuzzy_eligible: bool) -> list[tuple[int, bool]]:
    """Return (start_index, is_fuzzy) for every occurrence of a phrase.

    Multi-word phrases are matched exactly (substring). Single-word phrases
    also try a one-edit-distance spelling-tolerant match against each token
    in the narrative when no exact match exists, per the token's word
    boundaries.
    """
    normalized_phrase = normalize_text(phrase)
    matches: list[tuple[int, bool]] = []

    if " " in normalized_phrase or "-" in normalized_phrase:
        start = 0
        while True:
            idx = text.find(normalized_phrase, start)
            if idx == -1:
                break
            matches.append((idx, False))
            start = idx + len(normalized_phrase)
        return matches

    for exact_match in re.finditer(rf"\b{re.escape(normalized_phrase)}\b", text):
        matches.append((exact_match.start(), False))

    if not matches and fuzzy_eligible and len(normalized_phrase) >= 5:
        for token_match in re.finditer(r"[a-z0-9']+", text):
            token = token_match.group(0)
            if abs(len(token) - len(normalized_phrase)) <= 1 and _edit_distance_le_1(token, normalized_phrase):
                matches.append((token_match.start(), True))

    return matches


def _matched_rules_for_typology(
    text: str, rules: list[PhraseRule]
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Return (active_matches, negated_matches) for one typology's rule list."""
    active: list[dict[str, Any]] = []
    negated: list[dict[str, Any]] = []
    for rule in rules:
        if not rule.enabled:
            continue
        for start_index, is_fuzzy in _find_phrase_matches(text, rule.indicator, rule.fuzzy_eligible):
            entry = {
                "rule_id": rule.rule_id,
                "indicator": rule.indicator,
                "weight": rule.weight,
                "fuzzy_match": is_fuzzy,
            }
            if _is_negated(text, start_index):
                negated.append(entry)
            else:
                active.append(entry)
            break  # one contribution per rule, regardless of repeat mentions
    return active, negated


def classify_typology(narrative: str) -> dict[str, Any]:
    """Classify a narrative using explicit weighted phrase rules.

    Returns the selected primary typology, an optional secondary typology,
    matched/negated phrases per category, an evidence-strength indicator
    (not a probability), and an insufficient-evidence flag when no category
    has meaningful matched weight.
    """
    text = normalize_text(narrative)
    category_scores: dict[str, int] = {}
    category_matches: dict[str, list[dict[str, Any]]] = {}
    category_negated: dict[str, list[dict[str, Any]]] = {}

    for typology, rules in TYPOLOGY_PHRASE_RULES.items():
        active, negated = _matched_rules_for_typology(text, rules)
        category_matches[typology] = active
        category_negated[typology] = negated
        category_scores[typology] = sum(item["weight"] for item in active)

    ranked = sorted(category_scores.items(), key=lambda item: item[1], reverse=True)
    top_typology, top_score = ranked[0] if ranked else ("Other", 0)
    second_typology, second_score = ranked[1] if len(ranked) > 1 else (None, 0)

    insufficient_evidence = (
        top_score < INSUFFICIENT_EVIDENCE_SCORE_THRESHOLD
        and len(text) < INSUFFICIENT_EVIDENCE_MIN_CHARS
    )

    if top_score <= 0:
        primary_typology: Typology = "Insufficient evidence" if not text else "Other"
        evidence_strength = 10 if text else 0
    elif insufficient_evidence:
        primary_typology = "Insufficient evidence"
        evidence_strength = 20
    else:
        primary_typology = top_typology  # type: ignore[assignment]
        evidence_count = len(category_matches[top_typology])
        separation = max(0, top_score - second_score)
        evidence_strength = _clamp(35 + (top_score * 2.3) + (evidence_count * 5) + separation, 20, 95)

    secondary_typology = None
    is_multi_typology = False
    if (
        primary_typology not in ("Insufficient evidence", "Other")
        and second_typology
        and second_score > 0
        and second_score >= top_score * 0.6
    ):
        secondary_typology = second_typology
        is_multi_typology = True

    return {
        "primary_typology": primary_typology,
        "secondary_typology": secondary_typology,
        "is_multi_typology": is_multi_typology,
        "evidence_strength": int(round(evidence_strength)) if isinstance(evidence_strength, (int, float)) else evidence_strength,
        "insufficient_evidence": primary_typology == "Insufficient evidence",
        "matched_indicators": category_matches.get(top_typology, []) if top_score > 0 else [],
        "negated_indicators": [item for negated in category_negated.values() for item in negated],
        "category_scores": category_scores,
        "alternative_typologies": [
            {"typology": name, "rule_score": score}
            for name, score in ranked[1:4]
            if score > 0
        ],
    }


def _clamp(value: float, minimum: int, maximum: int) -> int:
    return int(round(max(minimum, min(maximum, value))))


def detect_conflicts(narrative: str, structured: dict[str, Any]) -> list[dict[str, str]]:
    """Detect contradictions between structured intake answers and narrative text.

    Example: the consumer selects "payment was authorized by me" but the
    narrative states "I never approved the transfer". This does not resolve
    the contradiction -- it flags it for manual review, per the platform's
    "never adjudicate" design constraint.
    """
    text = normalize_text(narrative)
    conflicts: list[dict[str, str]] = []

    payment_authorized = structured.get("payment_authorized")
    denies_authorization_phrases = [
        "never approved",
        "did not authorize",
        "never authorized",
        "did not approve",
        "without my authorization",
        "never gave permission",
    ]
    confirms_authorization_phrases = [
        "i authorized the transfer",
        "i approved the payment",
        "sent the money myself",
        "i authorized the payment",
    ]

    denies_present = any(phrase in text for phrase in denies_authorization_phrases)
    confirms_present = any(phrase in text for phrase in confirms_authorization_phrases)

    if payment_authorized is True and denies_present:
        conflicts.append(
            {
                "field": "payment_authorized",
                "description": (
                    "Structured intake indicates the payment was authorized by the "
                    "consumer, but the narrative states the transfer was not "
                    "approved or authorized."
                ),
            }
        )
    if payment_authorized is False and confirms_present and not denies_present:
        conflicts.append(
            {
                "field": "payment_authorized",
                "description": (
                    "Structured intake indicates the payment was not authorized, "
                    "but the narrative states the consumer personally authorized "
                    "or sent the payment."
                ),
            }
        )

    credentials_shared = structured.get("credentials_shared")
    if credentials_shared is False and any(
        phrase in text for phrase in ["shared the code", "gave them the password", "provided the otp", "gave the verification code"]
    ):
        conflicts.append(
            {
                "field": "credentials_shared",
                "description": (
                    "Structured intake indicates no credentials were shared, but "
                    "the narrative describes sharing a code or password."
                ),
            }
        )

    dispute_submitted = structured.get("dispute_submitted")
    if dispute_submitted is False and any(
        phrase in text for phrase in ["filed a dispute", "submitted a dispute", "opened a claim", "disputed the charge"]
    ):
        conflicts.append(
            {
                "field": "dispute_submitted",
                "description": (
                    "Structured intake indicates no dispute was submitted, but the "
                    "narrative describes filing a dispute or claim."
                ),
            }
        )

    return conflicts


def missing_information(narrative: str, structured: dict[str, Any]) -> list[str]:
    """List information that would materially strengthen the analysis."""
    missing: list[str] = []
    text = normalize_text(narrative)

    if not structured.get("incident_date"):
        missing.append("Incident date was not provided, which limits the recovery time-sensitivity assessment.")
    if not structured.get("amount_lost") and "amount_lost" in structured:
        missing.append("Amount lost was not provided or was zero, which limits the fraud-risk and harm scoring.")
    if structured.get("payment_channel") in (None, "unknown"):
        missing.append("Payment channel is unknown, which limits recovery-urgency and channel-risk scoring.")
    if structured.get("dispute_status") in (None, "", "unknown") and structured.get("dispute_submitted"):
        missing.append("A dispute was reported but its current status was not provided.")
    if len(text) < 40:
        missing.append("The narrative is very short; additional detail would improve typology confidence.")
    if structured.get("institution_type") in (None, "unknown"):
        missing.append("Institution type is unknown, which limits channel-specific guidance.")

    return missing
