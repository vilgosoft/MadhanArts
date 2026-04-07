/**
 * Base URL for static files (uploads) — strips trailing /api from VITE_API_URL.
 */
export function getApiOrigin(): string {
  let base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
  if (base.toLowerCase().endsWith('/api')) {
    base = base.slice(0, -4);
  }
  return base || 'http://localhost:8000';
}

/** Resolve stored paths like /uploads/gallery/foo.jpg to a full browser URL */
export function resolveUploadUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const origin = getApiOrigin();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${p}`;
}
