# Contributing to FinGuard-AI

Thank you for considering a contribution to this research prototype.

## Ground rules

- This project handles descriptions of financial fraud and consumer harm. Never commit real, non-synthetic consumer data. All sample data must remain fictional (see `data/README.md`).
- Preserve the platform's careful, non-adjudicative language ("may warrant," "is recommended") -- do not introduce language that states a legal conclusion or guarantees an outcome.
- Any change to `backend/app/risk_engine/rules.py` (weights, phrases, or new rules) must bump `RULES_ENGINE_VERSION` in `versioning.py` and add a changelog entry there and in `docs/methodology.md`.

## Development setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python -m pytest app/tests -q
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Pull request checklist

- [ ] `python -m pytest app/tests -q` passes.
- [ ] `npm run build` (frontend) succeeds with no new TypeScript/ESLint errors.
- [ ] New rules include a `rule_id`, `weight`, and `rationale`.
- [ ] New user-facing text avoids adjudicative or guaranteed-outcome language.
- [ ] `CHANGELOG.md` updated for any user-visible change.

## Code style

- Python: type hints throughout, `from __future__ import annotations`, no unused imports.
- TypeScript: strict mode is on (`tsconfig.json`); avoid `any`.

## Reporting bugs / requesting features

Use the issue templates in `.github/ISSUE_TEMPLATE/`.
