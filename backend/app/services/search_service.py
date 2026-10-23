from app.core.config import settings
from app.search.elastic_client import es
from app.search.query_builder import build_supplier_query
from app.ai.natural_language_search import parse_search_intent


def search_suppliers(query: str, category: str | None, location: str | None, verified_only: bool, use_ai: bool):
    intent = parse_search_intent(query) if use_ai and query else None
    parts = [query]
    if intent:
        parts.extend(intent.keywords)
        parts.extend(intent.materials)
        parts.extend(intent.certifications)
        parts.extend(intent.capabilities)
        category = category or intent.category
        location = location or intent.location
    body = build_supplier_query(" ".join(part for part in parts if part), category, location, verified_only)
    result = es.search(index=settings.elasticsearch_index, **body)
    return [{"supplier_id": hit["_source"]["supplier_id"], "score": float(hit.get("_score") or 0)} for hit in result["hits"]["hits"]]
