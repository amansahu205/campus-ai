"""ARQ worker task definitions for async background processing."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

import structlog

from app.core.config import get_settings

logger = structlog.get_logger(__name__)


async def sync_to_qdrant(ctx: dict, item_id: str) -> None:
    """
    ARQ task: embed a ContentItem and upsert it into the Qdrant collection.

    This task is enqueued after a ContentItem is written to PostgreSQL.
    """
    from openai import AsyncOpenAI
    from qdrant_client import AsyncQdrantClient
    from qdrant_client.http.models import PointStruct
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlmodel import select

    from app.core.database import AsyncSessionLocal
    from app.models.content import ContentItem, ContentStatus

    settings = get_settings()
    openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
    qdrant = AsyncQdrantClient(url=settings.qdrant_url)

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(ContentItem).where(ContentItem.id == UUID(item_id))
        )
        item = result.scalar_one_or_none()
        if item is None:
            logger.warning("sync_to_qdrant: item not found", item_id=item_id)
            return

        # Embed structured data as text
        text = str(item.structured_data)
        embedding_response = await openai_client.embeddings.create(
            input=text,
            model=settings.openai_embedding_model,
        )
        vector = embedding_response.data[0].embedding

        collection = settings.qdrant_collections[str(item.university)]

        point = PointStruct(
            id=str(item.id),
            vector=vector,
            payload={
                "university": str(item.university),
                "domain": str(item.domain),
                "source_url": item.source_url,
                "structured_data": item.structured_data,
                "scraped_at": item.scraped_at.isoformat(),
            },
        )
        await qdrant.upsert(collection_name=collection, points=[point])

        item.status = ContentStatus.SYNCED
        item.qdrant_id = str(item.id)
        item.synced_at = datetime.now(timezone.utc)
        session.add(item)
        await session.commit()

    logger.info("sync_to_qdrant: complete", item_id=item_id)


class WorkerSettings:
    """ARQ WorkerSettings – configures the ARQ worker process."""

    functions = [sync_to_qdrant]

    @staticmethod
    def redis_settings() -> "ArqRedisSettings":  # type: ignore[name-defined]
        from arq.connections import RedisSettings as ArqRedisSettings

        settings = get_settings()
        # Parse redis://host:port/db
        url = settings.redis_url
        # Simple parse for redis://host:port/db
        url_parts = url.replace("redis://", "").split("/")
        host_port = url_parts[0].split(":")
        host = host_port[0]
        port = int(host_port[1]) if len(host_port) > 1 else 6379
        database = int(url_parts[1]) if len(url_parts) > 1 else 0
        return ArqRedisSettings(host=host, port=port, database=database)
