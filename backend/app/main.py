"""FinGuard-AI FastAPI application entry point."""

from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from .api import analyze, contact, dashboard, feedback, letters, meta, reports, rules
from .config import get_settings
from .security.headers import SecurityHeadersMiddleware
from .security.limits import BodySizeLimitMiddleware

settings = get_settings()

# Raw narrative text must never reach application logs. Uvicorn access logs
# are left at INFO (method/path/status only); application loggers are
# configured to log structured, non-sensitive fields only.
logger = logging.getLogger("finguard_ai")
logger.setLevel(logging.INFO)

limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"])

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_FULL_TITLE,
    version="1.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(BodySizeLimitMiddleware, max_bytes=settings.MAX_REQUEST_BODY_BYTES)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list(),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    # Return field paths and error types only -- never echo the offending
    # input value, since that could include unredacted narrative text.
    safe_errors = [{"field": ".".join(str(p) for p in e["loc"]), "type": e["type"]} for e in exc.errors()]
    return JSONResponse(status_code=422, content={"detail": "Validation failed.", "errors": safe_errors})


app.include_router(analyze.router, prefix=settings.API_V1_PREFIX)
app.include_router(contact.router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_V1_PREFIX)
app.include_router(letters.router, prefix=settings.API_V1_PREFIX)
app.include_router(reports.router, prefix=settings.API_V1_PREFIX)
app.include_router(rules.router, prefix=settings.API_V1_PREFIX)
app.include_router(feedback.router, prefix=settings.API_V1_PREFIX)
app.include_router(meta.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "project": settings.PROJECT_NAME,
        "status": "ok",
        "docs": "/api/docs",
        "note": "Research prototype API. See /api/health for a lightweight status check.",
    }
