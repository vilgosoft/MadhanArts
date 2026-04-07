<?php

namespace App\Middleware;

use App\Helpers\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    /**
     * Verify JWT token and store decoded user in global state.
     * Works for both admin and user tokens.
     */
    public static function handle(): void
    {
        $token = self::getBearerToken();
        if (!$token) {
            Response::error('Authentication required', 401);
        }

        $config = require __DIR__ . '/../../config/app.php';

        try {
            $decoded = JWT::decode($token, new Key($config['jwt_secret'], 'HS256'));
            $GLOBALS['auth_user'] = (array) $decoded;
        } catch (\Exception $e) {
            Response::error('Invalid or expired token', 401);
        }
    }

    /**
     * Get the authenticated user data (set by handle()).
     */
    public static function getUser(): ?array
    {
        return $GLOBALS['auth_user'] ?? null;
    }

    private static function getBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.+)$/i', $header, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
