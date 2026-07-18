export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const PROJECT_NAME = "FinGuard-AI";
export const PROJECT_FULL_TITLE =
  "FinGuard-AI: U.S. Financial Fraud and Consumer Harm Risk Intelligence and Consumer Assistance Platform";

export interface Attribution {
  authorName?: string;
  authorRole?: string;
  authorAffiliation?: string;
  authorOrcid?: string;
  authorLinkedin?: string;
  authorGithub?: string;
  authorGoogleScholar?: string;
  authorSsrn?: string;
  authorZenodo?: string;
  researchPaperUrl?: string;
  liveAppUrl?: string;
  contactEmail?: string;
}

function nonEmpty(value: string | undefined): string | undefined {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

/** Only non-empty fields are returned; the UI must never render placeholder/empty attribution fields. */
export function getAttribution(): Attribution {
  return {
    authorName: nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_NAME) ?? "A S M FAHIM",
    authorRole:
      nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_ROLE) ?? "Founder, Independent Researcher, and System Designer",
    authorAffiliation: nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_AFFILIATION) ?? "Independent Researcher",
    authorOrcid: nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_ORCID),
    authorLinkedin: nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN),
    authorGithub: nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_GITHUB),
    authorGoogleScholar: nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_GOOGLE_SCHOLAR),
    authorSsrn: nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_SSRN),
    authorZenodo: nonEmpty(process.env.NEXT_PUBLIC_AUTHOR_ZENODO),
    researchPaperUrl: nonEmpty(process.env.NEXT_PUBLIC_RESEARCH_PAPER_URL),
    liveAppUrl: nonEmpty(process.env.NEXT_PUBLIC_LIVE_APP_URL),
    contactEmail: nonEmpty(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  };
}

export const CORE_DISCLAIMER =
  "Research Prototype — FinGuard-AI provides informational, explainable risk indicators and consumer-assistance guidance. It is not a bank, law firm, government agency, emergency service, fraud adjudication system, or automated eligibility determination.";

export const DISCLAIMER_POINTS = [
  "FinGuard-AI does not confirm that fraud occurred.",
  "FinGuard-AI does not determine legal rights.",
  "FinGuard-AI does not guarantee reimbursement or recovery.",
  "FinGuard-AI does not submit official complaints or reports for users.",
  "FinGuard-AI does not replace a financial institution, attorney, law-enforcement agency, regulator, compliance professional, or qualified human reviewer.",
  "FinGuard-AI does not perform official AML, sanctions, or suspicious activity reporting.",
  "FinGuard-AI is not production-ready unless future validation and security reviews establish otherwise.",
];
