from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_university

router = APIRouter()


@router.get(
    "",
    summary="Get news articles",
)
async def get_news(
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
    category: str | None = Query(None, description="Article category filter"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    """
    Returns articles from official university newsroom.
    TODO (Phase 5): implement NewsService.get_articles()
    """
    return {
        "university": university,
        "data": [],
        "message": "News endpoint stub — implementation coming in Phase 5",
    }
