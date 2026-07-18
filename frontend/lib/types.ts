export interface StructuredIntake {
  incident_date?: string | null;
  state?: string;
  amount_lost?: number;
  currency?: string;
  payment_channel?: string;
  institution_type?: string;
  contact_channel?: string;
  contact_initiated_by?: "consumer" | "other_party" | "unknown";
  payment_authorized?: boolean | null;
  impersonation_reported?: boolean | null;
  impersonated_organization_type?: string;
  payment_instructions_changed?: boolean | null;
  credentials_shared?: boolean | null;
  remote_access_provided?: boolean | null;
  dispute_submitted?: boolean | null;
  dispute_submission_date?: string | null;
  dispute_status?: string;
  reported_outcome?: string;
  essential_expense_impact?: boolean | null;
  payment_pending?: boolean | null;
}

export interface ScoreFactor {
  factor: string;
  effect: number;
}

export interface ScoreResult {
  score: number;
  band: "Low" | "Moderate" | "High" | "Critical";
  factors: ScoreFactor[];
}

export interface MatchedIndicator {
  rule_id: string;
  indicator: string;
  weight: number;
  fuzzy_match: boolean;
}

export interface AlternativeTypology {
  typology: string;
  rule_score: number;
}

export interface RedactionSummary {
  category: string;
  label: string;
  count: number;
}

export interface AnalyzeResponse {
  case_reference: string;
  analysis_timestamp: string;
  rules_engine_version: string;
  sanitized_narrative: string;
  redactions_applied: RedactionSummary[];
  primary_typology: string;
  secondary_typology: string | null;
  is_multi_typology: boolean;
  evidence_strength: number;
  insufficient_evidence: boolean;
  fraud_risk: ScoreResult;
  consumer_harm: ScoreResult;
  dispute_friction: ScoreResult;
  recovery_urgency: ScoreResult;
  overall_severity: "Low" | "Moderate" | "High" | "Critical";
  matched_indicators: MatchedIndicator[];
  negated_indicators: MatchedIndicator[];
  alternative_typologies: AlternativeTypology[];
  missing_information: string[];
  conflicts_detected: { field: string; description: string }[];
  recommendation: string;
  action_plan: {
    act_now: string[];
    secure_accounts: string[];
    preserve_evidence: string[];
    contact_institution: string[];
    follow_up: string[];
  };
  evidence_checklist: {
    id: string;
    label: string;
    sensitive: boolean;
    why: string;
    relevant: boolean;
  }[];
  official_resources: { name: string; url: string; description: string }[];
  non_probability_notice: string;
}

export interface RuleExplorerEntry {
  rule_id: string;
  typology: string;
  indicator: string;
  weight: number;
  rationale: string;
  source: string;
  enabled: boolean;
  effective_date: string;
  version: string;
  last_reviewed: string;
}

export interface DashboardSummary {
  total_cases: number;
  high_risk_cases: number;
  average_fraud_risk_score: number;
  average_consumer_harm_score: number;
  average_dispute_friction_score: number;
  average_recovery_urgency_score: number;
  total_amount_lost: number;
  typology_distribution: Record<string, number>;
  payment_channel_distribution: Record<string, number>;
  severity_distribution: Record<string, number>;
  state_distribution: Record<string, number>;
  high_risk_cases_table: Record<string, unknown>[];
  all_cases: Record<string, unknown>[];
  data_source: string;
  notice: string;
}
