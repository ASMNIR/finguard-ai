# Research Protocol (Design Document)

**Status: this is a protocol design for a future empirical validation study. No annotation study has been conducted yet, and no accuracy/precision/recall numbers exist for FinGuard-AI as of this release.**

## Objective

Measure how well the FinGuard-AI rules engine's typology classification and score outputs align with independent human judgment on a representative, appropriately licensed sample of complaint narratives.

## Proposed data sources

- Publicly available, de-identified consumer-complaint narrative datasets (subject to each source's license terms and any required data-use agreement).
- Synthetic narratives generated to stress-test specific rules (negation, spelling variants, multi-typology cases) -- useful for unit testing but not for prevalence claims.
- Institutional data, only under a lawful data-sharing agreement, privacy review, and governance sign-off (see `docs/governance.md`).

## Proposed annotation process

1. Recruit at least two independent human annotators per narrative, blind to the rules engine's output.
2. Annotators apply the codebook in `docs/annotation_codebook.md` to assign a primary typology (and, where applicable, a secondary typology) and a subjective evidence-strength rating.
3. Compute inter-rater agreement (Cohen's kappa or Krippendorff's alpha) before comparing to the rules engine.
4. Adjudicate disagreements via a third annotator or discussion, producing a consensus label.

## Proposed metrics

- Per-typology precision, recall, and F1 (macro and weighted).
- Confusion matrix across all twelve categories, including "Insufficient evidence."
- Abstention-rate analysis: how often the engine abstains versus how often human annotators found the narrative genuinely ambiguous.
- False-positive and false-negative qualitative review for the highest-stakes typologies (Bank impersonation scam, AML or mule-account risk).
- Subgroup analysis where demographic or language metadata is available and lawfully usable.

## Ethical and legal constraints

- No real complaint narrative will be used in development or testing without proper authorization, licensing, and de-identification.
- Annotators must not be shown any information that would allow re-identification of a real consumer.
- Any published results must include the dataset's known limitations (redactions, reporting bias, non-representativeness).

## Reproducibility commitments

- The exact `RULES_ENGINE_VERSION` used for any reported metric will be recorded.
- Annotation guidelines, inter-rater agreement statistics, and de-identified disagreement examples will be published alongside any accuracy claim.
