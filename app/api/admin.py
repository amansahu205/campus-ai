"""Admin dashboard API: pipeline health monitoring and dedup review queue."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func

from app.core.database import get_session
from app.models.admin import PipelineRun, PipelineStatus
from app.models.content import ContentItem, ContentStatus, DuplicateEvent

router = APIRouter()


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------


class PipelineRunSummary(BaseModel):
    id: UUID
    flow_name: str
    university: str
    domain: str
    status: PipelineStatus
    items_scraped: int
    items_written: int
    items_synced: int
    duration_seconds: float | None
    started_at: datetime
    finished_at: datetime | None


class PipelineHealthResponse(BaseModel):
    total_runs: int
    success_rate: float
    recent_runs: list[PipelineRunSummary]


class DuplicateEventSummary(BaseModel):
    id: UUID
    incoming_hash: str
    existing_item_id: UUID
    university: str
    domain: str
    detected_at: datetime
    reviewed: bool
    review_note: str | None


class ReviewDecision(BaseModel):
    reviewed: bool = True
    review_note: str | None = None


class ContentStats(BaseModel):
    university: str
    domain: str
    total: int
    pending: int
    structured: int
    validated: int
    synced: int
    rejected: int


# ---------------------------------------------------------------------------
# Pipeline health
# ---------------------------------------------------------------------------


@router.get("/pipeline/health", response_model=PipelineHealthResponse)
async def get_pipeline_health(
    university: str | None = Query(default=None),
    domain: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_session),
) -> PipelineHealthResponse:
    """Return pipeline health summary and recent runs."""
    query = select(PipelineRun).order_by(PipelineRun.started_at.desc())
    if university:
        query = query.where(PipelineRun.university == university)
    if domain:
        query = query.where(PipelineRun.domain == domain)

    result = await db.execute(query)
    all_runs = result.scalars().all()

    total = len(all_runs)
    successful = sum(1 for r in all_runs if r.status == PipelineStatus.SUCCESS)
    success_rate = (successful / total) if total > 0 else 0.0

    recent = all_runs[:limit]
    summaries = [
        PipelineRunSummary(
            id=r.id,
            flow_name=r.flow_name,
            university=r.university,
            domain=r.domain,
            status=r.status,
            items_scraped=r.items_scraped,
            items_written=r.items_written,
            items_synced=r.items_synced,
            duration_seconds=r.duration_seconds,
            started_at=r.started_at,
            finished_at=r.finished_at,
        )
        for r in recent
    ]

    return PipelineHealthResponse(
        total_runs=total,
        success_rate=round(success_rate, 4),
        recent_runs=summaries,
    )


@router.get("/pipeline/runs/{run_id}", response_model=PipelineRunSummary)
async def get_pipeline_run(
    run_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> PipelineRunSummary:
    """Get details of a specific pipeline run."""
    result = await db.execute(select(PipelineRun).where(PipelineRun.id == run_id))
    run = result.scalar_one_or_none()
    if run is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    return PipelineRunSummary(
        id=run.id,
        flow_name=run.flow_name,
        university=run.university,
        domain=run.domain,
        status=run.status,
        items_scraped=run.items_scraped,
        items_written=run.items_written,
        items_synced=run.items_synced,
        duration_seconds=run.duration_seconds,
        started_at=run.started_at,
        finished_at=run.finished_at,
    )


# ---------------------------------------------------------------------------
# Dedup review queue
# ---------------------------------------------------------------------------


@router.get("/dedup/queue", response_model=list[DuplicateEventSummary])
async def get_dedup_queue(
    university: str | None = Query(default=None),
    domain: str | None = Query(default=None),
    reviewed: bool | None = Query(default=False),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncSession = Depends(get_session),
) -> list[DuplicateEventSummary]:
    """Return duplicate events awaiting review."""
    query = (
        select(DuplicateEvent)
        .order_by(DuplicateEvent.detected_at.desc())
        .limit(limit)
    )
    if university:
        query = query.where(DuplicateEvent.university == university)
    if domain:
        query = query.where(DuplicateEvent.domain == domain)
    if reviewed is not None:
        query = query.where(DuplicateEvent.reviewed == reviewed)

    result = await db.execute(query)
    events = result.scalars().all()

    return [
        DuplicateEventSummary(
            id=e.id,
            incoming_hash=e.incoming_hash,
            existing_item_id=e.existing_item_id,
            university=str(e.university),
            domain=str(e.domain),
            detected_at=e.detected_at,
            reviewed=e.reviewed,
            review_note=e.review_note,
        )
        for e in events
    ]


@router.patch("/dedup/{event_id}/review", response_model=DuplicateEventSummary)
async def review_duplicate_event(
    event_id: UUID,
    decision: ReviewDecision,
    db: AsyncSession = Depends(get_session),
) -> DuplicateEventSummary:
    """Mark a duplicate event as reviewed."""
    result = await db.execute(
        select(DuplicateEvent).where(DuplicateEvent.id == event_id)
    )
    event = result.scalar_one_or_none()
    if event is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    event.reviewed = decision.reviewed
    event.review_note = decision.review_note
    db.add(event)
    await db.flush()

    return DuplicateEventSummary(
        id=event.id,
        incoming_hash=event.incoming_hash,
        existing_item_id=event.existing_item_id,
        university=str(event.university),
        domain=str(event.domain),
        detected_at=event.detected_at,
        reviewed=event.reviewed,
        review_note=event.review_note,
    )


# ---------------------------------------------------------------------------
# Content stats
# ---------------------------------------------------------------------------


@router.get("/content/stats", response_model=list[ContentStats])
async def get_content_stats(
    db: AsyncSession = Depends(get_session),
) -> list[ContentStats]:
    """Return content item counts grouped by university, domain, and status."""
    result = await db.execute(
        select(
            ContentItem.university,
            ContentItem.domain,
            ContentItem.status,
            func.count(ContentItem.id).label("cnt"),
        ).group_by(ContentItem.university, ContentItem.domain, ContentItem.status)
    )
    rows = result.all()

    # Aggregate into per-(university, domain) buckets
    buckets: dict[tuple, dict] = {}
    for university, domain, status_val, cnt in rows:
        key = (str(university), str(domain))
        if key not in buckets:
            buckets[key] = {
                "university": str(university),
                "domain": str(domain),
                "total": 0,
                "pending": 0,
                "structured": 0,
                "validated": 0,
                "synced": 0,
                "rejected": 0,
            }
        buckets[key]["total"] += cnt
        status_key = str(status_val)
        if status_key in buckets[key]:
            buckets[key][status_key] += cnt

    return [ContentStats(**v) for v in buckets.values()]
