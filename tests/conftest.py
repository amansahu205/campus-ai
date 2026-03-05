"""Shared pytest fixtures for the Campus AI test suite."""

from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Any

import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel


# ---------------------------------------------------------------------------
# In-memory SQLite engine for unit tests (no real PG needed)
# ---------------------------------------------------------------------------

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="function")
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(lambda c: SQLModel.metadata.create_all(c, checkfirst=True))
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def test_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    session_factory = async_sessionmaker(
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with session_factory() as session:
        yield session


# ---------------------------------------------------------------------------
# FastAPI test client (overrides DB dependency)
# ---------------------------------------------------------------------------


@pytest_asyncio.fixture(scope="function")
async def test_app(test_session: AsyncSession) -> FastAPI:
    from app.main import create_app
    from app.core.database import get_session

    application = create_app()

    async def override_get_session() -> AsyncGenerator[AsyncSession, None]:
        yield test_session

    application.dependency_overrides[get_session] = override_get_session
    return application


@pytest_asyncio.fixture(scope="function")
async def async_client(test_app: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(
        transport=ASGITransport(app=test_app), base_url="http://testserver"
    ) as client:
        yield client
