import uuid
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base

class RFQTemplate(Base):
    __tablename__ = "rfq_templates"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    buyer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(160))
    category: Mapped[str] = mapped_column(String(120), default="")
    material: Mapped[str] = mapped_column(String(120), default="")
    specifications: Mapped[str] = mapped_column(Text, default="")
    certifications_required: Mapped[list] = mapped_column(JSON, default=list)
    target_delivery_days: Mapped[int] = mapped_column(default=14)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
