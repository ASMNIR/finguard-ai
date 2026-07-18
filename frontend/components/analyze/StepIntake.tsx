import type { StructuredIntake } from "@/lib/types";
import { INSTITUTION_TYPES, PAYMENT_CHANNELS, US_STATES } from "@/lib/options";

interface Props {
  narrative: string;
  onNarrativeChange: (value: string) => void;
  structured: StructuredIntake;
  onStructuredChange: (value: StructuredIntake) => void;
  onBack: () => void;
  onNext: () => void;
  error: string | null;
}

function TriStateSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null | undefined;
  onChange: (value: boolean | null) => void;
}) {
  const asString = value === true ? "yes" : value === false ? "no" : "unknown";
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      <select
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        value={asString}
        onChange={(event) => {
          const v = event.target.value;
          onChange(v === "yes" ? true : v === "no" ? false : null);
        }}
      >
        <option value="unknown">Not sure / unknown</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label>
  );
}

export function StepIntake({ narrative, onNarrativeChange, structured, onStructuredChange, onBack, onNext, error }: Props) {
  function set<K extends keyof StructuredIntake>(key: K, value: StructuredIntake[K]) {
    onStructuredChange({ ...structured, [key]: value });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-2xl font-semibold text-navy-900">Structured case intake</h1>
      <p className="mt-1 text-sm text-slate-600">
        Fill in what you know. Every field is optional except where noted; leaving fields blank will simply reduce
        evidence strength and is reported back to you as missing information.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-redrisk-500/40 bg-redrisk-500/10 p-3 text-sm text-redrisk-500" role="alert">
          {error}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Incident date</span>
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.incident_date || ""}
            onChange={(event) => set("incident_date", event.target.value || null)}
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-800">U.S. state or territory</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.state || "unknown"}
            onChange={(event) => set("state", event.target.value)}
          >
            {US_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-800">Amount lost (USD)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.amount_lost ?? 0}
            onChange={(event) => set("amount_lost", Number(event.target.value) || 0)}
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-800">Payment channel</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.payment_channel || "unknown"}
            onChange={(event) => set("payment_channel", event.target.value)}
          >
            {PAYMENT_CHANNELS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-800">Institution type</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.institution_type || "unknown"}
            onChange={(event) => set("institution_type", event.target.value)}
          >
            {INSTITUTION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-800">Who initiated the contact?</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.contact_initiated_by || "unknown"}
            onChange={(event) => set("contact_initiated_by", event.target.value as StructuredIntake["contact_initiated_by"])}
          >
            <option value="unknown">Not sure / unknown</option>
            <option value="consumer">I initiated contact</option>
            <option value="other_party">The other party initiated contact</option>
          </select>
        </label>

        <TriStateSelect label="Was the payment authorized by you?" value={structured.payment_authorized} onChange={(v) => set("payment_authorized", v)} />
        <TriStateSelect label="Was impersonation reported (e.g., of a bank or agency)?" value={structured.impersonation_reported} onChange={(v) => set("impersonation_reported", v)} />

        <label className="block text-sm">
          <span className="font-medium text-slate-800">If impersonation was reported, what organization type?</span>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.impersonated_organization_type || ""}
            onChange={(event) => set("impersonated_organization_type", event.target.value)}
            placeholder="e.g., bank, government agency, tech support"
          />
        </label>

        <TriStateSelect label="Did payment instructions change?" value={structured.payment_instructions_changed} onChange={(v) => set("payment_instructions_changed", v)} />
        <TriStateSelect label="Were credentials shared?" value={structured.credentials_shared} onChange={(v) => set("credentials_shared", v)} />
        <TriStateSelect label="Was remote access provided?" value={structured.remote_access_provided} onChange={(v) => set("remote_access_provided", v)} />
        <TriStateSelect label="Was a dispute submitted?" value={structured.dispute_submitted} onChange={(v) => set("dispute_submitted", v)} />

        <label className="block text-sm">
          <span className="font-medium text-slate-800">Dispute submission date</span>
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.dispute_submission_date || ""}
            onChange={(event) => set("dispute_submission_date", event.target.value || null)}
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-800">Dispute status</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.dispute_status || "unknown"}
            onChange={(event) => set("dispute_status", event.target.value)}
          >
            <option value="unknown">Unknown</option>
            <option value="pending">Pending</option>
            <option value="denied">Denied</option>
            <option value="partial">Partial recovery</option>
            <option value="resolved">Resolved</option>
            <option value="no_response">No response</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-800">Reported outcome</span>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={structured.reported_outcome || ""}
            onChange={(event) => set("reported_outcome", event.target.value)}
            placeholder="e.g., unresolved, denied - no refund, full refund"
          />
        </label>

        <TriStateSelect label="Impact on essential expenses (housing, medical, utilities)?" value={structured.essential_expense_impact} onChange={(v) => set("essential_expense_impact", v)} />
        <TriStateSelect label="Is the payment still pending?" value={structured.payment_pending} onChange={(v) => set("payment_pending", v)} />
      </div>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-slate-800">Optional narrative</span>
        <textarea
          rows={8}
          maxLength={8000}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={narrative}
          onChange={(event) => onNarrativeChange(event.target.value)}
          placeholder="Describe what happened in your own words. Do not include passwords, PINs, SSNs, or full account/card numbers."
        />
        <span className="mt-1 block text-xs text-slate-500">{narrative.length}/8000 characters</span>
      </label>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
          Back
        </button>
        <button type="button" onClick={onNext} className="rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-card">
          Continue to privacy redaction
        </button>
      </div>
    </div>
  );
}
