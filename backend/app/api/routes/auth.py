from fastapi import APIRouter, Depends
from app.api.dependencies import current_user
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
def auth_me(user: User = Depends(current_user)):
    return {"id": str(user.id), "email": user.email, "name": user.name, "company": user.company, "role": user.role}
