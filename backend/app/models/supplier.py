import uuid
from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text, Float, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    owner_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    company_name: Mapped[str] = mapped_column(String(255), index=True)
    tagline: Mapped[str] = mapped_column(String(500), default="")
    overview: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(120), index=True)
    subcategories: Mapped[list] = mapped_column(JSON, default=list)
    capabilities: Mapped[list] = mapped_column(JSON, default=list)
    materials: Mapped[list] = mapped_column(JSON, default=list)
    certifications: Mapped[list] = mapped_column(JSON, default=list)
    machinery: Mapped[list] = mapped_column(JSON, default=list)
    images: Mapped[dict] = mapped_column(JSON, default=dict)
    contact: Mapped[dict] = mapped_column(JSON, default=dict)
    city: Mapped[str] = mapped_column(String(120), default="")
    state: Mapped[str] = mapped_column(String(120), default="")
    country: Mapped[str] = mapped_column(String(120), default="India")
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    gst_number: Mapped[str] = mapped_column(String(30), default="")
    registered_legal_name: Mapped[str] = mapped_column(String(255), default="")
    verification_status: Mapped[str] = mapped_column(String(30), default="pending")
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    employee_count: Mapped[str] = mapped_column(String(80), default="")
    established_year: Mapped[int] = mapped_column(Integer, default=2026)
    moq: Mapped[int] = mapped_column(Integer, default=1)
    avg_lead_time_days: Mapped[int] = mapped_column(Integer, default=14)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())