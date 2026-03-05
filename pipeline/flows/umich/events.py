"""Prefect flow: University of Michigan Events pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umich.events import UMichEventsScraper

umich_events_flow = build_domain_flow(UMichEventsScraper, "umich-events")
