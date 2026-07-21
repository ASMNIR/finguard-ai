import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
  description: "Synthetic demonstration data — not real consumer records.",
};

export default function DashboardPage() {
  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-navy-950">Portfolio dashboard</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        Synthetic demonstration data — not real consumer records. This view illustrates how a portfolio of analyzed
        cases can be summarized for research and governance discussion.
      </p>
      <div className="mt-6">
        <DashboardClient />
      </div>
    </Container>
  );
}
