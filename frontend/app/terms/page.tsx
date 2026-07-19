import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/content/PageHero";
import { SectionCard, accentFor } from "@/components/content/SectionCard";
import type { IconName } from "@/components/content/Icon";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the FinGuard-AI research prototype (draft, pending legal review).",
};

const SECTIONS: { title: string; icon: IconName; body: React.ReactNode }[] = [
  {
    title: "Research-prototype status",
    icon: "flag",
    body: <p>FinGuard-AI is a research prototype provided for informational and demonstration purposes only.</p>,
  },
  {
    title: "Informational use only",
    icon: "document",
    body: <p>Outputs are informational risk indicators and consumer-assistance guidance. They are not legal advice, financial advice, or a government determination of any kind.</p>,
  },
  {
    title: "No government affiliation",
    icon: "scale",
    body: <p>FinGuard-AI is an independent project and is not affiliated with, endorsed by, or operated on behalf of any government agency.</p>,
  },
  {
    title: "No guaranteed recovery",
    icon: "alert",
    body: <p>FinGuard-AI does not guarantee reimbursement, recovery of funds, or any particular outcome from any institution, agency, or legal process.</p>,
  },
  {
    title: "Not an emergency service",
    icon: "alert",
    body: <p>Do not rely on FinGuard-AI in place of contacting your financial institution, law enforcement, or emergency services directly.</p>,
  },
  {
    title: "User responsibility",
    icon: "users",
    body: <p>You are responsible for the accuracy of information you provide and for not entering highly sensitive information (see the Privacy page).</p>,
  },
  {
    title: "Acceptable use",
    icon: "check",
    body: <p>Do not use FinGuard-AI to submit fraudulent reports, to harass another person, or to attempt to disrupt or reverse-engineer the service in a manner inconsistent with its published API documentation.</p>,
  },
  {
    title: "Intellectual property",
    icon: "lock",
    body: <p>Rule text, scoring logic, and documentation are provided under the license in the project repository (see <code>LICENSE</code>).</p>,
  },
  {
    title: "Limitation of liability",
    icon: "scale",
    body: <p>FinGuard-AI is provided "as is," without warranty of any kind, to the maximum extent permitted by law. The designer is not liable for decisions made in reliance on this research prototype.</p>,
  },
  {
    title: "External links",
    icon: "globe",
    body: <p>Links to third-party official resources are provided for convenience. FinGuard-AI does not control and is not responsible for third-party content.</p>,
  },
  {
    title: "Service availability",
    icon: "clock",
    body: <p>This research prototype may be updated, interrupted, or discontinued at any time without notice.</p>,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms of Use"
        description="Draft — pending legal review. This page has not been reviewed by an attorney and should not be treated as a finalized legal agreement."
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
