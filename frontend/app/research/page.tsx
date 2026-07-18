import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { getAttribution } from "@/lib/config";

export const metadata: Metadata = {
  title: "Research",
  description: "Research overview, working paper, reproducibility package, and validation roadmap.",
};

export default function ResearchPage() {
  const attribution = getAttribution();

  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-semibold text-navy-900">Research</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        FinGuard-AI is a research artifact accompanying an in-progress working paper by {attribution.authorName}.
      </p>

      <div className="prose-content mt-6 max-w-3xl">
        <h2>Research overview</h2>
        <p>
          FinGuard-AI operationalizes a defined set of U.S. financial-fraud and consumer-protection problems —
          authorized push payment (APP) scams, bank impersonation, business email compromise, AML and mule-account
          risk, dispute friction, and recovery urgency — into a working, inspectable software prototype with a
          rules-first, explainable architecture.
        </p>

        <h2>Research questions</h2>
        <ul>
          <li>Can a transparent, phrase-weighted rules engine produce triage-useful typology classifications from complaint narratives?</li>
          <li>How should consumer-harm, dispute-friction, and recovery-urgency be operationalized as measurable, explainable dimensions distinct from a single fraud-risk score?</li>
          <li>What negation-handling, conflict-detection, and abstention mechanisms are needed for a rules-based triage system to avoid overconfident or misleading outputs?</li>
          <li>What would a rigorous empirical validation plan look like using appropriately licensed public or institutional complaint data?</li>
        </ul>

        <h2>Current publication status</h2>
        <p>
          <strong>Working paper</strong> — "FinGuard-AI: A Rules-First, Explainable Framework for Narrative-Based
          Financial Fraud and Consumer-Harm Triage in U.S. Financial Services." This is a working paper, not a
          peer-reviewed article. It has not undergone peer review, and no claim of peer review is made anywhere on
          this site.
        </p>

        <h2>Reproducibility package</h2>
        <ul>
          <li>Deterministic rules engine source code (this repository, <code>backend/app/risk_engine/</code>).</li>
          <li>Synthetic demonstration dataset (<code>data/sample_data.csv</code>) and data dictionary.</li>
          <li>Automated test suite covering every typology, negation, conflicts, and score bounds.</li>
          <li>Version-controlled rule set with rule IDs, effective dates, and rationale (see the Rule Explorer).</li>
        </ul>

        <h2>Validation roadmap</h2>
        <p>Empirical validation is in progress. FinGuard-AI does not currently make a real-world accuracy claim. Future phases would require, at minimum:</p>
        <ul>
          <li>Appropriately licensed, de-identified public or institutional complaint data.</li>
          <li>Independent human annotation and inter-rater agreement measurement.</li>
          <li>Precision, recall, macro/weighted F1, confusion-matrix, and abstention-rate reporting per typology.</li>
          <li>Subgroup and multilingual robustness analysis.</li>
          <li>Comparison against an optional interpretable machine-learning baseline (TF-IDF + logistic regression).</li>
        </ul>
        <p>See the <a href="/governance">Governance page</a> and the Research Validation Dashboard (to be published once empirical data are available) for details.</p>

        <h2>Citation</h2>
        <p>See <code>CITATION.cff</code> in the repository root for machine-readable citation metadata.</p>
      </div>
    </Container>
  );
}
