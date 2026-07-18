import { CORE_DISCLAIMER } from "@/lib/config";
import clsx from "clsx";

export function DisclaimerBanner({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div
      role="note"
      aria-label="Research prototype disclaimer"
      className={clsx(
        "rounded-xl border border-amber-500/40 bg-amber-500/10 text-slate-900",
        compact ? "px-4 py-3 text-sm" : "px-5 py-4 text-sm sm:text-base",
        className
      )}
    >
      <p>
        <strong className="font-heading font-semibold text-navy-900">Research Prototype.</strong>{" "}
        {CORE_DISCLAIMER}
      </p>
    </div>
  );
}
