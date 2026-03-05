"""Application configuration via Pydantic Settings."""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import AnyUrl, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    environment: Literal["development", "staging", "production"] = "development"
    secret_key: str = Field(default="dev-secret-key-change-in-production")
    debug: bool = False

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://campus_ai:campus_ai_secret@localhost:5432/campus_ai_dev"
    )

    # Redis / ARQ
    redis_url: str = Field(default="redis://localhost:6379/0")

    # Qdrant
    qdrant_url: str = Field(default="http://localhost:6333")
    qdrant_collection_prefix: str = "campus_ai"

    # OpenAI
    openai_api_key: str = Field(default="")
    openai_model: str = "gpt-4o"
    openai_embedding_model: str = "text-embedding-3-small"

    # Prefect
    prefect_api_url: str = "http://localhost:4200/api"

    # Pipeline settings
    content_hash_algorithm: str = "sha256"
    scrape_concurrency: int = 5
    llm_structuring_timeout: int = 30

    # Confidence routing (RAG)
    rag_high_confidence_threshold: float = 0.75
    rag_low_confidence_threshold: float = 0.40

    @field_validator("rag_high_confidence_threshold", "rag_low_confidence_threshold")
    @classmethod
    def validate_threshold(cls, v: float) -> float:
        if not 0.0 <= v <= 1.0:
            raise ValueError("Threshold must be between 0.0 and 1.0")
        return v

    @property
    def qdrant_collections(self) -> dict[str, str]:
        """Return the Qdrant collection names for each university."""
        return {
            "umd": f"{self.qdrant_collection_prefix}_umd",
            "umich": f"{self.qdrant_collection_prefix}_umich",
        }


@lru_cache
def get_settings() -> Settings:
    return Settings()
