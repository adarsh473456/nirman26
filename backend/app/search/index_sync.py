from sqlalchemy.orm import Session
from app.models import Supplier
from app.search.supplier_index import ensure_supplier_index, index_supplier

def rebuild_supplier_index(db: Session) -> int:
    ensure_supplier_index()
    count = 0
    for supplier in db.query(Supplier).all():
        index_supplier(supplier)
        count += 1
    return count
