<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (str_contains(config('app.url'), 'https://') || $this->app->environment('production')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
        Vite::prefetch(concurrency: 3);

        \Illuminate\Support\Facades\Gate::define('superadmin', function (\App\Models\User $user) {
            return $user->role === 'superadmin';
        });
    }

}
