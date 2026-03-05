"""FastAPI application entry point."""

from __future__ import annotations

import structlog
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import init_db
from app.core.redis import close_redis

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncGenerator[None, None]:
    """Startup / shutdown lifecycle events."""
    settings = get_settings()
    logger.info("Starting Campus AI API", environment=settings.environment)
    await init_db()
    yield
    await close_redis()
    logger.info("Campus AI API shutdown complete")


def create_app() -> FastAPI:
    settings = get_settings()

    application = FastAPI(
        title="Campus AI – University Intelligence Platform",
        description=(
            "RAG-powered campus intelligence for UMD and University of Michigan. "
            "Domains: dining, events, athletics, news, nightlife."
        ),
        version="0.1.0",
        debug=settings.debug,
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if settings.environment == "development" else [],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix="/api/v1")

    @application.get("/health", tags=["health"])
    async def health_check() -> dict:
        return {"status": "ok", "environment": settings.environment}

    return application


app = create_app()
