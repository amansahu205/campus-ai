from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.database import check_db_connection

router = APIRouter()


@router.get(
    "/health/db",
    summary="Database connectivity health check",
    tags=["System"],
)
async def check_database(db: AsyncSession = Depends(get_db)) -> dict:
    """
    Returns DB connectivity status.
    Called by /health and can also be hit directly.
    """
    ok = await check_db_connection()
    return {
        "status": "ok" if ok else "degraded",
        "database": "connected" if ok else "unreachable",
    }
