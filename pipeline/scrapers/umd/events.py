"""UMD Events scraper."""

from __future__ import annotations

from scrapling import Fetcher

from pipeline.scrapers.base import BaseScraper, ScrapeResult

_EVENTS_URL = "https://events.umd.edu/calendar"


class UMDEventsScraper(BaseScraper):
    university = "umd"
    domain = "events"

    async def scrape(self) -> list[ScrapeResult]:
        fetcher = Fetcher(auto_match=False)
        page = await fetcher.async_get(_EVENTS_URL, stealthy_headers=True)

        results: list[ScrapeResult] = []
        for event in page.css(".event-item, .views-row"):
            title = event.css_first("h3, .event-title, .views-field-title")
            date = event.css_first(".date-display-single, .field--name-field-date")
            location = event.css_first(".field--name-field-location, .location")
            description = event.css_first(".field--name-body, .description")

            raw = (
                f"Title: {title.text if title else 'N/A'}\n"
                f"Date: {date.text if date else 'N/A'}\n"
                f"Location: {location.text if location else 'N/A'}\n"
                f"Description: {description.text[:500] if description else 'N/A'}"
            )
            results.append(
                ScrapeResult(
                    university=self.university,
                    domain=self.domain,
                    source_url=_EVENTS_URL,
                    raw_content=raw,
                    metadata={"event_title": title.text if title else ""},
                )
            )

        return results
