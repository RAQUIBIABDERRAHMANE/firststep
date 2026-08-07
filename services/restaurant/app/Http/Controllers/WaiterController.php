<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WaiterController extends Controller
{
    public function index(Request $request)
    {
        $tenantSlug = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantSlug) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        $waiters = DB::table('restaurant_waiters')
            ->where('tenant_id', $tenantSlug)
            ->get();

        return response()->json($waiters);
    }

    public function store(Request $request)
    {
        $tenantSlug = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantSlug) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        $request->validate([
            'name' => 'required|string',
            'pin' => 'required|string'
        ]);

        $id = (string) Str::uuid();
        DB::table('restaurant_waiters')->insert([
            'id' => $id,
            'tenant_id' => $tenantSlug,
            'name' => $request->name,
            'pin_hash' => bcrypt($request->pin),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'id' => $id,
            'name' => $request->name,
            'is_active' => true
        ], 201);
    }

    public function destroy($id)
    {
        DB::table('restaurant_waiters')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
