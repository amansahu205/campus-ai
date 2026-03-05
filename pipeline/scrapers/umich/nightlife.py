"""University of Michigan Nightlife scraper (Ann Arbor area)."""

from __future__ import annotations

from scrapling import Fetcher

from pipeline.scrapers.base import BaseScraper, ScrapeResult

_NIGHTLIFE_URL = "https://www.mlive.com/entertainment/ann-arbor"


class UMichNightlifeScraper(BaseScraper):
    university = "umich"
    domain = "nightlife"

    async def scrape(self) -> list[ScrapeResult]:
        fetcher = Fetcher(auto_match=False)
        page = await fetcher.async_get(_NIGHTLIFE_URL, stealthy_headers=True)

        results: list[ScrapeResult] = []
        for item in page.css("article, .story-item, .article-item"):
            title = item.css_first("h2, h3, .article-title")
            date = item.css_first("time, .article-date, .date")
            summary = item.css_first("p, .article-summary, .teaser")
            link = item.css_first("a")

            raw = (
                f"Title: {title.text if title else 'N/A'}\n"
                f"Date: {date.text if date else 'N/A'}\n"
                f"Summary: {summary.text[:500] if summary else 'N/A'}\n"
                f"URL: {link.attrib.get('href', 'N/A') if link else 'N/A'}"
            )
            results.append(
                ScrapeResult(
                    university=self.university,
                    domain=self.domain,
                    source_url=_NIGHTLIFE_URL,
                    raw_content=raw,
                    metadata={"article_title": title.text if title else ""},
                )
            )

        return results
