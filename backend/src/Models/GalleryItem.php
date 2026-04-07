<?php

namespace App\Models;

use App\Database;
use PDO;

class GalleryItem
{
    public static function findAll(bool $activeOnly = true): array
    {
        $db = Database::getConnection();
        $sql = 'SELECT g.*, c.name AS category_name, c.slug AS category_slug
                FROM gallery_items g
                JOIN categories c ON g.category_id = c.id';
        if ($activeOnly) {
            $sql .= ' WHERE g.is_active = 1 AND c.is_active = 1';
        }
        $sql .= ' ORDER BY g.sort_order ASC, g.id DESC';
        return $db->query($sql)->fetchAll();
    }

    public static function findByCategory(int $categoryId, bool $activeOnly = true): array
    {
        $db = Database::getConnection();
        $sql = 'SELECT g.*, c.name AS category_name
                FROM gallery_items g
                JOIN categories c ON g.category_id = c.id
                WHERE g.category_id = :category_id';
        if ($activeOnly) {
            $sql .= ' AND g.is_active = 1';
        }
        $sql .= ' ORDER BY g.sort_order ASC, g.id DESC';
        $stmt = $db->prepare($sql);
        $stmt->execute(['category_id' => $categoryId]);
        return $stmt->fetchAll();
    }

    public static function findById(int $id): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM gallery_items WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function create(array $data): int
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'INSERT INTO gallery_items (category_id, image_url, title, sort_order, is_active)
             VALUES (:category_id, :image_url, :title, :sort_order, :is_active)'
        );
        $stmt->execute([
            'category_id' => $data['category_id'],
            'image_url'   => $data['image_url'],
            'title'       => $data['title'] ?? null,
            'sort_order'  => $data['sort_order'] ?? 0,
            'is_active'   => $data['is_active'] ?? 1,
        ]);
        return (int) $db->lastInsertId();
    }

    public static function update(int $id, array $data): bool
    {
        $db = Database::getConnection();
        $fields = [];
        $params = ['id' => $id];

        foreach (['category_id', 'image_url', 'title', 'sort_order', 'is_active'] as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = 'UPDATE gallery_items SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete(int $id): bool
    {
        $db = Database::getConnection();
        $stmt = $db->prepare('DELETE FROM gallery_items WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }
}
