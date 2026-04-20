/** Base URL du backend FastAPI (Railway, localhost, etc.) */
export function getApiBaseUrl(): string {
  const v = import.meta.env.VITE_API_URL;
  if (v && typeof v === 'string' && v.trim()) {
    return v.replace(/\/$/, '');
  }
  return 'http://localhost:8000';
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
