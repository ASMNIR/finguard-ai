import type { Metadata } from "next";
import { AnalyzeWizard } from "@/components/analyze/AnalyzeWizard";

export const metadata: Metadata = {
  title: "Analyze a Case",
  description: "Guided, privacy-aware case intake and explainable risk analysis.",
};

export default function AnalyzePage() {
  return <AnalyzeWizard />;
}
