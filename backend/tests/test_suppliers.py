from app.schemas.supplier import SupplierUpsert

def test_supplier_defaults_are_isolated():
    a = SupplierUpsert(company_name="Alpha Works", category="CNC Machining")
    b = SupplierUpsert(company_name="Beta Works", category="CNC Machining")
    a.materials.append("Titanium")
    assert b.materials == []
