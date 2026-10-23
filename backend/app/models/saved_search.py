import uuid
from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base

class SavedSearch(Base):
    __tablename__ = "saved_searches"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    buyer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(160))
    query: Mapped[str] = mapped_column(String(500), default="")
    filters: Mapped[dict] = mapped_column(JSON, default=dict)
    alert_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
