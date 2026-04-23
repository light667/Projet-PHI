"""
Supabase client — lazy initialization to avoid startup crashes
if environment variables are not yet loaded.
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

_client: Client | None = None


def get_supabase() -> Client:
    """Return the Supabase client, creating it on first call."""
    global _client
    if _client is not None:
        return _client

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. "
            "Check your .env file or Render environment variables."
        )

    _client = create_client(url, key)
    return _client


# Backward-compatible alias — existing code does `from db import supabase`
# This is a lazy proxy that defers the real client creation.
class _LazyClient:
    """Proxy that delegates every attribute access to the real Supabase client."""

    def __getattr__(self, name: str):
        return getattr(get_supabase(), name)


supabase: Client = _LazyClient()  # type: ignore[assignment]