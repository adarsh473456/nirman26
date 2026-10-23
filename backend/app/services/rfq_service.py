from sqlalchemy.orm import Session
from app.models import RFQ

def buyer_rfq_count(db: Session, buyer_id) -> int:
    return db.query(RFQ).filter(RFQ.buyer_id == buyer_id).count()
