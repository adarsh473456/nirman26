import uuid
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base


class VerificationReview(Base):
    __tablename__ = "verification_reviews"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    supplier_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("suppliers.id"), index=True)
    admin_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    status: Mapped[str] = mapped_column(String(30))
    notes: Mapped[str] = mapped_column(Text, default="")
    reviewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())