from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_university

router = APIRouter()


@router.get(
    "",
    summary="Get events with optional date, category, and source filters",
)
async def get_events(
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
    event_date: date | None = Query(None, alias="date", description="Filter by date (YYYY-MM-DD)"),
    category: str | None = Query(None, description="e.g. 'sports', 'academic', 'social'"),
    source: str | None = Query(None, description="Source slug, e.g. 'umd-events'"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    """
    Returns CONFIRMED events only — PENDING (in human review queue) are hidden.
    TODO (Phase 4): implement EventsService.get_events()
    """
    return {
        "university": university,
        "data": [],
        "message": "Events endpoint stub — implementation coming in Phase 4",
    }


@router.get(
    "/{event_id}",
    summary="Get a single event by ID",
)
async def get_event(
    event_id: str,
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    TODO (Phase 4): implement EventsService.get_event()
    """
    return {
        "university": university,
        "event_id": event_id,
        "message": "Event detail stub — implementation coming in Phase 4",
    }
