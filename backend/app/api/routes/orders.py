from fastapi import (
    APIRouter,
    Depends,
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


router = APIRouter(
    prefix="/orders",
    tags=["orders"],
)


def serialize_order(
    order: Order,
    db: Session,
):
    supplier = db.get(
        Supplier,
        order.supplier_id,
    )

    buyer = db.get(
        User,
        order.buyer_id,
    )

    rfq = db.get(
        RFQ,
        order.rfq_id,
    )

    buyer_name = ""

    if buyer:
        buyer_name = (
            getattr(buyer, "name", None)
            or getattr(buyer, "full_name", None)
            or getattr(buyer, "display_name", None)
            or ""
        )

    buyer_email = (
        getattr(buyer, "email", "")
        if buyer
        else ""
    )

    buyer_company = ""

    if buyer:
        buyer_company = (
            getattr(buyer, "company_name", None)
            or getattr(buyer, "company", None)
            or ""
        )

    return {
        "id": str(order.id),

        "rfqId": str(
            order.rfq_id
        ),

        "buyerId": str(
            order.buyer_id
        ),

        "buyerName":
            buyer_name,

        "buyerEmail":
            buyer_email,

        "buyerCompany":
            buyer_company,

        "supplierId": str(
            order.supplier_id
        ),

        "supplierName": (
            supplier.company_name
            if supplier
            else ""
        ),

        "partName":
            order.part_name,

        "category": (
            rfq.category
            if rfq
            else ""
        ),

        "material": (
            rfq.material
            if rfq
            else ""
        ),

        "quantity":
            order.quantity,

        "unitPrice":
            float(
                order.unit_price
            ),

        "toolingCost":
            float(
                order.tooling_cost
            ),

        "totalAmount":
            float(
                order.total_amount
            ),

        "currency":
            order.currency,

        "status":
            order.status,

        "estimatedLeadDays":
            order.estimated_lead_days,

        "trackingNumber":
            order.tracking_number,

        "inspectionCertAttached":
            order.inspection_cert_attached,

        "orderDate": (
            order.created_at.isoformat()
            if order.created_at
            else None
        ),
    }


@router.get("/buyer")
def buyer_orders(
    db: Session = Depends(get_db),
    user: User = Depends(
        require_role("buyer")
    ),
):
    """
    Return all real sourcing orders
    belonging to the logged-in Buyer.
    """

    rows = (
        db.query(Order)
        .filter(
            Order.buyer_id
            == user.id
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )

    return [
        serialize_order(
            order,
            db,
        )
        for order in rows
    ]


@router.get("/supplier")
def supplier_orders(
    db: Session = Depends(get_db),
    user: User = Depends(
        require_role("supplier")
    ),
):
    """
    Return all real sourcing orders
    assigned to the logged-in
    Supplier profile.
    """

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
        db.query(Order)
        .filter(
            Order.supplier_id
            == supplier.id
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )

    return [
        serialize_order(
            order,
            db,
        )
        for order in rows
    ]