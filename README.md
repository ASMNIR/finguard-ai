# FinGuard-AI

### U.S. Financial Fraud and Consumer Harm Risk Intelligence and Consumer Assistance Platform

**Research Prototype.** FinGuard-AI provides informational, explainable risk indicators and consumer-assistance guidance. It is not a bank, law firm, government agency, emergency service, fraud adjudication system, or automated eligibility determination. It does not confirm that fraud occurred, determine legal rights, or guarantee reimbursement or recovery. It does not submit official complaints or reports on a user's behalf. It is not production-ready unless future validation and security reviews establish otherwise.

Designed and developed by **A S M FAHIM**, Founder, Independent Researcher, and System Designer.

---

## What this is

FinGuard-AI turns a financial-fraud or consumer-complaint narrative (plus structured case details) into:

- A transparent typology classification (12 categories, including an explicit "Insufficient evidence" state) with matched rule IDs.
- Four independent 0-100 risk scores -- Fraud Risk, Consumer Harm, Dispute Friction, Recovery Urgency -- each fully decomposable into named, signed factors.
- A personalized, channel- and typology-aware action plan.
- An evidence checklist, a case timeline builder, editable dispute-letter templates, and a downloadable PDF case report.
- A synthetic-data portfolio dashboard and a public Rule Explorer.

The classification and scoring engine is **deterministic and rules-first**: no generative AI or opaque machine-learning model determines the primary typology, a legal conclusion, or a reimbursement outcome. See `docs/methodology.md`.

## Repository structure

```
finguard-ai/
├── frontend/        Next.js + TypeScript + Tailwind CSS application
├── backend/         FastAPI + Pydantic API and the deterministic risk_engine
├── data/            Synthetic sample_data.csv + data dictionary
├── docs/            Methodology, governance, privacy, security, deployment, architecture, limitations, etc.
├── research/        Working paper, publication links, figures, presentation
├── .github/         CI workflow, issue templates, PR template
├── docker-compose.yml
└── CITATION.cff, LICENSE, SECURITY.md, CONTRIBUTING.md, CHANGELOG.md
```

## Quick start (local)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

API docs at `http://localhost:8000/api/docs`. Health check at `http://localhost:8000/api/health`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

App at `http://localhost:3000`.

### Docker Compose (both services)

```bash
docker compose up --build
```

## Testing

```bash
# Backend: 99 tests covering every typology, negation, conflicts, redaction, score bounds, and the full API surface
cd backend && python -m pytest app/tests -q

# Frontend: production build + TypeScript + ESLint across all 13 routes
cd frontend && npm run build
```

See `docs/testing.md` for exactly what has and has not been run, stated plainly.

## Key pages

| Page | Purpose |
|---|---|
| `/` | Homepage |
| `/analyze` | Guided case-intake and explainable analysis workflow |
| `/dashboard` | Synthetic portfolio dashboard |
| `/rule-explorer` | Public, live rule table |
| `/methodology` | Scoring and classification methodology |
| `/research` | Working paper, reproducibility package, validation roadmap |
| `/governance` | Intended/prohibited use, NIST AI RMF mapping |
| `/about` | Project background and author |
| `/privacy`, `/terms`, `/security` | Legal and trust pages |
| `/contact` | Research, technical, academic, and pilot inquiries |

## API surface (backend)

`POST /api/analyze`, `POST /api/redact-preview`, `GET /api/rules`, `GET /api/dashboard/sample-summary`, `POST /api/dashboard/upload-summary`, `GET /api/dashboard/sample-data.csv`, `GET /api/letters/templates`, `POST /api/letters/generate`, `POST /api/reports/pdf`, `POST /api/feedback`, `POST /api/contact`, `GET /api/health`, `GET /api/meta/attribution`. Full interactive documentation at `/api/docs` (OpenAPI/Swagger).

## Live deployment

- **Website:** https://frontend-five-liard-58.vercel.app
- **API:** https://finguard-ai-api.onrender.com (interactive docs at `/api/docs`)
- **Source:** https://github.com/ASMNIR/finguard-ai

The backend runs on Render's free tier, which spins down after inactivity -- the first request after idle time may take up to ~50 seconds to respond while the instance wakes up. See `docs/deployment.md` for the full deployment process and how to redeploy or promote to a paid always-on tier.

## Documentation index

- `docs/methodology.md` -- classification and scoring logic
- `docs/governance.md` -- intended/prohibited use, NIST AI RMF mapping
- `docs/privacy.md` / `docs/security.md` -- privacy and security practices
- `docs/architecture.md` -- system architecture and data flow
- `docs/deployment.md` -- deployment instructions
- `docs/limitations.md` -- known limitations, stated directly
- `docs/multilingual.md` -- i18n status and roadmap
- `docs/accessibility.md` -- accessibility practices and known gaps
- `docs/testing.md` -- exactly what has and has not been tested
- `docs/system_card.md`, `docs/research_protocol.md`, `docs/annotation_codebook.md`

## License

MIT. See `LICENSE`. Copyright © 2026 A S M FAHIM.

## Citation

See `CITATION.cff`.

## Author

**A S M FAHIM** -- Founder, Independent Researcher, and System Designer of FinGuard-AI.
