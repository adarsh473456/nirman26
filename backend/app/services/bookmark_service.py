from sqlalchemy.orm import Session
from app.models import Bookmark

def is_bookmarked(db: Session, buyer_id, supplier_id) -> bool:
    return db.query(Bookmark).filter(Bookmark.buyer_id == buyer_id, Bookmark.supplier_id == supplier_id).first() is not None
