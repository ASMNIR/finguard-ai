import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/content/PageHero";
import { SectionCard, accentFor } from "@/components/content/SectionCard";
import type { IconName } from "@/components/content/Icon";

export const metadata: Metadata = {
  title: "Governance",
  description: "Intended use, prohibited use, human oversight, and NIST AI RMF mapping for FinGuard-AI.",
};

const SECTIONS: { title: string; icon: IconName; body: React.ReactNode }[] = [
  {
    title: "Intended use",
    icon: "target",
    body: <p>Informational, explainable triage support and consumer self-help guidance for research and demonstration purposes.</p>,
  },
  {
    title: "Prohibited use",
    icon: "alert",
    body: (
      <ul>
        <li>Automated adverse decisions (credit, account closure, employment, reimbursement denial) without human review.</li>
        <li>Official AML, sanctions, or suspicious-activity reporting.</li>
        <li>Legal advice or a substitute for qualified legal counsel.</li>
        <li>Emergency response or a substitute for contacting a financial institution through an official channel.</li>
      </ul>
    ),
  },
  {
    title: "Human oversight",
    icon: "users",
    body: <p>Every output includes a manual-review recommendation where thresholds are met. No score or classification is designed to auto-execute an action.</p>,
  },
  {
    title: "Rule ownership, approval, and change management",
    icon: "gitBranch",
    body: (
      <p>
        Rules are version-controlled with a rule ID, effective date, rationale, and last-reviewed date (see the Rule
        Explorer). Changes are tracked in <code>docs/methodology.md</code> version history and the rules-engine{" "}
        <code>versioning.py</code> module.
      </p>
    ),
  },
  {
    title: "Data minimization and privacy safeguards",
    icon: "lock",
    body: <p>Anonymous analysis by default, automatic redaction before analysis, no raw-narrative logging, and narrative/request size limits. See the <a href="/privacy">Privacy page</a>.</p>,
  },
  {
    title: "Security controls",
    icon: "shield",
    body: <p>See the <a href="/security">Security page</a> for headers, rate limiting, input validation, and responsible-disclosure process.</p>,
  },
  {
    title: "Fairness, language, and accessibility limitations",
    icon: "globe",
    body: (
      <p>
        Narrative quality varies by language, disability, education, and access to records. The rules engine has not
        been validated for disparate impact across demographic groups. Multilingual phrase rules are being built out
        incrementally (English complete; Spanish and Bengali scaffolding in progress) and are not treated as
        equivalent to English until independently reviewed.
      </p>
    ),
  },
  {
    title: "Incident response",
    icon: "clock",
    body: <p>See <code>SECURITY.md</code> in the repository for the vulnerability-reporting process.</p>,
  },
  {
    title: "Validation requirements before any production use",
    icon: "check",
    body: (
      <ul>
        <li>Legal review of dispute-letter templates and disclaimers.</li>
        <li>Independent security review.</li>
        <li>Empirical validation against representative, appropriately licensed data.</li>
        <li>Accessibility audit against WCAG 2.2 AA.</li>
        <li>Institutional governance sign-off on any operational deployment.</li>
      </ul>
    ),
  },
  {
    title: "Human override",
    icon: "eye",
    body: <p>Any user-facing result can be disregarded by the consumer or a reviewing professional; the platform does not lock in a determination.</p>,
  },
];

const NIST_ROWS = [
  { fn: "Govern", practice: "Documented intended/prohibited use, versioned rules, this governance page." },
  { fn: "Map", practice: "Typology and score definitions, limitations documentation, system card." },
  { fn: "Measure", practice: "Deterministic test suite; validation roadmap for empirical metrics." },
  { fn: "Manage", practice: "Manual-review flags, conflict detection, abstention logic, human override." },
];

export default function GovernancePage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="Governance framework"
        description="FinGuard-AI is designed around visible rules, human oversight, and data minimization. This page documents the governance framework as it stands today, for a research prototype."
      />

      <Container className="py-10 space-y-5 pb-16">
        {SECTIONS.map((section, i) => (
          <SectionCard key={section.title} title={section.title} icon={section.icon} accent={accentFor(i)}>
            {section.body}
          </SectionCard>
        ))}

        <SectionCard title="NIST AI Risk Management Framework mapping (illustrative)" icon="layers" accent={accentFor(SECTIONS.length)}>
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm">
              <caption className="sr-only">Mapping of FinGuard-AI features to NIST AI RMF functions</caption>
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">NIST AI RMF function</th>
                  <th className="px-4 py-3">FinGuard-AI practice</th>
                </tr>
              </thead>
              <tbody>
                {NIST_ROWS.map((row) => (
                  <tr key={row.fn} className="border-t border-slate-100">
                    <td className="px-4 py-3 align-top font-semibold text-navy-900">{row.fn}</td>
                    <td className="px-4 py-3 text-slate-600">{row.practice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">This mapping is illustrative and does not constitute a certified NIST AI RMF assessment.</p>
        </SectionCard>
      </Container>
    </>
  );
}
