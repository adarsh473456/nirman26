from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.api.dependencies import require_role
from app.database.session import get_db
from app.models import (
    Order,
    RFQ,
    Supplier,
    User,
)
from app.schemas.rfq import (
    RFQCreate,
    RFQQuoteCreate,
)


router = APIRouter(
    prefix="/rfqs",
    tags=["rfqs"],
)


def serialize(r: RFQ, db: Session):
    supplier = db.get(
        Supplier,
        r.supplier_id,
    )

    buyer = db.get(
        User,
        r.buyer_id,
    )

    buyer_name = ""

    if buyer:
        buyer_name = (
            getattr(buyer, "name", None)
            or getattr(
                buyer,
                "full_name",
                None,
            )
            or getattr(
                buyer,
                "display_name",
                None,
            )
            or ""
        )

    buyer_email = (
        getattr(
            buyer,
            "email",
            "",
        )
        if buyer
        else ""
    )

    buyer_company = ""

    if buyer:
        buyer_company = (
            getattr(
                buyer,
                "company_name",
                None,
            )
            or getattr(
                buyer,
                "company",
                None,
            )
            or ""
        )

    return {
        "id": str(r.id),

        "buyerId": str(
            r.buyer_id
        ),

        "buyerName":
            buyer_name,

        "buyerCompany":
            buyer_company,

        "buyerEmail":
            buyer_email,

        "supplierId": str(
            r.supplier_id
        ),

        "supplierName": (
            supplier.company_name
            if supplier
            else ""
        ),

        "title":
            r.title,

        "category":
            r.category,

        "material":
            r.material,

        "quantity":
            r.quantity,

        "targetUnitBudget": (
            float(
                r.target_unit_budget
            )
            if r.target_unit_budget
            is not None
            else None
        ),

        "targetDeliveryDays":
            r.target_delivery_days,

        "specifications":
            r.specifications,

        "certificationsRequired":
            r.certifications_required
            or [],

        "attachments":
            r.attachments
            or [],

        "status":
            r.status,

        "createdAt": (
            r.created_at.isoformat()
            if r.created_at
            else None
        ),

        "quote":
            r.quote,
    }


@router.post("")
def create_rfq(
    payload: RFQCreate,
    db: Session = Depends(
        get_db
    ),
    user: User = Depends(
        require_role("buyer")
    ),
):
    supplier = db.get(
        Supplier,
        payload.supplier_id,
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail=(
                "Supplier not found"
            ),
        )

    r = RFQ(
        buyer_id=user.id,
        **payload.model_dump(),
    )

    db.add(r)
    db.commit()
    db.refresh(r)

    return serialize(
        r,
        db,
    )


@router.get("/buyer")
def buyer_rfqs(
    db: Session = Depends(
        get_db
    ),
    user: User = Depends(
        require_role("buyer")
    ),
):
    rows = (
        db.query(RFQ)
        .filter(
            RFQ.buyer_id
            == user.id
        )
        .order_by(
            RFQ.created_at.desc()
        )
        .all()
    )

    return [
        serialize(r, db)
        for r in rows
    ]


@router.get("/supplier")
def supplier_rfqs(
    db: Session = Depends(
        get_db
    ),
    user: User = Depends(
        require_role(
            "supplier"
        )
    ),
):
    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.owner_user_id
            == user.id
        )
        .first()
    )

    if not supplier:
        return []

    rows = (
        db.query(RFQ)
        .filter(
            RFQ.supplier_id
            == supplier.id
        )
        .order_by(
            RFQ.created_at.desc()
        )
        .all()
    )

    return [
        serialize(r, db)
        for r in rows
    ]


# ==========================================
# REAL ADMIN GLOBAL RFQ SUPERVISION
# ==========================================
#
# Admin can see every RFQ created across
# the Nirman platform.
#
# This endpoint powers:
# - Global RFQ Supervision
# - RFQ volume analytics
# - Quoted RFQ count
# - RFQ response-rate calculation
#
# Buyers and Suppliers cannot access it.
#
@router.get("/admin")
def admin_rfqs(
    db: Session = Depends(
        get_db
    ),
    _: User = Depends(
        require_role("admin")
    ),
):
    rows = (
        db.query(RFQ)
        .order_by(
            RFQ.created_at.desc()
        )
        .all()
    )

    return [
        serialize(r, db)
        for r in rows
    ]


@router.post("/{rfq_id}/quote")
def submit_quote(
    rfq_id: str,
    payload: RFQQuoteCreate,
    db: Session = Depends(
        get_db
    ),
    user: User = Depends(
        require_role(
            "supplier"
        )
    ),
):
    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.owner_user_id
            == user.id
        )
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail=(
                "Supplier profile "
                "not found"
            ),
        )

    rfq = db.get(
        RFQ,
        rfq_id,
    )

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail=(
                "RFQ not found"
            ),
        )

    if (
        rfq.supplier_id
        != supplier.id
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "This RFQ does not "
                "belong to your "
                "supplier profile"
            ),
        )

    quote = {
        "supplierId":
            str(
                supplier.id
            ),

        "supplierName":
            supplier.company_name,

        "unitPrice":
            payload.unit_price,

        "currency":
            payload.currency,

        "toolingCost":
            payload.tooling_cost,

        "estimatedLeadDays":
            payload
            .estimated_lead_days,

        "notes":
            payload.notes,

        "quotedAt":
            datetime.now(
                timezone.utc
            ).isoformat(),

        "validUntil":
            payload.valid_until,
    }

    rfq.quote = quote
    rfq.status = "quoted"

    db.commit()
    db.refresh(rfq)

    return serialize(
        rfq,
        db,
    )


@router.post("/{rfq_id}/accept")
def accept_quote(
    rfq_id: str,
    db: Session = Depends(
        get_db
    ),
    user: User = Depends(
        require_role("buyer")
    ),
):
    """
    Buyer accepts a Supplier quotation.

    Accepting the quotation also
    creates a persistent sourcing
    order.
    """

    rfq = db.get(
        RFQ,
        rfq_id,
    )

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail=(
                "RFQ not found"
            ),
        )

    # Buyer can only accept their
    # own RFQ.
    if (
        rfq.buyer_id
        != user.id
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "You are not allowed "
                "to accept this RFQ"
            ),
        )

    # A quote must exist.
    if not rfq.quote:
        raise HTTPException(
            status_code=400,
            detail=(
                "This RFQ does not "
                "have a supplier "
                "quotation"
            ),
        )

    # Check whether an order already
    # exists for this RFQ.
    #
    # rfq_id is UNIQUE in orders.
    existing_order = (
        db.query(Order)
        .filter(
            Order.rfq_id
            == rfq.id
        )
        .first()
    )

    # Makes the endpoint safe if an
    # accepted RFQ already has its
    # order.
    if existing_order:
        if (
            rfq.status
            != "accepted"
        ):
            rfq.status = (
                "accepted"
            )

            db.commit()
            db.refresh(rfq)

        return serialize(
            rfq,
            db,
        )

    # Normally only quoted RFQs may
    # be accepted.
    #
    # Also allow an already-accepted
    # RFQ with no order so old RFQs
    # can be repaired.
    if rfq.status not in (
        "quoted",
        "accepted",
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                f"RFQ cannot be "
                f"accepted while "
                f"status is "
                f"'{rfq.status}'"
            ),
        )

    quote = rfq.quote

    try:
        unit_price = float(
            quote.get(
                "unitPrice",
                0,
            )
        )

        tooling_cost = float(
            quote.get(
                "toolingCost",
                0,
            )
            or 0
        )

        estimated_lead_days = int(
            quote.get(
                "estimatedLeadDays",
                rfq.target_delivery_days,
            )
        )

        currency = (
            quote.get(
                "currency",
                "INR",
            )
            or "INR"
        )

        if unit_price <= 0:
            raise ValueError(
                "Invalid unit price"
            )

        if (
            estimated_lead_days
            <= 0
        ):
            raise ValueError(
                "Invalid lead time"
            )

    except (
        TypeError,
        ValueError,
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Supplier quotation "
                "contains invalid "
                "pricing or lead-time "
                "data"
            ),
        )

    total_amount = (
        unit_price
        * rfq.quantity
    ) + tooling_cost

    order = Order(
        rfq_id=rfq.id,

        buyer_id=
            rfq.buyer_id,

        supplier_id=
            rfq.supplier_id,

        part_name=
            rfq.title,

        quantity=
            rfq.quantity,

        unit_price=
            unit_price,

        tooling_cost=
            tooling_cost,

        total_amount=
            total_amount,

        currency=
            currency,

        status=
            "confirmed",

        estimated_lead_days=
            estimated_lead_days,

        tracking_number=None,

        inspection_cert_attached=False,
    )

    rfq.status = (
        "accepted"
    )

    try:
        db.add(order)

        # RFQ acceptance + Order
        # creation happen in the
        # same transaction.
        db.commit()

        db.refresh(rfq)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to create "
                "sourcing order for "
                "this RFQ"
            ),
        )

    return serialize(
        rfq,
        db,
    )