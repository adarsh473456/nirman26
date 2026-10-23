import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class RFQ(Base):
    __tablename__ = "rfqs"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    buyer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"),
        index=True,
    )

    supplier_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("suppliers.id"),
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(300)
    )

    category: Mapped[str] = mapped_column(
        String(120),
        default="",
    )

    material: Mapped[str] = mapped_column(
        String(120),
        default="",
    )

    quantity: Mapped[int] = mapped_column(
        Integer
    )

    target_unit_budget: Mapped[float | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    target_delivery_days: Mapped[int] = mapped_column(
        Integer,
        default=14,
    )

    specifications: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    certifications_required: Mapped[list] = mapped_column(
        JSON,
        default=list,
    )

    attachments: Mapped[list] = mapped_column(
        JSON,
        default=list,
    )

    status: Mapped[str] = mapped_column(
        String(40),
        default="submitted",
    )

    quote: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )