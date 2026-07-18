# System Card: FinGuard-AI

## Summary

FinGuard-AI is a deterministic, rules-based system that classifies financial-fraud/consumer-harm complaint narratives into one of twelve typology categories and produces four independent 0-100 risk scores, alongside a consumer-facing action plan. It contains no machine-learning or generative-AI component in its default configuration.

## Intended use

Informational triage support and consumer self-help guidance for research and demonstration. See `docs/governance.md` for the full intended/prohibited-use statement.

## System type

Rule-based expert system (weighted phrase matching + structured-field scoring). Not a neural network, not a large language model, not a statistical classifier, in this release.

## Inputs

- Free-text narrative (optional, max 8,000 characters), redacted before use.
- Structured intake fields: incident date, state, amount lost, payment channel, institution type, authorization/impersonation/credential/dispute flags, dispute status, reported outcome.

## Outputs

- Primary and optional secondary typology (12 categories, including an explicit "Insufficient evidence" abstention state).
- Four 0-100 scores with severity bands (Low/Moderate/High/Critical) and full factor-level decomposition.
- Matched and negated rule IDs.
- Missing-information and conflicting-information flags.
- A categorized action plan, evidence checklist, and dispute-letter drafts.

## Performance characteristics

No empirical accuracy claim is made. See `docs/limitations.md` and `docs/research` validation roadmap. The system is deterministic: identical input and identical `RULES_ENGINE_VERSION` always produce identical output, which is itself verified by the automated test suite (`backend/app/tests/`).

## Explainability

Every output decomposes into named, published factors (rule IDs, weights, structured-field contributions). There is no hidden state to explain because there is no opaque model.

## Human oversight

Every result includes a manual-review recommendation on relevant thresholds. See `docs/governance.md`.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Overconfident classification from sparse evidence | Insufficient-evidence abstention threshold. |
| Contradictory user input silently ignored | Explicit conflict detection and manual-review flag. |
| Sensitive data exposure | Automatic pattern-based redaction before analysis; no raw-narrative logging or storage. |
| Misleading claims of legal/financial authority | Careful, non-adjudicative language throughout; repeated disclaimers. |
| Bias across language/disability/education | Documented as an open limitation; multilingual coverage is partial and explicitly not treated as equivalent to English. |

## Maintenance

Rule changes are version-controlled (`risk_engine/versioning.py`) with a visible changelog. See `docs/governance.md` for the rule-change process.

## Contact

See `SECURITY.md` and the Contact page for the current reporting channel.
