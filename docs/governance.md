# Governance Framework

## Intended use

Informational, explainable triage support and consumer self-help guidance for research and demonstration purposes.

## Prohibited use

- Automated adverse decisions (credit, account closure, employment, reimbursement denial) without human review.
- Official AML, sanctions, or suspicious-activity reporting.
- A substitute for qualified legal counsel.
- Emergency response, or a substitute for contacting a financial institution through an official channel.

## Human oversight

Every analysis result includes a manual-review recommendation where score thresholds, conflicts, or insufficient-evidence conditions are met. No score or classification is designed to auto-execute an action against a consumer or institution.

## Rule ownership, approval, and change management

Rules live in `backend/app/risk_engine/rules.py` as version-controlled `PhraseRule` records with a `rule_id`, `weight`, `rationale`, `source`, `enabled` flag, `effective_date`, `version`, and `last_reviewed` date. Rule-set changes are tracked in `docs/methodology.md`'s version-history table and `backend/app/risk_engine/versioning.py`'s `VERSION_HISTORY`. Any change to a rule's weight or wording should bump `RULES_ENGINE_VERSION` and add a changelog entry.

## Version control and audit logging

Every analysis response carries the active `rules_engine_version` and an `analysis_timestamp`. The audit-trail builder (`risk_engine/audit.py`) records matched rule IDs, redaction categories, and conflict fields -- explicitly excluding raw narrative text (`contains_raw_narrative: false`).

## Data minimization and privacy safeguards

See `docs/privacy.md`. Summary: anonymous by default, automatic redaction before analysis, no raw-narrative logging, narrative/request size limits, no advertising trackers.

## Security controls

See `docs/security.md`. Summary: security response headers, CSP, per-IP rate limiting, request body size limits, Pydantic input validation, JSON-only API responses, no dynamic code execution over user input.

## Fairness, language, and accessibility limitations

Narrative quality varies by language, disability, education, and access to records. The rules engine has not been validated for disparate impact across demographic groups. Multilingual phrase rules do not yet exist for Spanish or Bengali narratives (see `docs/multilingual.md`); the classification engine analyzes English text only in this release, and auto-translated narratives are not treated as equivalent to a validated rule match.

## Incident-response approach

See `SECURITY.md` for the vulnerability-reporting process for this research prototype.

## Validation requirements before any production use

1. Legal review of dispute-letter templates, disclaimers, and Terms of Use.
2. Independent security review / penetration test.
3. Empirical validation against representative, appropriately licensed complaint data (see `docs/limitations.md`).
4. Accessibility audit against WCAG 2.2 AA (see `docs/accessibility.md`).
5. Institutional governance sign-off on any operational deployment.

## Human override

Any user-facing result can be disregarded by the consumer or a reviewing professional. The platform does not lock in, store as final, or transmit a determination to any third party.

## NIST AI Risk Management Framework mapping (illustrative, not certified)

| NIST AI RMF function | FinGuard-AI practice |
|---|---|
| Govern | Documented intended/prohibited use (this file), versioned rules, `SECURITY.md`, `CONTRIBUTING.md`. |
| Map | Typology and score definitions (`docs/methodology.md`), `docs/system_card.md`, `docs/limitations.md`. |
| Measure | Deterministic pytest suite (99 tests); `docs/testing.md`; validation roadmap for empirical metrics. |
| Manage | Manual-review flags, conflict detection, insufficient-evidence abstention, human override, feedback capture. |

This mapping is illustrative and does not constitute a certified NIST AI RMF assessment or third-party audit.

## Future institutional governance model

A production deployment would require a named rule-owner role, a documented rule-approval workflow (e.g., pull-request review by a designated reviewer before merging a rule change), a change-advisory process for score-threshold changes, and a periodic (e.g., quarterly) review cadence tied to the `last_reviewed` field already present on every rule.
