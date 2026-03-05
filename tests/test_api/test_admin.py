"""Tests for the /api/v1/admin endpoints."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin import PipelineRun, PipelineStatus
from app.models.content import ContentItem, ContentStatus, Domain, DuplicateEvent, University


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


async def _create_pipeline_run(
    session: AsyncSession,
    status: PipelineStatus = PipelineStatus.SUCCESS,
    university: str = "umd",
    domain: str = "dining",
) -> PipelineRun:
    run = PipelineRun(
        flow_name=f"{university}-{domain}",
        university=university,
        domain=domain,
        status=status,
        items_scraped=10,
        items_written=8,
        items_synced=8,
        started_at=datetime.now(timezone.utc),
        finished_at=datetime.now(timezone.utc),
    )
    session.add(run)
    await session.commit()
    await session.refresh(run)
    return run


async def _create_duplicate_event(
    session: AsyncSession,
    reviewed: bool = False,
) -> DuplicateEvent:
    existing_id = uuid4()
    event = DuplicateEvent(
        incoming_hash="abc123",
        existing_item_id=existing_id,
        university=University.UMD,
        domain=Domain.DINING,
        reviewed=reviewed,
    )
    session.add(event)
    await session.commit()
    await session.refresh(event)
    return event


# ---------------------------------------------------------------------------
# Pipeline health tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_pipeline_health_empty(async_client: AsyncClient) -> None:
    response = await async_client.get("/api/v1/admin/pipeline/health")
    assert response.status_code == 200
    data = response.json()
    assert data["total_runs"] == 0
    assert data["success_rate"] == 0.0
    assert data["recent_runs"] == []


@pytest.mark.asyncio
async def test_pipeline_health_with_runs(
    async_client: AsyncClient,
    test_session: AsyncSession,
) -> None:
    await _create_pipeline_run(test_session, PipelineStatus.SUCCESS)
    await _create_pipeline_run(test_session, PipelineStatus.FAILED)

    response = await async_client.get("/api/v1/admin/pipeline/health")
    assert response.status_code == 200
    data = response.json()
    assert data["total_runs"] == 2
    assert data["success_rate"] == 0.5
    assert len(data["recent_runs"]) == 2


@pytest.mark.asyncio
async def test_get_pipeline_run_not_found(async_client: AsyncClient) -> None:
    response = await async_client.get(f"/api/v1/admin/pipeline/runs/{uuid4()}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_pipeline_run_found(
    async_client: AsyncClient,
    test_session: AsyncSession,
) -> None:
    run = await _create_pipeline_run(test_session)
    response = await async_client.get(f"/api/v1/admin/pipeline/runs/{run.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(run.id)
    assert data["status"] == "success"


# ---------------------------------------------------------------------------
# Dedup queue tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_dedup_queue_empty(async_client: AsyncClient) -> None:
    response = await async_client.get("/api/v1/admin/dedup/queue")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_dedup_queue_returns_unreviewed(
    async_client: AsyncClient,
    test_session: AsyncSession,
) -> None:
    await _create_duplicate_event(test_session, reviewed=False)
    await _create_duplicate_event(test_session, reviewed=True)

    response = await async_client.get("/api/v1/admin/dedup/queue?reviewed=false")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["reviewed"] is False


@pytest.mark.asyncio
async def test_review_duplicate_event(
    async_client: AsyncClient,
    test_session: AsyncSession,
) -> None:
    event = await _create_duplicate_event(test_session, reviewed=False)
    response = await async_client.patch(
        f"/api/v1/admin/dedup/{event.id}/review",
        json={"reviewed": True, "review_note": "Confirmed duplicate"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["reviewed"] is True
    assert data["review_note"] == "Confirmed duplicate"


@pytest.mark.asyncio
async def test_review_duplicate_event_not_found(async_client: AsyncClient) -> None:
    response = await async_client.patch(
        f"/api/v1/admin/dedup/{uuid4()}/review",
        json={"reviewed": True},
    )
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Content stats tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_content_stats_empty(async_client: AsyncClient) -> None:
    response = await async_client.get("/api/v1/admin/content/stats")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_content_stats_with_items(
    async_client: AsyncClient,
    test_session: AsyncSession,
) -> None:
    for _ in range(3):
        item = ContentItem(
            university=University.UMD,
            domain=Domain.DINING,
            source_url="https://dining.umd.edu",
            raw_content="Test content",
            content_hash=str(uuid4()),
            status=ContentStatus.SYNCED,
        )
        test_session.add(item)
    await test_session.commit()

    response = await async_client.get("/api/v1/admin/content/stats")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["university"] == "umd"
    assert data[0]["domain"] == "dining"
    assert data[0]["total"] == 3
    assert data[0]["synced"] == 3
