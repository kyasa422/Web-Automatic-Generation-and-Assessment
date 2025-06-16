<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
       public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'env' => [
                'GEMINI_API_KEY' => "AIzaSyDc0ugXTHctmxoaMBfBirfaiA15Vgjuobw",
                'GEMINI_MODEL_NAME' => "gemini-2.0-flash",
                'MODEL_API_URL' => env('MODEL_API_URL'),
            ],
            'auth' => [
                'user' => $request->user() ? $request->user()->load('roles', 'permissions') : null,
            ],
        ]);
    }
}
