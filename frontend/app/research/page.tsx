import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/content/PageHero";
import { SectionCard, accentFor } from "@/components/content/SectionCard";
import { getAttribution } from "@/lib/config";
import type { IconName } from "@/components/content/Icon";

export const metadata: Metadata = {
  title: "Research",
  description: "Research overview, working paper, reproducibility package, and validation roadmap.",
};

function buildSections(attribution: ReturnType<typeof getAttribution>): { title: string; icon: IconName; body: React.ReactNode }[] {
  return [
  {
    title: "Research overview",
    icon: "book",
    body: (
      <p>
        FinGuard-AI operationalizes a defined set of U.S. financial-fraud and consumer-protection problems —
        authorized push payment (APP) scams, bank impersonation, business email compromise, AML and mule-account
        risk, dispute friction, and recovery urgency — into a working, inspectable software prototype with a
        rules-first, explainable architecture.
      </p>
    ),
  },
  {
    title: "Research questions",
    icon: "target",
    body: (
      <ul>
        <li>Can a transparent, phrase-weighted rules engine produce triage-useful typology classifications from complaint narratives?</li>
        <li>How should consumer-harm, dispute-friction, and recovery-urgency be operationalized as measurable, explainable dimensions distinct from a single fraud-risk score?</li>
        <li>What negation-handling, conflict-detection, and abstention mechanisms are needed for a rules-based triage system to avoid overconfident or misleading outputs?</li>
        <li>What would a rigorous empirical validation plan look like using appropriately licensed public or institutional complaint data?</li>
      </ul>
    ),
  },
  {
    title: "Current publication status",
    icon: "document",
    body: (
      <p>
        <strong>Working paper</strong> — "FinGuard-AI: A Rules-First, Explainable Framework for Narrative-Based
        Financial Fraud and Consumer-Harm Triage in U.S. Financial Services." This is a working paper, not a
        peer-reviewed article. It has not undergone peer review, and no claim of peer review is made anywhere on this
        site.
        {attribution.authorZenodo && (
          <>
            {" "}It is permanently archived on Zenodo with a citable DOI:{" "}
            <a href={attribution.authorZenodo} className="font-medium text-teal-700 hover:underline">
              {attribution.authorZenodo.replace("https://doi.org/", "")}
            </a>.
          </>
        )}
        {attribution.authorSsrn && (
          <>
            {" "}It is also posted on SSRN:{" "}
            <a href={attribution.authorSsrn} className="font-medium text-teal-700 hover:underline">SSRN preprint</a>.
          </>
        )}
      </p>
    ),
  },
  {
    title: "Reproducibility package",
    icon: "layers",
    body: (
      <ul>
        <li>Deterministic rules engine source code (this repository, <code>backend/app/risk_engine/</code>).</li>
        <li>Synthetic demonstration dataset (<code>data/sample_data.csv</code>) and data dictionary.</li>
        <li>Automated test suite covering every typology, negation, conflicts, and score bounds.</li>
        <li>Version-controlled rule set with rule IDs, effective dates, and rationale (see the Rule Explorer).</li>
      </ul>
    ),
  },
  {
    title: "Validation roadmap",
    icon: "chart",
    body: (
      <>
        <p>Empirical validation is in progress. FinGuard-AI does not currently make a real-world accuracy claim. Future phases would require, at minimum:</p>
        <ul>
          <li>Appropriately licensed, de-identified public or institutional complaint data.</li>
          <li>Independent human annotation and inter-rater agreement measurement.</li>
          <li>Precision, recall, macro/weighted F1, confusion-matrix, and abstention-rate reporting per typology.</li>
          <li>Subgroup and multilingual robustness analysis.</li>
          <li>Comparison against an optional interpretable machine-learning baseline (TF-IDF + logistic regression).</li>
        </ul>
        <p>See the <a href="/governance">Governance page</a> and the Research Validation Dashboard (to be published once empirical data are available) for details.</p>
      </>
    ),
  },
  {
    title: "Citation",
    icon: "document",
    body: (
      <>
        <p>See <code>CITATION.cff</code> in the repository root for machine-readable citation metadata.</p>
        {attribution.authorZenodo && (
          <p className="mt-2 rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-700">
            {attribution.authorName} ({new Date().getFullYear()}). <em>FinGuard-AI: A Rules-First, Explainable Framework for
            Narrative-Based Financial Fraud and Consumer-Harm Triage in U.S. Financial Services.</em> Zenodo.{" "}
            {attribution.authorZenodo}
          </p>
        )}
      </>
    ),
  },
  ];
}

export default function ResearchPage() {
  const attribution = getAttribution();

  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Research"
        description={`FinGuard-AI is a research artifact accompanying an in-progress working paper by ${attribution.authorName}.`}
      />

      <Container className="py-10 space-y-5 pb-16">
        {buildSections(attribution).map((section, i) => (
          <SectionCard key={section.title} title={section.title} icon={section.icon} accent={accentFor(i)}>
            {section.body}
          </SectionCard>
        ))}
      </Container>
    </>
  );
}
