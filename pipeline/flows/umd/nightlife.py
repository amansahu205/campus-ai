"""Prefect flow: UMD Nightlife pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umd.nightlife import UMDNightlifeScraper

umd_nightlife_flow = build_domain_flow(UMDNightlifeScraper, "umd-nightlife")
