# campus-ai

AI-powered campus intelligence platform for UMD and University of Michigan. Real-time dining, events, athletics, news, and nightlife — powered by Scrapling, FastAPI, Prefect, and RAG.

## Project Structure

```
campus-ai/
│
├── app/           # Backend — FastAPI REST API
├── pipeline/      # Data Pipeline — Prefect + Scrapling + LLM
├── ai/            # AI Layer — RAG, prompts, embeddings, guardrails
├── frontend/      # Frontend — Next.js (React, Tailwind, Framer Motion)
├── migrations/    # Alembic DB migrations
├── tests/         # All tests (unit + integration)
├── infra/         # Docker, Railway config, env templates
└── docs/          # PRD, TECH_STACK, SOURCE_REGISTRY, etc.
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Three.js |
| API | FastAPI · Pydantic v2 · SQLModel · asyncpg |
| Pipeline | Prefect · Scrapling (3-tier fetcher) · GPT-4o structuring |
| AI / RAG | GPT-4o · text-embedding-3-small · Qdrant (self-hosted) |
| Database | PostgreSQL 16 + Alembic · Redis (cache + ARQ queues) |
| Infra | Docker · Railway / Fly.io · Vercel Analytics |

## Frontend

The frontend is a **Next.js 16** app (exported from v0/Lovable) with a two-screen architecture:

```
Landing Page (/)
  └── User selects university: UMD or Michigan
      └── Dashboard (/[university])
          ├── Ask Campus AI tab  — RAG chat with typewriter AI responses + source chips
          ├── Browse Data tab    — 2×3 widget grid linking to full domain pages
          ├── Dining   /[university]/dining
          ├── Events   /[university]/events
          ├── Athletics /[university]/athletics
          ├── Nightlife /[university]/nightlife
          └── News     /[university]/news
```

**Key UI details:**
- Brand color: `#E03A3E` (UMD red) · Font: Inter · Dark glassmorphism aesthetic
- Animated 3D background via `@react-three/fiber`
- All page transitions use `AnimatePresence` (Framer Motion)
- Status bar with live-glance stats (dining open · events today · live score · nightlife)
- Admin dashboard accessible via hidden button (bottom-right)

> **Current state**: All data is hardcoded in `frontend/lib/uip-data.ts`. AI chat uses mock responses. No API calls yet — needs wiring to the FastAPI backend.

## API Endpoints (Planned)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/{university}/dining` | All halls: status, hours, menus |
| `GET` | `/api/v1/{university}/events` | Events with date/category/source filters |
| `GET` | `/api/v1/{university}/athletics` | Schedule + live scores |
| `GET` | `/api/v1/{university}/nightlife` | Venue events by date |
| `GET` | `/api/v1/{university}/news` | Articles with category filter |
| `POST` | `/api/v1/{university}/ask` | RAG Q&A (rate-limited: 30/hr/IP) |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/amansahu205/campus-ai.git
cd campus-ai

# --- Frontend ---
cd frontend
pnpm install
pnpm dev        # http://localhost:3000

# --- Backend (when ready) ---
cd ..
curl -LsSf https://astral.sh/uv/install.sh | sh
uv sync
cp infra/.env.template .env
uv run uvicorn app.main:app --reload --port 8000
```

