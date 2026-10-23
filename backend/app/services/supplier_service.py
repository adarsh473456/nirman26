from sqlalchemy.orm import Session
from app.models import Supplier

def get_supplier_for_owner(db: Session, owner_user_id):
    return db.query(Supplier).filter(Supplier.owner_user_id == owner_user_id).first()
