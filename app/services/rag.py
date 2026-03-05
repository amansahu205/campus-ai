"""RAG service: embedding, vector search, and LLM answer generation."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue, SearchRequest
from fastapi import Depends

from app.core.config import Settings, get_settings


@dataclass
class RAGResponse:
    answer: str
    confidence: float
    sources: list[dict[str, Any]]
    fallback_used: bool = False


_FALLBACK_ANSWER = (
    "I don't have enough reliable information to answer that question. "
    "Please check the official university website for the most accurate details."
)

_SYSTEM_PROMPT = """You are a helpful campus assistant for {university}.
Answer the user's question using ONLY the provided context snippets.
If the context is insufficient, say so clearly.
Be concise and accurate."""


class RAGService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._openai = AsyncOpenAI(api_key=settings.openai_api_key)
        self._qdrant = AsyncQdrantClient(url=settings.qdrant_url)

    @classmethod
    def from_settings(
        cls,
        settings: Settings = Depends(get_settings),
    ) -> "RAGService":
        """FastAPI dependency factory."""
        return cls(settings)

    async def _embed(self, text: str) -> list[float]:
        """Embed text using the configured OpenAI embedding model."""
        response = await self._openai.embeddings.create(
            input=text,
            model=self._settings.openai_embedding_model,
        )
        return response.data[0].embedding

    async def query(
        self,
        question: str,
        university: str,
        domain: str | None = None,
        top_k: int = 5,
    ) -> RAGResponse:
        """Run a RAG query and return a structured response."""
        collection = self._settings.qdrant_collections[university]
        query_vector = await self._embed(question)

        # Build optional domain filter
        qdrant_filter: Filter | None = None
        if domain:
            qdrant_filter = Filter(
                must=[
                    FieldCondition(
                        key="domain",
                        match=MatchValue(value=domain),
                    )
                ]
            )

        search_results = await self._qdrant.search(
            collection_name=collection,
            query_vector=query_vector,
            query_filter=qdrant_filter,
            limit=top_k,
            with_payload=True,
        )

        if not search_results:
            return RAGResponse(
                answer=_FALLBACK_ANSWER,
                confidence=0.0,
                sources=[],
                fallback_used=True,
            )

        # Compute mean score as confidence proxy
        scores = [hit.score for hit in search_results]
        confidence = sum(scores) / len(scores)

        if confidence < self._settings.rag_low_confidence_threshold:
            return RAGResponse(
                answer=_FALLBACK_ANSWER,
                confidence=confidence,
                sources=[],
                fallback_used=True,
            )

        # Build context from top results
        context_snippets = []
        sources = []
        for hit in search_results:
            payload = hit.payload or {}
            snippet = payload.get("structured_data", {})
            context_snippets.append(str(snippet))
            sources.append(
                {
                    "id": str(hit.id),
                    "score": hit.score,
                    "university": payload.get("university"),
                    "domain": payload.get("domain"),
                    "source_url": payload.get("source_url"),
                }
            )

        context = "\n\n---\n\n".join(context_snippets)
        university_name = "University of Maryland" if university == "umd" else "University of Michigan"

        chat_response = await self._openai.chat.completions.create(
            model=self._settings.openai_model,
            messages=[
                {
                    "role": "system",
                    "content": _SYSTEM_PROMPT.format(university=university_name),
                },
                {
                    "role": "user",
                    "content": f"Context:\n{context}\n\nQuestion: {question}",
                },
            ],
            temperature=0.2,
            max_tokens=512,
        )

        answer = chat_response.choices[0].message.content or _FALLBACK_ANSWER

        return RAGResponse(
            answer=answer,
            confidence=confidence,
            sources=sources,
            fallback_used=False,
        )
