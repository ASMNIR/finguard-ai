import Link from "next/link";
import { Container } from "@/components/Container";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { getAttribution } from "@/lib/config";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-teal-700 text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-cyan-400/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" aria-hidden />
        <Container className="relative py-20 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-100">
            Research Prototype
          </span>
          <h1 className="mt-6 max-w-3xl font-heading text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            FinGuard-AI
          </h1>
          <p className="mt-4 max-w-2xl text-xl font-medium text-cyan-100 sm:text-2xl">
            Explainable Intelligence for Financial Fraud and Consumer Harm
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">
            FinGuard-AI transforms complaint narratives and structured case information into transparent fraud
            indicators, consumer-harm assessments, dispute-friction signals, recovery time-sensitivity measures, and
            practical consumer-assistance guidance.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/analyze"
              className="rounded-full bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-navy-950 shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Analyze a Case
            </Link>
            <Link
              href="/research"
              className="rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore the Research
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <Link href="/methodology" className="underline-offset-4 transition hover:text-cyan-200 hover:underline">View Methodology</Link>
            <Link href="/dashboard" className="underline-offset-4 transition hover:text-cyan-200 hover:underline">Open Synthetic Dashboard</Link>
            <Link href="/governance" className="underline-offset-4 transition hover:text-cyan-200 hover:underline">Read Governance Framework</Link>
          </div>

          <p className="mt-10 text-sm text-slate-400">Created by {attribution.authorName}</p>
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
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              Four explainable risk dimensions
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Every case receives four independent 0–100 scores, each built from visible, inspectable factors.
              Illustrative example shown below.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {SCORE_PREVIEW.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className={`mt-3 font-mono text-4xl font-bold ${item.text}`}>{item.score}</p>
                <p className="mt-1 text-xs text-slate-400">out of 100 · illustrative</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              Guided consumer-assistance workflow
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              A ten-step guided process, from safety notice to a downloadable case report.
            </p>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-offwhite/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-900 font-mono text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
            Fraud and risk typologies covered
          </h2>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {TYPOLOGIES.map((typology) => (
              <span
                key={typology}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:border-teal-300 hover:text-teal-800"
              >
                {typology}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500">
            When evidence is weak, FinGuard-AI reports an <strong className="text-slate-700">Insufficient evidence</strong> state
            rather than forcing a classification.
          </p>
        </Container>
      </section>

      <section className="bg-navy-950 py-16 text-white sm:py-24">
        <Container className="grid gap-12 sm:grid-cols-2 sm:gap-8">
          <div>
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
          </div>
          <div>
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
          </div>
        </Container>
      </section>
    </>
  );
}
