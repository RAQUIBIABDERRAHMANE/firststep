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
            \App\Domains\Restaurant\Contracts\CategoryRepositoryInterface::class,
            \App\Domains\Restaurant\Repositories\CategoryRepository::class
        );
        $this->app->bind(
            \App\Domains\Restaurant\Contracts\DishRepositoryInterface::class,
            \App\Domains\Restaurant\Repositories\DishRepository::class
        );
        $this->app->bind(
            \App\Domains\Restaurant\Contracts\TableRepositoryInterface::class,
            \App\Domains\Restaurant\Repositories\TableRepository::class
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
