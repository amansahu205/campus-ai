"""Prefect flow: University of Michigan Athletics pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umich.athletics import UMichAthleticsScraper

umich_athletics_flow = build_domain_flow(UMichAthleticsScraper, "umich-athletics")
