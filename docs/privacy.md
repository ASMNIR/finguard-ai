# Privacy

## Anonymous by default

The public case-analysis flow requires no account and no login. No persistent user identifier is created for anonymous analysis. See `POST /api/analyze` in `backend/app/api/analyze.py`.

## What information is processed

- The narrative text you enter, after automatic redaction (see below).
- Structured intake fields you choose to fill in (dates, amounts, channel, dispute status) -- see `backend/app/schemas.py::StructuredIntake`.

## What is not collected by default

- Raw, unredacted narrative text is not persisted beyond the lifetime of the API request that processes it -- there is no database write path for it in this release.
- No advertising trackers or behavioral-profiling scripts.
- No account, password, or persistent case history unless a future opt-in feature is explicitly enabled (not present in this release).

## Automatic redaction

Implemented in `backend/app/risk_engine/redaction.py`. Categories: email addresses, telephone numbers, Social Security number patterns, long account-number-like and payment-card-like sequences, routing-number-like sequences, verification-code/PIN/password statements, and street addresses. This is a best-effort, regex-based safeguard, not a guarantee -- users are also instructed not to enter sensitive details themselves (Analyze workflow Step 1).

## Server logs

Application/uvicorn logs record method, path, and status code for operational monitoring. The validation-error handler in `backend/app/main.py` deliberately returns only field paths and error types, never the submitted value, so a rejected request cannot leak narrative content into a log or error response.

## Cookies and analytics

The public prototype sets no tracking cookies and integrates no third-party analytics or advertising SDK.

## Third-party services

Outbound links to official reporting resources (ReportFraud.ftc.gov, IdentityTheft.gov, the CFPB complaint portal, IC3, state attorney general resources, Eldercare Locator) open in a new tab and are governed by that organization's own privacy practices.

## Retention

- Anonymous case analysis: processed in memory for the duration of the request; not retained afterward.
- Dashboard CSV uploads (`POST /api/dashboard/upload-summary`): processed in memory only, capped at 1 MB, not stored to disk.
- Contact-form submissions (`POST /api/contact`): acknowledged but not persisted in this release.
- Feedback submissions (`POST /api/feedback`): acknowledged but not persisted or used for training in this release.

## Future opt-in case tracking

A future authenticated, opt-in case-tracking feature (optional PostgreSQL/Supabase support referenced in the architecture) would require explicit consent, documented retention limits, encryption at rest, user-initiated deletion, access controls, and audit logging before release. It is disabled by default and not implemented in this release.

## Deletion requests

Because anonymous analysis is not stored, there is typically nothing to delete. For questions, use the Contact page or `SECURITY.md` contact path.

## Security limitations

This is a research prototype and has not completed an independent third-party security audit. See `docs/security.md`.

## Prohibited information

Do not enter passwords, PINs, Social Security numbers, full account numbers, full card numbers, routing numbers, or one-time authentication codes -- both because of the sensitivity of that data and because FinGuard-AI's redaction is a best-effort safeguard, not a guarantee.
