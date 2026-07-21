"""Centralized, editable configuration.

Author-attribution fields are intentionally kept here so they can be edited
in one place. Empty string fields are treated as "not configured" and must
not be rendered publicly (frontend and PDF templates both filter these out).
"""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api"

    # CORS: comma-separated list of allowed origins.
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Request limits (privacy + abuse protection).
    MAX_NARRATIVE_CHARS: int = 8000
    MAX_REQUEST_BODY_BYTES: int = 262_144  # 256 KB
    RATE_LIMIT_PER_MINUTE: int = 30

    # Author / project attribution (see project spec: "centralized editable
    # configuration variables"). Leave blank to hide a field publicly.
    AUTHOR_NAME: str = "A S M FAHIM"
    AUTHOR_ROLE: str = "Founder, Independent Researcher, and System Designer"
    AUTHOR_EMAIL: str = ""
    AUTHOR_LOCATION: str = ""
    AUTHOR_AFFILIATION: str = "Independent Researcher"
    AUTHOR_ORCID: str = ""
    AUTHOR_LINKEDIN: str = ""
    AUTHOR_GITHUB: str = ""
    AUTHOR_GOOGLE_SCHOLAR: str = ""
    AUTHOR_SSRN: str = ""
    AUTHOR_ZENODO: str = ""
    RESEARCH_PAPER_URL: str = ""
    LIVE_APP_URL: str = ""
    CONTACT_EMAIL: str = "asmfahim987@gmail.com"

    # Contact-form delivery. Leave RESEND_API_KEY unset to keep the form's
    # current "received but not stored" behavior with no outbound email.
    RESEND_API_KEY: str = ""

    PROJECT_NAME: str = "FinGuard-AI"
    PROJECT_FULL_TITLE: str = (
        "FinGuard-AI: U.S. Financial Fraud and Consumer Harm Risk Intelligence "
        "and Consumer Assistance Platform"
    )

    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    def public_attribution(self) -> dict[str, str]:
        """Return only the non-empty attribution fields, for public rendering."""
        fields = {
            "author_name": self.AUTHOR_NAME,
            "author_role": self.AUTHOR_ROLE,
            "author_email": self.AUTHOR_EMAIL,
            "author_location": self.AUTHOR_LOCATION,
            "author_affiliation": self.AUTHOR_AFFILIATION,
            "author_orcid": self.AUTHOR_ORCID,
            "author_linkedin": self.AUTHOR_LINKEDIN,
            "author_github": self.AUTHOR_GITHUB,
            "author_google_scholar": self.AUTHOR_GOOGLE_SCHOLAR,
            "author_ssrn": self.AUTHOR_SSRN,
            "author_zenodo": self.AUTHOR_ZENODO,
            "research_paper_url": self.RESEARCH_PAPER_URL,
            "live_app_url": self.LIVE_APP_URL,
            "contact_email": self.CONTACT_EMAIL,
        }
        return {key: value for key, value in fields.items() if value}


@lru_cache
def get_settings() -> Settings:
    return Settings()
