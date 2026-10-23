from app.search.query_builder import build_supplier_query

def test_keyword_query():
    body = build_supplier_query("titanium cnc", "CNC Machining")
    assert body["size"] == 50
    assert body["query"]["bool"]["must"]
