<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Middleware\TenantResolver;

Route::middleware([TenantResolver::class])->group(function () {
    // 1. Forward Identity Operations
    Route::any('/v1/auth/{any}', function ($any) {
        $response = Http::withHeaders(request()->headers->all())
            ->send(request()->method(), "http://firststep-identity/api/v1/auth/{$any}", [
                'query' => request()->query(),
                'body' => request()->getContent()
            ]);
        return response($response->body(), $response->status(), $response->headers());
    })->where('any', '.*');

    // 2. Forward Tenant Operations
    Route::any('/v1/tenant/{any}', function ($any) {
        $response = Http::withHeaders(request()->headers->all())
            ->send(request()->method(), "http://firststep-tenant/api/v1/tenant/{$any}", [
                'query' => request()->query(),
                'body' => request()->getContent()
            ]);
        return response($response->body(), $response->status(), $response->headers());
    })->where('any', '.*');

    // 3. Forward Restaurant Operations
    Route::any('/v1/restaurant/{any}', function ($any) {
        $response = Http::withHeaders(request()->headers->all())
            ->send(request()->method(), "http://firststep-restaurant/api/v1/restaurant/{$any}", [
                'query' => request()->query(),
                'body' => request()->getContent()
            ]);
        return response($response->body(), $response->status(), $response->headers());
    })->where('any', '.*');

    // 4. Forward POS Operations
    Route::any('/v1/pos/{any}', function ($any) {
        $response = Http::withHeaders(request()->headers->all())
            ->send(request()->method(), "http://firststep-pos/api/v1/pos/{$any}", [
                'query' => request()->query(),
                'body' => request()->getContent()
            ]);
        return response($response->body(), $response->status(), $response->headers());
    })->where('any', '.*');
});
