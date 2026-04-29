import os
import time
from typing import Any

import jwt
import requests
from fastapi import Header, HTTPException

FIREBASE_CERTS_URL = (
    "https://www.googleapis.com/robot/v1/metadata/x509/"
    "securetoken@system.gserviceaccount.com"
)

_CERT_CACHE: dict[str, Any] = {"expires_at": 0.0, "certs": {}}


def _env_flag(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _get_project_id() -> str:
    project_id = os.getenv("FIREBASE_PROJECT_ID", "phi-org").strip()
    if not project_id:
        raise HTTPException(status_code=500, detail="FIREBASE_PROJECT_ID is not configured")
    return project_id


def _get_firebase_certs() -> dict[str, str]:
    now = time.time()
    if _CERT_CACHE["certs"] and _CERT_CACHE["expires_at"] > now:
        return _CERT_CACHE["certs"]

    try:
        res = requests.get(FIREBASE_CERTS_URL, timeout=10)
        res.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=503, detail="Impossible de vérifier le token Firebase") from exc

    max_age = 3600
    cache_control = res.headers.get("cache-control", "")
    for part in cache_control.split(","):
        part = part.strip()
        if part.startswith("max-age="):
            try:
                max_age = int(part.split("=", 1)[1])
            except ValueError:
                pass

    _CERT_CACHE["certs"] = res.json()
    _CERT_CACHE["expires_at"] = now + max_age
    return _CERT_CACHE["certs"]


def get_current_user(authorization: str | None = Header(default=None)) -> str:
    """Validate a Firebase ID token and return the Firebase UID.

    For local development only, set AUTH_ALLOW_TEST_USER=true to allow missing
    Authorization headers and map them to TEST_USER_ID/test-user-id.
    """
    if not authorization:
        if _env_flag("AUTH_ALLOW_TEST_USER", default=False):
            return os.getenv("TEST_USER_ID", "test-user-id")
        raise HTTPException(status_code=401, detail="Authorization header manquant")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Authorization Bearer token invalide")

    try:
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        cert = _get_firebase_certs().get(kid)
        if not cert:
            raise HTTPException(status_code=401, detail="Certificat Firebase inconnu")

        project_id = _get_project_id()
        payload = jwt.decode(
            token,
            cert,
            algorithms=["RS256"],
            audience=project_id,
            issuer=f"https://securetoken.google.com/{project_id}",
        )
    except HTTPException:
        raise
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Token Firebase invalide") from exc

    uid = payload.get("user_id") or payload.get("sub")
    if not uid:
        raise HTTPException(status_code=401, detail="Token Firebase sans UID")
    return str(uid)

