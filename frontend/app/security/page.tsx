import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { getAttribution } from "@/lib/config";

export const metadata: Metadata = {
  title: "Security",
  description: "Security practices and responsible-disclosure process for FinGuard-AI.",
};

export default function SecurityPage() {
  const attribution = getAttribution();

  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-semibold text-navy-900">Security</h1>
      <div className="prose-content mt-6 max-w-3xl">
        <h2>Responsible disclosure</h2>
        <p>
          If you believe you have found a security vulnerability in FinGuard-AI, please report it responsibly
          rather than exploiting it or disclosing it publicly.{" "}
          {attribution.contactEmail
            ? <>Contact <a href={`mailto:${attribution.contactEmail}`}>{attribution.contactEmail}</a>.</>
            : "See SECURITY.md in the project repository for the current reporting contact."}
        </p>

        <h2>Secure development practices</h2>
        <ul>
          <li>Deterministic, dependency-light rules engine with no dynamic code execution over user input.</li>
          <li>Input validation via Pydantic schemas with explicit length and range limits.</li>
          <li>Output encoding via JSON API responses; no server-rendered template injection of user content.</li>
        </ul>

        <h2>No sensitive-data logging</h2>
        <p>Raw narrative text is never written to application logs. Validation-error responses report field paths and error types only, never the submitted value.</p>

        <h2>Secure headers</h2>
        <p>Every response includes X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, and a restrictive Content-Security-Policy. HSTS is applied when served over HTTPS.</p>

        <h2>Rate limiting and request limits</h2>
        <p>The API applies a per-IP rate limit and a maximum request-body size, in addition to per-field length limits, to reduce narrative-length and request-flooding abuse.</p>

        <h2>Dependency scanning</h2>
        <p>GitHub Actions runs dependency and lint checks on every pull request (see <code>.github/workflows/</code>).</p>

        <h2>Access control</h2>
        <p>The public API exposes only anonymous, stateless endpoints. There is no administrative interface in this release.</p>

        <h2>Encryption</h2>
        <p>Production deployments should terminate TLS at the load balancer/CDN and enforce HTTPS end to end; see <code>docs/deployment.md</code>.</p>

        <h2>Secret management</h2>
        <p>All configuration, including author-attribution fields, is environment-variable driven via <code>.env</code> files that are excluded from version control (see <code>.env.example</code>).</p>

        <h2>Incident response</h2>
        <p>See <code>SECURITY.md</code> in the repository root for the current incident-response process for this research prototype.</p>
      </div>
    </Container>
  );
}
