/**
 * Base URL for static files (uploads) — strips trailing /api from VITE_API_URL.
 */
export function getApiOrigin(): string {
  let base = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
  if (base.toLowerCase().endsWith('/api')) {
    base = base.slice(0, -4);
  }
  if (!base) {
    return window.location.origin;
  }
  return base.startsWith('http') ? base : window.location.origin;
}

/** Resolve stored paths like /uploads/gallery/foo.jpg to a full browser URL */
export function resolveUploadUrl(path: string | null | undefined): string {
  if (!path) return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="%23f4efe5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23988f80" font-family="Arial" font-size="24">No Photo</text></svg>';
  if (path.startsWith('http')) return path;
  const origin = getApiOrigin();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${p}`;
}
