export interface UrgencyAnswers {
  moneyLeft: boolean | null;
  paymentStatus: "pending" | "completed" | "unknown";
  credentialsShared: boolean | null;
  remoteAccess: boolean | null;
  institutionContacted: boolean | null;
  accountLocked: boolean | null;
  essentialImpact: boolean | null;
}

interface Props {
  answers: UrgencyAnswers;
  onChange: (answers: UrgencyAnswers) => void;
  onBack: () => void;
  onNext: () => void;
}

function YesNoUnknown({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}) {
  return (
    <fieldset className="rounded-xl2 border border-slate-200 bg-white p-4">
      <legend className="text-sm font-medium text-slate-800">{label}</legend>
      <div className="mt-2 flex gap-2">
        {[
          { label: "Yes", value: true },
          { label: "No", value: false },
          { label: "Not sure", value: null },
        ].map((option) => (
          <button
            type="button"
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
              value === option.value
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const URGENT_TRIGGERS = (a: UrgencyAnswers) =>
  a.moneyLeft === true && a.paymentStatus === "pending"
    ? true
    : a.credentialsShared === true || a.remoteAccess === true || a.accountLocked === true;

export function StepUrgency({ answers, onChange, onBack, onNext }: Props) {
  const showUrgentAlert = URGENT_TRIGGERS(answers);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-2xl font-semibold text-navy-900">Urgency screening</h1>
      <p className="mt-1 text-sm text-slate-600">
        These questions help identify whether time-sensitive action may be worth considering. FinGuard-AI cannot
        promise that any action will succeed.
      </p>

      {showUrgentAlert && (
        <div className="mt-4 rounded-xl2 border border-redrisk-500/50 bg-redrisk-500/10 p-4 text-sm text-slate-900" role="alert">
          <strong className="font-semibold text-redrisk-500">Time-sensitive indicators were identified.</strong>{" "}
          Consider contacting the relevant institution through an official channel and asking whether fraud
          escalation, account security, transaction recall, freeze, stop-payment, or dispute options are available.
        </div>
      )}

      <div className="mt-4 space-y-3">
        <YesNoUnknown label="Has money already left the account?" value={answers.moneyLeft} onChange={(v) => onChange({ ...answers, moneyLeft: v })} />

        <fieldset className="rounded-xl2 border border-slate-200 bg-white p-4">
          <legend className="text-sm font-medium text-slate-800">Is the payment pending or completed?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["pending", "completed", "unknown"] as const).map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => onChange({ ...answers, paymentStatus: status })}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium capitalize ${
                  answers.paymentStatus === status
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </fieldset>

        <YesNoUnknown
          label="Was a password, verification code, PIN, or authentication code shared?"
          value={answers.credentialsShared}
          onChange={(v) => onChange({ ...answers, credentialsShared: v })}
        />
        <YesNoUnknown
          label="Was remote-device access or screen sharing provided?"
          value={answers.remoteAccess}
          onChange={(v) => onChange({ ...answers, remoteAccess: v })}
        />
        <YesNoUnknown
          label="Has the bank, payment service, card issuer, or exchange already been contacted?"
          value={answers.institutionContacted}
          onChange={(v) => onChange({ ...answers, institutionContacted: v })}
        />
        <YesNoUnknown
          label="Is an account currently locked or compromised?"
          value={answers.accountLocked}
          onChange={(v) => onChange({ ...answers, accountLocked: v })}
        />
        <YesNoUnknown
          label="Is there an immediate housing, medical, utility, or essential-expense impact?"
          value={answers.essentialImpact}
          onChange={(v) => onChange({ ...answers, essentialImpact: v })}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
          Back
        </button>
        <button type="button" onClick={onNext} className="rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-card">
          Continue to case intake
        </button>
      </div>
    </div>
  );
}
