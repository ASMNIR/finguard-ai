import type { RedactionSummary } from "@/lib/types";

interface Props {
  narrative: string;
  loadingPreview: boolean;
  sanitized: string | null;
  redactions: RedactionSummary[];
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
}

export function StepRedaction({ narrative, loadingPreview, sanitized, redactions, error, onBack, onConfirm, submitting }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-2xl font-semibold text-navy-900">Automatic privacy redaction</h1>
      <p className="mt-1 text-sm text-slate-600">
        FinGuard-AI scans your narrative for common sensitive patterns before analysis. This is a best-effort
        safeguard, not a guarantee — please review the sanitized text below.
      </p>

      {!narrative && (
        <p className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No narrative was provided. Analysis will rely on the structured intake fields only.
        </p>
      )}

      {narrative && loadingPreview && <p className="mt-4 text-sm text-slate-600">Checking for sensitive patterns…</p>}

      {narrative && error && (
        <p className="mt-4 rounded-lg border border-redrisk-500/40 bg-redrisk-500/10 p-3 text-sm text-redrisk-500" role="alert">
          {error}
        </p>
      )}

      {narrative && sanitized !== null && !loadingPreview && (
        <>
          <div className="mt-4 rounded-xl2 border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-800">Sanitized narrative</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{sanitized}</p>
          </div>

          {redactions.length > 0 ? (
            <div className="mt-4 rounded-xl2 border border-amber-500/40 bg-amber-500/10 p-4">
              <h2 className="text-sm font-semibold text-navy-900">Redacted items by category</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-800">
                {redactions.map((item) => (
                  <li key={item.category}>
                    {item.label}: {item.count} occurrence{item.count === 1 ? "" : "s"} removed
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-600">
                Do not re-enter any redacted sensitive information in a later step.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-emerald-700">No sensitive patterns were detected.</p>
          )}
        </>
      )}

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting || loadingPreview}
          className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-card disabled:opacity-50"
        >
          {submitting ? "Analyzing…" : "Confirm and run analysis"}
        </button>
      </div>
    </div>
  );
}
