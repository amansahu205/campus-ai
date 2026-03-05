"""SQLModel models for admin / pipeline monitoring."""

from __future__ import annotations

from datetime import datetime, timezone
from enum import StrEnum
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import JSON, Text
from sqlmodel import Column, Field, SQLModel


class PipelineStatus(StrEnum):
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"


class PipelineRun(SQLModel, table=True):
    """Records each Prefect pipeline execution for health monitoring."""

    __tablename__ = "pipeline_runs"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    flow_name: str = Field(max_length=128, index=True)
    university: str = Field(max_length=32, index=True)
    domain: str = Field(max_length=32, index=True)
    status: PipelineStatus = Field(default=PipelineStatus.RUNNING)
    items_scraped: int = Field(default=0)
    items_structured: int = Field(default=0)
    items_deduplicated: int = Field(default=0)
    items_written: int = Field(default=0)
    items_synced: int = Field(default=0)
    error_message: str | None = Field(default=None, sa_column=Column(Text))
    run_metadata: dict[str, Any] = Field(
        default_factory=dict, sa_column=Column(JSON)
    )
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    finished_at: datetime | None = Field(default=None)

    @property
    def duration_seconds(self) -> float | None:
        if self.finished_at is None:
            return None
        return (self.finished_at - self.started_at).total_seconds()
