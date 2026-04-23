/**
 * Base URL du backend FastAPI.
 *
 * Variable locale / CI : `VITE_API_URL` (voir `frontend/.env`).
 * En prod sans variable, fallback Render ci-dessous.
 *
 * CORS est géré sur Render (`CORS_ORIGINS`, avec un « S ») ; les origines autorisées
 * doivent inclure l'URL du site (ex. Firebase) et Vite en dev, par ex. :
 *   https://phi-org.web.app,http://localhost:5173,http://127.0.0.1:5173
 */
const PRODUCTION_API_FALLBACK = 'https://phi-api-dt94.onrender.com';

export function getApiBaseUrl(): string {
  const v = import.meta.env.VITE_API_URL;
  if (v && typeof v === 'string' && v.trim()) {
    return v.replace(/\/$/, '');
  }
  if (import.meta.env.PROD) {
    return PRODUCTION_API_FALLBACK;
  }
  return 'http://localhost:8000';
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Wake up the Render backend (free tier sleeps after 15 min of inactivity).
 * Returns true once the server responds, false on failure.
 * Retries up to `maxRetries` times with `intervalMs` delay between attempts.
 */
export async function wakeBackend(
  maxRetries = 3,
  intervalMs = 4000,
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30_000);
      const res = await fetch(apiUrl('/ping'), { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) return true;
    } catch {
      // Server still waking up — wait and retry
    }
    if (i < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  return false;
}

/**
 * fetch() wrapper with AbortController-based timeout.
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 120_000,
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}
