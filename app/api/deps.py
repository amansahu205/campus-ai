from __future__ import annotations

import secrets
from typing import AsyncGenerator

from fastapi import Depends, HTTPException, Path, Security, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import AsyncSessionFactory

# ── HTTP Basic Auth security scheme ──────────────────────────────────────────
security = HTTPBasic()


# ── DB session dependency ─────────────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yields an AsyncSession per request.
    Commits on success, rolls back on any exception.
    """
    async with AsyncSessionFactory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# ── University slug validator ─────────────────────────────────────────────────
async def get_university(
    university: str = Path(..., description="University slug: 'umd' or 'michigan'"),
) -> str:
    """
    Validates university slug from URL path.
    Raises 404 for any slug not in SUPPORTED_UNIVERSITIES.
    """
    if university not in settings.SUPPORTED_UNIVERSITIES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "UNIVERSITY_NOT_FOUND",
                "message": (
                    f"University '{university}' is not supported. "
                    f"Supported: {settings.SUPPORTED_UNIVERSITIES}"
                ),
            },
        )
    return university


# ── Admin auth dependency ─────────────────────────────────────────────────────
def get_admin(
    credentials: HTTPBasicCredentials = Security(security),
) -> str:
    """
    HTTP Basic Auth for all /admin/* routes.
    Uses secrets.compare_digest to prevent timing attacks.
    """
    correct_username = secrets.compare_digest(
        credentials.username.encode("utf-8"),
        settings.ADMIN_USERNAME.encode("utf-8"),
    )
    correct_password = secrets.compare_digest(
        credentials.password.encode("utf-8"),
        settings.ADMIN_PASSWORD.encode("utf-8"),
    )
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username
