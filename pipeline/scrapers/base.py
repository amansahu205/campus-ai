"""Base scraper class using Scrapling."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

import structlog

logger = structlog.get_logger(__name__)


@dataclass
class ScrapeResult:
    """Raw content returned by a scraper."""

    university: str
    domain: str
    source_url: str
    raw_content: str
    metadata: dict[str, Any] = field(default_factory=dict)


class BaseScraper(ABC):
    """Abstract base class for all campus domain scrapers."""

    university: str = ""
    domain: str = ""

    def __init__(self) -> None:
        if not self.university or not self.domain:
            raise ValueError(
                f"{self.__class__.__name__} must define 'university' and 'domain' class attributes"
            )

    @abstractmethod
    async def scrape(self) -> list[ScrapeResult]:
        """
        Execute the scrape and return a list of raw result objects.

        Subclasses implement this method using Scrapling to fetch and
        parse the target page(s).
        """

    async def run(self) -> list[ScrapeResult]:
        """
        Public entry point – wraps ``scrape()`` with logging and error handling.
        """
        logger.info(
            "Starting scrape",
            university=self.university,
            domain=self.domain,
        )
        try:
            results = await self.scrape()
            logger.info(
                "Scrape complete",
                university=self.university,
                domain=self.domain,
                count=len(results),
            )
            return results
        except Exception as exc:
            logger.exception(
                "Scrape failed",
                university=self.university,
                domain=self.domain,
                error=str(exc),
            )
            raise
