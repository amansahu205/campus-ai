"""Tests for the content deduplication service."""

from __future__ import annotations

from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.content import ContentItem, ContentStatus, Domain, University
from app.services.dedup import DedupService


async def _insert_item(session: AsyncSession, raw_content: str) -> ContentItem:
    content_hash = DedupService.compute_hash(raw_content)
    item = ContentItem(
        university=University.UMD,
        domain=Domain.DINING,
        source_url="https://dining.umd.edu",
        raw_content=raw_content,
        content_hash=content_hash,
        status=ContentStatus.VALIDATED,
    )
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return item


# ---------------------------------------------------------------------------
# Unit tests for hash computation
# ---------------------------------------------------------------------------


def test_compute_hash_deterministic() -> None:
    """The same input always produces the same hash."""
    content = "Hello, campus!"
    h1 = DedupService.compute_hash(content)
    h2 = DedupService.compute_hash(content)
    assert h1 == h2
    assert len(h1) == 64  # SHA-256 hex digest


def test_compute_hash_different_inputs() -> None:
    """Different inputs produce different hashes."""
    h1 = DedupService.compute_hash("content A")
    h2 = DedupService.compute_hash("content B")
    assert h1 != h2


# ---------------------------------------------------------------------------
# Integration tests against the in-memory SQLite DB
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_is_duplicate_returns_false_for_new_content(
    test_session: AsyncSession,
) -> None:
    service = DedupService(test_session)
    content_hash = DedupService.compute_hash("brand new content")
    is_dup, existing_id = await service.is_duplicate(content_hash)
    assert is_dup is False
    assert existing_id is None


@pytest.mark.asyncio
async def test_is_duplicate_returns_true_for_existing_content(
    test_session: AsyncSession,
) -> None:
    raw = "Some campus dining update"
    item = await _insert_item(test_session, raw)

    service = DedupService(test_session)
    content_hash = DedupService.compute_hash(raw)
    is_dup, existing_id = await service.is_duplicate(content_hash)
    assert is_dup is True
    assert existing_id == item.id


@pytest.mark.asyncio
async def test_process_new_content_not_duplicate(
    test_session: AsyncSession,
) -> None:
    service = DedupService(test_session)
    raw = "Completely unique content " + str(uuid4())

    content_hash, is_dup, existing_id = await service.process(
        raw_content=raw,
        university=University.UMD,
        domain=Domain.EVENTS,
    )

    assert len(content_hash) == 64
    assert is_dup is False
    assert existing_id is None


@pytest.mark.asyncio
async def test_process_duplicate_creates_duplicate_event(
    test_session: AsyncSession,
) -> None:
    from sqlmodel import select
    from app.models.content import DuplicateEvent

    raw = "Duplicate content example"
    item = await _insert_item(test_session, raw)

    service = DedupService(test_session)
    content_hash, is_dup, existing_id = await service.process(
        raw_content=raw,
        university=University.UMD,
        domain=Domain.DINING,
    )

    assert is_dup is True
    assert existing_id == item.id

    # A DuplicateEvent record should have been created
    result = await test_session.execute(
        select(DuplicateEvent).where(DuplicateEvent.incoming_hash == content_hash)
    )
    dup_event = result.scalar_one_or_none()
    assert dup_event is not None
    assert dup_event.existing_item_id == item.id
    assert dup_event.reviewed is False
