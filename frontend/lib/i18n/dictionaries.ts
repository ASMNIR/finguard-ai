/**
 * Multilingual scaffolding (English complete; Spanish and Bengali cover the
 * safety/navigation surface as a proof of architecture). See
 * docs/multilingual.md — full site-wide translation is roadmap work, not a
 * completed feature, and the classification rules engine remains
 * English-phrase-based only: translated narratives are analyzed against the
 * English rule set until language-specific, independently reviewed phrase
 * rules exist. Do not treat auto-translated text as equivalent to a
 * validated rule match.
 */

export type Locale = "en" | "es" | "bn";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "bn", label: "বাংলা" },
];

export interface Dictionary {
  nav: {
    analyze: string;
    dashboard: string;
    methodology: string;
    research: string;
    governance: string;
    about: string;
    contact: string;
  };
  safety: {
    title: string;
    sensitiveWarningTitle: string;
    sensitiveWarningBody: string;
    notEmergencyTitle: string;
    notEmergencyBody: string;
    acknowledgement: string;
    continueButton: string;
  };
  common: {
    back: string;
    continueLabel: string;
    languageLabel: string;
  };
}

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    nav: {
      analyze: "Analyze a Case",
      dashboard: "Dashboard",
      methodology: "Methodology",
      research: "Research",
      governance: "Governance",
      about: "About",
      contact: "Contact",
    },
    safety: {
      title: "Before you begin: safety & privacy",
      sensitiveWarningTitle: "Do not enter highly sensitive information",
      sensitiveWarningBody:
        "Do not enter passwords, PINs, Social Security numbers, full bank-account numbers, full payment-card numbers, routing numbers, private authentication codes, or other highly sensitive information.",
      notEmergencyTitle: "Not an emergency service.",
      notEmergencyBody:
        "FinGuard-AI is not an emergency service. If an account may be actively compromised, contact the relevant financial institution through an official channel immediately.",
      acknowledgement:
        "I understand this is a research prototype, I will not enter highly sensitive information, and I understand FinGuard-AI is not an emergency service.",
      continueButton: "Continue to urgency screening",
    },
    common: { back: "Back", continueLabel: "Continue", languageLabel: "Language" },
  },
  es: {
    nav: {
      analyze: "Analizar un caso",
      dashboard: "Panel",
      methodology: "Metodología",
      research: "Investigación",
      governance: "Gobernanza",
      about: "Acerca de",
      contact: "Contacto",
    },
    safety: {
      title: "Antes de comenzar: seguridad y privacidad",
      sensitiveWarningTitle: "No ingrese información altamente confidencial",
      sensitiveWarningBody:
        "No ingrese contraseñas, PIN, números de seguro social, números de cuenta bancaria completos, números de tarjeta de pago completos, números de ruta bancaria ni otros datos altamente confidenciales.",
      notEmergencyTitle: "No es un servicio de emergencia.",
      notEmergencyBody:
        "FinGuard-AI no es un servicio de emergencia. Si una cuenta puede estar comprometida activamente, comuníquese de inmediato con la institución financiera correspondiente por un canal oficial.",
      acknowledgement:
        "Entiendo que esto es un prototipo de investigación, no ingresaré información altamente confidencial y entiendo que FinGuard-AI no es un servicio de emergencia.",
      continueButton: "Continuar a la evaluación de urgencia",
    },
    common: { back: "Atrás", continueLabel: "Continuar", languageLabel: "Idioma" },
  },
  bn: {
    nav: {
      analyze: "একটি কেস বিশ্লেষণ করুন",
      dashboard: "ড্যাশবোর্ড",
      methodology: "পদ্ধতি",
      research: "গবেষণা",
      governance: "শাসন",
      about: "সম্পর্কে",
      contact: "যোগাযোগ",
    },
    safety: {
      title: "শুরু করার আগে: নিরাপত্তা ও গোপনীয়তা",
      sensitiveWarningTitle: "অত্যন্ত সংবেদনশীল তথ্য প্রবেশ করাবেন না",
      sensitiveWarningBody:
        "পাসওয়ার্ড, পিন, সোশ্যাল সিকিউরিটি নম্বর, সম্পূর্ণ ব্যাংক অ্যাকাউন্ট নম্বর, সম্পূর্ণ পেমেন্ট কার্ড নম্বর, রাউটিং নম্বর, বা অন্যান্য অত্যন্ত সংবেদনশীল তথ্য প্রবেশ করাবেন না।",
      notEmergencyTitle: "জরুরি পরিষেবা নয়।",
      notEmergencyBody:
        "FinGuard-AI একটি জরুরি পরিষেবা নয়। যদি কোনো অ্যাকাউন্ট সক্রিয়ভাবে আপস করা হতে পারে, অবিলম্বে সংশ্লিষ্ট আর্থিক প্রতিষ্ঠানের সাথে একটি অফিসিয়াল চ্যানেলের মাধ্যমে যোগাযোগ করুন।",
      acknowledgement:
        "আমি বুঝি এটি একটি গবেষণা প্রোটোটাইপ, আমি অত্যন্ত সংবেদনশীল তথ্য প্রবেশ করাব না, এবং আমি বুঝি FinGuard-AI জরুরি পরিষেবা নয়।",
      continueButton: "জরুরি স্ক্রিনিং চালিয়ে যান",
    },
    common: { back: "পেছনে", continueLabel: "চালিয়ে যান", languageLabel: "ভাষা" },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES.en;
}
