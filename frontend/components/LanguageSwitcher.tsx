"use client";

import { LOCALES, type Locale } from "@/lib/i18n/dictionaries";

export function LanguageSwitcher({ value, onChange }: { value: Locale; onChange: (locale: Locale) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
      <span className="sr-only">Language</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Locale)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
        aria-label="Select language"
      >
        {LOCALES.map((locale) => (
          <option key={locale.code} value={locale.code}>{locale.label}</option>
        ))}
      </select>
    </label>
  );
}
