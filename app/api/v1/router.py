from __future__ import annotations

from fastapi import APIRouter

from app.api.v1 import ask, athletics, dining, events, news, nightlife
from app.api.v1 import health as health_router

api_router = APIRouter()

# ── System ────────────────────────────────────────────────────────────────────
api_router.include_router(health_router.router, tags=["System"])

# ── Public domain routes ──────────────────────────────────────────────────────
api_router.include_router(
    dining.router, prefix="/{university}/dining", tags=["Dining"]
)
api_router.include_router(
    events.router, prefix="/{university}/events", tags=["Events"]
)
api_router.include_router(
    athletics.router, prefix="/{university}/athletics", tags=["Athletics"]
)
api_router.include_router(
    nightlife.router, prefix="/{university}/nightlife", tags=["Nightlife"]
)
api_router.include_router(
    news.router, prefix="/{university}/news", tags=["News"]
)
api_router.include_router(
    ask.router, prefix="/{university}/ask", tags=["Q&A"]
)
