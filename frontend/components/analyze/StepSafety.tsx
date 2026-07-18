import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

interface Props {
  acknowledged: boolean;
  onAcknowledgedChange: (value: boolean) => void;
  onNext: () => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function StepSafety({ acknowledged, onAcknowledgedChange, onNext, locale, onLocaleChange }: Props) {
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-navy-900">{dict.safety.title}</h1>
        <LanguageSwitcher value={locale} onChange={onLocaleChange} />
      </div>
      {locale !== "en" && (
        <p className="mt-2 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">
          This step is available in {locale === "es" ? "Spanish" : "Bengali"}. The rest of the guided workflow is
          currently English-only; full multilingual coverage is documented as roadmap work in docs/multilingual.md.
        </p>
      )}

      <div className="mt-4 rounded-xl2 border border-redrisk-500/40 bg-redrisk-500/5 p-5">
        <p className="text-sm font-semibold text-redrisk-500">{dict.safety.sensitiveWarningTitle}</p>
        <p className="mt-1 text-sm text-slate-700">{dict.safety.sensitiveWarningBody}</p>
      </div>

      <div className="mt-4 rounded-xl2 border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-base font-semibold text-navy-900">How this works</h2>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          <li>Analysis is anonymous by default: no account is required, and raw narrative text is not stored by default.</li>
          <li>Automatic redaction runs on your narrative before analysis, and you will see the sanitized version before continuing.</li>
          <li>
            The rules engine is deterministic and explainable — see the{" "}
            <a href="/privacy" className="underline">Privacy page</a> for full details.
          </li>
        </ul>
      </div>

      <div className="mt-4 rounded-xl2 border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-slate-800">
        <strong className="font-semibold text-navy-900">{dict.safety.notEmergencyTitle}</strong> {dict.safety.notEmergencyBody}
      </div>

      <div className="mt-5">
        <DisclaimerBanner compact />
      </div>

      <label className="mt-6 flex items-start gap-3 rounded-xl2 border border-slate-200 bg-white p-4">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => onAcknowledgedChange(event.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
        />
        <span className="text-sm text-slate-800">{dict.safety.acknowledgement}</span>
      </label>

      <button
        type="button"
        disabled={!acknowledged}
        onClick={onNext}
        className="mt-6 w-full rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {dict.safety.continueButton}
      </button>
    </div>
  );
}
