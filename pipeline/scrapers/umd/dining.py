"""UMD Dining scraper."""

from __future__ import annotations

from scrapling import Fetcher

from pipeline.scrapers.base import BaseScraper, ScrapeResult

_DINING_URL = "https://dining.umd.edu/locations"


class UMDDiningScraper(BaseScraper):
    university = "umd"
    domain = "dining"

    async def scrape(self) -> list[ScrapeResult]:
        fetcher = Fetcher(auto_match=False)
        page = await fetcher.async_get(_DINING_URL, stealthy_headers=True)

        results: list[ScrapeResult] = []
        for location in page.css(".dining-location"):
            name = location.css_first(".location-name")
            hours = location.css_first(".hours")
            menu_link = location.css_first("a[href*='menu']")

            raw = (
                f"Name: {name.text if name else 'N/A'}\n"
                f"Hours: {hours.text if hours else 'N/A'}\n"
                f"Menu URL: {menu_link.attrib.get('href', 'N/A') if menu_link else 'N/A'}"
            )
            results.append(
                ScrapeResult(
                    university=self.university,
                    domain=self.domain,
                    source_url=_DINING_URL,
                    raw_content=raw,
                    metadata={"location_name": name.text if name else ""},
                )
            )

        return results
