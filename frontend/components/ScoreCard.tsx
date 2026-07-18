import { SeverityBadge } from "./SeverityBadge";

interface ScoreCardProps {
  label: string;
  score: number;
  band: "Low" | "Moderate" | "High" | "Critical";
  explanation: string;
}

const BAR_COLOR: Record<string, string> = {
  Low: "bg-emerald-500",
  Moderate: "bg-amber-500",
  High: "bg-orange-500",
  Critical: "bg-redrisk-500",
};

export function ScoreCard({ label, score, band, explanation }: ScoreCardProps) {
  return (
    <div className="rounded-xl2 border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-sm font-semibold text-slate-600">{label}</h3>
        <SeverityBadge severity={band} />
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold text-navy-900">
        {score}
        <span className="text-base font-normal text-slate-500">/100</span>
      </p>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200"
        role="img"
        aria-label={`${label} score bar: ${score} out of 100, band ${band}`}
      >
        <div className={`h-full ${BAR_COLOR[band]}`} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-600">{explanation}</p>
    </div>
  );
}
