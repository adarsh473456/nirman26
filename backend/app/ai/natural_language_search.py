import json
from openai import OpenAI
from app.core.config import settings
from app.schemas.search import SearchIntent


SYSTEM_PROMPT = """You extract supplier-search requirements from a buyer query.
Return JSON only with keys: keywords, category, materials, certifications, capabilities, location.
Use null for unknown scalar values and [] for unknown lists. Do not invent requirements."""


def parse_search_intent(query: str) -> SearchIntent:
    if not settings.openai_api_key:
        return SearchIntent(keywords=query.split())

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.responses.create(
        model=settings.openai_model,
        instructions=SYSTEM_PROMPT,
        input=query,
    )

    try:
        data = json.loads(response.output_text)
        return SearchIntent.model_validate(data)
    except Exception:
        return SearchIntent(keywords=query.split())