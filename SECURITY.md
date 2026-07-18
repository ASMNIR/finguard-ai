# Security Policy

FinGuard-AI is a research prototype. We still take security reports seriously.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for a suspected security vulnerability. Instead:

1. Email the contact address configured in `CONTACT_EMAIL` (backend) / `NEXT_PUBLIC_CONTACT_EMAIL` (frontend) for this deployment, or the repository owner directly if those are not yet set.
2. Include: a description of the issue, steps to reproduce, and the potential impact.
3. Allow a reasonable time for a response before any public disclosure.

## Scope

In scope: the FastAPI backend (`backend/`), the Next.js frontend (`frontend/`), and the deterministic risk engine (`backend/app/risk_engine/`).

Out of scope: third-party hosting-provider infrastructure (Vercel, Render, etc.) -- report those directly to the provider.

## Supported versions

Only the latest commit on `main` is supported with security fixes during this research-prototype phase.

## What to expect

This is an independent research project without a dedicated security team or bug-bounty budget. We will acknowledge reports, investigate in good faith, and credit reporters (if desired) once a fix ships.
