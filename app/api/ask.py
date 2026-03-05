"""RAG-powered 'Ask UIP' endpoint with confidence routing."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.core.config import Settings, get_settings
from app.services.rag import RAGService, RAGResponse

router = APIRouter()


class AskRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)
    university: str = Field(..., pattern="^(umd|umich)$")
    domain: str | None = Field(
        default=None,
        pattern="^(dining|events|athletics|news|nightlife)$",
    )
    top_k: int = Field(default=5, ge=1, le=20)


class AskResponseBody(BaseModel):
    answer: str
    confidence: float
    confidence_label: str  # "high" | "medium" | "low"
    sources: list[dict]
    fallback_used: bool


@router.post("", response_model=AskResponseBody)
async def ask_uip(
    request: AskRequest,
    settings: Settings = Depends(get_settings),
    rag_service: RAGService = Depends(RAGService.from_settings),
) -> AskResponseBody:
    """
    Ask a question about campus life at a specific university.

    Confidence routing:
    - High (≥ high_threshold): Direct answer from vector search
    - Medium (≥ low_threshold): Answer with caveat
    - Low (< low_threshold): Fallback to generic response
    """
    result: RAGResponse = await rag_service.query(
        question=request.question,
        university=request.university,
        domain=request.domain,
        top_k=request.top_k,
    )

    if result.confidence >= settings.rag_high_confidence_threshold:
        confidence_label = "high"
    elif result.confidence >= settings.rag_low_confidence_threshold:
        confidence_label = "medium"
    else:
        confidence_label = "low"

    return AskResponseBody(
        answer=result.answer,
        confidence=result.confidence,
        confidence_label=confidence_label,
        sources=result.sources,
        fallback_used=result.fallback_used,
    )
