from app.core.permissions import ensure_role

def test_allowed_role():
    assert ensure_role("buyer", "buyer", "admin") is None
