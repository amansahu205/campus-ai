"""Content deduplication service using SHA-256 content hashing."""

from __future__ import annotations

import hashlib
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.content import ContentItem, DuplicateEvent, University, Domain


class DedupService:
    """Checks incoming raw content against existing hashes in PostgreSQL."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    @staticmethod
    def compute_hash(raw_content: str, algorithm: str = "sha256") -> str:
        """Return a hex digest of the raw content."""
        h = hashlib.new(algorithm)
        h.update(raw_content.encode("utf-8"))
        return h.hexdigest()

    async def is_duplicate(self, content_hash: str) -> tuple[bool, UUID | None]:
        """
        Check whether *content_hash* already exists in the database.

        Returns ``(True, existing_id)`` if a duplicate is found,
        ``(False, None)`` otherwise.
        """
        result = await self._session.execute(
            select(ContentItem.id).where(ContentItem.content_hash == content_hash)
        )
        existing_id = result.scalar_one_or_none()
        if existing_id is not None:
            return True, existing_id
        return False, None

    async def record_duplicate(
        self,
        incoming_hash: str,
        existing_item_id: UUID,
        university: University,
        domain: Domain,
    ) -> DuplicateEvent:
        """Persist a DuplicateEvent record for the admin review queue."""
        event = DuplicateEvent(
            incoming_hash=incoming_hash,
            existing_item_id=existing_item_id,
            university=university,
            domain=domain,
        )
        self._session.add(event)
        await self._session.flush()
        return event

    async def process(
        self,
        raw_content: str,
        university: University,
        domain: Domain,
        algorithm: str = "sha256",
    ) -> tuple[str, bool, UUID | None]:
        """
        Full dedup pipeline step.

        Returns ``(content_hash, is_dup, existing_id)``.
        If ``is_dup`` is True a DuplicateEvent is also recorded.
        """
        content_hash = self.compute_hash(raw_content, algorithm)
        is_dup, existing_id = await self.is_duplicate(content_hash)
        if is_dup and existing_id is not None:
            await self.record_duplicate(content_hash, existing_id, university, domain)
        return content_hash, is_dup, existing_id
