"""Request body size limiting.

Rejects oversized request bodies before they reach any handler, which caps
narrative length abuse and general request-flooding cost. Combined with the
per-field `max_length` constraints in schemas.py.
"""

from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class BodySizeLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_bytes: int) -> None:
        super().__init__(app)
        self.max_bytes = max_bytes

    async def dispatch(self, request: Request, call_next) -> Response:  # type: ignore[override]
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > self.max_bytes:
                    return JSONResponse(
                        status_code=413,
                        content={"detail": "Request body exceeds the maximum accepted size."},
                    )
            except ValueError:
                pass
        return await call_next(request)
