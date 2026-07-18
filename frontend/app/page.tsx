import Link from "next/link";
import { Container } from "@/components/Container";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { getAttribution } from "@/lib/config";

const SCORE_PREVIEW = [
  { label: "Fraud Risk", score: 78, color: "from-orange-500/20 to-orange-500/5", text: "text-orange-600" },
  { label: "Consumer Harm", score: 64, color: "from-amber-500/20 to-amber-500/5", text: "text-amber-600" },
  { label: "Dispute Friction", score: 41, color: "from-teal-500/20 to-teal-500/5", text: "text-teal-700" },
  { label: "Recovery Urgency", score: 82, color: "from-redrisk-500/20 to-redrisk-500/5", text: "text-redrisk-500" },
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
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden />
        <Container className="relative py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Research Prototype
          </span>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl">FinGuard-AI</h1>
          <p className="mt-3 max-w-2xl text-lg text-cyan-100 sm:text-xl">
            Explainable Intelligence for Financial Fraud and Consumer Harm
          </p>
          <p className="mt-5 max-w-2xl text-sm text-slate-200 sm:text-base">
            FinGuard-AI transforms complaint narratives and structured case information into transparent fraud
            indicators, consumer-harm assessments, dispute-friction signals, recovery time-sensitivity measures, and
            practical consumer-assistance guidance.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/analyze"
              className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-semibold text-navy-950 shadow-glow hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Analyze a Case
            </Link>
            <Link
              href="/research"
              className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore the Research
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
            <Link href="/methodology" className="underline-offset-4 hover:underline">View Methodology</Link>
            <Link href="/dashboard" className="underline-offset-4 hover:underline">Open Synthetic Dashboard</Link>
            <Link href="/governance" className="underline-offset-4 hover:underline">Read Governance Framework</Link>
          </div>

          <p className="mt-8 text-sm text-slate-300">Created by {attribution.authorName}</p>
        </Container>
      </section>

      <Container className="-mt-8 relative z-10">
        <DisclaimerBanner />
      </Container>

      <Container className="py-4">
        <p className="rounded-lg bg-teal-700/5 px-4 py-3 text-sm text-slate-700">
          <strong className="font-semibold text-navy-900">No-storage by default:</strong> anonymous case analysis does
          not require an account and raw narrative text is not stored by default. See the{" "}
          <Link href="/privacy" className="underline">Privacy page</Link> for details.
        </p>
      </Container>

      <section className="py-10">
        <Container>
          <h2 className="font-heading text-2xl font-semibold text-navy-900">Four explainable risk dimensions</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Every case receives four independent 0–100 scores, each built from visible, inspectable factors.
            Illustrative example shown below.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SCORE_PREVIEW.map((item) => (
              <div key={item.label} className={`rounded-xl2 border border-slate-200 bg-gradient-to-b ${item.color} p-5`}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{item.label}</p>
                <p className={`mt-2 font-mono text-3xl font-bold ${item.text}`}>{item.score}</p>
                <p className="text-xs text-slate-500">out of 100 (illustrative)</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-10">
        <Container>
          <h2 className="font-heading text-2xl font-semibold text-navy-900">Guided consumer-assistance workflow</h2>
          <p className="mt-2 max-w-2xl text-slate-600">A ten-step guided process, from safety notice to a downloadable case report.</p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className="rounded-xl2 border border-slate-200 p-5 shadow-card">
                <span className="font-mono text-xs font-semibold text-teal-700">STEP {index + 1}</span>
                <h3 className="mt-1 font-heading text-base font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <h2 className="font-heading text-2xl font-semibold text-navy-900">Fraud and risk typologies covered</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {TYPOLOGIES.map((typology) => (
              <span key={typology} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                {typology}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            When evidence is weak, FinGuard-AI reports an <strong>Insufficient evidence</strong> state rather than
            forcing a classification.
          </p>
        </Container>
      </section>

      <section className="bg-navy-950 py-12 text-white">
        <Container className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-semibold">Explainability, not a black box</h2>
            <p className="mt-2 text-sm text-slate-300">
              Every score decomposes into a visible factor table. Every typology decision traces to matched phrases
              and rule IDs, published on the Rule Explorer page.
            </p>
            <Link href="/rule-explorer" className="mt-3 inline-block text-sm font-semibold text-cyan-400 underline-offset-4 hover:underline">
              Open the Rule Explorer →
            </Link>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold">Research, methodology &amp; governance</h2>
            <p className="mt-2 text-sm text-slate-300">
              FinGuard-AI documents its typology definitions, scoring construction, limitations, and a NIST AI RMF
              governance mapping.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-cyan-400">
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
