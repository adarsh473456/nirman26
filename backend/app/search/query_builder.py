def build_supplier_query(search_text: str = "", category: str | None = None, location: str | None = None, verified_only: bool = False) -> dict:
    must: list[dict] = []
    filters: list[dict] = []
    if search_text.strip():
        must.append({"multi_match": {"query": search_text.strip(), "fields": ["company_name^3", "category^3", "capabilities^3", "materials^2", "certifications^2", "machinery", "subcategories", "overview"], "fuzziness": "AUTO"}})
    if category:
        filters.append({"term": {"category": category}})
    if location:
        filters.append({"bool": {"should": [{"term": {"city": location}}, {"term": {"state": location}}], "minimum_should_match": 1}})
    if verified_only:
        filters.append({"term": {"verified": True}})
    return {"query": {"bool": {"must": must or [{"match_all": {}}], "filter": filters}}, "size": 50}
