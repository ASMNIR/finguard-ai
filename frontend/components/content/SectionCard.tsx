import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

const ACCENTS = {
  teal: "bg-teal-50 text-teal-700",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
  navy: "bg-slate-100 text-navy-900",
} as const;

export type Accent = keyof typeof ACCENTS;

/** Cycles through the accent set so a long page of sections reads with visual
 *  variety without any per-page bookkeeping. */
const ACCENT_ORDER: Accent[] = ["teal", "violet", "amber", "blue", "emerald", "rose", "navy"];
export function accentFor(index: number): Accent {
  return ACCENT_ORDER[index % ACCENT_ORDER.length] ?? "teal";
}

export function SectionCard({
  icon,
  accent = "teal",
  title,
  children,
  id,
}: {
  icon: IconName;
  accent?: Accent;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-4px_rgba(16,24,40,0.08)] sm:p-8">
      <div className="flex items-start gap-4">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${ACCENTS[accent]}`} aria-hidden>
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-navy-900 sm:text-xl">{title}</h2>
          <div className="prose-content mt-2 max-w-none [&>p:first-child]:mt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
