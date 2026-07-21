import Link from "next/link";
import { Container } from "@/components/Container";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Reveal } from "@/components/Reveal";
import { ShieldScan } from "@/components/illustrations/ShieldScan";
import { getAttribution } from "@/lib/config";

const FACTS = [
  { value: "100", label: "automated tests" },
  { value: "10", label: "fraud & harm typologies" },
  { value: "4", label: "explainable 0–100 scores" },
  { value: "0", label: "black-box ML in scoring" },
];

const SCORE_PREVIEW = [
  { label: "Fraud Risk", score: 78, text: "text-orange-600" },
  { label: "Consumer Harm", score: 64, text: "text-amber-600" },
  { label: "Dispute Friction", score: 41, text: "text-teal-700" },
  { label: "Recovery Urgency", score: 82, text: "text-redrisk-500" },
];

const TYPOLOGIES = [
  "APP scam",
  "Bank impersonation scam",
  "Invoice redirection / business email compromise",
  "Marketplace scam",
  "Romance scam",
  "Investment scam",
  "AML or mule-account risk",
  "Medical debt or credit stress",
  "Mortgage or insurance stress",
  "Financial reporting / disclosure-integrity concern",
];

const PROCESS_STEPS = [
  { title: "Safety & privacy notice", description: "Review what not to share, and how redaction works, before anything is analyzed." },
  { title: "Urgency screening", description: "A short set of questions identifies whether time-sensitive action may be worth considering." },
  { title: "Structured intake", description: "Guided fields capture the channel, amount, and dispute status behind the case." },
  { title: "Automatic redaction", description: "Sensitive patterns are stripped before analysis, and you can review the sanitized text." },
  { title: "Explainable analysis", description: "Four 0–100 scores, matched phrases, and alternative typologies — never a black box." },
  { title: "Action plan & exports", description: "A personalized checklist, timeline, dispute letters, and a downloadable PDF case report." },
];

export default function HomePage() {
  const attribution = getAttribution();

  return (
    <>
      <section className="relative overflow-hidden bg-mint-50">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-coral-400/10 blur-3xl" aria-hidden />

        {/* floating decorative shapes, Plax-style */}
        <div className="pointer-events-none absolute inset-0 hidden select-none sm:block" aria-hidden>
          <span className="float-shape absolute right-[26%] top-16 h-3 w-3 rotate-45 rounded-sm bg-coral-400/70" style={{ animationDelay: "0.2s" }} />
          <span className="float-shape absolute right-[14%] top-40 h-2.5 w-2.5 rounded-full bg-teal-500/60" style={{ animationDelay: "1.1s" }} />
          <span className="float-shape absolute right-[34%] top-56 h-4 w-4 rounded-full border-2 border-coral-500/50" style={{ animationDelay: "0.6s" }} />
          <span className="float-shape absolute right-[8%] top-72 h-3 w-3 rotate-12 rounded-sm bg-emerald-500/50" style={{ animationDelay: "1.6s" }} />
        </div>

        <Container className="relative grid gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700 shadow-sm">
              Research Prototype
            </span>
            <h1 className="mt-6 max-w-xl font-heading text-6xl font-extrabold leading-[1.02] tracking-tight text-navy-950 sm:text-7xl">
              Your Ally Against Financial Fraud
            </h1>
            <p className="mt-5 max-w-lg text-xl font-medium text-teal-700 sm:text-2xl">
              Explainable intelligence for fraud and consumer harm
            </p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600">
              FinGuard-AI turns complaint narratives and structured case facts into transparent fraud indicators,
              consumer-harm assessments, dispute-friction signals, and recovery-urgency measures — every score
              traceable back to the exact phrases that produced it.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600"
              >
                Analyze a Case <span aria-hidden>→</span>
              </Link>
              <Link
                href="/research"
                className="rounded-full border border-navy-900/15 bg-white px-7 py-3.5 text-sm font-semibold text-navy-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              >
                Explore the Research
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <Link href="/methodology" className="underline-offset-4 transition hover:text-teal-700 hover:underline">View Methodology</Link>
              <Link href="/dashboard" className="underline-offset-4 transition hover:text-teal-700 hover:underline">Open Synthetic Dashboard</Link>
              <Link href="/governance" className="underline-offset-4 transition hover:text-teal-700 hover:underline">Read Governance Framework</Link>
            </div>

            <p className="mt-10 text-sm text-slate-500">
              Created by{" "}
              {attribution.authorGoogleScholar ? (
                <a href={attribution.authorGoogleScholar} className="font-medium text-teal-700 underline underline-offset-2 hover:text-coral-600">
                  {attribution.authorName}
                </a>
              ) : (
                attribution.authorName
              )}
            </p>
          </Reveal>

          <Reveal delay={150} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <ShieldScan className="h-auto w-full" />
          </Reveal>
        </Container>

        <Container className="relative pb-16">
          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-4 rounded-3xl bg-white p-6 shadow-soft sm:grid-cols-4 sm:p-8">
              {FACTS.map((fact) => (
                <div key={fact.label} className="text-center">
                  <p className="font-heading text-3xl font-extrabold text-navy-950 sm:text-4xl">{fact.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 sm:text-sm">{fact.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="space-y-4">
          <DisclaimerBanner />
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6 sm:py-5">
            <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6l-9-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            </span>
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
              <strong className="font-semibold text-navy-900">No-storage by default:</strong> anonymous case analysis
              does not require an account and raw narrative text is not stored by default. See the{" "}
              <Link href="/privacy" className="font-medium text-teal-700 underline underline-offset-2">Privacy page</Link> for details.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <Reveal className="max-w-2xl">
            <h2 className="font-heading text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
              Four explainable risk dimensions
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Every case receives four independent 0–100 scores, each built from visible, inspectable factors.
              Illustrative example shown below.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {SCORE_PREVIEW.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div className="h-full rounded-3xl bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className={`mt-3 font-mono text-4xl font-bold ${item.text}`}>{item.score}</p>
                  <p className="mt-1 text-xs text-slate-400">out of 100 · illustrative</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mint-50/60 py-16 sm:py-24">
        <Container>
          <Reveal className="max-w-2xl">
            <h2 className="font-heading text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
              Guided consumer-assistance workflow
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              A ten-step guided process, from safety notice to a downloadable case report.
            </p>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.title} delay={(index % 3) * 80}>
                <li className="h-full rounded-3xl bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-coral-500 font-mono text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="font-heading text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
              Fraud and risk typologies covered
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-8 flex flex-wrap gap-2.5">
            {TYPOLOGIES.map((typology) => (
              <span
                key={typology}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:border-teal-300 hover:text-teal-800"
              >
                {typology}
              </span>
            ))}
          </Reveal>
          <p className="mt-5 text-sm text-slate-500">
            When evidence is weak, FinGuard-AI reports an <strong className="text-slate-700">Insufficient evidence</strong> state
            rather than forcing a classification.
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-coral-500/10 blur-3xl" aria-hidden />
        <Container className="relative grid gap-12 sm:grid-cols-2 sm:gap-8">
          <Reveal>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Explainability, not a black box</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Every score decomposes into a visible factor table. Every typology decision traces to matched phrases
              and rule IDs, published on the Rule Explorer page.
            </p>
            <Link
              href="/rule-explorer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 underline-offset-4 transition hover:gap-2.5 hover:underline"
            >
              Open the Rule Explorer <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Research, methodology &amp; governance</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              FinGuard-AI documents its typology definitions, scoring construction, limitations, and a NIST AI RMF
              governance mapping.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-cyan-400">
              <Link href="/methodology" className="underline-offset-4 hover:underline">Methodology</Link>
              <Link href="/governance" className="underline-offset-4 hover:underline">Governance</Link>
              <Link href="/research" className="underline-offset-4 hover:underline">Research</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
