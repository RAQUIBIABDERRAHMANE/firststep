<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantResolver
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $slug = null;

        // 1. Resolve via custom subdomains (e.g., classic-burger.firststepco.com)
        // Adjust for staging/local addresses as well
        if ($host !== 'firststepco.com' && str_ends_with($host, '.firststepco.com')) {
            $slug = str_replace('.firststepco.com', '', $host);
        } elseif ($host !== 'firststep.local' && str_ends_with($host, '.firststep.local')) {
            $slug = str_replace('.firststep.local', '', $host);
        }

        // 2. Resolve fallback header (for local testing/cross-origin requests)
        if (!$slug && $request->hasHeader('X-Tenant-Slug')) {
            $slug = $request->header('X-Tenant-Slug');
        }

        if ($slug) {
            // Bind the tenant slug into Laravel container
            app()->instance('tenant.slug', $slug);
            $request->headers->set('X-Tenant-Resolved-Slug', $slug);
        }

        return $next($request);
    }
}
