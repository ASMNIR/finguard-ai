"use client";

import { useState } from "react";
import type { AnalyzeResponse } from "@/lib/types";

type Status = "have" | "missing" | "not_applicable";

export function EvidenceChecklist({ analysis }: { analysis: AnalyzeResponse }) {
  const relevantItems = analysis.evidence_checklist.filter((item) => item.relevant);
  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(relevantItems.map((item) => [item.id, "missing" as Status]))
  );

  function downloadChecklist() {
    const lines = [
      `FinGuard-AI Evidence Checklist - Case ${analysis.case_reference}`,
      "",
      ...relevantItems.map((item) => `[${status[item.id] === "have" ? "x" : " "}] ${item.label} - ${item.why}`),
      "",
      "Do not upload or paste passwords, PINs, full account numbers, full card numbers, Social Security numbers, or one-time authentication codes.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${analysis.case_reference}-evidence-checklist.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl2 border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Evidence checklist</h2>
        <div className="flex gap-2 print:hidden">
          <button type="button" onClick={() => window.print()} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Print
          </button>
          <button type="button" onClick={downloadChecklist} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Download
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Do not upload or paste passwords, PINs, full account numbers, full card numbers, Social Security numbers, or
        one-time authentication codes, even when building this checklist.
      </p>

      <ul className="mt-4 space-y-3">
        {relevantItems.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="mt-0.5 text-xs text-slate-600">{item.why}</p>
              </div>
              <select
                value={status[item.id]}
                onChange={(event) => setStatus((prev) => ({ ...prev, [item.id]: event.target.value as Status }))}
                className="shrink-0 rounded-md border border-slate-300 px-2 py-1 text-xs"
              >
                <option value="missing">Missing</option>
                <option value="have">Have it</option>
                <option value="not_applicable">Not applicable</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
