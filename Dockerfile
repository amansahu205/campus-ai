FROM python:3.12-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies inline (no file copy needed)
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

# Copy app code
COPY . .

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
