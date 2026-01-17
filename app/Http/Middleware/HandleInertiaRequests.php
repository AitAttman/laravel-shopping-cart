<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $response = [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            // flash key is necessary to overcome the conflict trigger my "message" key by other methods
            // flash must be used to read response from POST|DELETE|PUT methods
            'flash' => []
        ];
        // updated by ahmed 0n 14/01/2026
        if( $request->session()->has('message') )
            $response['message'] = fn() => $request->session()->get('message');
        /**
         * flashed messages from methods like POST,DELETE,PUT must be separated from messages from 'GET' method
         */
        if( $request->session()->has('flash_message') )
            $response['flash']['message'] = fn() => $request->session()->get('flash_message');

        return $response;
    }
}
