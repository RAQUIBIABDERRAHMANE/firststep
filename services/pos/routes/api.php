<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\OrderController;

Route::prefix('v1/pos')->group(function () {
    // Registers Configuration
    Route::get('/registers', [RegisterController::class, 'index']);
    Route::post('/registers', [RegisterController::class, 'store']);
    
    // Sessions Management
    Route::post('/sessions/open', [SessionController::class, 'open']);
    Route::post('/sessions/{id}/close', [SessionController::class, 'close']);
    
    // Order Synchronization
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/sync', [OrderController::class, 'syncBatch']);
});
