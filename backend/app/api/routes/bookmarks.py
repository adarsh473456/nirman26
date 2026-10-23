from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import require_role
from app.database.session import get_db
from app.models import Bookmark, Supplier, User
from app.api.routes.suppliers import serialize

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.get("")
def list_bookmarks(db: Session = Depends(get_db), user: User = Depends(require_role("buyer"))):
    rows = db.query(Bookmark).filter(Bookmark.buyer_id == user.id).all()
    ids = [row.supplier_id for row in rows]
    if not ids:
        return []
    return [serialize(s) for s in db.query(Supplier).filter(Supplier.id.in_(ids)).all()]


@router.post("/{supplier_id}")
def add_bookmark(supplier_id: str, db: Session = Depends(get_db), user: User = Depends(require_role("buyer"))):
    exists = db.query(Bookmark).filter(Bookmark.buyer_id == user.id, Bookmark.supplier_id == supplier_id).first()
    if not exists:
        db.add(Bookmark(buyer_id=user.id, supplier_id=supplier_id))
        db.commit()
    return {"ok": True}


@router.delete("/{supplier_id}")
def delete_bookmark(supplier_id: str, db: Session = Depends(get_db), user: User = Depends(require_role("buyer"))):
    row = db.query(Bookmark).filter(Bookmark.buyer_id == user.id, Bookmark.supplier_id == supplier_id).first()
    if row:
        db.delete(row)
        db.commit()
    return {"ok": True}