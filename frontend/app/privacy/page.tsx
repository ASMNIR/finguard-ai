import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/content/PageHero";
import { SectionCard, accentFor } from "@/components/content/SectionCard";
import type { IconName } from "@/components/content/Icon";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How FinGuard-AI handles case data by default, and what is never collected.",
};

const SECTIONS: { title: string; icon: IconName; body: React.ReactNode }[] = [
  {
    title: "Anonymous by default",
    icon: "lock",
    body: <p>The public case-analysis flow requires no account and no login. No persistent user identifier is created for anonymous analysis.</p>,
  },
  {
    title: "What information is processed",
    icon: "document",
    body: (
      <ul>
        <li>The narrative text you enter (redacted before analysis; see below).</li>
        <li>Structured intake fields you choose to fill in (dates, amounts, channel, dispute status).</li>
      </ul>
    ),
  },
  {
    title: "What is not collected by default",
    icon: "shield",
    body: (
      <ul>
        <li>Raw, unredacted narrative text is not stored server-side beyond the lifetime of the API request that processes it.</li>
        <li>No advertising trackers or behavioral-profiling scripts are used.</li>
        <li>No account, password, or persistent case history is created unless a future opt-in feature is explicitly enabled.</li>
      </ul>
    ),
  },
  {
    title: "Automatic redaction",
    icon: "eye",
    body: (
      <p>
        Before analysis, FinGuard-AI applies pattern-based redaction for emails, phone numbers, Social Security
        number patterns, long account-number-like and card-like sequences, routing-number-like sequences,
        verification-code and PIN/password statements, and street addresses. This is a best-effort safeguard, not a
        guarantee — please avoid entering sensitive details yourself.
      </p>
    ),
  },
  {
    title: "Server logs",
    icon: "document",
    body: <p>Application logs record method, path, and status code for operational monitoring. Raw narrative text and structured PII values are never written to logs.</p>,
  },
  {
    title: "Cookies and analytics",
    icon: "globe",
    body: <p>The public prototype does not set tracking cookies and does not integrate a third-party analytics or advertising SDK.</p>,
  },
  {
    title: "Third-party services",
    icon: "globe",
    body: <p>Outbound links to official reporting resources (e.g., ReportFraud.ftc.gov) open in a new tab and are governed by that organization's own privacy practices, not FinGuard-AI's.</p>,
  },
  {
    title: "Retention",
    icon: "clock",
    body: <p>Anonymous case analysis is processed in memory for the duration of the request and is not retained afterward. Uploaded CSV files for the dashboard are processed in memory only and are not stored.</p>,
  },
  {
    title: "Future opt-in case tracking",
    icon: "layers",
    body: (
      <p>
        A future authenticated, opt-in case-tracking feature would require explicit consent, documented retention
        limits, encryption at rest, user-initiated deletion, access controls, and audit logging before release. It is
        not enabled in this release.
      </p>
    ),
  },
  {
    title: "Deletion requests",
    icon: "mail",
    body: <p>Because anonymous analysis is not stored, there is typically nothing to delete. For questions, use the <a href="/contact">Contact page</a>.</p>,
  },
  {
    title: "Security limitations",
    icon: "alert",
    body: <p>This is a research prototype and has not completed an independent third-party security audit. See the <a href="/security">Security page</a>.</p>,
  },
  {
    title: "Prohibited information",
    icon: "lock",
    body: <p>Do not enter passwords, PINs, Social Security numbers, full account numbers, full card numbers, routing numbers, or one-time authentication codes.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy"
        description="How FinGuard-AI handles case data by default, and what is never collected."
      />
      <Container className="py-10 space-y-5 pb-16">
        {SECTIONS.map((section, i) => (
          <SectionCard key={section.title} title={section.title} icon={section.icon} accent={accentFor(i)}>
            {section.body}
          </SectionCard>
        ))}
      </Container>
    </>
  );
}
