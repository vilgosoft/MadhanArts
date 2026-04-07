<?php

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Models\User;

class UserController
{
    /**
     * GET /api/users?page=1&limit=20  (Admin)
     */
    public static function index(array $params): void
    {
        $page  = max(1, (int) ($_GET['page'] ?? 1));
        $limit = min(100, max(1, (int) ($_GET['limit'] ?? 20)));

        $result = User::findAll($page, $limit);
        Response::success($result);
    }

    /**
     * PUT /api/users/:id  (Admin)
     * Body: { name, email?, phone? } — at least one of email or phone required (non-empty).
     */
    public static function update(array $params): void
    {
        $id = (int) $params['id'];
        $user = User::findById($id);
        if (!$user) {
            Response::error('User not found', 404);
        }

        $body = Validator::getJsonBody();
        $missing = Validator::required($body, ['name']);
        if (!empty($missing)) {
            Response::error('Name is required', 422);
        }

        $email = isset($body['email']) ? trim((string) $body['email']) : '';
        $phone = isset($body['phone']) ? trim((string) $body['phone']) : '';
        $email = $email !== '' ? $email : null;
        $phone = $phone !== '' ? $phone : null;

        if ($email === null && $phone === null) {
            Response::error('Email or phone is required', 422);
        }

        if ($email !== null && !Validator::isValidEmail($email)) {
            Response::error('Invalid email address', 422);
        }

        if ($email !== null) {
            $existing = User::findByEmail($email);
            if ($existing && (int) $existing['id'] !== $id) {
                Response::error('Email already registered', 409);
            }
        }
        if ($phone !== null) {
            $existing = User::findByPhone($phone);
            if ($existing && (int) $existing['id'] !== $id) {
                Response::error('Phone already registered', 409);
            }
        }

        try {
            User::update($id, [
                'name'  => Validator::sanitizeString($body['name']),
                'email' => $email,
                'phone' => $phone,
            ]);
        } catch (\PDOException $e) {
            $sqlState = $e->errorInfo[0] ?? '';
            if ($sqlState === '23000' || str_contains($e->getMessage(), 'Duplicate')) {
                Response::error('Email or phone already registered', 409);
            }
            Response::error('Update failed', 500);
        }

        $updated = User::findById($id);
        Response::success([
            'id'         => $updated['id'],
            'name'       => $updated['name'],
            'email'      => $updated['email'],
            'phone'      => $updated['phone'],
            'created_at' => $updated['created_at'],
            'updated_at' => $updated['updated_at'],
        ], 'User updated');
    }
}
