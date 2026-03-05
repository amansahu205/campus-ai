"""UMD Nightlife scraper (College Park area)."""

from __future__ import annotations

from scrapling import Fetcher

from pipeline.scrapers.base import BaseScraper, ScrapeResult

_NIGHTLIFE_URL = "https://thestampumd.com/calendar-events"


class UMDNightlifeScraper(BaseScraper):
    university = "umd"
    domain = "nightlife"

    async def scrape(self) -> list[ScrapeResult]:
        fetcher = Fetcher(auto_match=False)
        page = await fetcher.async_get(_NIGHTLIFE_URL, stealthy_headers=True)

        results: list[ScrapeResult] = []
        for event in page.css(".event, .tribe-event, .event-item"):
            title = event.css_first(".tribe-event-title, h2, h3, .event-name")
            date = event.css_first(".tribe-event-schedule-details, .date, time")
            venue = event.css_first(".tribe-venue, .location, .venue")
            description = event.css_first(".tribe-events-single-section, .description, p")

            raw = (
                f"Event: {title.text if title else 'N/A'}\n"
                f"Date: {date.text if date else 'N/A'}\n"
                f"Venue: {venue.text if venue else 'N/A'}\n"
                f"Description: {description.text[:500] if description else 'N/A'}"
            )
            results.append(
                ScrapeResult(
                    university=self.university,
                    domain=self.domain,
                    source_url=_NIGHTLIFE_URL,
                    raw_content=raw,
                    metadata={"event_title": title.text if title else ""},
                )
            )

        return results
