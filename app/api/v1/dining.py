from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_university

router = APIRouter()


@router.get(
    "",
    summary="Get all dining halls with current status, hours, and menu",
)
async def get_dining_current(
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
    open_only: bool = Query(False, description="Filter to open halls only"),
) -> dict:
    """
    Returns all dining halls with is_open calculated at query time.
    is_open is NEVER stored — always computed from schedule + real-time status.

    TODO (Phase 3): implement DiningService.get_current()
    """
    return {
        "university": university,
        "data": [],
        "message": "Dining endpoint stub — implementation coming in Phase 3",
    }


@router.get(
    "/{hall_id}",
    summary="Get a single dining hall with full menu detail",
)
async def get_dining_hall(
    hall_id: str,
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Returns one dining hall by ID.
    TODO (Phase 3): implement DiningService.get_hall_detail()
    """
    return {
        "university": university,
        "hall_id": hall_id,
        "message": "Dining hall detail stub — implementation coming in Phase 3",
    }
