<?php

namespace App\Models;

use App\Database;
use PDO;

class Order
{
    public static function generateOrderNumber(): string
    {
        $date = date('Ymd');
        $db = Database::getConnection();
        $stmt = $db->prepare(
            "SELECT COUNT(*) as count FROM orders WHERE order_number LIKE :prefix"
        );
        $prefix = "MA-$date-%";
        $stmt->execute(['prefix' => $prefix]);
        $count = (int) $stmt->fetch()['count'] + 1;
        return sprintf('MA-%s-%04d', $date, $count);
    }

    public static function create(array $data): int
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'INSERT INTO orders
                (order_number, user_id, category_id, size_id, pricing_rule_id,
                 reference_photo, delivery_address, needed_by_date, amount, currency, payment_gateway)
             VALUES
                (:order_number, :user_id, :category_id, :size_id, :pricing_rule_id,
                 :reference_photo, :delivery_address, :needed_by_date, :amount, :currency, :payment_gateway)'
        );
        $stmt->execute([
            'order_number'    => $data['order_number'],
            'user_id'         => $data['user_id'],
            'category_id'     => $data['category_id'],
            'size_id'         => $data['size_id'],
            'pricing_rule_id' => $data['pricing_rule_id'],
            'reference_photo' => $data['reference_photo'],
            'delivery_address' => $data['delivery_address'],
            'needed_by_date'  => $data['needed_by_date'] ?? null,
            'amount'          => $data['amount'],
            'currency'        => $data['currency'] ?? 'INR',
            'payment_gateway' => $data['payment_gateway'] ?? null,
        ]);
        return (int) $db->lastInsertId();
    }

    public static function findById(int $id): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'SELECT o.*, c.name AS category_name, s.label AS size_label,
                    u.name AS user_name, u.email AS user_email, u.phone AS user_phone
             FROM orders o
             JOIN categories c ON o.category_id = c.id
             JOIN sizes s ON o.size_id = s.id
             JOIN users u ON o.user_id = u.id
             WHERE o.id = :id'
        );
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function findByUser(int $userId): array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'SELECT o.*, c.name AS category_name, s.label AS size_label,
                    u.name AS user_name, u.email AS user_email, u.phone AS user_phone
             FROM orders o
             JOIN categories c ON o.category_id = c.id
             JOIN sizes s ON o.size_id = s.id
             JOIN users u ON o.user_id = u.id
             WHERE o.user_id = :user_id
             ORDER BY o.created_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public static function findAll(int $page = 1, int $limit = 20, ?string $status = null): array
    {
        $db = Database::getConnection();
        $offset = ($page - 1) * $limit;

        $where = '';
        $params = [];
        if ($status) {
            $where = 'WHERE o.order_status = :status';
            $params['status'] = $status;
        }

        $sql = "SELECT o.*, c.name AS category_name, s.label AS size_label,
                       u.name AS user_name, u.email AS user_email, u.phone AS user_phone
                FROM orders o
                JOIN categories c ON o.category_id = c.id
                JOIN sizes s ON o.size_id = s.id
                JOIN users u ON o.user_id = u.id
                $where
                ORDER BY o.created_at DESC
                LIMIT $limit OFFSET $offset";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM orders o $where";
        $countStmt = $db->prepare($countSql);
        $countStmt->execute($params);
        $total = (int) $countStmt->fetch()['total'];

        return [
            'orders' => $orders,
            'total'  => $total,
            'page'   => $page,
            'limit'  => $limit,
            'pages'  => (int) ceil($total / $limit),
        ];
    }

    public static function updateStatus(int $id, string $orderStatus, ?string $adminNotes = null): bool
    {
        $db = Database::getConnection();
        $sql = 'UPDATE orders SET order_status = :status';
        $params = ['id' => $id, 'status' => $orderStatus];

        if ($adminNotes !== null) {
            $sql .= ', admin_notes = :notes';
            $params['notes'] = $adminNotes;
        }

        $sql .= ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function updatePayment(int $id, string $paymentStatus, ?string $paymentId = null): bool
    {
        $db = Database::getConnection();
        $sql = 'UPDATE orders SET payment_status = :payment_status';
        $params = ['id' => $id, 'payment_status' => $paymentStatus];

        if ($paymentId !== null) {
            $sql .= ', payment_id = :payment_id';
            $params['payment_id'] = $paymentId;
        }

        $sql .= ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }
}
