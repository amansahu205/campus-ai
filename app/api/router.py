"""Central API router that wires together all sub-routers."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.ask import router as ask_router
from app.api.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(ask_router, prefix="/ask", tags=["ask"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
