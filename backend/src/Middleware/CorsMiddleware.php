<?php

namespace App\Middleware;

class CorsMiddleware
{
    public static function handle(): void
    {
        $config = require __DIR__ . '/../../config/app.php';
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        $allowOrigin = in_array($origin, $config['allowed_origins'], true)
            || ($origin !== '' && preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin));

        if ($allowOrigin) {
            header("Access-Control-Allow-Origin: $origin");
        }

        // Same-origin API requests (no Origin header) are always allowed
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');

        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
