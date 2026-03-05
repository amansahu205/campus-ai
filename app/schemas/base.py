from __future__ import annotations

from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T


class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
    has_next: bool
    has_prev: bool


class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    data: list[T]
    meta: PaginationMeta


class ErrorDetail(BaseModel):
    field: str | None = None
    message: str


class ErrorBody(BaseModel):
    code: str        # Machine-readable: "NOT_FOUND", "VALIDATION_ERROR"
    message: str     # Human-readable
    details: list[ErrorDetail] | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorBody


class FreshnessInfo(BaseModel):
    """Included on every widget response — shows data age to the frontend."""
    scraped_at: datetime
    is_stale: bool
    stale_reason: str | None = None    # e.g. "dining_status > 20 min"


class UniversityContext(BaseModel):
    university_id: str      # "umd" | "michigan"
    display_name: str       # "University of Maryland"
