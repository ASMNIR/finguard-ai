# Architecture

## Overview

```
                         ┌─────────────────────────────┐
                         │        Frontend (Next.js)   │
                         │  App Router, TypeScript,     │
                         │  Tailwind CSS, Recharts       │
                         └──────────────┬───────────────┘
                                        │ HTTPS / JSON (fetch)
                                        ▼
                         ┌─────────────────────────────┐
                         │        Backend (FastAPI)     │
                         │  schemas.py (Pydantic)        │
                         │  api/  (routers)               │
                         │  services/ (orchestration)     │
                         └──────────────┬───────────────┘
                                        │
                     ┌──────────────────┼──────────────────┐
                     ▼                  ▼                  ▼
        ┌─────────────────────┐ ┌───────────────┐ ┌──────────────────┐
        │ risk_engine/         │ │ reports/       │ │ security/         │
        │ classifier.py        │ │ pdf_generator   │ │ headers.py        │
        │ scoring.py           │ │  (reportlab)    │ │ limits.py         │
        │ recommendations.py   │ └───────────────┘ │ (rate limiting via │
        │ redaction.py          │                    │  slowapi)          │
        │ rules.py               │                    └──────────────────┘
        │ versioning.py          │
        │ audit.py               │
        └─────────────────────┘
                     │
                     ▼
        ┌─────────────────────┐
        │ data/sample_data.csv  │  (synthetic only)
        └─────────────────────┘
```

## Request flow: Analyze a Case

1. Frontend `AnalyzeWizard` collects safety acknowledgment, urgency-screening answers, structured intake, and an optional narrative -- entirely client-side, nothing is sent to the backend until Step 4.
2. `POST /api/redact-preview` sanitizes the narrative and returns categorized redaction counts for user review.
3. `POST /api/analyze` re-redacts (defense in depth), classifies the typology, computes four scores, detects conflicts/missing information, and returns a structured `AnalyzeResponse`.
4. The results page renders scores, matched rule IDs, the action plan, evidence checklist, case timeline (client-only state), dispute-letter generator (`POST /api/letters/generate`), and a PDF download (`POST /api/reports/pdf`).

## Determinism boundary

Everything inside `backend/app/risk_engine/` is pure, deterministic Python with no network calls and no machine-learning inference. This is a deliberate architectural boundary: the classification and scoring functions can be unit-tested with plain input/output assertions, and the same input always produces the same output for a given `RULES_ENGINE_VERSION`.

## Data flow and storage boundary

There is no database in this release. `services/csv_service.py` reads the synthetic CSV from disk (or an uploaded file held in memory) purely for the dashboard demo; case-analysis requests never touch disk. This means the "no raw narrative storage by default" privacy claim is structurally true, not just policy -- there is no code path that writes narrative text anywhere persistent.

## Frontend structure

- `app/` -- Next.js App Router pages, one directory per route.
- `components/` -- shared UI (Nav, Footer, ScoreCard, SeverityBadge, DisclaimerBanner) and the `analyze/` subtree (wizard steps).
- `lib/` -- `api.ts` (typed fetch client), `types.ts` (schema mirror), `config.ts` (attribution/env), `i18n/` (dictionaries).

## Backend structure

- `app/main.py` -- app assembly: middleware, routers, exception handling.
- `app/config.py` -- `pydantic-settings`-based configuration, including the centralized author-attribution fields.
- `app/schemas.py` -- all request/response models.
- `app/api/` -- one module per resource (analyze, dashboard, letters, reports, rules, feedback, contact, meta).
- `app/services/` -- orchestration that calls into `risk_engine/` and `reports/`.
- `app/risk_engine/` -- the deterministic engine described above.
- `app/reports/` -- `reportlab`-based PDF generation.
- `app/security/` -- header and body-size-limit middleware.
- `app/tests/` -- pytest suite (99 tests as of v1.1.0).

## Why FastAPI + Next.js

FastAPI gives Pydantic-validated, self-documenting (OpenAPI at `/api/docs`) endpoints with minimal ceremony, matching the "deterministic by default" requirement. Next.js App Router gives file-based routing across the dozen-plus required pages, server-rendering where useful, and a component model well-suited to the guided multi-step Analyze workflow.
