import httpx
from app.core.config import settings

def get_auth0_userinfo(access_token: str) -> dict:
    url = f"https://{settings.auth0_domain}/userinfo"
    try:
        response = httpx.get(url, headers={"Authorization": f"Bearer {access_token}"}, timeout=8.0)
        response.raise_for_status()
        data = response.json()
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}
