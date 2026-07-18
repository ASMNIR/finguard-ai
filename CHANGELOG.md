# Changelog

All notable changes to this project are documented here.

## [1.1.0] - 2026-07-18

### Added

- Full-stack rebuild: FastAPI backend + Next.js/TypeScript/Tailwind frontend, replacing the single-file Streamlit MVP.
- Deterministic rules engine refactored into an independent, tested Python package (`backend/app/risk_engine/`) with rule IDs, versioning, and a non-sensitive audit trail.
- Negation detection, one-edit spelling-tolerance matching, structured-field score weighting, conflicting-information detection, and insufficient-evidence abstention.
- Secondary-typology / multi-typology detection.
- Automatic PII redaction engine (`redaction.py`) covering email, phone, SSN, card/account/routing-number-like sequences, verification-code/PIN/password statements, and street addresses.
- Guided, ten-step Analyze-a-Case workflow: safety notice, urgency screening, structured intake, redaction preview, explainable results, categorized action plan, evidence checklist, case timeline, dispute-letter generator, and PDF case report.
- Portfolio dashboard with synthetic-data charts (typology, payment-channel, severity distributions; high-risk case queue; CSV export).
- Public Rule Explorer page backed by `GET /api/rules`.
- Thirteen frontend pages: Home, Analyze, Dashboard, Methodology, Rule Explorer, Research, Governance, About, Privacy, Terms, Security, Contact.
- Centralized, editable author-attribution configuration (backend `config.py`, frontend `lib/config.ts`), with empty fields hidden from public view.
- i18n architecture (English/Spanish/Bengali) covering navigation and the Analyze workflow's safety step, with an explicit, documented boundary that the classification engine remains English-phrase-based (`docs/multilingual.md`).
- Security headers, per-IP rate limiting, and request-body size limiting middleware.
- 99-test backend pytest suite; verified frontend production build across all routes.
- Docker support for both services, `docker-compose.yml`, and a GitHub Actions CI workflow.
- Full documentation set: methodology, governance, privacy, security, deployment, architecture, data dictionary, system card, limitations, multilingual, accessibility, testing, research protocol, annotation codebook.

### Changed

- Typology names normalized (e.g., "bank impersonation scam" → "Bank impersonation scam"; "AML / mule-account risk" → "AML or mule-account risk") to match the required public-facing category list.

### Known limitations

See `docs/limitations.md`. Notably: not yet deployed to a public URL (requires the project owner's own hosting credentials), no independent security audit, no completed empirical validation study, partial multilingual coverage, no end-to-end browser test suite yet.

## [1.0.0] - 2026-07-14

- Original Streamlit MVP: single-file rules-based prototype (`app.py`), synthetic sample data, methodology write-up.
