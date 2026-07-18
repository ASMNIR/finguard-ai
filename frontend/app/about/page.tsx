import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { getAttribution } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: "Why FinGuard-AI exists, and who designed it.",
};

export default function AboutPage() {
  const attribution = getAttribution();

  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-semibold text-navy-900">About FinGuard-AI</h1>

      <div className="prose-content mt-6 max-w-3xl">
        <h2>The problem</h2>
        <p>
          Digital payments, instant-transfer channels, and remote onboarding increase convenience while also
          accelerating fraud losses and the movement of illicit proceeds. Consumers describing what happened to them
          in their own words — a complaint narrative — carry a great deal of triage-relevant information that is
          often processed inconsistently or opaquely.
        </p>

        <h2>Why narratives and explainability matter</h2>
        <p>
          A narrative can reveal impersonation tactics, payment-redirection patterns, and receiving-side risk signals
          that structured fields alone miss. FinGuard-AI's rules-first design means every classification and score
          traces back to a specific, published phrase or structured condition — nothing is hidden inside an opaque
          model.
        </p>

        <h2>Relevance to APP scams, bank impersonation, and AML/mule-account risk</h2>
        <p>
          The typology rules explicitly encode APP-scam and bank-impersonation social-engineering patterns, and
          separately track AML/mule-account risk indicators such as pass-through accounts and structuring language —
          always as risk indicators, never as findings of criminal activity.
        </p>

        <h2>Consumer-harm measurement, dispute friction, and recovery urgency</h2>
        <p>
          Traditional fraud triage often focuses narrowly on transaction authorization. FinGuard-AI adds
          consumer-centered dimensions — essential-funds impact, vulnerability indicators, dispute-handling
          friction, and recovery time sensitivity — so that the practical severity of harm is visible alongside the
          fraud-risk classification.
        </p>

        <h2>Responsible FinTech governance</h2>
        <p>
          Every score decomposes into a visible factor table, every typology decision traces to matched phrases and
          published rule IDs, and every result carries a manual-review recommendation rather than an automated
          determination. See the <a href="/governance">Governance page</a>.
        </p>

        <h2>Limitations and future research</h2>
        <p>
          FinGuard-AI is a research prototype. It has not been empirically validated against representative
          institutional or public complaint data, has not completed an independent security review, and is not
          production-ready. See <a href="/methodology">Methodology</a> and <a href="/research">Research</a> for the
          full limitations and validation roadmap.
        </p>
      </div>

      <div className="mt-10 rounded-xl2 border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-navy-900 to-teal-500 font-heading text-xl font-bold text-white"
          >
            AF
          </span>
          <div>
            <p className="font-heading text-lg font-semibold text-navy-900">{attribution.authorName}</p>
            <p className="text-sm text-slate-600">{attribution.authorRole}</p>
            {attribution.authorAffiliation && <p className="text-xs text-slate-500">{attribution.authorAffiliation}</p>}
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-slate-700">
          FinGuard-AI was created and designed by {attribution.authorName} as an independent research project
          exploring explainable, governance-oriented risk intelligence for U.S. financial fraud and consumer harm.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {attribution.authorLinkedin && <a href={attribution.authorLinkedin} className="text-teal-700 underline">LinkedIn</a>}
          {attribution.authorGithub && <a href={attribution.authorGithub} className="text-teal-700 underline">GitHub</a>}
          {attribution.authorGoogleScholar && <a href={attribution.authorGoogleScholar} className="text-teal-700 underline">Google Scholar</a>}
          {attribution.authorOrcid && <a href={attribution.authorOrcid} className="text-teal-700 underline">ORCID</a>}
          {attribution.authorSsrn && <a href={attribution.authorSsrn} className="text-teal-700 underline">SSRN</a>}
        </div>
      </div>
    </Container>
  );
}
