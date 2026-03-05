from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

try:
    import sentry_sdk
    _SENTRY_AVAILABLE = True
except ImportError:
    _SENTRY_AVAILABLE = False
import structlog
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.api.v1.router import api_router
from app.config import settings
from app.database import close_db, create_db_and_tables
from app.middleware import RequestIDMiddleware, StructlogMiddleware
from app.schemas.base import ErrorBody, ErrorResponse

logger = structlog.get_logger()


# ── Sentry (initialise before app creation) ───────────────────────────────────
if _SENTRY_AVAILABLE and settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=0.2,
        environment=settings.APP_ENV,
    )


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # ── Startup ──────────────────────────────────────────────────────────────
    logger.info("uip.startup", env=settings.APP_ENV, debug=settings.DEBUG)
    await create_db_and_tables()
    logger.info("uip.db.connected")
    yield
    # ── Shutdown ─────────────────────────────────────────────────────────────
    await close_db()
    logger.info("uip.shutdown")


# ── App factory ───────────────────────────────────────────────────────────────
def create_app() -> FastAPI:
    app = FastAPI(
        title="University Intelligence Platform API",
        description=(
            "Real-time campus intelligence for UMD and University of Michigan. "
            "Dining, events, athletics, nightlife, news, and AI-powered Q&A."
        ),
        version="1.0.0",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # ── Middleware (applied bottom-up — last added = outermost) ──────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=False,          # No cookies — public anonymous API
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "X-Request-ID"],
    )
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )
    app.add_middleware(StructlogMiddleware)
    app.add_middleware(RequestIDMiddleware)

    # ── Global exception handlers ─────────────────────────────────────────────
    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=ErrorResponse(
                error=ErrorBody(code="BAD_REQUEST", message=str(exc))
            ).model_dump(),
        )

    @app.exception_handler(LookupError)
    async def lookup_error_handler(request: Request, exc: LookupError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(
                error=ErrorBody(code="NOT_FOUND", message=str(exc))
            ).model_dump(),
        )

    @app.exception_handler(PermissionError)
    async def permission_error_handler(request: Request, exc: PermissionError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content=ErrorResponse(
                error=ErrorBody(code="FORBIDDEN", message=str(exc))
            ).model_dump(),
        )

    @app.exception_handler(ValidationError)
    async def pydantic_validation_handler(
        request: Request, exc: ValidationError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=ErrorResponse(
                error=ErrorBody(
                    code="VALIDATION_ERROR",
                    message="Request validation failed",
                    details=[
                        {"field": ".".join(str(loc) for loc in e["loc"]), "message": e["msg"]}
                        for e in exc.errors()
                    ],
                )
            ).model_dump(),
        )

    # ── Routers ───────────────────────────────────────────────────────────────
    app.include_router(api_router, prefix="/api/v1")

    # ── Infra health check (no prefix — checked by Railway/Fly) ──────────────
    @app.get("/health", include_in_schema=False, tags=["System"])
    async def health() -> dict:
        return {"status": "ok", "version": "1.0.0", "env": settings.APP_ENV}

    return app


app = create_app()
