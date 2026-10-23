from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    current_user,
    get_active_role,
    require_role,
)

from app.database.session import get_db
from app.models import Supplier, User
from app.schemas.supplier import SupplierUpsert
from app.search.supplier_index import index_supplier


router = APIRouter(
    prefix="/suppliers",
    tags=["suppliers"],
)


def serialize(s: Supplier):
    default_images = {
        "logo": "",
        "hero": "",
        "facility": [],
        "samples": [],
    }

    images = (
        default_images
        | (s.images or {})
    )

    default_contact = {
        "contactPerson": "",
        "title": "",
        "email": "",
        "phone": "",
        "website": "",
        "address": "",
    }

    contact = (
        default_contact
        | (s.contact or {})
    )

    return {
        "id": str(s.id),
        "name": s.company_name,
        "tagline": s.tagline,
        "category": s.category,
        "subcategories": (
            s.subcategories or []
        ),
        "location": {
            "city": s.city,
            "state": s.state,
            "country": s.country,
            "lat": s.latitude or 0,
            "lng": s.longitude or 0,
        },
        "verified": s.verified,
        "verificationDetails": {
            "gstNumber":
                s.gst_number,
            "registeredLegalName":
                s.registered_legal_name,
            "auditStatus":
                s.verification_status,
        },
        "rating": 0,
        "reviewCount": 0,
        "establishedYear":
            s.established_year,
        "employeeCount":
            s.employee_count,
        "facilitySizeSqFt": 0,
        "moq": s.moq,
        "avgLeadTimeDays":
            s.avg_lead_time_days,
        "responseRatePct": 0,
        "avgResponseTimeHours": 24,
        "materials":
            s.materials or [],
        "certifications":
            s.certifications or [],
        "machinery":
            s.machinery or [],
        "images":
            images,
        "overview":
            s.overview,
        "contact":
            contact,
        "capabilities":
            s.capabilities or [],
    }


def safe_index(
    supplier: Supplier,
) -> None:
    try:
        index_supplier(
            supplier
        )
    except Exception as exc:
        print(
            "Elasticsearch indexing "
            f"skipped: {exc}"
        )


@router.get("")
def list_suppliers(
    db: Session = Depends(
        get_db
    ),
    _: User = Depends(
        current_user
    ),
):
    return [
        serialize(s)
        for s in (
            db.query(Supplier)
            .order_by(
                Supplier.company_name.asc()
            )
            .all()
        )
    ]


@router.get("/mine")
def my_supplier(
    request: Request,
    db: Session = Depends(
        get_db
    ),
    user: User = Depends(
        require_role(
            "supplier",
            "admin",
        )
    ),
):
    active_role = get_active_role(
        request,
        user,
    )

    # Admin does not have a personal
    # supplier profile.
    if active_role == "admin":
        return None

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.owner_user_id
            == user.id
        )
        .first()
    )

    return (
        serialize(supplier)
        if supplier
        else None
    )


@router.get("/{supplier_id}")
def get_supplier(
    supplier_id: str,
    db: Session = Depends(
        get_db
    ),
    _: User = Depends(
        current_user
    ),
):
    supplier = db.get(
        Supplier,
        supplier_id,
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail=(
                "Supplier not found"
            ),
        )

    return serialize(
        supplier
    )


@router.post("")
def create_supplier(
    payload: SupplierUpsert,
    request: Request,
    db: Session = Depends(
        get_db
    ),
    user: User = Depends(
        require_role(
            "supplier",
            "admin",
        )
    ),
):
    active_role = get_active_role(
        request,
        user,
    )

    # Normal suppliers may only own
    # one supplier profile.
    if active_role == "supplier":
        existing = (
            db.query(Supplier)
            .filter(
                Supplier.owner_user_id
                == user.id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail=(
                    "Supplier profile "
                    "already exists"
                ),
            )

    supplier = Supplier(
        owner_user_id=user.id,
        **payload.model_dump(),
    )

    db.add(
        supplier
    )
    db.commit()
    db.refresh(
        supplier
    )

    safe_index(
        supplier
    )

    return serialize(
        supplier
    )


@router.put("/{supplier_id}")
def update_supplier(
    supplier_id: str,
    payload: SupplierUpsert,
    request: Request,
    db: Session = Depends(
        get_db
    ),
    user: User = Depends(
        require_role(
            "supplier",
            "admin",
        )
    ),
):
    active_role = get_active_role(
        request,
        user,
    )

    supplier = db.get(
        Supplier,
        supplier_id,
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail=(
                "Supplier not found"
            ),
        )

    # Supplier can edit only the
    # profile they own.
    if (
        active_role != "admin"
        and supplier.owner_user_id
        != user.id
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "Not your supplier profile"
            ),
        )

    for (
        key,
        value,
    ) in payload.model_dump().items():
        setattr(
            supplier,
            key,
            value,
        )

    # If a previously rejected supplier
    # edits their profile, send it back
    # for admin verification.
    if (
        active_role != "admin"
        and supplier.verification_status
        == "rejected"
    ):
        supplier.verification_status = (
            "pending"
        )
        supplier.verified = False

    db.commit()
    db.refresh(
        supplier
    )

    safe_index(
        supplier
    )

    return serialize(
        supplier
    )