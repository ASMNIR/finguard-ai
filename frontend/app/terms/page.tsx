import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the FinGuard-AI research prototype (draft, pending legal review).",
};

export default function TermsPage() {
  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-semibold text-navy-900">Terms of Use</h1>
      <div className="mt-3 rounded-xl2 border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-slate-800">
        <strong className="font-semibold text-navy-900">Draft — pending legal review.</strong> This page is a
        placeholder terms-of-use document for a research prototype. It has not been reviewed by an attorney and
        should not be treated as a finalized legal agreement.
      </div>

      <div className="prose-content mt-6 max-w-3xl">
        <h2>Research-prototype status</h2>
        <p>FinGuard-AI is a research prototype provided for informational and demonstration purposes only.</p>

        <h2>Informational use only</h2>
        <p>Outputs are informational risk indicators and consumer-assistance guidance. They are not legal advice, financial advice, or a government determination of any kind.</p>

        <h2>No government affiliation</h2>
        <p>FinGuard-AI is an independent project and is not affiliated with, endorsed by, or operated on behalf of any government agency.</p>

        <h2>No guaranteed recovery</h2>
        <p>FinGuard-AI does not guarantee reimbursement, recovery of funds, or any particular outcome from any institution, agency, or legal process.</p>

        <h2>Not an emergency service</h2>
        <p>Do not rely on FinGuard-AI in place of contacting your financial institution, law enforcement, or emergency services directly.</p>

        <h2>User responsibility</h2>
        <p>You are responsible for the accuracy of information you provide and for not entering highly sensitive information (see the Privacy page).</p>

        <h2>Acceptable use</h2>
        <p>Do not use FinGuard-AI to submit fraudulent reports, to harass another person, or to attempt to disrupt or reverse-engineer the service in a manner inconsistent with its published API documentation.</p>

        <h2>Intellectual property</h2>
        <p>Rule text, scoring logic, and documentation are provided under the license in the project repository (see <code>LICENSE</code>).</p>

        <h2>Limitation of liability</h2>
        <p>FinGuard-AI is provided "as is," without warranty of any kind, to the maximum extent permitted by law. The designer is not liable for decisions made in reliance on this research prototype.</p>

        <h2>External links</h2>
        <p>Links to third-party official resources are provided for convenience. FinGuard-AI does not control and is not responsible for third-party content.</p>

        <h2>Service availability</h2>
        <p>This research prototype may be updated, interrupted, or discontinued at any time without notice.</p>
      </div>
    </Container>
  );
}
