from app.schemas.rfq import RFQCreate

def test_valid_rfq():
    rfq = RFQCreate(supplier_id="00000000-0000-0000-0000-000000000001", title="Titanium bracket", quantity=10)
    assert rfq.quantity == 10
