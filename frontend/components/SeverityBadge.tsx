import clsx from "clsx";

type Severity = "Low" | "Moderate" | "High" | "Critical";

const SEVERITY_META: Record<Severity, { classes: string; icon: string; description: string }> = {
  Low: {
    classes: "bg-emerald-500/10 text-emerald-700 border-emerald-500/40",
    icon: "●",
    description: "Low: limited indicators identified in this dimension.",
  },
  Moderate: {
    classes: "bg-amber-500/10 text-amber-700 border-amber-500/40",
    icon: "▲",
    description: "Moderate: some indicators identified; review is suggested.",
  },
  High: {
    classes: "bg-orange-500/10 text-orange-700 border-orange-500/40",
    icon: "■",
    description: "High: multiple indicators identified; manual review is recommended.",
  },
  Critical: {
    classes: "bg-redrisk-500/10 text-redrisk-500 border-redrisk-500/40",
    icon: "★",
    description: "Critical: strong indicators identified; prompt manual review is recommended.",
  },
};

export function SeverityBadge({ severity, showDescription = false }: { severity: Severity; showDescription?: boolean }) {
  const meta = SEVERITY_META[severity];
  return (
    <span className="inline-flex flex-col gap-1">
      <span
        className={clsx(
          "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
          meta.classes
        )}
      >
        <span aria-hidden>{meta.icon}</span>
        {severity}
      </span>
      {showDescription && <span className="text-xs text-slate-600">{meta.description}</span>}
    </span>
  );
}
