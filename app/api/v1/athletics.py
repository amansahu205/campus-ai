from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_university

router = APIRouter()


@router.get(
    "",
    summary="Get athletics schedule and scores",
)
async def get_athletics(
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Returns schedule + live scores.
    TODO (Phase 5): implement AthleticsService.get_schedule()
    """
    return {
        "university": university,
        "data": [],
        "message": "Athletics endpoint stub — implementation coming in Phase 5",
    }


@router.get(
    "/live",
    summary="Get currently active games (live scores only)",
)
async def get_live_scores(
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Returns only games where is_live = true.
    TODO (Phase 5): implement AthleticsService.get_live_scores()
    """
    return {
        "university": university,
        "data": [],
        "message": "Live scores stub — implementation coming in Phase 5",
    }
