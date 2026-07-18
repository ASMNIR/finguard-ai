import { ReactNode } from "react";
import clsx from "clsx";

const STEP_LABELS = ["Safety", "Urgency", "Intake", "Redaction", "Results"];

export function WizardShell({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div>
      <ol className="flex flex-wrap gap-2 text-xs font-semibold" aria-label="Guided case-analysis steps">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === step;
          const isDone = stepNumber < step;
          return (
            <li key={label}>
              <span
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
                  isActive && "border-teal-700 bg-teal-700 text-white",
                  isDone && !isActive && "border-emerald-500/50 bg-emerald-500/10 text-emerald-700",
                  !isActive && !isDone && "border-slate-200 bg-white text-slate-500"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? "✓" : stepNumber}. {label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-6">{children}</div>
    </div>
  );
}
