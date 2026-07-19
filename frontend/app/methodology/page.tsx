import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PageHero } from "@/components/content/PageHero";
import { SectionCard, accentFor } from "@/components/content/SectionCard";
import { SeverityBadge } from "@/components/SeverityBadge";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How FinGuard-AI classifies typologies and constructs its four risk scores.",
};

const WORKFLOW_STEPS = [
  "Redact sensitive patterns from the narrative.",
  "Normalize the sanitized text (lowercase, punctuation cleanup).",
  "Match visible phrases against typology rule lists, including a one-edit-distance spelling-tolerant fallback for single-word indicators.",
  'Suppress matches found immediately after a negation cue (e.g., "did not", "never").',
  "Select the typology with the highest weighted rule score; report a secondary typology when a second category scores within 60% of the top score.",
  'Abstain to "Insufficient evidence" when no category has meaningful matched weight and the input is short.',
  "Calculate four independent 0–100 scores from typology, structured fields, and narrative indicators.",
  "Detect contradictions between structured answers and narrative text.",
  "Generate a deterministic recommendation and action plan from score thresholds and typology.",
];

const TYPOLOGIES = [
  { name: "APP scam", desc: "The consumer appears to have authorized a payment because of deception." },
  { name: "Bank impersonation scam", desc: 'False bank fraud departments, spoofed caller ID, false "safe account" instructions.' },
  { name: "Invoice redirection or business email compromise", desc: "Changed payment instructions, compromised vendor/supplier email." },
  { name: "Marketplace scam", desc: "Fake listings, off-platform payment, non-delivery." },
  { name: "Romance scam", desc: "Prolonged online relationships, fabricated emergencies, repeated financial requests." },
  { name: "Investment scam", desc: "Guaranteed returns, unlicensed brokers, withdrawal-fee extraction." },
  { name: "AML or mule-account risk", desc: "Receiving-side indicators such as pass-through accounts and structuring references — risk indicators, not findings of criminal activity." },
  { name: "Medical debt or credit stress", desc: "Billing disputes, collections, credit-report impact." },
  { name: "Mortgage or insurance stress", desc: "Servicing errors, foreclosure risk, force-placed insurance." },
  { name: "Financial reporting or disclosure-integrity concern", desc: "Disclosure and internal-control concerns." },
  { name: "Other", desc: "Matched some evidence but not a defined category." },
  { name: "Insufficient evidence", desc: "No meaningful matched evidence; the engine abstains rather than forcing a label." },
];

const BANDS = [
  { band: "Low" as const, range: "0–44" },
  { band: "Moderate" as const, range: "45–69" },
  { band: "High" as const, range: "70–84" },
  { band: "Critical" as const, range: "85–100" },
];

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Methodology"
        title="Methodology"
        description="FinGuard-AI uses a rules-first, deterministic architecture. Every classification and score is produced from visible phrase matches, structured intake fields, and transparent point additions or deductions."
      />

      <Container className="py-10 space-y-5 pb-16">
        <DisclaimerBanner />

        <SectionCard title="Analytical workflow" icon="gitBranch" accent={accentFor(0)}>
          <ol className="list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-teal-600">
            {WORKFLOW_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-3">
            No embeddings, generative model, hidden prompt, or black-box classifier is used for classification or
            scoring. See the <Link href="/rule-explorer">Rule Explorer</Link> for the full, live rule table.
          </p>
        </SectionCard>

        <SectionCard title="Typology categories" icon="layers" accent={accentFor(1)}>
          <div className="grid gap-3 sm:grid-cols-2">
            {TYPOLOGIES.map((t) => (
              <div key={t.name} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-heading text-sm font-semibold text-navy-900">{t.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Score interpretation bands" icon="chart" accent={accentFor(2)}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BANDS.map((b) => (
              <div key={b.band} className="rounded-2xl bg-slate-50 p-4 text-center">
                <SeverityBadge severity={b.band} />
                <p className="mt-2 font-mono text-sm font-semibold text-navy-900">{b.range}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">Scores are triage indicators, not conclusions that fraud occurred, and evidence strength is not a statistical probability.</p>
        </SectionCard>

        <SectionCard title="Negation and conflict handling" icon="shield" accent={accentFor(3)}>
          <p>
            A positive phrase match found immediately after a negation cue (e.g., "the caller did not claim to be
            from my bank") is excluded from scoring and reported separately as a negated indicator. When structured
            intake answers contradict the narrative (for example, "payment was authorized" selected alongside "I
            never approved the transfer" in the narrative), FinGuard-AI reports a conflict and recommends manual
            review rather than resolving the contradiction itself.
          </p>
        </SectionCard>

        <SectionCard title="Limitations" icon="flag" accent={accentFor(4)}>
          <ul>
            <li>Synthetic demonstration data cannot establish real-world accuracy or prevalence.</li>
            <li>Phrase matching may miss paraphrases, sarcasm, or emerging scheme language.</li>
            <li>No factual verification of identity, account ownership, or transaction records is performed.</li>
            <li>No legal or compliance determination is made.</li>
            <li>Thresholds are heuristic and have not been empirically calibrated. See <Link href="/research">Research</Link> for the validation roadmap.</li>
          </ul>
        </SectionCard>
      </Container>
    </>
  );
}
