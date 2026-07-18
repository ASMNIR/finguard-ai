# Deployment

## Current status: live

| Component | URL | Host |
|---|---|---|
| Frontend | https://frontend-five-liard-58.vercel.app | Vercel (free/Hobby tier) |
| Backend API | https://finguard-ai-api.onrender.com | Render (free tier, Docker) |
| Source | https://github.com/ASMNIR/finguard-ai | GitHub |

Both were verified live end-to-end (not just built): `/api/health`, `POST /api/analyze`, `/api/dashboard/sample-summary`, and cross-origin requests from the actual Vercel domain to the actual Render domain all returned real 200 responses at deploy time.

**Free-tier caveat:** Render's free web-service tier spins down after ~15 minutes of inactivity. The first request after idle time can take up to ~50 seconds while the instance restarts; subsequent requests are fast. If this matters for a live demo, upgrade the Render service to a paid "Starter" instance beforehand (Render dashboard → service → Settings → Instance Type), which removes the spin-down behavior.

The steps below document exactly how this deployment was produced, so it can be redeployed, forked, or moved to a different host.

## Frontend: Vercel

1. Push this repository to GitHub (see `docs/architecture.md` for structure).
2. In the Vercel dashboard: **New Project** → import the repo → set **Root Directory** to `frontend/`.
3. Framework preset: Next.js (auto-detected).
4. Environment variables (Project Settings → Environment Variables), copied from `frontend/.env.example`:
   - `NEXT_PUBLIC_API_BASE_URL` = the deployed backend URL + `/api` (e.g. `https://api-finguard-ai.onrender.com/api`)
   - `NEXT_PUBLIC_AUTHOR_NAME`, `NEXT_PUBLIC_AUTHOR_ROLE`, etc. from `.env.example`.
5. Deploy. Vercel will provide a URL of the form `https://finguard-ai.vercel.app` (or a project-specific subdomain) -- confirm the actual assigned URL in the Vercel dashboard after deploying, since Vercel may allocate a different subdomain if the name is taken.
6. Custom domain: Project Settings → Domains → add your domain and follow Vercel's DNS instructions (CNAME or A record as directed). HTTPS is provisioned automatically via Vercel's managed certificates.

**Free-tier limitations:** Vercel's Hobby tier includes serverless function execution limits, bandwidth caps, and does not include a paid support SLA. Review current limits at time of deployment, as they change.

## Backend: Render (or Railway / Fly.io / Cloud Run)

### Render

1. New → Web Service → connect the GitHub repo.
2. Root directory: repository root (the Dockerfile build context must be the repo root; see the note in `backend/Dockerfile`).
3. Environment: Docker. Dockerfile path: `backend/Dockerfile`.
4. Environment variables, copied from `backend/.env.example`:
   - `ENVIRONMENT=production`
   - `CORS_ORIGINS=https://<your-vercel-domain>`
   - `RATE_LIMIT_PER_MINUTE`, `MAX_REQUEST_BODY_BYTES`, `MAX_NARRATIVE_CHARS` as needed
   - Author-attribution fields as desired
5. Health check path: `/api/health`.
6. Deploy. Render will provide a URL such as `https://api-finguard-ai.onrender.com` -- confirm the actual assigned URL after deploying.

**Free-tier limitations:** Render's free web-service tier spins down after a period of inactivity, causing a cold-start delay on the next request, and provides limited monthly compute hours. Review current limits at time of deployment.

### Railway / Fly.io / Google Cloud Run (alternatives)

All three support deploying from `backend/Dockerfile` with the same environment variables. Cloud Run additionally requires setting the container's listening port to match the `PORT` environment variable it injects (update the Dockerfile `CMD` to read `$PORT` if deploying there, since Cloud Run does not fix the port to 8000).

## Docker Compose (local full-stack run)

```bash
docker compose up --build
```

This builds both images from the repository root and starts the backend on port 8000 and the frontend on port 3000, wired together via `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api`.

## CORS configuration checklist

Whichever backend host is used, `CORS_ORIGINS` **must** include the exact scheme + host of the deployed frontend (e.g. `https://finguard-ai.vercel.app`), or the frontend's `fetch` calls will fail with a CORS error in the browser console.

## Monitoring guidance

- Use the deployed backend's `/api/health` endpoint for uptime checks (Render/Railway/Fly.io all support external or built-in health checks against a path).
- Enable your hosting provider's request/error logging dashboard; do not add a third-party logging SDK without first reviewing `docs/privacy.md`'s no-raw-narrative-logging requirement.

## Rollback

Both Vercel and Render keep a history of prior deployments/builds; use their dashboard "redeploy previous version" / "rollback" feature rather than a force-push to `main`.

## Release process

1. Merge to `main` via pull request (CI must pass -- see `.github/workflows/ci.yml`).
2. Tag a release (`git tag vX.Y.Z && git push --tags`) and update `CHANGELOG.md`.
3. Vercel and Render are both configured (once connected) to auto-deploy on push to `main`; verify the new deployment's health check before considering the release complete.
