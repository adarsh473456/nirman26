from pydantic import BaseModel


class VerificationDecision(BaseModel):
    approved: bool
    notes: str = ""