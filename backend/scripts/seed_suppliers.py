from app.database.session import SessionLocal
from app.models import Supplier, User

SEED_AUTH0_ID = "seed|supplier"

if __name__ == "__main__":
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.auth0_id == SEED_AUTH0_ID).first()
        if not user:
            user = User(auth0_id=SEED_AUTH0_ID, email="supplier@example.com", name="Seed Supplier", company="PrecisionTech Dynamics", role="supplier")
            db.add(user); db.commit(); db.refresh(user)
        supplier = db.query(Supplier).filter(Supplier.owner_user_id == user.id).first()
        if not supplier:
            supplier = Supplier(owner_user_id=user.id, company_name="PrecisionTech Dynamics", tagline="AS9100D & ISO 9001 Certified High-Precision 5-Axis CNC Machining", overview="Pilot seed supplier for Nirman.", category="CNC Machining", capabilities=["5-axis CNC machining", "CMM inspection"], materials=["Aluminum 6061-T6", "Titanium Gr5", "Stainless Steel 316L", "Inconel 718", "PEEK"], certifications=[{"id":"cert-1","name":"AS9100D","code":"AS9100D","issuer":"IAQG","validUntil":"2027-12-31","verified":True}], machinery=[], images={"logo":"","hero":"","facility":[],"samples":[]}, contact={"contactPerson":"Seed Contact","title":"Sales","email":"supplier@example.com","phone":"","website":"","address":"Bangalore, Karnataka"}, city="Bangalore", state="Karnataka", country="India", gst_number="29ABCDE1234F1Z5", registered_legal_name="PrecisionTech Dynamics Private Limited", verification_status="verified", verified=True, employee_count="85-100", established_year=2012, moq=1, avg_lead_time_days=14)
            db.add(supplier); db.commit()
        print("Seed complete")
    finally:
        db.close()
