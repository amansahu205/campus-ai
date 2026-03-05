from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500, description="Student question")


class SourceChip(BaseModel):
    label: str               # "UMD Dining · 4 min ago"
    source_url: str | None = None
    scraped_at: datetime


class AskResponse(BaseModel):
    answer: str | None       # None if confidence below fallback threshold
    is_fallback: bool        # True when confidence < RAG_SIMILARITY_THRESHOLD_UNCERTAIN
    is_uncertain: bool       # True when 0.75 ≤ similarity < 0.85
    confidence: float
    sources: list[SourceChip] = []
    fallback_url: str | None = None   # Official source link on fallback
    query_id: str                     # UUID — used for feedback tracking


class FeedbackRequest(BaseModel):
    query_id: str
    rating: int = Field(..., ge=-1, le=1)   # 1=up, -1=down, 0=neutral
    comment: str | None = Field(None, max_length=300)
