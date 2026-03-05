FROM python:3.12-slim

# /workspace is our working dir — app code goes into /workspace/app/
WORKDIR /workspace

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    "fastapi>=0.115.0" \
    "uvicorn[standard]>=0.30.0" \
    "pydantic>=2.7.0" \
    "pydantic-settings>=2.3.0" \
    "sqlmodel>=0.0.21" \
    "asyncpg>=0.29.0" \
    "alembic>=1.13.0" \
    "redis>=5.0.0" \
    "arq>=0.25.0" \
    "httpx>=0.27.0" \
    "structlog>=24.0.0" \
    "sentry-sdk[fastapi]>=2.0.0" \
    "python-multipart>=0.0.9"

# Railway sends app/ as build context — copy into /workspace/app/
# so Python finds it as the `app` package
COPY . /workspace/app/

EXPOSE 8000

# uvicorn runs from /workspace, imports app.main correctly
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
