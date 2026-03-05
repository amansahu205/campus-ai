"""Prefect flow: University of Michigan News pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umich.news import UMichNewsScraper

umich_news_flow = build_domain_flow(UMichNewsScraper, "umich-news")
