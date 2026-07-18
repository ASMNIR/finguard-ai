"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { analyzeCase, redactPreview } from "@/lib/api";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { AnalyzeResponse, StructuredIntake } from "@/lib/types";
import { WizardShell } from "./WizardShell";
import { StepSafety } from "./StepSafety";
import { StepUrgency, type UrgencyAnswers } from "./StepUrgency";
import { StepIntake } from "./StepIntake";
import { StepRedaction } from "./StepRedaction";
import { StepResults } from "./StepResults";

const DEFAULT_URGENCY: UrgencyAnswers = {
  moneyLeft: null,
  paymentStatus: "unknown",
  credentialsShared: null,
  remoteAccess: null,
  institutionContacted: null,
  accountLocked: null,
  essentialImpact: null,
};

const DEFAULT_STRUCTURED: StructuredIntake = {
  incident_date: null,
  state: "unknown",
  amount_lost: 0,
  currency: "USD",
  payment_channel: "unknown",
  institution_type: "unknown",
  contact_channel: "unknown",
  contact_initiated_by: "unknown",
  payment_authorized: null,
  impersonation_reported: null,
  impersonated_organization_type: "",
  payment_instructions_changed: null,
  credentials_shared: null,
  remote_access_provided: null,
  dispute_submitted: null,
  dispute_submission_date: null,
  dispute_status: "unknown",
  reported_outcome: "unresolved",
  essential_expense_impact: null,
  payment_pending: null,
};

export function AnalyzeWizard() {
  const [step, setStep] = useState(1);
  const [locale, setLocale] = useState<Locale>("en");
  const [acknowledged, setAcknowledged] = useState(false);
  const [urgency, setUrgency] = useState<UrgencyAnswers>(DEFAULT_URGENCY);
  const [narrative, setNarrative] = useState("");
  const [structured, setStructured] = useState<StructuredIntake>(DEFAULT_STRUCTURED);
  const [intakeError, setIntakeError] = useState<string | null>(null);

  const [sanitized, setSanitized] = useState<string | null>(null);
  const [redactions, setRedactions] = useState<AnalyzeResponse["redactions_applied"]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [redactionError, setRedactionError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);

  function mergedStructured(): StructuredIntake {
    return {
      ...structured,
      credentials_shared: structured.credentials_shared ?? urgency.credentialsShared,
      remote_access_provided: structured.remote_access_provided ?? urgency.remoteAccess,
      essential_expense_impact: structured.essential_expense_impact ?? urgency.essentialImpact,
      payment_pending: structured.payment_pending ?? (urgency.paymentStatus === "pending"),
    };
  }

  async function goToRedactionStep() {
    setIntakeError(null);
    setStep(4);
    if (!narrative.trim()) {
      setSanitized("");
      setRedactions([]);
      return;
    }
    setLoadingPreview(true);
    setRedactionError(null);
    try {
      const preview = await redactPreview(narrative);
      setSanitized(preview.sanitized_narrative);
      setRedactions(preview.redactions_applied);
    } catch {
      setRedactionError("Could not check the narrative for sensitive patterns. Please try again.");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function runAnalysis() {
    setSubmitting(true);
    setIntakeError(null);
    try {
      const result = await analyzeCase(narrative, mergedStructured(), locale);
      setAnalysis(result);
      setStep(5);
    } catch (err) {
      setIntakeError(err instanceof Error ? err.message : "Analysis failed. Please review your inputs and try again.");
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setStep(1);
    setAcknowledged(false);
    setUrgency(DEFAULT_URGENCY);
    setNarrative("");
    setStructured(DEFAULT_STRUCTURED);
    setSanitized(null);
    setRedactions([]);
    setAnalysis(null);
  }

  return (
    <Container className="py-10">
      {step < 5 && (
        <WizardShell step={step}>
          {step === 1 && (
            <StepSafety
              acknowledged={acknowledged}
              onAcknowledgedChange={setAcknowledged}
              onNext={() => setStep(2)}
              locale={locale}
              onLocaleChange={setLocale}
            />
          )}
          {step === 2 && (
            <StepUrgency answers={urgency} onChange={setUrgency} onBack={() => setStep(1)} onNext={() => setStep(3)} />
          )}
          {step === 3 && (
            <StepIntake
              narrative={narrative}
              onNarrativeChange={setNarrative}
              structured={structured}
              onStructuredChange={setStructured}
              onBack={() => setStep(2)}
              onNext={goToRedactionStep}
              error={intakeError}
            />
          )}
          {step === 4 && (
            <StepRedaction
              narrative={narrative}
              loadingPreview={loadingPreview}
              sanitized={sanitized}
              redactions={redactions}
              error={redactionError}
              onBack={() => setStep(3)}
              onConfirm={runAnalysis}
              submitting={submitting}
            />
          )}
        </WizardShell>
      )}

      {step === 5 && analysis && (
        <StepResults analysis={analysis} structured={mergedStructured()} onStartOver={startOver} />
      )}
    </Container>
  );
}
