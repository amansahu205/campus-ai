"""UMD News scraper."""

from __future__ import annotations

from scrapling import Fetcher

from pipeline.scrapers.base import BaseScraper, ScrapeResult

_NEWS_URL = "https://umdrightnow.umd.edu"


class UMDNewsScraper(BaseScraper):
    university = "umd"
    domain = "news"

    async def scrape(self) -> list[ScrapeResult]:
        fetcher = Fetcher(auto_match=False)
        page = await fetcher.async_get(_NEWS_URL, stealthy_headers=True)

        results: list[ScrapeResult] = []
        for article in page.css("article, .news-item, .views-row"):
            title = article.css_first("h2, h3, .field--name-title")
            date = article.css_first("time, .date, .field--name-field-news-date")
            summary = article.css_first(".field--name-body, .teaser, p")
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
