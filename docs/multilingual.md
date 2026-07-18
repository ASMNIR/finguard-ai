# Multilingual Support

## Status: partial (roadmap item, honestly disclosed)

FinGuard-AI's frontend has an i18n architecture (`frontend/lib/i18n/dictionaries.ts`) supporting English, Spanish, and Bengali. **As of this release, the dictionary covers navigation labels and the Analyze workflow's Step 1 (safety & privacy) screen end to end**, as a proof of the architecture. It does not yet cover every page.

This is intentionally disclosed rather than silently overclaimed: translating and, more importantly, independently reviewing the entire site (privacy/terms/legal language especially) is nontrivial work that should not be rubber-stamped by machine translation alone, given how much of this product's language is deliberately careful ("may warrant," "is recommended," never "confirmed").

## What is translated today

- Primary navigation labels (`nav.*`).
- The Analyze workflow's safety/privacy step (title, sensitive-information warning, "not an emergency service" notice, acknowledgment checkbox, continue button).
- A language switcher (`components/LanguageSwitcher.tsx`) is available on that step and persists the selection through the wizard's `language` field, which is sent to `POST /api/analyze` as a `language` parameter.

## What is not yet translated

- The remaining Analyze workflow steps (urgency screening, structured intake, redaction preview, results).
- Static content pages (Methodology, Research, Governance, About, Privacy, Terms, Security, Contact).
- Backend-generated text: recommendations, action-plan items, dispute-letter templates, and PDF report content are English-only in this release.

## Classification-engine language boundary

**The deterministic rules engine matches English-language phrases only.** The `language` field is accepted and stored on the request/response for future use, but no Spanish- or Bengali-specific phrase rule set exists yet in `backend/app/risk_engine/rules.py`. If a Spanish or Bengali narrative is submitted, it is redacted and scored using structured-intake fields and whatever English cognates happen to appear, but **it should not be assumed to receive the same evidence-strength quality as an English narrative.** This is called out explicitly in `docs/governance.md`'s fairness-limitations section and must not be silently glossed over in any future expansion of this feature.

## Roadmap for full multilingual coverage

1. Independent, professional (not purely machine) translation of every static page and backend-generated string, with terminology review against the careful-language guidelines used throughout this project.
2. Language-specific phrase-rule sets for the classifier, each independently validated (not a 1:1 machine translation of the English rules, since idiomatic scam-narrative language differs by language and region).
3. `next-intl`-based (or equivalent) locale-prefixed routing (`/es/...`, `/bn/...`) so every page -- not just the Analyze workflow -- is served in the user's chosen language, including metadata and `lang` attributes for accessibility.
4. Locale-aware PDF report generation.
5. QA pass confirming no mixed-language leakage on any single page.
