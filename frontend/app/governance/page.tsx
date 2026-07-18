import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Governance",
  description: "Intended use, prohibited use, human oversight, and NIST AI RMF mapping for FinGuard-AI.",
};

export default function GovernancePage() {
  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-semibold text-navy-900">Governance</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        FinGuard-AI is designed around visible rules, human oversight, and data minimization. This page documents
        the governance framework as it stands today, for a research prototype.
      </p>

      <div className="prose-content mt-6 max-w-3xl">
        <h2>Intended use</h2>
        <p>Informational, explainable triage support and consumer self-help guidance for research and demonstration purposes.</p>

        <h2>Prohibited use</h2>
        <ul>
          <li>Automated adverse decisions (credit, account closure, employment, reimbursement denial) without human review.</li>
          <li>Official AML, sanctions, or suspicious-activity reporting.</li>
          <li>Legal advice or a substitute for qualified legal counsel.</li>
          <li>Emergency response or a substitute for contacting a financial institution through an official channel.</li>
        </ul>

        <h2>Human oversight</h2>
        <p>Every output includes a manual-review recommendation where thresholds are met. No score or classification is designed to auto-execute an action.</p>

        <h2>Rule ownership, approval, and change management</h2>
        <p>
          Rules are version-controlled with a rule ID, effective date, rationale, and last-reviewed date (see the
          Rule Explorer). Changes are tracked in <code>docs/methodology.md</code> version history and the rules-engine
          <code>versioning.py</code> module.
        </p>

        <h2>Data minimization and privacy safeguards</h2>
        <p>Anonymous analysis by default, automatic redaction before analysis, no raw-narrative logging, and narrative/request size limits. See the <a href="/privacy">Privacy page</a>.</p>

        <h2>Security controls</h2>
        <p>See the <a href="/security">Security page</a> for headers, rate limiting, input validation, and responsible-disclosure process.</p>

        <h2>Fairness, language, and accessibility limitations</h2>
        <p>
          Narrative quality varies by language, disability, education, and access to records. The rules engine has
          not been validated for disparate impact across demographic groups. Multilingual phrase rules are being
          built out incrementally (English complete; Spanish and Bengali scaffolding in progress) and are not
          treated as equivalent to English until independently reviewed.
        </p>

        <h2>Incident response</h2>
        <p>See <code>SECURITY.md</code> in the repository for the vulnerability-reporting process.</p>

        <h2>Validation requirements before any production use</h2>
        <ul>
          <li>Legal review of dispute-letter templates and disclaimers.</li>
          <li>Independent security review.</li>
          <li>Empirical validation against representative, appropriately licensed data.</li>
          <li>Accessibility audit against WCAG 2.2 AA.</li>
          <li>Institutional governance sign-off on any operational deployment.</li>
        </ul>

        <h2>Human override</h2>
        <p>Any user-facing result can be disregarded by the consumer or a reviewing professional; the platform does not lock in a determination.</p>

        <h2>NIST AI Risk Management Framework mapping (illustrative)</h2>
        <table className="mt-3 w-full text-sm">
          <caption className="sr-only">Mapping of FinGuard-AI features to NIST AI RMF functions</caption>
          <thead>
            <tr className="text-left"><th className="pb-1">NIST AI RMF function</th><th className="pb-1">FinGuard-AI practice</th></tr>
          </thead>
          <tbody>
            <tr><td className="py-1 pr-4 align-top">Govern</td><td className="py-1">Documented intended/prohibited use, versioned rules, this governance page.</td></tr>
            <tr><td className="py-1 pr-4 align-top">Map</td><td className="py-1">Typology and score definitions, limitations documentation, system card.</td></tr>
            <tr><td className="py-1 pr-4 align-top">Measure</td><td className="py-1">Deterministic test suite; validation roadmap for empirical metrics.</td></tr>
            <tr><td className="py-1 pr-4 align-top">Manage</td><td className="py-1">Manual-review flags, conflict detection, abstention logic, human override.</td></tr>
          </tbody>
        </table>
        <p className="text-xs text-slate-500">This mapping is illustrative and does not constitute a certified NIST AI RMF assessment.</p>
      </div>
    </Container>
  );
}
