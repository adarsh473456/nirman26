from fastapi import HTTPException, status

def ensure_role(current_role: str, *allowed_roles: str) -> None:
    if current_role not in allowed_roles:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
