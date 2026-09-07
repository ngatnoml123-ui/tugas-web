<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role?->name, $roles)) {
            if ($request->expectsJson() || $request->inertia()) {
                abort(403, 'Akses ditolak. Anda tidak memiliki izin untuk halaman ini.');
            }
            return redirect()->route('dashboard')->with('error', 'Akses ditolak.');
        }

        return $next($request);
    }
}
