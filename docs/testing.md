# Testing

## What has actually been run (as of this release)

### Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate  # or source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
python -m pytest app/tests -q
```

**Result at time of writing: 99 passed, 0 failed.** Coverage includes:

- Every one of the twelve typologies classifies correctly on a representative narrative (`test_classifier.py`).
- Insufficient-evidence abstention for empty/very short narratives.
- Negation suppresses a positive phrase match (`test_negation_suppresses_positive_match`, `test_negated_indicator_is_reported_but_not_scored`).
- Spelling-tolerance fuzzy matching (`test_spelling_tolerance_single_word_indicator`).
- Multi-typology / secondary-typology detection.
- Conflict detection (authorized-vs-denial contradiction) and the no-conflict case.
- Missing-information detection.
- All four scores stay within `[0, 100]` across all twelve typologies and extreme inputs (`test_scoring.py`, parametrized).
- Score-band thresholds at every boundary (44/45, 69/70, 84/85).
- Full recovery reduces harm and urgency scores; pending payments and shared credentials increase relevant scores.
- Extremely long narratives (40,000+ characters) do not break scoring.
- PII redaction for email, phone, SSN, card-number, verification-code, password, and street-address patterns, plus the empty/clean-narrative cases (`test_redaction.py`).
- Full API integration tests via FastAPI's `TestClient`: health check, analyze happy path, empty-case rejection (400), oversized-narrative rejection (422) with no value echoed back, redaction preview, rule explorer, dashboard sample summary and CSV download, letter generation (valid and invalid template), PDF report generation (verifies actual `%PDF` byte signature), feedback endpoint, contact endpoint (valid, honeypot-rejected, empty-message-rejected), and security-header presence (`test_api.py`).

### Manual live-server smoke test

Also performed manually during this build (not part of the automated suite, but actually executed, not assumed):

```bash
cd backend
.venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8123
curl http://127.0.0.1:8123/api/health
curl -X POST http://127.0.0.1:8123/api/analyze -d '{...}'
curl -X POST http://127.0.0.1:8123/api/reports/pdf -d '{...}'  # verified real PDF bytes returned
```

### Frontend

```bash
cd frontend
npm install
npm run build
```

**Result at time of writing: build succeeds, all 13 routes compile and prerender, TypeScript type-checking passes with zero errors, ESLint passes.** This confirms the app builds and every page's TypeScript is sound; it does not by itself confirm every interactive flow behaves correctly in a real browser (see "not yet run" below).

## What has NOT been run (honest disclosure)

- No Playwright/Cypress end-to-end browser test suite exists yet. The guided Analyze wizard, redaction preview, letter generator, and PDF download have been code-reviewed and the underlying API calls are covered by backend integration tests, but no automated browser-driven click-through test has been executed.
- No `npm run test` (Vitest) unit tests have been written for frontend components yet, even though the `vitest`/`@testing-library/react` devDependencies are present in `package.json` for this purpose.
- No load/performance testing has been performed.
- No automated accessibility test run (see `docs/accessibility.md`).

## Recommended next steps for a contributor

1. Add Vitest unit tests for `ScoreCard`, `SeverityBadge`, and the redaction-preview rendering logic.
2. Add a Playwright suite covering: full Analyze wizard happy path, urgency-alert triggering, PDF download, CSV upload to the dashboard, and mobile-viewport navigation.
3. Wire both into `.github/workflows/ci.yml` (already scaffolded to run backend pytest and frontend build/typecheck).
