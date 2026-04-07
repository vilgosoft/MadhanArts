<?php

namespace App\Middleware;

use App\Helpers\Response;

class AdminMiddleware
{
    /**
     * Ensure the authenticated user has admin role.
     * Must be called AFTER AuthMiddleware::handle().
     */
    public static function handle(): void
    {
        AuthMiddleware::handle();

        $user = AuthMiddleware::getUser();
        if (!$user || ($user['role'] ?? '') !== 'admin') {
            Response::error('Admin access required', 403);
        }
    }
}
