from app.schemas.verification import VerificationDecision

def test_verification_decision():
    decision = VerificationDecision(approved=True, notes="Documents checked")
    assert decision.approved is True
