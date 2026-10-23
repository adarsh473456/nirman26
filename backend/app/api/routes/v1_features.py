from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.api.dependencies import current_user, require_role
from app.database.session import get_db
from app.models import Order, RFQ, RFQTemplate, Review, SavedSearch, Supplier, SupplierView, User

router = APIRouter(prefix="/v1", tags=["v1-features"])

class BulkRFQCreate(BaseModel):
    supplier_ids: list[str] = Field(min_length=1, max_length=50)
    title: str = Field(min_length=3, max_length=300)
    category: str = ""
    material: str = ""
    quantity: int = Field(gt=0)
    target_unit_budget: float | None = Field(default=None, ge=0)
    target_delivery_days: int = Field(default=14, gt=0)
    specifications: str = ""
    certifications_required: list[str] = Field(default_factory=list)
    attachments: list[dict] = Field(default_factory=list)

class SavedSearchCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    query: str = ""
    filters: dict = Field(default_factory=dict)
    alert_enabled: bool = True

class TemplateCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    category: str = ""
    material: str = ""
    specifications: str = ""
    certifications_required: list[str] = Field(default_factory=list)
    target_delivery_days: int = Field(default=14, gt=0)

class ReviewCreate(BaseModel):
    order_id: str
    rating: int = Field(ge=1, le=5)
    comment: str = Field(default="", max_length=3000)

def rfq_dict(r: RFQ, db: Session):
    s = db.get(Supplier, r.supplier_id)
    q = r.quote or {}
    total = None
    if q:
        total = float(q.get("unitPrice", 0)) * r.quantity + float(q.get("toolingCost", 0))
    return {"id": str(r.id), "supplierId": str(r.supplier_id), "supplierName": s.company_name if s else "", "title": r.title, "quantity": r.quantity, "status": r.status, "quote": q or None, "totalQuoted": total, "createdAt": r.created_at.isoformat() if r.created_at else None}

@router.post("/rfqs/bulk")
def create_bulk_rfq(payload: BulkRFQCreate, db: Session = Depends(get_db), user: User = Depends(require_role("buyer"))):
    ids = list(dict.fromkeys(payload.supplier_ids))
    suppliers = db.query(Supplier).filter(Supplier.id.in_(ids)).all()
    found = {str(s.id) for s in suppliers}
    missing = [x for x in ids if x not in found]
    if missing:
        raise HTTPException(404, detail=f"Supplier(s) not found: {', '.join(missing)}")
    common = payload.model_dump(exclude={"supplier_ids"})
    rows = [RFQ(buyer_id=user.id, supplier_id=s.id, **common) for s in suppliers]
    db.add_all(rows); db.commit()
    for r in rows: db.refresh(r)
    return {"created": len(rows), "rfqs": [rfq_dict(r, db) for r in rows]}

@router.get("/rfqs/quote-comparison")
def quote_comparison(db: Session = Depends(get_db), user: User = Depends(require_role("buyer"))):
    rows = db.query(RFQ).filter(RFQ.buyer_id == user.id, RFQ.quote.isnot(None)).order_by(RFQ.created_at.desc()).all()
    return [rfq_dict(r, db) for r in rows]

@router.get("/buyer/analytics")
def buyer_analytics(db: Session = Depends(get_db), user: User = Depends(require_role("buyer"))):
    rows = db.query(RFQ).filter(RFQ.buyer_id == user.id).all()
    total = len(rows); quoted = sum(1 for r in rows if r.quote); accepted = sum(1 for r in rows if r.status == "accepted")
    turnaround = []
    spend = 0.0
    for r in rows:
        q = r.quote or {}
        if q and r.created_at and q.get("quotedAt"):
            try:
                qt = datetime.fromisoformat(q["quotedAt"].replace("Z", "+00:00"))
                created = r.created_at if r.created_at.tzinfo else r.created_at.replace(tzinfo=timezone.utc)
                turnaround.append((qt-created).total_seconds()/3600)
            except Exception: pass
        if r.status == "accepted" and q:
            spend += float(q.get("unitPrice", 0))*r.quantity + float(q.get("toolingCost", 0))
    return {"total_rfqs": total, "quoted_rfqs": quoted, "accepted_rfqs": accepted, "response_rate_pct": round(quoted*100/total,1) if total else 0, "conversion_rate_pct": round(accepted*100/total,1) if total else 0, "avg_quote_turnaround_hours": round(sum(turnaround)/len(turnaround),1) if turnaround else 0, "accepted_order_value": round(spend,2)}

@router.post("/saved-searches")
def save_search(payload: SavedSearchCreate, db: Session = Depends(get_db), user: User = Depends(require_role("buyer"))):
    row = SavedSearch(buyer_id=user.id, **payload.model_dump()); db.add(row); db.commit(); db.refresh(row)
    return {"id": str(row.id), **payload.model_dump(), "created_at": row.created_at.isoformat() if row.created_at else None}

@router.get("/saved-searches")
def saved_searches(db: Session = Depends(get_db), user: User = Depends(require_role("buyer"))):
    rows=db.query(SavedSearch).filter(SavedSearch.buyer_id==user.id).order_by(SavedSearch.created_at.desc()).all()
    return [{"id":str(x.id),"name":x.name,"query":x.query,"filters":x.filters,"alert_enabled":x.alert_enabled} for x in rows]

@router.delete("/saved-searches/{search_id}")
def delete_saved_search(search_id: str, db: Session=Depends(get_db), user: User=Depends(require_role("buyer"))):
    row=db.get(SavedSearch, search_id)
    if not row or row.buyer_id != user.id: raise HTTPException(404,"Saved search not found")
    db.delete(row); db.commit(); return {"ok": True}

@router.post("/rfq-templates")
def create_template(payload: TemplateCreate, db: Session=Depends(get_db), user: User=Depends(require_role("buyer"))):
    row=RFQTemplate(buyer_id=user.id, **payload.model_dump()); db.add(row); db.commit(); db.refresh(row)
    return {"id":str(row.id), **payload.model_dump()}

@router.get("/rfq-templates")
def templates(db: Session=Depends(get_db), user: User=Depends(require_role("buyer"))):
    rows=db.query(RFQTemplate).filter(RFQTemplate.buyer_id==user.id).order_by(RFQTemplate.created_at.desc()).all()
    return [{"id":str(x.id),"name":x.name,"category":x.category,"material":x.material,"specifications":x.specifications,"certifications_required":x.certifications_required or [],"target_delivery_days":x.target_delivery_days} for x in rows]

@router.post("/reviews")
def create_review(payload: ReviewCreate, db: Session=Depends(get_db), user: User=Depends(require_role("buyer"))):
    order=db.get(Order,payload.order_id)
    if not order or order.buyer_id != user.id: raise HTTPException(404,"Order not found")
    existing=db.query(Review).filter(Review.buyer_id==user.id,Review.order_id==order.id).first()
    if existing: raise HTTPException(409,"This order has already been reviewed")
    row=Review(buyer_id=user.id,supplier_id=order.supplier_id,order_id=order.id,rating=payload.rating,comment=payload.comment)
    db.add(row); db.commit(); db.refresh(row); return {"id":str(row.id),"rating":row.rating,"comment":row.comment}

@router.get("/suppliers/{supplier_id}/reviews")
def supplier_reviews(supplier_id: str, db: Session=Depends(get_db), _: User=Depends(current_user)):
    rows=db.query(Review).filter(Review.supplier_id==supplier_id).order_by(Review.created_at.desc()).all()
    avg=db.query(func.avg(Review.rating)).filter(Review.supplier_id==supplier_id).scalar()
    return {"rating":round(float(avg or 0),1),"reviewCount":len(rows),"reviews":[{"id":str(x.id),"rating":x.rating,"comment":x.comment,"createdAt":x.created_at.isoformat() if x.created_at else None} for x in rows]}

@router.post("/suppliers/{supplier_id}/view")
def record_supplier_view(supplier_id: str, db: Session=Depends(get_db), user: User=Depends(current_user)):
    if not db.get(Supplier,supplier_id): raise HTTPException(404,"Supplier not found")
    row=SupplierView(supplier_id=supplier_id,viewer_user_id=user.id); db.add(row); db.commit(); return {"ok":True}

@router.get("/supplier/analytics")
def supplier_analytics(db: Session=Depends(get_db), user: User=Depends(require_role("supplier"))):
    s=db.query(Supplier).filter(Supplier.owner_user_id==user.id).first()
    if not s: raise HTTPException(404,"Supplier profile not found")
    rfqs=db.query(RFQ).filter(RFQ.supplier_id==s.id).all(); quoted=[r for r in rfqs if r.quote]; accepted=[r for r in rfqs if r.status=="accepted"]
    response_hours=[]
    for r in quoted:
        try:
            qt=datetime.fromisoformat(r.quote["quotedAt"].replace("Z","+00:00")); created=r.created_at if r.created_at.tzinfo else r.created_at.replace(tzinfo=timezone.utc); response_hours.append((qt-created).total_seconds()/3600)
        except Exception: pass
    views=db.query(SupplierView).filter(SupplierView.supplier_id==s.id).count()
    unique=db.query(func.count(func.distinct(SupplierView.viewer_user_id))).filter(SupplierView.supplier_id==s.id).scalar() or 0
    avg=round(sum(response_hours)/len(response_hours),1) if response_hours else 0
    badge="New supplier" if not quoted else ("Responds < 4h" if avg <= 4 else "Responds < 24h" if avg <= 24 else "Responds in 1+ day")
    return {"profile_views":views,"unique_viewers":int(unique),"rfqs_received":len(rfqs),"quotes_submitted":len(quoted),"rfq_response_rate_pct":round(len(quoted)*100/len(rfqs),1) if rfqs else 0,"accepted_quotes":len(accepted),"quote_win_rate_pct":round(len(accepted)*100/len(quoted),1) if quoted else 0,"avg_response_time_hours":avg,"response_badge":badge}

class CapabilityExtractRequest(BaseModel):
    text: str = Field(min_length=20, max_length=20000)

@router.post("/ai/extract-capabilities")
def extract_capabilities(payload: CapabilityExtractRequest, _: User=Depends(require_role("supplier","admin"))):
    from app.ai.client import get_openai_client
    from app.core.config import settings
    import json
    client=get_openai_client()
    if not client:
        # Safe fallback keeps onboarding usable without an API key.
        words=[x.strip(" ,.;:()[]").lower() for x in payload.text.split()]
        common=[x for x in ["cnc","turning","milling","casting","forging","welding","injection molding","3d printing","pcb","assembly","aluminium","aluminum","steel","titanium","as9100","iso 9001"] if x in payload.text.lower()]
        return {"capabilities":common,"materials":[],"processes":common,"machinery":[],"industries":[],"certifications":[],"source":"fallback"}
    instructions='''Extract a supplier capability profile from the supplied company text. Return JSON only with arrays: capabilities, materials, processes, machinery, industries, certifications. Never invent facts not present in the text.'''
    response=client.responses.create(model=settings.openai_model,instructions=instructions,input=payload.text)
    try:
        data=json.loads(response.output_text)
        return {k:list(dict.fromkeys(data.get(k,[]) or [])) for k in ["capabilities","materials","processes","machinery","industries","certifications"]} | {"source":"ai"}
    except Exception:
        raise HTTPException(502,"AI extraction returned an invalid response")

class ExportReadinessRequest(BaseModel):
    destination_country: str = Field(min_length=2,max_length=120)
    product_description: str = Field(min_length=2,max_length=1000)
    required_documents: list[str] = Field(default_factory=list)
    available_documents: list[str] = Field(default_factory=list)
    export_control_checked: bool = False
    license_confirmed_if_required: bool = False

@router.post("/export-readiness")
def export_readiness(payload: ExportReadinessRequest, _: User=Depends(current_user)):
    required={x.strip().lower():x.strip() for x in payload.required_documents if x.strip()}
    available={x.strip().lower() for x in payload.available_documents if x.strip()}
    missing=[label for key,label in required.items() if key not in available]
    blockers=[]
    if not payload.export_control_checked: blockers.append("Export-control / SCOMET applicability has not been checked")
    if not payload.license_confirmed_if_required: blockers.append("Required export licence, if applicable, has not been confirmed")
    status="ready" if not missing and not blockers else ("documents_missing" if missing else "compliance_check_required")
    return {"status":status,"destination_country":payload.destination_country,"missing_documents":missing,"compliance_checks":blockers,"note":"Decision-support only. Final export classification/licensing must be verified by an authorised compliance professional or competent authority."}
