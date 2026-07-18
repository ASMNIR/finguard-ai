# FinGuard-AI Methodology

## Status and purpose

FinGuard-AI is an explainable research prototype for financial fraud and consumer-harm risk intelligence. It demonstrates a practical, auditable analytics architecture for U.S. fraud operations, APP scams, AML and mule-account indicators, dispute governance, recovery prioritization, and consumer protection.

The prototype is not production-ready. The rules and thresholds have not been validated against a representative population, institutional loss data, public complaint data, confirmed fraud labels, or regulatory outcomes.

## Analytical workflow

For each case, the engine performs these steps (implemented in `backend/app/risk_engine/` and orchestrated by `backend/app/services/analysis_service.py`):

1. Redact sensitive patterns from the narrative (`redaction.py`) before any further processing.
2. Normalize the sanitized text (lowercase, punctuation cleanup) (`classifier.py`).
3. Match visible phrases against typology rule lists (`rules.py`), including a one-edit-distance spelling-tolerant fallback for single-word indicators.
4. Suppress matches found within 28 characters after a negation cue (e.g., "did not", "never") and report them separately as negated indicators.
5. Select the typology with the highest weighted rule score; report a secondary typology when a second category scores at least 60% of the top score.
6. Abstain to "Insufficient evidence" when no category has meaningful matched weight and the input is short.
7. Calculate four separate 0-100 risk scores (`scoring.py`) from typology, structured intake fields, and narrative indicators.
8. Detect contradictions between structured answers and narrative text (`classifier.detect_conflicts`).
9. Generate a deterministic recommendation and categorized action plan (`recommendations.py`).
10. Build an audit trail containing rule IDs, redaction categories, and conflict flags -- never raw narrative text (`audit.py`).

No embeddings, generative model, hidden prompt, or black-box classifier is used for classification or scoring in the default configuration.

## Typology categories

- **APP scam** -- the consumer or business appears to have authorized a payment because of deception.
- **Bank impersonation scam** -- false bank fraud departments, spoofed caller ID, false "safe account" instructions, one-time passcodes.
- **Invoice redirection or business email compromise** -- changed payment instructions, compromised vendor/supplier email, closing-agent impersonation.
- **Marketplace scam** -- fake listings, off-platform payment, non-delivery, fraudulent rentals.
- **Romance scam** -- prolonged online relationships, fabricated emergencies, repeated financial requests.
- **Investment scam** -- guaranteed returns, unlicensed brokers, withdrawal-fee extraction, "pig butchering" patterns.
- **AML or mule-account risk** -- receiving-side indicators such as pass-through accounts, structuring references, and rapid onward transfers. These are risk indicators, not findings of criminal activity.
- **Medical debt or credit stress** -- billing disputes, collections, credit-report impact.
- **Mortgage or insurance stress** -- servicing errors, foreclosure risk, force-placed insurance.
- **Financial reporting or disclosure-integrity concern** -- disclosure and internal-control concerns.
- **Other** -- some evidence matched, but not a defined category.
- **Insufficient evidence** -- no meaningful matched evidence; the engine abstains rather than forcing a label.

## Classification logic

Each typology has a list of phrases with a visible weight (see the Rule Explorer, `GET /api/rules`). The selected category is the one with the highest total matched weight. A secondary typology is reported when a second category's score is within 60% of the top score, supporting a multi-typology state.

The evidence-strength indicator (0-100) is a heuristic based on total matched weight, number of matched phrases, and separation between the top two categories. **It is not a calibrated probability.**

### Negation handling

A positive phrase match found within a short window immediately after a negation cue (e.g., "not", "never", "did not") is excluded from scoring and reported separately as a `negated_indicators` entry, so that "the caller never claimed to be from the bank" does not score the same as "the caller claimed to be from the bank."

### Spelling tolerance

Single-word indicators (no spaces) also match narrative tokens within one edit (insertion, deletion, or substitution), e.g. "structurng" still matches the "structuring" rule. Multi-word phrases require an exact substring match in this release.

### Conflicting-information detection

When a structured intake answer contradicts the narrative -- for example, "payment was authorized" selected alongside "I never approved the transfer" in the narrative -- the engine reports a conflict and recommends manual review rather than resolving the contradiction itself.

## Fraud Risk Score

Inputs: typology base risk, payment-channel reversibility/speed, credential or one-time-passcode compromise, remote access or screen sharing, spoofing and false safe-account instructions, urgency/pressure tactics, account-takeover language, implausible return promises, mule-recruitment incentives, amount lost, confirmed-fraud outcome language, and structured-intake flags (credentials shared, remote access, impersonation reported, payment instructions changed).

Bands: `0-44` Low, `45-69` Moderate, `70-84` High, `85-100` Critical. This is a triage indicator, not a conclusion that fraud occurred.

## Consumer Harm Score

Inputs: amount lost, vulnerability indicators (age/fixed-income, disability, language access, medical/housing/essential-funds impact, account depletion, repeat victimization, reported distress), typology-level manipulation duration, structured essential-expense-impact flag, and unresolved/recovered outcome language.

## Dispute Friction Score

Inputs: claim denial, case closure without resolution, no response, repeated contacts, department transfers, duplicative document requests, appeals, provisional-credit reversal, external complaints, extended resolution timelines, and structured dispute-status flags.

## Recovery Urgency Score

Inputs: payment-channel reversibility, recovery-sensitive typologies (APP scam, bank impersonation, BEC, AML/mule-account risk), overall Fraud Risk Score, temporal language ("today", "pending"), structured payment-pending flag, case-date recency, material loss amount, and recovery/resolution outcome language.

## Recommendation and action-plan logic

Recommendations are generated from explicit typology and score-threshold conditions (`recommendations.generate_recommendation`) using careful, non-adjudicative language ("may warrant," "is recommended," "manual review is recommended"). The categorized action plan (`build_action_plan`) varies by payment channel, typology, credential-compromise status, and payment-pending status.

## Explainability and auditability

Every result can be reconstructed from public rule dictionaries in `rules.py`, matched narrative phrases, category weights, typology base values, transparent point additions/deductions, visible thresholds, and deterministic recommendation conditions. An auditor can reproduce the same result from the same input given the same rules-engine version.

## Limitations

See `docs/limitations.md` for the full discussion, including synthetic-data limitations, heuristic phrase-matching limitations, absence of factual verification, absence of legal/compliance determination, uncalibrated thresholds, and potential bias/accessibility risks.

## Version history

| Version | Date | Summary |
|---|---|---|
| 1.0.0 | 2026-07-14 | Original Streamlit MVP rules engine. |
| 1.1.0 | 2026-07-18 | Refactored into an independent Python package; added negation detection, spelling tolerance, structured-field weighting, conflict detection, insufficient-evidence abstention, secondary-typology reporting, rule IDs, and a non-sensitive audit trail. |

## Improvement paths

See `docs/limitations.md` ("Improvement with public complaint data" and "Improvement with institutional data") and `research/publication_links.md` for the empirical validation roadmap, and the optional interpretable machine-learning extension described there.
