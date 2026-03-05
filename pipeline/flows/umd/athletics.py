"""Prefect flow: UMD Athletics pipeline."""

from pipeline.flows.factory import build_domain_flow
from pipeline.scrapers.umd.athletics import UMDAthleticsScraper

umd_athletics_flow = build_domain_flow(UMDAthleticsScraper, "umd-athletics")
