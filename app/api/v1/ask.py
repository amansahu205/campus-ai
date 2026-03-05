from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_university
from app.schemas.ask import AskRequest, AskResponse

router = APIRouter()


@router.post(
    "",
    response_model=AskResponse,
    summary="Ask a campus AI question (RAG-powered)",
)
async def ask_question(
    body: AskRequest,
    university: str = Depends(get_university),
    db: AsyncSession = Depends(get_db),
) -> AskResponse:
    """
    RAG Q&A endpoint.

    Confidence routing (from config):
    - score ≥ 0.85 → full answer
    - 0.75 ≤ score < 0.85 → answer + is_uncertain=True disclaimer
    - score < 0.75 → is_fallback=True, fallback_url to official source

    Rate-limited: 30 requests/hour per IP (SlowAPI — wired in Phase 8).
    TODO (Phase 8): implement RAGService.ask()
    """
    import uuid  # noqa: PLC0415

    return AskResponse(
        answer=f"[STUB] You asked: '{body.query}' — RAG implementation coming in Phase 8.",
        is_fallback=False,
        is_uncertain=True,
        confidence=0.0,
        sources=[],
        fallback_url=None,
        query_id=str(uuid.uuid4()),
    )
