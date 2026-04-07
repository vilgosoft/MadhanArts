<?php

namespace App\Models;

use App\Database;
use PDO;

class PricingRule
{
    public static function findAll(): array
    {
        $db = Database::getConnection();
        return $db->query(
            'SELECT p.*, c.name AS category_name, s.label AS size_label
             FROM pricing_rules p
             JOIN categories c ON p.category_id = c.id
             JOIN sizes s ON p.size_id = s.id
             ORDER BY c.sort_order, s.sort_order'
        )->fetchAll();
    }

    public static function findByCategory(int $categoryId): array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'SELECT p.*, s.label AS size_label, s.description AS size_description
             FROM pricing_rules p
             JOIN sizes s ON p.size_id = s.id
             WHERE p.category_id = :category_id AND p.is_active = 1 AND s.is_active = 1
             ORDER BY s.sort_order'
        );
        $stmt->execute(['category_id' => $categoryId]);
        return $stmt->fetchAll();
    }

    public static function findByCategoryAndSize(int $categoryId, int $sizeId): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'SELECT p.*, c.name AS category_name, s.label AS size_label
             FROM pricing_rules p
             JOIN categories c ON p.category_id = c.id
             JOIN sizes s ON p.size_id = s.id
             WHERE p.category_id = :category_id AND p.size_id = :size_id AND p.is_active = 1'
        );
        $stmt->execute(['category_id' => $categoryId, 'size_id' => $sizeId]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function findById(int $id): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM pricing_rules WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function create(array $data): int
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'INSERT INTO pricing_rules (category_id, size_id, price, currency, is_active)
             VALUES (:category_id, :size_id, :price, :currency, :is_active)'
        );
        $stmt->execute([
            'category_id' => $data['category_id'],
            'size_id'     => $data['size_id'],
            'price'       => $data['price'],
            'currency'    => $data['currency'] ?? 'INR',
            'is_active'   => $data['is_active'] ?? 1,
        ]);
        return (int) $db->lastInsertId();
    }

    public static function update(int $id, array $data): bool
    {
        $db = Database::getConnection();
        $fields = [];
        $params = ['id' => $id];

        foreach (['category_id', 'size_id', 'price', 'currency', 'is_active'] as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = 'UPDATE pricing_rules SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete(int $id): bool
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('DELETE FROM pricing_rules WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }
}
