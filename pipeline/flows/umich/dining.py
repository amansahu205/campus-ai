"""Prefect flow: University of Michigan Dining pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umich.dining import UMichDiningScraper

umich_dining_flow = build_domain_flow(UMichDiningScraper, "umich-dining")
