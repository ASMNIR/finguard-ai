import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How FinGuard-AI handles case data by default, and what is never collected.",
};

export default function PrivacyPage() {
  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-semibold text-navy-900">Privacy</h1>
      <div className="prose-content mt-6 max-w-3xl">
        <h2>Anonymous by default</h2>
        <p>The public case-analysis flow requires no account and no login. No persistent user identifier is created for anonymous analysis.</p>

        <h2>What information is processed</h2>
        <ul>
          <li>The narrative text you enter (redacted before analysis; see below).</li>
          <li>Structured intake fields you choose to fill in (dates, amounts, channel, dispute status).</li>
        </ul>

        <h2>What is not collected by default</h2>
        <ul>
          <li>Raw, unredacted narrative text is not stored server-side beyond the lifetime of the API request that processes it.</li>
          <li>No advertising trackers or behavioral-profiling scripts are used.</li>
          <li>No account, password, or persistent case history is created unless a future opt-in feature is explicitly enabled.</li>
        </ul>

        <h2>Automatic redaction</h2>
        <p>
          Before analysis, FinGuard-AI applies pattern-based redaction for emails, phone numbers, Social Security
          number patterns, long account-number-like and card-like sequences, routing-number-like sequences,
          verification-code and PIN/password statements, and street addresses. This is a best-effort safeguard, not
          a guarantee — please avoid entering sensitive details yourself.
        </p>

        <h2>Server logs</h2>
        <p>Application logs record method, path, and status code for operational monitoring. Raw narrative text and structured PII values are never written to logs.</p>

        <h2>Cookies and analytics</h2>
        <p>The public prototype does not set tracking cookies and does not integrate a third-party analytics or advertising SDK.</p>

        <h2>Third-party services</h2>
        <p>Outbound links to official reporting resources (e.g., ReportFraud.ftc.gov) open in a new tab and are governed by that organization's own privacy practices, not FinGuard-AI's.</p>

        <h2>Retention</h2>
        <p>Anonymous case analysis is processed in memory for the duration of the request and is not retained afterward. Uploaded CSV files for the dashboard are processed in memory only and are not stored.</p>

        <h2>Future opt-in case tracking</h2>
        <p>
          A future authenticated, opt-in case-tracking feature would require explicit consent, documented retention
          limits, encryption at rest, user-initiated deletion, access controls, and audit logging before release. It
          is not enabled in this release.
        </p>

        <h2>Deletion requests</h2>
        <p>Because anonymous analysis is not stored, there is typically nothing to delete. For questions, use the <a href="/contact">Contact page</a>.</p>

        <h2>Security limitations</h2>
        <p>This is a research prototype and has not completed an independent third-party security audit. See the <a href="/security">Security page</a>.</p>

        <h2>Prohibited information</h2>
        <p>Do not enter passwords, PINs, Social Security numbers, full account numbers, full card numbers, routing numbers, or one-time authentication codes.</p>
      </div>
    </Container>
  );
}
