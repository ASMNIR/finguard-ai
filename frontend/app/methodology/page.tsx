import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How FinGuard-AI classifies typologies and constructs its four risk scores.",
};

export default function MethodologyPage() {
  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-semibold text-navy-900">Methodology</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        FinGuard-AI uses a rules-first, deterministic architecture. Every classification and score is produced from
        visible phrase matches, structured intake fields, and transparent point additions or deductions.
      </p>
      <div className="mt-4"><DisclaimerBanner compact /></div>

      <div className="prose-content mt-6 max-w-3xl">
        <h2>Analytical workflow</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Redact sensitive patterns from the narrative.</li>
          <li>Normalize the sanitized text (lowercase, punctuation cleanup).</li>
          <li>Match visible phrases against typology rule lists, including a one-edit-distance spelling-tolerant fallback for single-word indicators.</li>
          <li>Suppress matches found immediately after a negation cue (e.g., "did not", "never").</li>
          <li>Select the typology with the highest weighted rule score; report a secondary typology when a second category scores within 60% of the top score.</li>
          <li>Abstain to "Insufficient evidence" when no category has meaningful matched weight and the input is short.</li>
          <li>Calculate four independent 0–100 scores from typology, structured fields, and narrative indicators.</li>
          <li>Detect contradictions between structured answers and narrative text.</li>
          <li>Generate a deterministic recommendation and action plan from score thresholds and typology.</li>
        </ol>
        <p>No embeddings, generative model, hidden prompt, or black-box classifier is used for classification or scoring. See the <Link href="/rule-explorer">Rule Explorer</Link> for the full, live rule table.</p>

        <h2>Typology categories</h2>
        <ul>
          <li><strong>APP scam</strong> — the consumer appears to have authorized a payment because of deception.</li>
          <li><strong>Bank impersonation scam</strong> — false bank fraud departments, spoofed caller ID, false "safe account" instructions.</li>
          <li><strong>Invoice redirection or business email compromise</strong> — changed payment instructions, compromised vendor/supplier email.</li>
          <li><strong>Marketplace scam</strong> — fake listings, off-platform payment, non-delivery.</li>
          <li><strong>Romance scam</strong> — prolonged online relationships, fabricated emergencies, repeated financial requests.</li>
          <li><strong>Investment scam</strong> — guaranteed returns, unlicensed brokers, withdrawal-fee extraction.</li>
          <li><strong>AML or mule-account risk</strong> — receiving-side indicators such as pass-through accounts and structuring references. These are risk indicators, not findings of criminal activity.</li>
          <li><strong>Medical debt or credit stress</strong> — billing disputes, collections, credit-report impact.</li>
          <li><strong>Mortgage or insurance stress</strong> — servicing errors, foreclosure risk, force-placed insurance.</li>
          <li><strong>Financial reporting or disclosure-integrity concern</strong> — disclosure and internal-control concerns.</li>
          <li><strong>Other</strong> — matched some evidence but not a defined category.</li>
          <li><strong>Insufficient evidence</strong> — no meaningful matched evidence; the engine abstains rather than forcing a label.</li>
        </ul>

        <h2>Score interpretation bands</h2>
        <table className="mt-3 w-full text-sm">
          <caption className="sr-only">Score bands and their numeric ranges</caption>
          <thead>
            <tr className="text-left"><th className="pb-1">Band</th><th className="pb-1">Range</th></tr>
          </thead>
          <tbody>
            <tr><td>Low</td><td>0–44</td></tr>
            <tr><td>Moderate</td><td>45–69</td></tr>
            <tr><td>High</td><td>70–84</td></tr>
            <tr><td>Critical</td><td>85–100</td></tr>
          </tbody>
        </table>
        <p>Scores are triage indicators, not conclusions that fraud occurred, and evidence strength is not a statistical probability.</p>

        <h2>Negation and conflict handling</h2>
        <p>
          A positive phrase match found immediately after a negation cue (e.g., "the caller did not claim to be from
          my bank") is excluded from scoring and reported separately as a negated indicator. When structured intake
          answers contradict the narrative (for example, "payment was authorized" selected alongside "I never
          approved the transfer" in the narrative), FinGuard-AI reports a conflict and recommends manual review
          rather than resolving the contradiction itself.
        </p>

        <h2>Limitations</h2>
        <ul>
          <li>Synthetic demonstration data cannot establish real-world accuracy or prevalence.</li>
          <li>Phrase matching may miss paraphrases, sarcasm, or emerging scheme language.</li>
          <li>No factual verification of identity, account ownership, or transaction records is performed.</li>
          <li>No legal or compliance determination is made.</li>
          <li>Thresholds are heuristic and have not been empirically calibrated. See <Link href="/research">Research</Link> for the validation roadmap.</li>
        </ul>
      </div>
    </Container>
  );
}
