from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.config import settings

# ── Engine ────────────────────────────────────────────────────────────────────
engine = create_async_engine(
    str(settings.DATABASE_URL),
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=10,
    pool_pre_ping=True,        # Detect stale connections
    pool_recycle=3600,         # Recycle after 1 hour
    echo=settings.DEBUG,       # Log SQL in dev only
)

# ── Session factory ───────────────────────────────────────────────────────────
AsyncSessionFactory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,    # Critical for async — don't refresh after commit
    autoflush=False,
)


# ── Lifecycle helpers (called from main.py lifespan) ─────────────────────────
async def create_db_and_tables() -> None:
    """Create all SQLModel-registered tables. Used in dev; prod uses Alembic."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db() -> None:
    """Dispose all connections in the pool."""
    await engine.dispose()


# ── Health check ──────────────────────────────────────────────────────────────
async def check_db_connection() -> bool:
    """Returns True if the DB is reachable. Used by /health endpoint."""
    try:
        async with AsyncSessionFactory() as session:
            await session.execute(__import__("sqlalchemy").text("SELECT 1"))
        return True
    except Exception:
        return False
