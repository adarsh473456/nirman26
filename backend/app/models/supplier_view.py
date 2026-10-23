import uuid
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base

class SupplierView(Base):
    __tablename__ = "supplier_views"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    supplier_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("suppliers.id"), index=True)
    viewer_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    viewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
