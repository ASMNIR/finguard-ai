# Data Dictionary: `sample_data.csv`

`data/sample_data.csv` contains **30 synthetic, fictional demonstration cases**. No row corresponds to a real consumer, institution, complaint, investigation, or enforcement matter.

| Column | Type | Description |
|---|---|---|
| `case_id` | string | Synthetic case identifier, e.g. `FG-0001`. |
| `date` | date (`YYYY-MM-DD`) | Fictional incident date. |
| `state` | string | Two-letter U.S. state code (fictional). |
| `narrative` | string | Fictional first-person complaint narrative used to demonstrate phrase-based classification. |
| `amount_lost` | number | Fictional reported loss amount in USD. |
| `payment_channel` | string | One of: instant payment, wire transfer, P2P payment, ACH, debit card, cryptocurrency, gift card, not applicable. |
| `institution_type` | string | One of: bank, credit union, payment platform, crypto exchange, mortgage servicer, insurance company, debt collector, credit bureau, public company. |
| `outcome` | string | Fictional reported outcome, e.g. `claim pending`, `denied - no refund`, `partial recovery`, `full refund`, `information only`. |

## Derived columns (added by the analysis engine, not present in the source file)

| Column | Description |
|---|---|
| `typology` | Primary typology classification (see `docs/methodology.md`). |
| `evidence_strength` | 0-100 heuristic evidence-strength indicator (not a probability). |
| `fraud_risk_score` | 0-100 Fraud Risk Score. |
| `consumer_harm_score` | 0-100 Consumer Harm Score. |
| `dispute_friction_score` | 0-100 Dispute Friction Score. |
| `recovery_urgency_score` | 0-100 Recovery Urgency Score. |
| `overall_severity` | Low / Moderate / High / Critical band of the maximum of the four scores. |
| `matched_indicators` | Comma-separated list of matched rule phrases. |
| `recommendation` | Deterministic recommendation text. |

## Uploading your own CSV

`POST /api/dashboard/upload-summary` accepts a CSV with the same eight required source columns (`case_id, date, state, narrative, amount_lost, payment_channel, institution_type, outcome`), capped at 1 MB, processed in memory only, and not stored.
