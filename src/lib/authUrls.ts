/** Safe in-app path for post-login/register redirect (blocks open redirects). */
export function sanitizeContinuePath(path: string | null | undefined): string | null {
  if (!path?.startsWith('/') || path.startsWith('//')) return null;
  return path;
}

export function loginUrl(continueTo?: string | null): string {
  const safe = sanitizeContinuePath(continueTo ?? null);
  return safe ? `/login?continue=${encodeURIComponent(safe)}` : '/login';
}

export function registerUrl(continueTo?: string | null): string {
  const safe = sanitizeContinuePath(continueTo ?? null);
  return safe ? `/register?continue=${encodeURIComponent(safe)}` : '/register';
}
