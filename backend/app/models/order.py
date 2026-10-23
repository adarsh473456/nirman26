import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Boolean,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    rfq_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("rfqs.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    buyer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    supplier_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("suppliers.id"),
        nullable=False,
        index=True,
    )

    part_name: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    unit_price: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    tooling_cost: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    total_amount: Mapped[float] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="INR",
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="confirmed",
    )

    estimated_lead_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=14,
    )

    tracking_number: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    inspection_cert_attached: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )