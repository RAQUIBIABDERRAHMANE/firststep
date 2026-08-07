<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;

Route::get('/v1/auth/test', function () {
    try {
        $dbStatus = DB::connection()->getPdo() ? 'Connected' : 'Disconnected';
    } catch (\Exception $e) {
        $dbStatus = 'Error: ' . $e->getMessage();
    }

    return response()->json([
        'service' => 'Identity & Auth Service',
        'status' => 'OK',
        'database_connection' => $dbStatus,
        'resolved_tenant' => request()->header('X-Tenant-Resolved-Slug')
    ]);
});

Route::post('/v1/auth/login', [AuthController::class, 'login']);
Route::get('/v1/auth/me', [AuthController::class, 'me']);
