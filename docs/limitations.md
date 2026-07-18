# Known Limitations

FinGuard-AI is a research prototype. This document lists known limitations honestly and directly; none of them are hidden elsewhere in the product.

## Synthetic data

`data/sample_data.csv` contains fictional demonstration cases. They cannot establish real-world accuracy, prevalence, loss rates, protected-class effects, institutional performance, or consumer outcomes. The portfolio dashboard is clearly labeled as synthetic on every view.

## Heuristic phrase matching

The rules engine may miss paraphrases, spelling errors beyond a one-edit tolerance, sarcasm, complex timelines, or emerging scheme language. Multi-word phrases require an exact substring match. Negation handling is a nearby-window cue check, not a full dependency parse, and can both under- and over-suppress in edge cases.

## No factual verification

The tool analyzes reported text and structured answers. It does not verify identity, account ownership, transaction records, device data, beneficiary data, sanctions exposure, or source of funds.

## No legal or compliance determination

The output does not decide reimbursement rights, liability, unfair-or-deceptive-conduct findings, suspicious-activity-reporting obligations, money-laundering findings, sanctions matches, consumer-law violations, or criminal conduct.

## Uncalibrated thresholds

Scores and cutoffs were selected for demonstration and interpretability. They require empirical calibration and governance approval before any operational use. See `docs/governance.md`.

## Potential bias and accessibility risks

Narrative quality varies by language, disability, education, access to records, and assistance received. The rules engine has not been tested for disparate impact across demographic groups. Multilingual coverage is partial (see `docs/multilingual.md`) and translated narratives are not treated as equivalent to independently reviewed English-language phrase matches.

## Data privacy and security maturity

This prototype implements data minimization, redaction, and standard security headers/rate limiting, but has not undergone an independent third-party security audit or formal penetration test. See `docs/security.md`.

## Testing scope

Automated tests cover the deterministic rules engine, the API surface, and frontend build/type correctness. End-to-end browser automation (Playwright/Cypress) and a full WCAG 2.2 AA accessibility audit are documented as roadmap items, not completed certifications -- see `docs/accessibility.md` and `docs/testing.md` for exactly what has and has not been run.

## Deployment status

This release has been built, containerized, and tested locally (backend pytest suite, live uvicorn smoke tests, frontend production build). It has not been deployed to a public cloud URL as part of this engagement, because doing so requires the project owner's own Vercel/Render (or equivalent) account credentials. See `docs/deployment.md`.

## Improvement with public complaint data

A future research phase could use appropriately licensed and de-identified public complaint data to expand the phrase dictionary, measure coverage across complaint products/issues, evaluate temporal/geographic trends, compare typology predictions with available complaint labels, analyze dispute-friction language, and test whether harm/urgency indicators identify meaningful subgroups. Public data may have missing labels, reporting bias, redactions, and nonrepresentative coverage that would need to be documented.

## Improvement with institutional data

Subject to lawful access, privacy controls, and governance approval, institutional data could support stronger validation through confirmed fraud/nonfraud labels, transaction timing/channel/amount/beneficiary features, device/account/authentication indicators, recall/freeze/recovery/reimbursement outcomes, receiving-side account/network patterns, dispute contact/evidence-request/cycle-time data, repeat-victimization/linked-case analysis, and analyst disposition/quality-review data. A production program should separate model development, validation, approval, deployment, monitoring, and change control.

## Optional machine-learning extension

A later version could add a simple, interpretable classifier (e.g., TF-IDF with logistic regression). The rules engine should remain available as a benchmark, fallback, explanation layer, source of weak labels, and a governance control for detecting implausible model outputs. Any ML extension should report class-level precision, recall, calibration, confusion matrices, subgroup performance, drift, and stability, and should not replace human review for high-impact decisions. No ML model is active in this release.
