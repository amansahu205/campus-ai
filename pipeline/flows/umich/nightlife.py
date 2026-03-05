"""Prefect flow: University of Michigan Nightlife pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umich.nightlife import UMichNightlifeScraper

umich_nightlife_flow = build_domain_flow(UMichNightlifeScraper, "umich-nightlife")
