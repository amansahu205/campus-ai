"""University of Michigan News scraper."""

from __future__ import annotations

from scrapling import Fetcher

from pipeline.scrapers.base import BaseScraper, ScrapeResult

_NEWS_URL = "https://news.umich.edu"


class UMichNewsScraper(BaseScraper):
    university = "umich"
    domain = "news"

    async def scrape(self) -> list[ScrapeResult]:
        fetcher = Fetcher(auto_match=False)
        page = await fetcher.async_get(_NEWS_URL, stealthy_headers=True)

        results: list[ScrapeResult] = []
        for article in page.css("article, .news-item, .story"):
            title = article.css_first("h2, h3, .story-title")
            date = article.css_first("time, .date, .published-date")
            summary = article.css_first(".summary, .teaser, p")
            link = article.css_first("a")

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
                    source_url=_NEWS_URL,
                    raw_content=raw,
                    metadata={"article_title": title.text if title else ""},
                )
            )

        return results
