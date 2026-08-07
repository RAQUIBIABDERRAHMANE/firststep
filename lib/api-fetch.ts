import { cookies } from 'next/headers';

const GATEWAY_URL = 'http://localhost:8000/api';

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('fs_session_token')?.value;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const tenantSlug = cookieStore.get('fs_tenant_slug')?.value;
  if (tenantSlug) {
    headers.set('X-Tenant-Slug', tenantSlug);
  }

  const response = await fetch(`${GATEWAY_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
}
