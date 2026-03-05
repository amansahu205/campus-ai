"""Shared Prefect tasks used by all domain pipeline flows."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import structlog
from prefect import task

from app.core.config import get_settings
from app.models.content import ContentItem, ContentStatus, Domain, University
from pipeline.scrapers.base import ScrapeResult
from pipeline.structuring.llm import LLMStructurer

logger = structlog.get_logger(__name__)


@task(name="structure_content", retries=2, retry_delay_seconds=5)
async def structure_content_task(result: ScrapeResult) -> dict[str, Any]:
    """LLM structuring task – converts raw scraped text to structured JSON."""
    structurer = LLMStructurer()
    return await structurer.structure(
        raw_content=result.raw_content,
        university=result.university,
        domain=result.domain,
    )


@task(name="write_content_item")
async def write_content_item_task(
    scrape_result: ScrapeResult,
    structured_data: dict[str, Any],
    run_id: str,
) -> str | None:
    """
    Dedup check → write ContentItem to PostgreSQL → enqueue Qdrant sync.
    Returns the item UUID as a string, or None if duplicate.
    """
    from arq import create_pool
    from arq.connections import RedisSettings as ArqRedisSettings
    from sqlmodel import select

    from app.core.database import AsyncSessionLocal
    from app.models.content import DuplicateEvent
    from app.services.dedup import DedupService

    settings = get_settings()

    async with AsyncSessionLocal() as session:
        dedup = DedupService(session)
        content_hash, is_dup, existing_id = await dedup.process(
            raw_content=scrape_result.raw_content,
            university=University(scrape_result.university),
            domain=Domain(scrape_result.domain),
            algorithm=settings.content_hash_algorithm,
        )

        if is_dup:
            logger.info(
                "Duplicate content skipped",
                hash=content_hash,
                existing_id=str(existing_id),
            )
            return None

        item = ContentItem(
            university=University(scrape_result.university),
            domain=Domain(scrape_result.domain),
            source_url=scrape_result.source_url,
            raw_content=scrape_result.raw_content,
            structured_data=structured_data,
            content_hash=content_hash,
            status=ContentStatus.VALIDATED,
            structured_at=datetime.now(timezone.utc),
        )
        session.add(item)
        await session.commit()
        await session.refresh(item)

    # Enqueue Qdrant sync via ARQ
    url_parts = settings.redis_url.replace("redis://", "").split("/")
    host_port = url_parts[0].split(":")
    host = host_port[0]
    port = int(host_port[1]) if len(host_port) > 1 else 6379
    database = int(url_parts[1]) if len(url_parts) > 1 else 0

    redis = await create_pool(
        ArqRedisSettings(host=host, port=port, database=database)
    )
    await redis.enqueue_job("sync_to_qdrant", str(item.id))
    await redis.aclose()

    return str(item.id)
