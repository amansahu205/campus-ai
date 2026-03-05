"""University of Michigan Dining scraper."""

from __future__ import annotations

from scrapling import Fetcher

from pipeline.scrapers.base import BaseScraper, ScrapeResult

_DINING_URL = "https://dining.umich.edu/locations-hours"


class UMichDiningScraper(BaseScraper):
    university = "umich"
    domain = "dining"

    async def scrape(self) -> list[ScrapeResult]:
        fetcher = Fetcher(auto_match=False)
        page = await fetcher.async_get(_DINING_URL, stealthy_headers=True)

        results: list[ScrapeResult] = []
        for location in page.css(".dining-hall, .location-item, .views-row"):
            name = location.css_first("h3, .location-name, .field--name-title")
            hours = location.css_first(".hours, .field--name-field-hours")
            address = location.css_first(".address, .field--name-field-address")

            raw = (
                f"Name: {name.text if name else 'N/A'}\n"
                f"Hours: {hours.text if hours else 'N/A'}\n"
                f"Address: {address.text if address else 'N/A'}"
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
