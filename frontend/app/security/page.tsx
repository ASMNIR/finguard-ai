import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/content/PageHero";
import { SectionCard, accentFor } from "@/components/content/SectionCard";
import { getAttribution } from "@/lib/config";
import type { IconName } from "@/components/content/Icon";

export const metadata: Metadata = {
  title: "Security",
  description: "Security practices and responsible-disclosure process for FinGuard-AI.",
};

export default function SecurityPage() {
  const attribution = getAttribution();

  const sections: { title: string; icon: IconName; body: React.ReactNode }[] = [
    {
      title: "Responsible disclosure",
      icon: "mail",
      body: (
        <p>
          If you believe you have found a security vulnerability in FinGuard-AI, please report it responsibly rather
          than exploiting it or disclosing it publicly.{" "}
          {attribution.contactEmail ? (
            <>Contact <a href={`mailto:${attribution.contactEmail}`}>{attribution.contactEmail}</a>.</>
          ) : (
            "See SECURITY.md in the project repository for the current reporting contact."
          )}
        </p>
      ),
    },
    {
      title: "Secure development practices",
      icon: "shield",
      body: (
        <ul>
          <li>Deterministic, dependency-light rules engine with no dynamic code execution over user input.</li>
          <li>Input validation via Pydantic schemas with explicit length and range limits.</li>
          <li>Output encoding via JSON API responses; no server-rendered template injection of user content.</li>
        </ul>
      ),
    },
    {
      title: "No sensitive-data logging",
      icon: "eye",
      body: <p>Raw narrative text is never written to application logs. Validation-error responses report field paths and error types only, never the submitted value.</p>,
    },
    {
      title: "Secure headers",
      icon: "lock",
      body: <p>Every response includes X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, and a restrictive Content-Security-Policy. HSTS is applied when served over HTTPS.</p>,
    },
    {
      title: "Rate limiting and request limits",
      icon: "clock",
      body: <p>The API applies a per-IP rate limit and a maximum request-body size, in addition to per-field length limits, to reduce narrative-length and request-flooding abuse.</p>,
    },
    {
      title: "Dependency scanning",
      icon: "gitBranch",
      body: <p>GitHub Actions runs dependency and lint checks on every pull request (see <code>.github/workflows/</code>).</p>,
    },
    {
      title: "Access control",
      icon: "users",
      body: <p>The public API exposes only anonymous, stateless endpoints. There is no administrative interface in this release.</p>,
    },
    {
      title: "Encryption",
      icon: "lock",
      body: <p>Production deployments should terminate TLS at the load balancer/CDN and enforce HTTPS end to end; see <code>docs/deployment.md</code>.</p>,
    },
    {
      title: "Secret management",
      icon: "shield",
      body: <p>All configuration, including author-attribution fields, is environment-variable driven via <code>.env</code> files that are excluded from version control (see <code>.env.example</code>).</p>,
    },
    {
      title: "Incident response",
      icon: "alert",
      body: <p>See <code>SECURITY.md</code> in the repository root for the current incident-response process for this research prototype.</p>,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Security"
        description="Security practices and responsible-disclosure process for FinGuard-AI."
      />
      <Container className="py-10 space-y-5 pb-16">
        {sections.map((section, i) => (
          <SectionCard key={section.title} title={section.title} icon={section.icon} accent={accentFor(i)}>
            {section.body}
          </SectionCard>
        ))}
      </Container>
    </>
  );
}
