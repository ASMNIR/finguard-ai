import Link from "next/link";
import { Container } from "./Container";
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

  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-200">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 text-xs font-bold text-navy-950"
            >
              FG
            </span>
            {PROJECT_NAME}
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            FinGuard-AI is an explainable financial-fraud and consumer-harm research prototype designed and
            developed by {attribution.authorName}.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
              {column.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-300 hover:text-cyan-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/10">
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
