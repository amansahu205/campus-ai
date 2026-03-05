"""Prefect flow: UMD Dining pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umd.dining import UMDDiningScraper

umd_dining_flow = build_domain_flow(UMDDiningScraper, "umd-dining")
