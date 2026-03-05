"""LLM structuring step: converts raw scraped text into structured JSON via GPT-4o."""

from __future__ import annotations

import json
from typing import Any

import structlog
from openai import AsyncOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings

logger = structlog.get_logger(__name__)

_DOMAIN_SCHEMAS: dict[str, str] = {
    "dining": (
        "Extract a JSON object with keys: "
        "name (str), hours (str), location (str), menu_url (str | null), cuisine_type (str | null)."
    ),
    "events": (
        "Extract a JSON object with keys: "
        "title (str), date (str), time (str | null), location (str), description (str), "
        "organizer (str | null), registration_url (str | null)."
    ),
    "athletics": (
        "Extract a JSON object with keys: "
        "sport (str), opponent (str | null), date (str | null), venue (str | null), "
        "result (str | null), schedule_url (str | null)."
    ),
    "news": (
        "Extract a JSON object with keys: "
        "headline (str), date (str), author (str | null), summary (str), url (str | null), "
        "tags (list[str])."
    ),
    "nightlife": (
        "Extract a JSON object with keys: "
        "name (str), date (str), venue (str), description (str), "
        "cover_charge (str | null), url (str | null)."
    ),
}

_SYSTEM_TEMPLATE = (
    "You are a structured data extractor for a university campus intelligence system. "
    "Given raw scraped text from the '{domain}' section of {university}'s website, "
    "{schema_instruction} "
    "Return ONLY valid JSON. Do not include any explanation or markdown."
)


class LLMStructurer:
    """Uses GPT-4o to convert raw scraped text into domain-specific structured JSON."""

    def __init__(self) -> None:
        self._settings = get_settings()
        self._client = AsyncOpenAI(api_key=self._settings.openai_api_key)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def structure(
        self,
        raw_content: str,
        university: str,
        domain: str,
    ) -> dict[str, Any]:
        """
        Send ``raw_content`` to GPT-4o and parse the returned JSON.

        Retries up to 3 times on transient failures.
        """
        schema_instruction = _DOMAIN_SCHEMAS.get(
            domain,
            "Extract the most relevant structured information as a JSON object.",
        )
        university_name = (
            "University of Maryland" if university == "umd" else "University of Michigan"
        )

        system_prompt = _SYSTEM_TEMPLATE.format(
            domain=domain,
            university=university_name,
            schema_instruction=schema_instruction,
        )

        response = await self._client.chat.completions.create(
            model=self._settings.openai_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": raw_content},
            ],
            temperature=0.0,
            max_tokens=512,
            timeout=self._settings.llm_structuring_timeout,
        )

        raw_json = response.choices[0].message.content or "{}"
        try:
            structured: dict[str, Any] = json.loads(raw_json)
        except json.JSONDecodeError:
            logger.warning(
                "LLM returned invalid JSON; storing raw string",
                university=university,
                domain=domain,
                raw_json=raw_json[:200],
            )
            structured = {"raw": raw_json}

        return structured
