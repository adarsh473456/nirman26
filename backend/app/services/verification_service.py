from sqlalchemy.orm import Session
from app.models import Supplier

def pending_supplier_count(db: Session) -> int:
    return db.query(Supplier).filter(Supplier.verification_status == "pending").count()
