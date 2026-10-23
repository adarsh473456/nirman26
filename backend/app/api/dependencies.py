from typing import Generator
import secrets

import httpx
import jwt

from fastapi import (
    Depends,
    HTTPException,
    Request,
    status,
)

from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from jwt import PyJWKClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import SessionLocal
from app.models.user import User


bearer_scheme = HTTPBearer()


# ---------------------------------------------------------
# DATABASE SESSION
# ---------------------------------------------------------

def get_db() -> Generator:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------
# AUTH0 ACCESS TOKEN VALIDATION
# ---------------------------------------------------------

def get_auth0_claims(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
):
    token = credentials.credentials

    try:
        jwks_url = (
            f"https://{settings.auth0_domain}"
            "/.well-known/jwks.json"
        )

        jwks_client = PyJWKClient(
            jwks_url
        )

        signing_key = (
            jwks_client
            .get_signing_key_from_jwt(
                token
            )
        )

        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.auth0_audience,
            issuer=(
                f"https://"
                f"{settings.auth0_domain}/"
            ),
        )

        # Save the access token temporarily.
        # current_user() may need it to
        # request Auth0 /userinfo.
        claims["_access_token"] = token

        return claims

    except Exception as exc:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Invalid authentication token"
            ),
        ) from exc


# ---------------------------------------------------------
# AUTH0 USER PROFILE
# ---------------------------------------------------------

def get_auth0_profile(
    token: str,
) -> dict:
    try:
        response = httpx.get(
            (
                f"https://"
                f"{settings.auth0_domain}"
                "/userinfo"
            ),
            headers={
                "Authorization":
                    f"Bearer {token}",
            },
            timeout=10.0,
        )

        if response.status_code != 200:
            return {}

        return response.json()

    except Exception:
        # Profile enrichment failure should
        # not completely break authentication.
        return {}


# ---------------------------------------------------------
# CURRENT AUTHENTICATED USER
# ---------------------------------------------------------

def current_user(
    claims: dict = Depends(
        get_auth0_claims
    ),
    db: Session = Depends(
        get_db
    ),
):
    sub = claims.get("sub")

    if not sub:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Authentication subject missing"
            ),
        )

    token = claims.get(
        "_access_token",
        "",
    )

    # Try profile information already
    # contained inside the token.
    email = claims.get(
        "email",
        "",
    )

    name = (
        claims.get("name")
        or claims.get("nickname")
        or ""
    )

    # If profile information is missing,
    # request it from Auth0 /userinfo.
    if not email or not name:
        profile = get_auth0_profile(
            token
        )

        email = (
            email
            or profile.get(
                "email",
                "",
            )
        )

        name = (
            name
            or profile.get(
                "name"
            )
            or profile.get(
                "nickname"
            )
            or ""
        )

    # Find the local Nirman user.
    user = (
        db.query(User)
        .filter(
            User.auth0_id == sub
        )
        .first()
    )

    # -----------------------------------------------------
    # FIRST LOGIN
    # -----------------------------------------------------

    if user is None:
        user = User(
            auth0_id=sub,
            email=email,
            name=name,
            company="",
            role="buyer",
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    # -----------------------------------------------------
    # UPDATE MISSING PROFILE INFORMATION
    # -----------------------------------------------------

    changed = False

    if email and not user.email:
        user.email = email
        changed = True

    if name and not user.name:
        user.name = name
        changed = True

    if changed:
        db.commit()
        db.refresh(user)

    return user


# ---------------------------------------------------------
# ACTIVE SESSION ROLE
# ---------------------------------------------------------

def get_active_role(
    request: Request,
    user: User,
) -> str:
    """
    Return the role being used for the
    current Nirman login session.

    ADMIN:
        Always comes from PostgreSQL.

    NORMAL USER:
        Buyer/Supplier comes from the
        trusted Next.js server proxy.
    """

    # -----------------------------------------------------
    # ADMIN ALWAYS COMES FROM DATABASE
    # -----------------------------------------------------

    if user.role == "admin":
        return "admin"

    # -----------------------------------------------------
    # VERIFY NEXT.JS PROXY
    # -----------------------------------------------------

    expected_secret = (
        settings.nirman_proxy_secret
    )

    received_secret = (
        request.headers.get(
            "X-Nirman-Proxy-Secret",
            "",
        )
    )

    if not received_secret:
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail=(
                "Nirman proxy authentication "
                "header missing"
            ),
        )

    if not secrets.compare_digest(
        expected_secret,
        received_secret,
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail=(
                "Invalid Nirman proxy request"
            ),
        )

    # -----------------------------------------------------
    # READ ACTIVE BUYER / SUPPLIER ROLE
    # -----------------------------------------------------

    active_role = (
        request.headers.get(
            "X-Nirman-Role",
            "",
        )
        .strip()
        .lower()
    )

    # Admin can NEVER be supplied from
    # the browser or proxy role selector.
    if active_role not in (
        "buyer",
        "supplier",
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail=(
                "Invalid active Nirman role"
            ),
        )

    return active_role


# ---------------------------------------------------------
# ROLE AUTHORIZATION
# ---------------------------------------------------------

def require_role(
    *allowed_roles: str,
):
    """
    FastAPI dependency for role-protected
    endpoints.

    Examples:

        Depends(
            require_role("buyer")
        )

        Depends(
            require_role(
                "supplier",
                "admin",
            )
        )
    """

    def role_checker(
        request: Request,
        user: User = Depends(
            current_user
        ),
    ):
        active_role = get_active_role(
            request,
            user,
        )

        if active_role not in allowed_roles:
            raise HTTPException(
                status_code=(
                    status.HTTP_403_FORBIDDEN
                ),
                detail=(
                    f"Role '{active_role}' "
                    f"is not allowed to "
                    f"access this resource"
                ),
            )

        return user

    return role_checker