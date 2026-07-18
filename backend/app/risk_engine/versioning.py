"""Version history for the FinGuard-AI deterministic rules engine.

Every analysis result carries the active ``RULES_ENGINE_VERSION`` so that a
result can be reproduced against the exact rule set that produced it.
"""

from __future__ import annotations

from typing import TypedDict


class VersionEntry(TypedDict):
    version: str
    date: str
    summary: str


RULES_ENGINE_VERSION = "1.1.0"

VERSION_HISTORY: list[VersionEntry] = [
    {
        "version": "1.0.0",
        "date": "2026-07-14",
        "summary": (
            "Original Streamlit MVP rules engine: phrase-weighted typology "
            "classification, four heuristic 0-100 scores, deterministic "
            "recommendation text."
        ),
    },
    {
        "version": "1.1.0",
        "date": "2026-07-18",
        "summary": (
            "Refactored into an independent, testable Python package. Added "
            "negation detection, basic spelling-tolerance matching, "
            "structured-field weighting, conflicting-information detection, "
            "insufficient-evidence abstention, secondary-typology reporting, "
            "rule IDs and rule metadata for the public rule explorer, and an "
            "audit-trail builder that never records raw narrative text."
        ),
    },
]
