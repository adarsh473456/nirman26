from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import current_user, require_role
from app.database.session import get_db
from app.models import User, Supplier, RFQ
from app.schemas.user import RoleUpdate


router = APIRouter(
    prefix="/users",
    tags=["users"],
)


def serialize(user: User):
    return {
        "id": str(user.id),
        "auth0_id": user.auth0_id,
        "email": user.email,
        "name": user.name,
        "company": user.company,
        "role": user.role,
    }


@router.get("/me")
def me(
    user: User = Depends(current_user),
):
    return serialize(user)


@router.patch("/me/role")
def update_role(
    payload: RoleUpdate,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    if user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Admin role cannot be changed here",
        )

    user.role = payload.role

    db.commit()
    db.refresh(user)

    return serialize(user)


@router.get("/admin/analytics")
def admin_analytics(
    db: Session = Depends(get_db),
    _: User = Depends(
        require_role("admin")
    ),
):
    """
    Real PostgreSQL-backed analytics for
    the Nirman Admin Dashboard.

    Admin only.
    """

    users = (
        db.query(User)
        .order_by(
            User.created_at.desc()
        )
        .all()
    )

    suppliers = (
        db.query(Supplier)
        .all()
    )

    rfqs = (
        db.query(RFQ)
        .order_by(
            RFQ.created_at.desc()
        )
        .all()
    )

    # Nirman currently allows a normal Auth0
    # account to operate as Buyer or Supplier
    # based on the selected login-session role.
    #
    # Therefore the database role is not a
    # reliable permanent Buyer/Supplier identity.
    #
    # For the current V1 analytics, all
    # non-admin registered accounts are counted
    # as normal platform users available to the
    # Buyer workflow.
    buyer_users = [
        user
        for user in users
        if user.role != "admin"
    ]

    verified_suppliers = [
        supplier
        for supplier in suppliers
        if supplier.verified
    ]

    quoted_rfqs = [
        rfq
        for rfq in rfqs
        if rfq.status in (
            "quoted",
            "accepted",
        )
    ]

    accepted_rfqs = [
        rfq
        for rfq in rfqs
        if rfq.status == "accepted"
    ]

    # Current platform match/response rate:
    #
    # Percentage of RFQs that received a
    # Supplier quotation or progressed to
    # acceptance.
    if rfqs:
        match_rate = round(
            (
                len(quoted_rfqs)
                / len(rfqs)
            )
            * 100,
            1,
        )
    else:
        match_rate = 0.0

    recent_buyer_activity = []

    # Build recent activity directly from
    # real PostgreSQL RFQs.
    for rfq in rfqs[:10]:
        buyer = (
            db.query(User)
            .filter(
                User.id
                == rfq.buyer_id
            )
            .first()
        )

        if buyer:
            buyer_name = (
                buyer.name
                or buyer.email
                or "Unknown Buyer"
            )

            buyer_company = (
                buyer.company
                or ""
            )
        else:
            buyer_name = (
                "Unknown Buyer"
            )

            buyer_company = ""

        if rfq.status == "accepted":
            activity = (
                "RFQ accepted / "
                "order placed"
            )

        elif rfq.status == "quoted":
            activity = (
                "Supplier quotation "
                "received"
            )

        else:
            activity = (
                "RFQ posted"
            )

        recent_buyer_activity.append(
            {
                "id": str(rfq.id),

                "buyer_name":
                    buyer_name,

                "buyer_company":
                    buyer_company,

                "activity":
                    activity,

                "rfq_title":
                    rfq.title,

                "status":
                    rfq.status,

                "created_at":
                    (
                        rfq.created_at.isoformat()
                        if rfq.created_at
                        else None
                    ),
            }
        )

    return {
        "total_buyers":
            len(buyer_users),

        "total_suppliers":
            len(suppliers),

        "verified_suppliers":
            len(
                verified_suppliers
            ),

        "pending_suppliers":
            (
                len(suppliers)
                - len(
                    verified_suppliers
                )
            ),

        "total_rfqs":
            len(rfqs),

        "quoted_rfqs":
            len(quoted_rfqs),

        "accepted_rfqs":
            len(accepted_rfqs),

        "match_rate":
            match_rate,

        "recent_buyer_activity":
            recent_buyer_activity,
    }