"""Factory that builds a Prefect flow for any university+domain combination."""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any

import structlog
from prefect import flow, task

from app.core.config import get_settings
from app.models.admin import PipelineRun, PipelineStatus
from pipeline.scrapers.base import BaseScraper
from pipeline.flows.tasks import structure_content_task, write_content_item_task

logger = structlog.get_logger(__name__)


def build_domain_flow(
    scraper_class: type[BaseScraper],
    flow_name: str,
) -> Any:
    """
    Return a Prefect ``@flow`` function for the given scraper class.

    The returned flow:
    1. Creates a PipelineRun record
    2. Runs the scraper
    3. Structures each result with GPT-4o (respecting concurrency limit)
    4. Deduplicates and writes to PostgreSQL
    5. Enqueues Qdrant sync for each new item
    6. Updates the PipelineRun record with final stats
    """

    @flow(name=flow_name, log_prints=True)
    async def _domain_flow(run_id: str | None = None) -> dict[str, Any]:
        from app.core.database import AsyncSessionLocal

        settings = get_settings()
        scraper = scraper_class()
        university = scraper.university
        domain = scraper.domain

        # 1. Create pipeline run record
        async with AsyncSessionLocal() as session:
            pipeline_run = PipelineRun(
                flow_name=flow_name,
                university=university,
                domain=domain,
                status=PipelineStatus.RUNNING,
            )
            session.add(pipeline_run)
            await session.commit()
            await session.refresh(pipeline_run)
            pipeline_run_id = pipeline_run.id

        stats: dict[str, Any] = {
            "items_scraped": 0,
            "items_structured": 0,
            "items_written": 0,
            "error": None,
        }

        try:
            # 2. Scrape
            scrape_results = await scraper.run()
            stats["items_scraped"] = len(scrape_results)

            # 3 + 4. Structure and write (bounded concurrency)
            semaphore = asyncio.Semaphore(settings.scrape_concurrency)

            async def _process_one(
                result: ScrapeResult,
            ) -> tuple[dict[str, Any], str | None]:
                async with semaphore:
                    structured = await structure_content_task(result)
                    item_id = await write_content_item_task(
                        scrape_result=result,
                        structured_data=structured,
                        run_id=str(pipeline_run_id),
                    )
                    return structured, item_id

            process_tasks = [_process_one(r) for r in scrape_results]
            process_results = await asyncio.gather(*process_tasks, return_exceptions=True)

            for pr in process_results:
                if isinstance(pr, Exception):
                    logger.warning("Item processing error", error=str(pr))
                    continue
                structured_data, item_id = pr
                if structured_data:
                    stats["items_structured"] += 1
                if item_id:
                    stats["items_written"] += 1

            final_status = PipelineStatus.SUCCESS

        except Exception as exc:
            logger.exception("Pipeline flow failed", flow=flow_name, error=str(exc))
            stats["error"] = str(exc)
            final_status = PipelineStatus.FAILED

        # 5. Update pipeline run
        async with AsyncSessionLocal() as session:
            from sqlmodel import select

            result_row = await session.execute(
                select(PipelineRun).where(PipelineRun.id == pipeline_run_id)
            )
            pipeline_run = result_row.scalar_one()
            pipeline_run.status = final_status
            pipeline_run.items_scraped = stats["items_scraped"]
            pipeline_run.items_structured = stats["items_structured"]
            pipeline_run.items_written = stats["items_written"]
            pipeline_run.error_message = stats.get("error")
            pipeline_run.finished_at = datetime.now(timezone.utc)
            session.add(pipeline_run)
            await session.commit()

        return stats

    return _domain_flow
