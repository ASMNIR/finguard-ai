"use client";

import { useState } from "react";

interface TimelineEvent {
  id: string;
  label: string;
  date: string;
}

const DEFAULT_LABELS = [
  "Incident date",
  "Payment date",
  "Institution contact date",
  "Dispute date",
  "Evidence submission date",
  "Provisional-credit date",
  "Denial date",
  "Appeal date",
  "Complaint-report date",
  "Follow-up date",
  "Recovery date",
];

export function CaseTimeline({ caseReference }: { caseReference: string }) {
  const [events, setEvents] = useState<TimelineEvent[]>(
    DEFAULT_LABELS.map((label) => ({ id: label, label, date: "" }))
  );
  const [finalOutcome, setFinalOutcome] = useState("");

  function updateDate(id: string, date: string) {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, date } : event)));
  }

  const filled = events.filter((event) => event.date).sort((a, b) => a.date.localeCompare(b.date));

  function downloadTimeline() {
    const lines = [
      `FinGuard-AI Case Timeline - Case ${caseReference}`,
      "",
      ...filled.map((event) => `${event.date}: ${event.label}`),
      "",
      `Final outcome: ${finalOutcome || "Not yet recorded"}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${caseReference}-timeline.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl2 border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Case timeline</h2>
        <button type="button" onClick={downloadTimeline} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 print:hidden">
          Download
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {events.map((event) => (
          <label key={event.id} className="block text-sm">
            <span className="font-medium text-slate-800">{event.label}</span>
            <input
              type="date"
              value={event.date}
              onChange={(e) => updateDate(event.id, e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        ))}
      </div>

      <label className="mt-3 block text-sm">
        <span className="font-medium text-slate-800">Final outcome</span>
        <input
          type="text"
          value={finalOutcome}
          onChange={(e) => setFinalOutcome(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g., partial recovery, denied, unresolved"
        />
      </label>

      {filled.length > 0 && (
        <ol className="mt-5 space-y-2 border-l-2 border-teal-500 pl-4" aria-label="Visual timeline">
          {filled.map((event) => (
            <li key={event.id} className="relative text-sm">
              <span className="absolute -left-[1.32rem] top-1 h-2.5 w-2.5 rounded-full bg-teal-500" aria-hidden />
              <span className="font-mono text-xs text-slate-500">{event.date}</span> — {event.label}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
