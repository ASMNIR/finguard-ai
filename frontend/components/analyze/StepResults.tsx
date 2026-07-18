"use client";

import { useState } from "react";
import { ScoreCard } from "@/components/ScoreCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { downloadCaseReportPdf, submitFeedback } from "@/lib/api";
import type { AnalyzeResponse, StructuredIntake } from "@/lib/types";
import { EvidenceChecklist } from "./EvidenceChecklist";
import { CaseTimeline } from "./CaseTimeline";
import { LetterGenerator } from "./LetterGenerator";

const ACTION_SECTIONS: { key: keyof AnalyzeResponse["action_plan"]; title: string }[] = [
  { key: "act_now", title: "Act now" },
  { key: "secure_accounts", title: "Secure accounts" },
  { key: "preserve_evidence", title: "Preserve evidence" },
  { key: "contact_institution", title: "Contact the institution" },
  { key: "follow_up", title: "Follow-up" },
];

export function StepResults({
  analysis,
  structured,
  onStartOver,
}: {
  analysis: AnalyzeResponse;
  structured: StructuredIntake;
  onStartOver: () => void;
}) {
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  async function handleDownloadPdf() {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const blob = await downloadCaseReportPdf(analysis);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${analysis.case_reference}-finguard-ai-report.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setPdfError("Could not generate the PDF report. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy-900">Case analysis</h1>
          <p className="font-mono text-xs text-slate-500">
            Case reference {analysis.case_reference} · Rules-engine v{analysis.rules_engine_version} · {new Date(analysis.analysis_timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleDownloadPdf} disabled={pdfLoading} className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {pdfLoading ? "Preparing…" : "Download PDF report"}
          </button>
          <button type="button" onClick={onStartOver} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Start a new case
          </button>
        </div>
      </div>
      {pdfError && <p className="text-sm text-redrisk-500">{pdfError}</p>}

      <div className="rounded-xl2 border border-teal-500/30 bg-teal-500/5 p-4 text-sm text-slate-800">
        {analysis.recommendation}
      </div>

      {analysis.insufficient_evidence && (
        <div className="rounded-xl2 border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-slate-800">
          Evidence is currently insufficient for a stronger classification. Consider adding more detail and
          re-running the analysis.
        </div>
      )}

      {analysis.conflicts_detected.length > 0 && (
        <div className="rounded-xl2 border border-redrisk-500/40 bg-redrisk-500/10 p-4 text-sm text-slate-800" role="alert">
          <strong className="font-semibold text-redrisk-500">Conflicting information detected — manual review recommended.</strong>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {analysis.conflicts_detected.map((conflict) => (
              <li key={conflict.field}>{conflict.description}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="rounded-xl2 border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Typology classification</h2>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-navy-900 px-3 py-1 text-sm font-semibold text-white">{analysis.primary_typology}</span>
          {analysis.secondary_typology && (
            <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
              Possible secondary: {analysis.secondary_typology}
            </span>
          )}
          <SeverityBadge severity={analysis.overall_severity} />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Evidence-strength indicator: {analysis.evidence_strength}/100. {analysis.non_probability_notice}
        </p>

        {analysis.alternative_typologies.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Other categories with matched evidence</p>
            <ul className="mt-1 flex flex-wrap gap-2">
              {analysis.alternative_typologies.map((alt) => (
                <li key={alt.typology} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                  {alt.typology} (rule score {alt.rule_score})
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard label="Fraud Risk" score={analysis.fraud_risk.score} band={analysis.fraud_risk.band} explanation="Estimates how strongly the case resembles deliberate deception, account compromise, or payment redirection." />
        <ScoreCard label="Consumer Harm" score={analysis.consumer_harm.score} band={analysis.consumer_harm.band} explanation="Estimates the practical severity of the reported financial and personal impact." />
        <ScoreCard label="Dispute Friction" score={analysis.dispute_friction.score} band={analysis.dispute_friction.band} explanation="Estimates how difficult it appears to obtain communication, review, or remediation." />
        <ScoreCard label="Recovery Urgency" score={analysis.recovery_urgency.score} band={analysis.recovery_urgency.band} explanation="Estimates the time sensitivity of freeze, recall, or evidence-preservation steps." />
      </section>

      <section className="rounded-xl2 border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Score-contribution detail</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["Fraud Risk", analysis.fraud_risk],
              ["Consumer Harm", analysis.consumer_harm],
              ["Dispute Friction", analysis.dispute_friction],
              ["Recovery Urgency", analysis.recovery_urgency],
            ] as const
          ).map(([label, result]) => (
            <div key={label}>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <table className="mt-1 w-full text-xs">
                <caption className="sr-only">{label} score contribution factors</caption>
                <tbody>
                  {result.factors.map((factor, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-1 pr-2 text-slate-600">{factor.factor}</td>
                      <td className={`py-1 text-right font-mono ${factor.effect < 0 ? "text-emerald-600" : "text-slate-800"}`}>
                        {factor.effect > 0 ? "+" : ""}
                        {factor.effect}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl2 border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Matched indicators</h2>
        {analysis.matched_indicators.length > 0 ? (
          <table className="mt-2 w-full text-sm">
            <caption className="sr-only">Matched typology indicators with rule IDs and weights</caption>
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th scope="col" className="pb-1">Rule ID</th>
                <th scope="col" className="pb-1">Indicator</th>
                <th scope="col" className="pb-1">Weight</th>
              </tr>
            </thead>
            <tbody>
              {analysis.matched_indicators.map((m) => (
                <tr key={m.rule_id} className="border-t border-slate-100">
                  <td className="py-1.5 font-mono text-xs text-teal-700">{m.rule_id}</td>
                  <td className="py-1.5">{m.indicator}{m.fuzzy_match && <span className="ml-2 text-xs text-amber-600">(spelling-variant match)</span>}</td>
                  <td className="py-1.5">{m.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-2 text-sm text-slate-600">No category-specific phrase matched.</p>
        )}

        {analysis.negated_indicators.length > 0 && (
          <p className="mt-3 text-xs text-slate-500">
            {analysis.negated_indicators.length} phrase(s) matched a rule but were excluded because the narrative
            appeared to negate them (e.g., "did not claim...").
          </p>
        )}
      </section>

      {analysis.missing_information.length > 0 && (
        <section className="rounded-xl2 border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-navy-900">Missing information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {analysis.missing_information.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl2 border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Personalized action plan</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {ACTION_SECTIONS.map(({ key, title }) => (
            <div key={key}>
              <p className="text-sm font-semibold text-teal-700">{title}</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {analysis.action_plan[key].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl2 border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Official reporting resources</h2>
        <p className="mt-1 text-xs text-slate-600">FinGuard-AI does not submit reports or complaints on your behalf.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {analysis.official_resources.map((resource) => (
            <li key={resource.name} className="rounded-lg border border-slate-200 p-3 text-sm">
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
                {resource.name}
              </a>
              <p className="mt-0.5 text-xs text-slate-600">{resource.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <EvidenceChecklist analysis={analysis} />
      <CaseTimeline caseReference={analysis.case_reference} />
      <LetterGenerator analysis={analysis} structured={structured} />

      <section className="rounded-xl2 border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Feedback</h2>
        {feedbackSent ? (
          <p className="mt-2 text-sm text-emerald-700">Thank you — feedback received (not stored in this research prototype).</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => submitFeedback({ case_reference: analysis.case_reference, typology_understandable: true }).then(() => setFeedbackSent(true))}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              This was helpful
            </button>
            <button
              type="button"
              onClick={() => submitFeedback({ case_reference: analysis.case_reference, would_choose_different_typology: true }).then(() => setFeedbackSent(true))}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              I'd choose a different typology
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
