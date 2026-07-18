"use client";

import { useEffect, useState } from "react";
import { fetchLetterTemplates, generateLetter } from "@/lib/api";
import type { AnalyzeResponse, StructuredIntake } from "@/lib/types";

export function LetterGenerator({ analysis, structured }: { analysis: AnalyzeResponse; structured: StructuredIntake }) {
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const [templateId, setTemplateId] = useState("initial_dispute");
  const [letterBody, setLetterBody] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLetterTemplates()
      .then(setTemplates)
      .catch(() => setTemplates({ initial_dispute: "Initial Dispute Letter" }));
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateLetter({
        template_id: templateId,
        case_reference: analysis.case_reference,
        structured,
        sanitized_narrative: analysis.sanitized_narrative,
        typology: analysis.primary_typology,
      });
      setLetterBody(result.body);
      setSubject(result.subject);
    } catch {
      setError("Could not generate the letter. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadTxt() {
    const blob = new Blob([letterBody], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${analysis.case_reference}-${templateId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl2 border border-slate-200 bg-white p-5">
      <h2 className="font-heading text-lg font-semibold text-navy-900">Dispute-letter generator</h2>
      <p className="mt-1 text-xs text-slate-600">
        Editable, plain-language templates built from your sanitized case facts. Informational only — not legal
        advice and does not cite laws or regulations.
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="font-medium text-slate-800">Template</span>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="mt-1 block rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {Object.entries(templates).map(([id, title]) => (
              <option key={id} value={id}>{title}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleGenerate} disabled={loading} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "Generating…" : "Generate letter"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-redrisk-500">{error}</p>}

      {letterBody && (
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-800">{subject}</p>
          <textarea
            value={letterBody}
            onChange={(e) => setLetterBody(e.target.value)}
            rows={14}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(letterBody);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button type="button" onClick={downloadTxt} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
              Download (.txt)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
