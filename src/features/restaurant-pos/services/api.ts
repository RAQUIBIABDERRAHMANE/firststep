export const posApiFetch = async (path: string, options: RequestInit = {}) => {
  const activeTenantSlug = typeof window !== 'undefined' ? localStorage.getItem('fs_tenant_slug') : null;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (activeTenantSlug) {
    headers.set('X-Tenant-Slug', activeTenantSlug);
  }

  const response = await fetch(`http://localhost:8000/api/v1/pos${path}`, {
    ...options,
    headers,
  });

  return response;
};
