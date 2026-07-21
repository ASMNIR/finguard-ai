import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/content/PageHero";
import { SectionCard, accentFor } from "@/components/content/SectionCard";
import { Reveal } from "@/components/Reveal";
import { getAttribution } from "@/lib/config";
import type { IconName } from "@/components/content/Icon";

export const metadata: Metadata = {
  title: "About",
  description: "Why FinGuard-AI exists, and who designed it.",
};

const SECTIONS: { title: string; icon: IconName; body: React.ReactNode }[] = [
  {
    title: "The problem",
    icon: "alert",
    body: (
      <p>
        Digital payments, instant-transfer channels, and remote onboarding increase convenience while also
        accelerating fraud losses and the movement of illicit proceeds. Consumers describing what happened to them
        in their own words — a complaint narrative — carry a great deal of triage-relevant information that is often
        processed inconsistently or opaquely.
      </p>
    ),
  },
  {
    title: "Why narratives and explainability matter",
    icon: "eye",
    body: (
      <p>
        A narrative can reveal impersonation tactics, payment-redirection patterns, and receiving-side risk signals
        that structured fields alone miss. FinGuard-AI's rules-first design means every classification and score
        traces back to a specific, published phrase or structured condition — nothing is hidden inside an opaque
        model.
      </p>
    ),
  },
  {
    title: "Relevance to APP scams, bank impersonation, and AML/mule-account risk",
    icon: "shield",
    body: (
      <p>
        The typology rules explicitly encode APP-scam and bank-impersonation social-engineering patterns, and
        separately track AML/mule-account risk indicators such as pass-through accounts and structuring language —
        always as risk indicators, never as findings of criminal activity.
      </p>
    ),
  },
  {
    title: "Consumer-harm measurement, dispute friction, and recovery urgency",
    icon: "chart",
    body: (
      <p>
        Traditional fraud triage often focuses narrowly on transaction authorization. FinGuard-AI adds
        consumer-centered dimensions — essential-funds impact, vulnerability indicators, dispute-handling friction,
        and recovery time sensitivity — so that the practical severity of harm is visible alongside the fraud-risk
        classification.
      </p>
    ),
  },
  {
    title: "Responsible FinTech governance",
    icon: "scale",
    body: (
      <p>
        Every score decomposes into a visible factor table, every typology decision traces to matched phrases and
        published rule IDs, and every result carries a manual-review recommendation rather than an automated
        determination. See the <a href="/governance">Governance page</a>.
      </p>
    ),
  },
  {
    title: "Limitations and future research",
    icon: "flag",
    body: (
      <p>
        FinGuard-AI is a research prototype. It has not been empirically validated against representative
        institutional or public complaint data, has not completed an independent security review, and is not
        production-ready. See <a href="/methodology">Methodology</a> and <a href="/research">Research</a> for the
        full limitations and validation roadmap.
      </p>
    ),
  },
];

export default function AboutPage() {
  const attribution = getAttribution();

  return (
    <>
      <PageHero
        eyebrow="About"
        title="About FinGuard-AI"
        description="Why complaint narratives, explainability, and consumer-centered harm measurement are the core of this project."
      />

      <Container className="py-10 space-y-5 pb-16">
        {SECTIONS.map((section, i) => (
          <SectionCard key={section.title} title={section.title} icon={section.icon} accent={accentFor(i)}>
            {section.body}
          </SectionCard>
        ))}

        <Reveal className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-soft sm:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-coral-400/[0.08] blur-2xl" />
          <div className="relative flex items-center gap-4">
            <Image
              src="/images/asm-fahim.jpg"
              alt={`Portrait of ${attribution.authorName}`}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            <div>
              <p className="font-heading text-lg font-semibold text-navy-900">{attribution.authorName}</p>
              <p className="text-sm text-slate-600">{attribution.authorRole}</p>
              {attribution.authorAffiliation && <p className="text-xs text-slate-500">{attribution.authorAffiliation}</p>}
            </div>
          </div>
          <p className="relative mt-4 max-w-2xl text-sm text-slate-700">
            FinGuard-AI was created and designed by {attribution.authorName} as an independent research project
            exploring explainable, governance-oriented risk intelligence for U.S. financial fraud and consumer harm.
          </p>
          <div className="relative mt-4 flex flex-wrap gap-2 text-sm">
            {attribution.authorLinkedin && (
              <a href={attribution.authorLinkedin} className="rounded-full bg-slate-50 px-3 py-1.5 font-medium text-teal-700 transition hover:bg-coral-50 hover:text-coral-600">LinkedIn</a>
            )}
            {attribution.authorGithub && (
              <a href={attribution.authorGithub} className="rounded-full bg-slate-50 px-3 py-1.5 font-medium text-teal-700 transition hover:bg-coral-50 hover:text-coral-600">GitHub</a>
            )}
            {attribution.authorGoogleScholar && (
              <a href={attribution.authorGoogleScholar} className="rounded-full bg-slate-50 px-3 py-1.5 font-medium text-teal-700 transition hover:bg-coral-50 hover:text-coral-600">Google Scholar</a>
            )}
            {attribution.authorOrcid && (
              <a href={`https://orcid.org/${attribution.authorOrcid}`} className="rounded-full bg-slate-50 px-3 py-1.5 font-medium text-teal-700 transition hover:bg-coral-50 hover:text-coral-600">ORCID</a>
            )}
            {attribution.authorSsrn && (
              <a href={attribution.authorSsrn} className="rounded-full bg-slate-50 px-3 py-1.5 font-medium text-teal-700 transition hover:bg-coral-50 hover:text-coral-600">SSRN</a>
            )}
            {attribution.authorZenodo && (
              <a href={attribution.authorZenodo} className="rounded-full bg-slate-50 px-3 py-1.5 font-medium text-teal-700 transition hover:bg-coral-50 hover:text-coral-600">Zenodo (DOI)</a>
            )}
          </div>
        </Reveal>
      </Container>
    </>
  );
}
