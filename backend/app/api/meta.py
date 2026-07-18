from __future__ import annotations

from fastapi import APIRouter

from ..config import get_settings
from ..risk_engine.versioning import RULES_ENGINE_VERSION, VERSION_HISTORY
from ..schemas import HealthResponse

router = APIRouter(tags=["meta"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(status="ok", rules_engine_version=RULES_ENGINE_VERSION, environment=settings.ENVIRONMENT)


@router.get("/meta/attribution")
def attribution() -> dict[str, str]:
    settings = get_settings()
    return settings.public_attribution()


@router.get("/meta/version-history")
def version_history() -> list[dict[str, str]]:
    return VERSION_HISTORY
