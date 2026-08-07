<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Domains\POS\Contracts\RegisterRepositoryInterface::class,
            \App\Domains\POS\Repositories\RegisterRepository::class
        );
        $this->app->bind(
            \App\Domains\POS\Contracts\SessionRepositoryInterface::class,
            \App\Domains\POS\Repositories\SessionRepository::class
        );
        $this->app->bind(
            \App\Domains\POS\Contracts\OrderRepositoryInterface::class,
            \App\Domains\POS\Repositories\OrderRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
