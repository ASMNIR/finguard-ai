import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { RuleExplorerClient } from "@/components/RuleExplorerClient";

export const metadata: Metadata = {
  title: "Rule Explorer",
  description: "The full, public, inspectable phrase-rule table behind FinGuard-AI's typology classification.",
};

export default function RuleExplorerPage() {
  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-semibold text-navy-900">Rule Explorer</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Every phrase rule that can influence a typology classification, published for audit and review. Nothing
        security-sensitive is withheld because nothing in this rule set is security-sensitive.
      </p>
      <div className="mt-6 rounded-xl2 border border-slate-200 bg-white p-5">
        <RuleExplorerClient />
      </div>
    </Container>
  );
}
