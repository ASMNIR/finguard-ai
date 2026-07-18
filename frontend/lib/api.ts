import { API_BASE_URL } from "./config";
import type { AnalyzeResponse, DashboardSummary, RuleExplorerEntry, StructuredIntake } from "./types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!response.ok) {
    let detail = `Request to ${path} failed with status ${response.status}.`;
    try {
      const body = await response.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      // Non-JSON error body; keep the generic message. Never surface raw response text,
      // which could echo request content back to the console.
    }
    throw new ApiError(detail, response.status);
  }
  return response.json() as Promise<T>;
}

export function analyzeCase(narrative: string, structured: StructuredIntake, language: "en" | "es" | "bn" = "en") {
  return request<AnalyzeResponse>("/analyze", {
    method: "POST",
    body: JSON.stringify({ narrative, structured, language }),
  });
}

export function redactPreview(narrative: string) {
  return request<{ sanitized_narrative: string; redactions_applied: { category: string; label: string; count: number }[]; warning: string }>(
    "/redact-preview",
    { method: "POST", body: JSON.stringify({ narrative }) }
  );
}

export function fetchRules() {
  return request<RuleExplorerEntry[]>("/rules");
}

export function fetchSampleDashboard() {
  return request<DashboardSummary>("/dashboard/sample-summary");
}

export function fetchLetterTemplates() {
  return request<Record<string, string>>("/letters/templates");
}

export function generateLetter(payload: {
  template_id: string;
  case_reference: string;
  structured: StructuredIntake;
  sanitized_narrative: string;
  typology: string;
}) {
  return request<{ template_id: string; subject: string; body: string; disclaimer: string }>("/letters/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function downloadCaseReportPdf(analysis: AnalyzeResponse): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/reports/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analysis),
  });
  if (!response.ok) throw new ApiError("Could not generate the PDF report.", response.status);
  return response.blob();
}

export function submitContact(payload: {
  inquiry_type: string;
  name: string;
  email?: string;
  organization?: string;
  message: string;
  website?: string;
}) {
  return request<{ status: string; message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitFeedback(payload: Record<string, unknown>) {
  return request<{ status: string; message: string }>("/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
