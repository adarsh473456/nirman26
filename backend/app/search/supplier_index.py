from app.core.config import settings
from .elastic_client import es


def ensure_supplier_index() -> None:
    if es.indices.exists(index=settings.elasticsearch_index):
        return
    es.indices.create(
        index=settings.elasticsearch_index,
        mappings={
            "properties": {
                "supplier_id": {"type": "keyword"},
                "company_name": {"type": "text"},
                "category": {"type": "keyword"},
                "subcategories": {"type": "text"},
                "capabilities": {"type": "text"},
                "materials": {"type": "text"},
                "certifications": {"type": "text"},
                "machinery": {"type": "text"},
                "overview": {"type": "text"},
                "city": {"type": "keyword"},
                "state": {"type": "keyword"},
                "verified": {"type": "boolean"},
            }
        },
    )


def _names(items: list) -> list[str]:
    output: list[str] = []
    for item in items or []:
        if isinstance(item, dict):
            output.append(str(item.get("name") or item.get("code") or ""))
        else:
            output.append(str(item))
    return [x for x in output if x]


def supplier_document(supplier) -> dict:
    return {
        "supplier_id": str(supplier.id),
        "company_name": supplier.company_name,
        "category": supplier.category,
        "subcategories": supplier.subcategories or [],
        "capabilities": supplier.capabilities or [],
        "materials": supplier.materials or [],
        "certifications": _names(supplier.certifications or []),
        "machinery": _names(supplier.machinery or []),
        "overview": supplier.overview,
        "city": supplier.city,
        "state": supplier.state,
        "verified": supplier.verified,
    }


def index_supplier(supplier) -> None:
    ensure_supplier_index()
    es.index(index=settings.elasticsearch_index, id=str(supplier.id), document=supplier_document(supplier), refresh=True)
