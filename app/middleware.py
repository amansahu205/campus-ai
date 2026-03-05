from __future__ import annotations

import time
import uuid

try:
    import structlog
    logger = structlog.get_logger()
except ImportError:
    import logging
    logger = logging.getLogger(__name__)  # type: ignore[assignment]

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Injects a unique X-Request-ID into every request and response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


class StructlogMiddleware(BaseHTTPMiddleware):
    """Logs every request/response with timing and university context."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.perf_counter()

        # Extract university slug from path: /api/v1/{university}/...
        path_parts = request.url.path.split("/")
        university = path_parts[3] if len(path_parts) > 3 else None

        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=getattr(request.state, "request_id", None),
            method=request.method,
            path=request.url.path,
            university=university,
        )

        response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 2)

        logger.info(
            "http.request",
            status_code=response.status_code,
            duration_ms=duration_ms,
        )
        return response
