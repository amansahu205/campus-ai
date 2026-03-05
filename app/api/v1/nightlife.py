from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_university

router = APIRouter()


@router.get(
    "",
    summary="Get nightlife venue events",
)
async def get_nightlife(
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
    event_date: date | None = Query(None, alias="date", description="Filter by date (YYYY-MM-DD)"),
) -> dict:
    """
    Returns venue events for the given date (defaults to today).
    TODO (Phase 6): implement NightlifeService.get_venue_events()
    """
    return {
        "university": university,
        "data": [],
        "message": "Nightlife endpoint stub — full design deferred to v1.1 sprint",
    }
