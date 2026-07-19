import { CORE_DISCLAIMER } from "@/lib/config";
import clsx from "clsx";

export function DisclaimerBanner({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div
      role="note"
      aria-label="Research prototype disclaimer"
      className={clsx(
        "flex items-start gap-3 rounded-2xl border border-amber-200 bg-white shadow-sm",
        compact ? "px-4 py-3" : "px-5 py-4 sm:px-6 sm:py-5",
        className
      )}
    >
      <span
        aria-hidden
        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-700"
      >
        !
      </span>
      <p className={clsx("leading-relaxed text-slate-700", compact ? "text-sm" : "text-sm sm:text-base")}>
        {CORE_DISCLAIMER}
      </p>
    </div>
  );
}
