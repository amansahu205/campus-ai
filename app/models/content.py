"""SQLModel domain models for scraped campus content."""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from enum import StrEnum
from typing import Any
from uuid import UUID, uuid4

from sqlmodel import Column, Field, Index, SQLModel
from sqlalchemy import JSON, Text


class University(StrEnum):
    UMD = "umd"
    UMICH = "umich"


class Domain(StrEnum):
    DINING = "dining"
    EVENTS = "events"
    ATHLETICS = "athletics"
    NEWS = "news"
    NIGHTLIFE = "nightlife"


class ContentStatus(StrEnum):
    PENDING = "pending"
    STRUCTURED = "structured"
    VALIDATED = "validated"
    DEDUPLICATED = "deduplicated"
    SYNCED = "synced"
    REJECTED = "rejected"


class ContentItem(SQLModel, table=True):
    """A single piece of scraped and structured campus content."""

    __tablename__ = "content_items"
    __table_args__ = (
        Index("ix_content_items_university_domain", "university", "domain"),
        Index("ix_content_items_status", "status"),
    )

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    university: University = Field(index=True)
    domain: Domain = Field(index=True)

    # Raw and structured content
    source_url: str = Field(sa_column=Column(Text))
    raw_content: str = Field(sa_column=Column(Text))
    structured_data: dict[str, Any] = Field(
        default_factory=dict, sa_column=Column(JSON)
    )

    # Dedup – unique constraint enforces dedup at the DB level
    content_hash: str = Field(max_length=64, unique=True)

    # Lifecycle
    status: ContentStatus = Field(default=ContentStatus.PENDING)
    qdrant_id: str | None = Field(default=None, max_length=64)

    # Timestamps
    scraped_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    structured_at: datetime | None = Field(default=None)
    synced_at: datetime | None = Field(default=None)

    @classmethod
    def compute_hash(cls, raw_content: str, algorithm: str = "sha256") -> str:
        """Compute a content hash for deduplication."""
        h = hashlib.new(algorithm)
        h.update(raw_content.encode("utf-8"))
        return h.hexdigest()


class DuplicateEvent(SQLModel, table=True):
    """Records when a scraped item was found to be a duplicate."""

    __tablename__ = "duplicate_events"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    incoming_hash: str = Field(max_length=64)
    existing_item_id: UUID
    university: University
    domain: Domain
    detected_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviewed: bool = Field(default=False)
    review_note: str | None = Field(default=None, sa_column=Column(Text))
