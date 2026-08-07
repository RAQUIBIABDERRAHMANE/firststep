<?php

namespace App\Http\Controllers;

use App\Models\TenantWebsite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantController extends Controller
{
    public function show(string $slug)
    {
        $tenant = TenantWebsite::where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        return response()->json([
            'id' => $tenant->id,
            'slug' => $tenant->slug,
            'primaryColor' => $tenant->primary_color,
            'config' => $tenant->config,
            'designTemplate' => $tenant->design_template,
            'isActive' => $tenant->is_active,
            'createdAt' => $tenant->created_at,
            'updatedAt' => $tenant->updated_at,
            'siteName' => 'FirstStep Shop',
            'service' => [
                'slug' => 'restaurant'
            ]
        ]);
    }

    public function upsert(Request $request)
    {
        $request->validate([
            'site_name' => 'required|string',
            'slug' => 'required|string',
            'primary_color' => 'nullable|string',
            'design_template' => 'nullable|string',
            'config' => 'nullable|string',
            'user_id' => 'required|string'
        ]);

        $orgId = '019f09a1-66c5-703d-89a0-76181d77ac4a';
        $companyId = '019f09a1-66c5-703d-89a0-76181d77ac49';
        $locationId = '019f09a1-66c5-703d-89a0-76181d77ac48';

        DB::table('organizations')->updateOrInsert(['id' => $orgId], ['name' => 'Default Org', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('companies')->updateOrInsert(['id' => $companyId], ['organization_id' => $orgId, 'name' => 'Default Company', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('locations')->updateOrInsert(['id' => $locationId], ['company_id' => $companyId, 'name' => $request->site_name, 'city' => 'Casablanca', 'created_at' => now(), 'updated_at' => now()]);

        $tenant = TenantWebsite::updateOrCreate(
            ['slug' => $request->slug],
            [
                'id' => (string) Str::uuid(),
                'location_id' => $locationId,
                'primary_color' => $request->primary_color ?: '#3B82F6',
                'design_template' => $request->design_template ?: 'classic',
                'config' => $request->config ?: '{}',
                'is_active' => true
            ]
        );

        return response()->json([
            'id' => $tenant->id,
            'slug' => $tenant->slug,
            'primaryColor' => $tenant->primary_color,
            'config' => $tenant->config,
            'designTemplate' => $tenant->design_template,
            'isActive' => $tenant->is_active,
            'siteName' => $request->site_name,
            'userId' => $request->user_id
        ]);
    }
}
