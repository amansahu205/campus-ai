"""UMD Athletics scraper."""

from __future__ import annotations

from scrapling import Fetcher

from pipeline.scrapers.base import BaseScraper, ScrapeResult

_ATHLETICS_URL = "https://umterps.com/sports"


class UMDAthleticsScraper(BaseScraper):
    university = "umd"
    domain = "athletics"

    async def scrape(self) -> list[ScrapeResult]:
        fetcher = Fetcher(auto_match=False)
        page = await fetcher.async_get(_ATHLETICS_URL, stealthy_headers=True)

        results: list[ScrapeResult] = []
        for sport in page.css(".sport-item, .sport-tile, li.sport"):
            name = sport.css_first(".sport-name, h3, a")
            schedule_link = sport.css_first("a[href*='schedule']")

            raw = (
                f"Sport: {name.text if name else 'N/A'}\n"
                f"Schedule URL: {schedule_link.attrib.get('href', 'N/A') if schedule_link else 'N/A'}"
            )
            results.append(
                ScrapeResult(
                    university=self.university,
                    domain=self.domain,
                    source_url=_ATHLETICS_URL,
                    raw_content=raw,
                    metadata={"sport_name": name.text if name else ""},
                )
            )

        return results
