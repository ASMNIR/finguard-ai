# Security

## Responsible disclosure

See `SECURITY.md` in the repository root for the current vulnerability-reporting contact.

## Secure development practices

- Deterministic, dependency-light rules engine; no dynamic code execution (`eval`, `exec`, template compilation) over user-supplied input anywhere in `risk_engine/`.
- Input validation via Pydantic v2 schemas (`backend/app/schemas.py`) with explicit `max_length` / range constraints on every field.
- Output encoding via JSON API responses only; the frontend renders API data through React (auto-escaped), never `dangerouslySetInnerHTML`.

## No sensitive-data logging

Raw narrative text is never written to application logs (`backend/app/main.py` logger is configured for structured, non-sensitive fields only). The `RequestValidationError` handler returns field paths and error *types* only, never the submitted value -- verified by `test_analyze_endpoint_rejects_oversized_narrative` in the backend test suite.

## Secure headers

`backend/app/security/headers.py` (`SecurityHeadersMiddleware`) applies `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, a restrictive `Permissions-Policy`, and a `default-src 'none'` Content-Security-Policy to every API response. `Strict-Transport-Security` is added automatically when the request scheme is HTTPS. The frontend (`next.config.mjs`) applies the same header set at the edge.

## CORS

`backend/app/config.py::cors_origin_list()` restricts allowed origins to an explicit comma-separated allowlist (default: `localhost:3000`), with only `GET`/`POST` and `Content-Type` permitted, and credentials disabled.

## Rate limiting and request-size limits

- Per-IP rate limiting via `slowapi` (`RATE_LIMIT_PER_MINUTE`, default 30/minute).
- `BodySizeLimitMiddleware` (`backend/app/security/limits.py`) rejects oversized request bodies (`MAX_REQUEST_BODY_BYTES`, default 256 KB) before they reach a handler.
- Per-field length limits (narrative capped at 8,000 characters; dashboard CSV upload capped at 1 MB).

## File-type and upload validation

`POST /api/dashboard/upload-summary` validates the declared content type and enforces a hard size cap before attempting to parse the file; parse failures return a generic 400 rather than echoing parser internals.

## Dependency scanning

GitHub Actions (`.github/workflows/`) runs backend tests, frontend build/typecheck, and `pip`/`npm` dependency installation on every push and pull request, surfacing installation and known-vulnerability failures in CI.

## Access control

The public API exposes only anonymous, stateless endpoints. There is no administrative interface, authentication system, or privileged role in this release -- there is nothing to escalate to.

## Encryption

Production deployments should terminate TLS at the load-balancer/CDN layer (Vercel and Render both provide this by default) and enforce HTTPS end to end; see `docs/deployment.md`.

## Secret management

All configuration, including author-attribution fields and CORS origins, is environment-variable driven via `.env` files that are excluded from version control (`.gitignore`) with `.env.example` templates checked in instead. No credentials are hard-coded anywhere in the codebase.

## Known gaps (honest disclosure)

- No independent third-party penetration test has been performed.
- No Web Application Firewall (WAF) is configured in this release; a production deployment behind Vercel/Render should add one at the platform or CDN level.
- Automated dependency **vulnerability** scanning (e.g., Dependabot alerts, `pip-audit`) is configured as a CI step placeholder but has not been run against a live vulnerability database as part of this engagement.

## Incident response

See `SECURITY.md` for the current process. A production deployment would additionally need an on-call rotation, a documented severity matrix, and a public status page.
