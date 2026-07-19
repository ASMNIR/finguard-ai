"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { PROJECT_NAME } from "@/lib/config";

const LINKS = [
  { href: "/analyze", label: "Analyze a Case" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/methodology", label: "Methodology" },
  { href: "/research", label: "Research" },
  { href: "/governance", label: "Governance" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-navy-900">
          <Logo className="h-9 w-9" gradientId="navLogoGradient" />
          {PROJECT_NAME}
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/analyze"
            className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Analyze a Case
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-navy-900 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation menu</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-slate-200 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-base font-medium text-slate-900 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
