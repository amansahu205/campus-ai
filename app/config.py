from __future__ import annotations

from pydantic import PostgresDsn, RedisDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────
    APP_ENV: str = "development"
    APP_NAME: str = "University Intelligence Platform"
    DEBUG: bool = False

    # ── Database ─────────────────────────────────────────────────
    DATABASE_URL: PostgresDsn
    DATABASE_POOL_SIZE: int = 10

    # ── Redis ────────────────────────────────────────────────────
    REDIS_URL: RedisDsn = "redis://localhost:6379"  # type: ignore[assignment]

    # ── Qdrant ───────────────────────────────────────────────────
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str | None = None          # Required in prod
    QDRANT_COLLECTION: str = "uip_chunks"

    # ── OpenAI ───────────────────────────────────────────────────
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"

    # ── Anthropic (Claude fallback) ───────────────────────────────
    ANTHROPIC_API_KEY: str | None = None

    # ── RAG ──────────────────────────────────────────────────────
    RAG_TOP_K: int = 5
    RAG_SIMILARITY_THRESHOLD_CONFIDENT: float = 0.85
    RAG_SIMILARITY_THRESHOLD_UNCERTAIN: float = 0.75
    RAG_RATE_LIMIT_PER_HOUR: int = 30

    # ── Qdrant sync SLA ──────────────────────────────────────────
    QDRANT_SYNC_MAX_LAG_SECONDS: int = 300     # 5-minute SLA

    # ── Admin (HTTP Basic Auth) ───────────────────────────────────
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str

    # ── CORS + trusted hosts ──────────────────────────────────────
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    ALLOWED_HOSTS: list[str] = ["localhost", "127.0.0.1"]

    # ── Universities ──────────────────────────────────────────────
    SUPPORTED_UNIVERSITIES: list[str] = ["umd", "michigan"]

    # ── Pipeline (Prefect) ────────────────────────────────────────
    PREFECT_API_URL: str | None = None

    # ── Observability ─────────────────────────────────────────────
    SENTRY_DSN: str | None = None

    # ── Storage v1.1 (Cloudflare R2) ─────────────────────────────
    R2_BUCKET: str | None = None
    R2_ACCESS_KEY_ID: str | None = None
    R2_SECRET_ACCESS_KEY: str | None = None

    # ── Validators ────────────────────────────────────────────────
    @field_validator("CORS_ORIGINS", "ALLOWED_HOSTS", mode="before")
    @classmethod
    def _split_str(cls, v: str | list) -> list[str]:
        """Accept comma-separated strings from Railway env vars."""
        if isinstance(v, str):
            return [item.strip() for item in v.split(",")]
        return v

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def _fix_db_scheme(cls, v: str) -> str:
        """Railway injects plain postgresql:// — asyncpg needs postgresql+asyncpg://."""
        if isinstance(v, str):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
            v = v.replace("postgres://", "postgresql+asyncpg://", 1)
        return v


settings = Settings()
