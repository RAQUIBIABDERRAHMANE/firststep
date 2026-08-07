<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\TenantController;

Route::get('/v1/tenant/test', function () {
    try {
        $dbStatus = DB::connection()->getPdo() ? 'Connected' : 'Disconnected';
    } catch (\Exception $e) {
        $dbStatus = 'Error: ' . $e->getMessage();
    }

    return response()->json([
        'service' => 'Tenant Service',
        'status' => 'OK',
        'database_connection' => $dbStatus,
        'resolved_tenant' => request()->header('X-Tenant-Resolved-Slug')
    ]);
});

Route::get('/v1/tenant/websites/{slug}', [TenantController::class, 'show']);
Route::post('/v1/tenant/websites', [TenantController::class, 'upsert']);
