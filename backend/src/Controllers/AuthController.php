<?php

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Models\Admin;
use App\Models\User;
use App\Middleware\AuthMiddleware;
use Firebase\JWT\JWT;

class AuthController
{
    private static function normalizePhone(?string $phone): ?string
    {
        if ($phone === null) {
            return null;
        }
        $digits = preg_replace('/\D+/', '', trim($phone)) ?? '';
        if ($digits === '') {
            return null;
        }
        return strlen($digits) > 10 ? substr($digits, -10) : $digits;
    }

    /**
     * POST /api/auth/admin/login
     * Body: { email, password }
     */
    public static function adminLogin(array $params): void
    {
        $body = Validator::getJsonBody();
        $missing = Validator::required($body, ['email', 'password']);
        if (!empty($missing)) {
            Response::error('Missing fields: ' . implode(', ', $missing), 422);
        }

        $admin = Admin::findByEmail($body['email']);
        if (!$admin || !password_verify($body['password'], $admin['password'])) {
            Response::error('Invalid email or password', 401);
        }

        $config = require __DIR__ . '/../../config/app.php';
        $token = JWT::encode([
            'sub'  => $admin['id'],
            'role' => 'admin',
            'name' => $admin['name'],
            'iat'  => time(),
            'exp'  => time() + $config['jwt_expiry'],
        ], $config['jwt_secret'], 'HS256');

        Response::success([
            'token' => $token,
            'user'  => [
                'id'    => $admin['id'],
                'name'  => $admin['name'],
                'email' => $admin['email'],
                'role'  => 'admin',
            ],
        ], 'Login successful');
    }

    /**
     * POST /api/auth/register
     * Body: { name, email?, phone? }
     * Simple registration without OTP for now.
     */
    public static function register(array $params): void
    {
        $body = Validator::getJsonBody();
        $missing = Validator::required($body, ['name']);
        if (!empty($missing)) {
            Response::error('Name is required', 422);
        }

        $email = isset($body['email']) ? trim((string) $body['email']) : '';
        $phone = isset($body['phone']) ? trim((string) $body['phone']) : '';
        $email = $email !== '' ? $email : null;
        $phone = self::normalizePhone($phone !== '' ? $phone : null);

        if ($phone === null) {
            Response::error('Phone number is required', 422);
        }

        if (!preg_match('/^\d{10}$/', $phone)) {
            Response::error('Please enter a valid 10-digit phone number', 422);
        }

        if ($email !== null && !Validator::isValidEmail($email)) {
            Response::error('Invalid email address', 422);
        }

        // Check if user already exists
        if ($email !== null) {
            $existing = User::findByEmail($email);
            if ($existing) {
                Response::error('Email already registered', 409);
            }
        }
        if ($phone !== null) {
            $existing = User::findByPhone($phone);
            if ($existing) {
                Response::error('Phone already registered', 409);
            }
        }

        try {
            $userId = User::create([
                'name'  => Validator::sanitizeString($body['name']),
                'email' => $email,
                'phone' => $phone,
            ]);
        } catch (\PDOException $e) {
            $sqlState = $e->errorInfo[0] ?? '';
            if ($sqlState === '23000' || str_contains($e->getMessage(), 'Duplicate')) {
                Response::error('Email or phone already registered', 409);
            }
            Response::error('Registration failed', 500);
        }

        $config = require __DIR__ . '/../../config/app.php';
        $token = JWT::encode([
            'sub'  => $userId,
            'role' => 'user',
            'name' => $body['name'],
            'iat'  => time(),
            'exp'  => time() + $config['jwt_expiry'],
        ], $config['jwt_secret'], 'HS256');

        Response::success([
            'token' => $token,
            'user'  => [
                'id'   => $userId,
                'name' => $body['name'],
                'role' => 'user',
            ],
        ], 'Registration successful', 201);
    }

    /**
     * POST /api/auth/login
     * Body: { email? , phone? }
     * Simple user login (finds existing user, returns token).
     */
    public static function userLogin(array $params): void
    {
        $body = Validator::getJsonBody();

        if (empty($body['email']) && empty($body['phone'])) {
            Response::error('Phone number is required', 422);
        }

        $user = null;
        if (!empty($body['email'])) {
            $user = User::findByEmail($body['email']);
        } elseif (!empty($body['phone'])) {
            $normalizedPhone = self::normalizePhone((string) $body['phone']);
            if ($normalizedPhone === null || !preg_match('/^\d{10}$/', $normalizedPhone)) {
                Response::error('Please enter a valid 10-digit phone number', 422);
            }
            $user = User::findByPhone($normalizedPhone);
        }

        if (!$user) {
            Response::error('User not found', 404);
        }

        $config = require __DIR__ . '/../../config/app.php';
        $token = JWT::encode([
            'sub'  => $user['id'],
            'role' => 'user',
            'name' => $user['name'],
            'iat'  => time(),
            'exp'  => time() + $config['jwt_expiry'],
        ], $config['jwt_secret'], 'HS256');

        Response::success([
            'token' => $token,
            'user'  => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'role'  => 'user',
            ],
        ], 'Login successful');
    }

    /**
     * GET /api/auth/me
     * Returns current authenticated user profile.
     */
    public static function me(array $params): void
    {
        $authUser = AuthMiddleware::getUser();
        if ($authUser['role'] === 'admin') {
            $admin = Admin::findById($authUser['sub']);
            $admin['role'] = 'admin';
            Response::success($admin);
        } else {
            $user = User::findById($authUser['sub']);
            $user['role'] = 'user';
            Response::success($user);
        }
    }
}
