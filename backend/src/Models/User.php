<?php

namespace App\Models;

use App\Database;
use PDO;

class User
{
    public static function findById(int $id): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function findByEmail(string $email): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function findByPhone(string $phone): ?array
    {
        $db = Database::getConnection();
        $digitsOnly = preg_replace('/\D+/', '', $phone) ?? '';
        $phone10 = strlen($digitsOnly) > 10 ? substr($digitsOnly, -10) : $digitsOnly;

        $stmt = $db->prepare(
            "SELECT *
             FROM users
             WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+', ''), '(', ''), ')', '') = :raw
                OR RIGHT(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+', ''), '(', ''), ')', ''), 10) = :phone10
             LIMIT 1"
        );
        $stmt->execute([
            'raw' => $digitsOnly,
            'phone10' => $phone10,
        ]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function create(array $data): int
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'INSERT INTO users (name, email, phone) VALUES (:name, :email, :phone)'
        );
        $stmt->execute([
            'name'  => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
        ]);
        return (int) $db->lastInsertId();
    }

    public static function update(int $id, array $data): bool
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'UPDATE users SET name = :name, email = :email, phone = :phone WHERE id = :id'
        );

        return $stmt->execute([
            'id'    => $id,
            'name'  => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
        ]);
    }

    /**
     * @return array{users: array<int, array>, total: int, page: int, limit: int, pages: int}
     */
    public static function findAll(int $page = 1, int $limit = 20): array
    {
        $db = Database::getConnection();
        $offset = ($page - 1) * $limit;

        $sql = 'SELECT id, name, email, phone, created_at, updated_at
                FROM users
                ORDER BY created_at DESC
                LIMIT ' . (int) $limit . ' OFFSET ' . (int) $offset;

        $users = $db->query($sql)->fetchAll();
        $total = (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();

        return [
            'users' => $users,
            'total' => $total,
            'page'  => $page,
            'limit' => $limit,
            'pages' => (int) ceil($total / $limit),
        ];
    }
}
