"""Prefect flow: UMD News pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umd.news import UMDNewsScraper

umd_news_flow = build_domain_flow(UMDNewsScraper, "umd-news")
