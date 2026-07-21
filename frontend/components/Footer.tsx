import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { getAttribution, PROJECT_NAME } from "@/lib/config";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { href: "/analyze", label: "Analyze a Case" },
      { href: "/dashboard", label: "Portfolio Dashboard" },
      { href: "/rule-explorer", label: "Rule Explorer" },
    ],
  },
  {
    title: "Research & Governance",
    links: [
      { href: "/methodology", label: "Methodology" },
      { href: "/research", label: "Research" },
      { href: "/governance", label: "Governance" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Legal & Trust",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/security", label: "Security" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  const attribution = getAttribution();
  const year = new Date().getFullYear();

  // Author-identity links (the person) vs. prototype-citation links (the paper/codebase) are kept visually
  // distinct: mixing "Google Scholar" with "Zenodo DOI" in one row reads as if both describe the same thing.
  const authorLinks: { href: string; label: string }[] = [
    attribution.authorGoogleScholar ? { href: attribution.authorGoogleScholar, label: "Google Scholar" } : null,
    attribution.authorOrcid ? { href: `https://orcid.org/${attribution.authorOrcid}`, label: "ORCID" } : null,
    attribution.authorGithub ? { href: attribution.authorGithub, label: "GitHub" } : null,
    attribution.authorLinkedin ? { href: attribution.authorLinkedin, label: "LinkedIn" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  const citationLinks: { href: string; label: string }[] = [
    attribution.authorZenodo ? { href: attribution.authorZenodo, label: "Zenodo (DOI)" } : null,
    attribution.authorSsrn ? { href: attribution.authorSsrn, label: "SSRN" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-navy-950 text-slate-200">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-coral-500/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" aria-hidden />

      <Container className="relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <Logo className="h-8 w-8" gradientId="footerLogoGradient" variant="light" />
            {PROJECT_NAME}
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            FinGuard-AI is an explainable financial-fraud and consumer-harm research prototype designed and
            developed by {attribution.authorName}.
          </p>

          {authorLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {authorLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-teal-400/60 hover:text-teal-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {citationLinks.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Cite this research</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {citationLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-full border border-coral-400/30 bg-coral-500/10 px-3 py-1.5 text-xs font-medium text-coral-300 transition hover:border-coral-400/60 hover:bg-coral-500/20"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
              {column.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-300 transition hover:text-cyan-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {attribution.authorName}. FinGuard-AI Research Project.
          </p>
          <p>Research prototype — not production-ready. See disclaimers on every page.</p>
        </Container>
      </div>
    </footer>
  );
}
