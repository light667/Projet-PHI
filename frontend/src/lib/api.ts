/**
 * Base URL du backend FastAPI.
 *
 * Variable locale / CI : `VITE_API_URL` (voir `frontend/.env`).
 * En prod sans variable, fallback Render ci-dessous.
 *
 * CORS est géré sur Render (`CORS_ORIGINS`, avec un « S ») ; les origines autorisées
 * doivent inclure l’URL du site (ex. Firebase) et Vite en dev, par ex. :
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
