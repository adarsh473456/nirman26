from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import require_role
from app.database.session import get_db
from app.models import Supplier, User, VerificationReview
from app.schemas.verification import VerificationDecision
from app.api.routes.suppliers import serialize
from app.search.supplier_index import index_supplier

router = APIRouter(prefix="/verification", tags=["verification"])


@router.get("/pending")
def pending(db: Session = Depends(get_db), _: User = Depends(require_role("admin"))):
    rows = db.query(Supplier).filter(Supplier.verification_status == "pending").all()
    return [serialize(s) for s in rows]


@router.patch("/{supplier_id}")
def decide(
    supplier_id: str,
    payload: VerificationDecision,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    supplier = db.get(Supplier, supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    supplier.verified = payload.approved
    supplier.verification_status = "verified" if payload.approved else "rejected"

    db.add(
        VerificationReview(
            supplier_id=supplier.id,
            admin_id=admin.id,
            status=supplier.verification_status,
            notes=payload.notes,
        )
    )
    db.commit()
    db.refresh(supplier)

    # PostgreSQL remains the source of truth if Elasticsearch is offline.
    try:
        index_supplier(supplier)
    except Exception as exc:
        print("Elasticsearch verification indexing skipped:", exc)

    return serialize(supplier)
