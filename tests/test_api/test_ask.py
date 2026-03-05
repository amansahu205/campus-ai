"""Tests for the /api/v1/ask endpoint."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest
from httpx import AsyncClient

from app.services.rag import RAGResponse, RAGService


def _make_rag_override(response: RAGResponse):
    """Return a FastAPI dependency override that returns a mock RAGService."""
    mock_service = MagicMock(spec=RAGService)
    mock_service.query = AsyncMock(return_value=response)

    def override():
        return mock_service

    return override


@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient) -> None:
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_ask_high_confidence(async_client: AsyncClient, test_app) -> None:
    """A high-confidence RAG response returns the answer and correct label."""
    rag_response = RAGResponse(
        answer="The dining hall is open 7am–9pm.",
        confidence=0.85,
        sources=[
            {
                "id": str(uuid4()),
                "score": 0.85,
                "university": "umd",
                "domain": "dining",
                "source_url": "https://dining.umd.edu",
            }
        ],
        fallback_used=False,
    )
    test_app.dependency_overrides[RAGService.from_settings] = _make_rag_override(
        rag_response
    )
    try:
        response = await async_client.post(
            "/api/v1/ask",
            json={
                "question": "When does the dining hall open?",
                "university": "umd",
                "domain": "dining",
            },
        )
    finally:
        test_app.dependency_overrides.pop(RAGService.from_settings, None)

    assert response.status_code == 200
    data = response.json()
    assert data["confidence_label"] == "high"
    assert len(data["answer"]) > 0
    assert data["fallback_used"] is False
    assert len(data["sources"]) == 1


@pytest.mark.asyncio
async def test_ask_low_confidence_returns_fallback(
    async_client: AsyncClient, test_app
) -> None:
    """A low-confidence result triggers the fallback answer."""
    rag_response = RAGResponse(
        answer="I don't have enough reliable information.",
        confidence=0.15,
        sources=[],
        fallback_used=True,
    )
    test_app.dependency_overrides[RAGService.from_settings] = _make_rag_override(
        rag_response
    )
    try:
        response = await async_client.post(
            "/api/v1/ask",
            json={
                "question": "What time does the library close?",
                "university": "umich",
            },
        )
    finally:
        test_app.dependency_overrides.pop(RAGService.from_settings, None)

    assert response.status_code == 200
    data = response.json()
    assert data["confidence_label"] == "low"
    assert data["fallback_used"] is True


@pytest.mark.asyncio
async def test_ask_invalid_university(async_client: AsyncClient) -> None:
    """Unknown university value should be rejected with 422."""
    response = await async_client.post(
        "/api/v1/ask",
        json={
            "question": "What events are happening?",
            "university": "mit",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_ask_invalid_domain(async_client: AsyncClient) -> None:
    """Unknown domain value should be rejected with 422."""
    response = await async_client.post(
        "/api/v1/ask",
        json={
            "question": "What concerts are on?",
            "university": "umd",
            "domain": "concerts",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_ask_question_too_short(async_client: AsyncClient) -> None:
    """Questions shorter than min_length=3 should be rejected with 422."""
    response = await async_client.post(
        "/api/v1/ask",
        json={
            "question": "Hi",
            "university": "umd",
        },
    )
    assert response.status_code == 422
