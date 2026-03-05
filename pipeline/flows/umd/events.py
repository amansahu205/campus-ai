"""Prefect flow: UMD Events pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umd.events import UMDEventsScraper

umd_events_flow = build_domain_flow(UMDEventsScraper, "umd-events")
