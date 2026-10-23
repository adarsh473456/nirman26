from functools import lru_cache
import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, status
from app.core.config import settings

@lru_cache
def get_jwks_client() -> PyJWKClient:
    return PyJWKClient(f"https://{settings.auth0_domain}/.well-known/jwks.json")

def decode_access_token(token: str) -> dict:
    try:
        signing_key = get_jwks_client().get_signing_key_from_jwt(token).key
        return jwt.decode(token, signing_key, algorithms=["RS256"], audience=settings.auth0_audience, issuer=f"https://{settings.auth0_domain}/")
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token") from exc
