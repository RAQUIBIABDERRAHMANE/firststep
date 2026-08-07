<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\WaiterController;

Route::prefix('v1/restaurant')->group(function () {
    // Menu Category & Dishes CRUD
    Route::get('/categories', [MenuController::class, 'indexCategories']);
    Route::post('/categories', [MenuController::class, 'storeCategory']);
    Route::put('/categories/{id}', [MenuController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [MenuController::class, 'deleteCategory']);
    
    Route::post('/categories/{categoryId}/dishes', [MenuController::class, 'storeDish']);
    Route::put('/dishes/{id}', [MenuController::class, 'updateDish']);
    Route::delete('/dishes/{id}', [MenuController::class, 'deleteDish']);
    Route::get('/categories/{categoryId}/dishes', [MenuController::class, 'indexDishes']);
    
    // Tables Routing
    Route::get('/tables', [TableController::class, 'index']);
    Route::post('/tables', [TableController::class, 'store']);

    // Waiters Routing
    Route::get('/waiters', [WaiterController::class, 'index']);
    Route::post('/waiters', [WaiterController::class, 'store']);
    Route::delete('/waiters/{id}', [WaiterController::class, 'destroy']);
});
