<?php

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Models\Order;
use App\Models\PricingRule;
use App\Models\Category;
use App\Models\Size;

class OrderController
{
    private const ADMIN_NOTIFICATION_EMAIL = 'mail.madhanarts@gmail.com';

    /**
     * POST /api/orders
     * Expects multipart/form-data with 'reference_photo' file,
     * plus 'category_id' and 'size_id' fields.
     */
    public static function create(array $params): void
    {
        $authUser = AuthMiddleware::getUser();

        if (!isset($_FILES['reference_photo'])) {
            Response::error('Reference photo is required', 422);
        }
        if (empty($_POST['category_id']) || empty($_POST['size_id'])) {
            Response::error('category_id and size_id are required', 422);
        }
        if (empty($_POST['delivery_address'])) {
            Response::error('Delivery address is required', 422);
        }

        $categoryId      = (int) $_POST['category_id'];
        $sizeId          = (int) $_POST['size_id'];
        $deliveryAddress = trim($_POST['delivery_address']);
        $neededByDate    = !empty($_POST['needed_by_date']) ? $_POST['needed_by_date'] : null;

        // Validate category and size exist
        if (!Category::findById($categoryId)) {
            Response::error('Category not found', 404);
        }
        if (!Size::findById($sizeId)) {
            Response::error('Size not found', 404);
        }

        // Get pricing
        $pricing = PricingRule::findByCategoryAndSize($categoryId, $sizeId);
        if (!$pricing) {
            Response::error('No pricing available for this combination', 404);
        }

        // Upload reference photo
        $file = $_FILES['reference_photo'];
        $config = require __DIR__ . '/../../config/app.php';

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes, true)) {
            Response::error('Only JPEG, PNG, and WebP images are allowed', 422);
        }
        if ($file['size'] > $config['max_upload_size']) {
            Response::error('File size exceeds 10MB limit', 422);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('ref_') . '.' . $ext;
        $uploadDir = $config['upload_path'] . '/references';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $destPath = $uploadDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::error('Failed to save uploaded file', 500);
        }

        $photoPath = '/uploads/references/' . $filename;

        // Create order
        $orderNumber = Order::generateOrderNumber();
        $orderId = Order::create([
            'order_number'    => $orderNumber,
            'user_id'         => $authUser['sub'],
            'category_id'     => $categoryId,
            'size_id'         => $sizeId,
            'pricing_rule_id' => $pricing['id'],
            'reference_photo' => $photoPath,
            'delivery_address' => $deliveryAddress,
            'needed_by_date'  => $neededByDate,
            'amount'          => $pricing['price'],
            'currency'        => $pricing['currency'],
        ]);

        $order = Order::findById($orderId);
        Response::success($order, 'Order created. Complete payment to confirm.', 201);
    }

    /**
     * GET /api/orders
     * Admin: all orders. User: own orders only.
     */
    public static function index(array $params): void
    {
        $authUser = AuthMiddleware::getUser();

        if ($authUser['role'] === 'admin') {
            $page   = (int) ($_GET['page'] ?? 1);
            $limit  = (int) ($_GET['limit'] ?? 20);
            $status = $_GET['status'] ?? null;
            $result = Order::findAll($page, $limit, $status);
            Response::success($result);
        } else {
            $orders = Order::findByUser($authUser['sub']);
            Response::success($orders);
        }
    }

    /**
     * GET /api/orders/:id
     */
    public static function show(array $params): void
    {
        $id = (int) $params['id'];
        $authUser = AuthMiddleware::getUser();

        $order = Order::findById($id);
        if (!$order) {
            Response::error('Order not found', 404);
        }

        // Users can only view their own orders
        if ($authUser['role'] !== 'admin' && (int) $order['user_id'] !== $authUser['sub']) {
            Response::error('Access denied', 403);
        }

        Response::success($order);
    }

    /**
     * PUT /api/orders/:id/status  (Admin)
     * Body: { order_status, admin_notes? }
     */
    public static function updateStatus(array $params): void
    {
        $id = (int) $params['id'];
        $order = Order::findById($id);
        if (!$order) {
            Response::error('Order not found', 404);
        }

        $body = Validator::getJsonBody();
        $validStatuses = ['received', 'in_progress', 'completed', 'delivered', 'cancelled'];

        if (empty($body['order_status']) || !in_array($body['order_status'], $validStatuses, true)) {
            Response::error('Valid order_status is required: ' . implode(', ', $validStatuses), 422);
        }

        Order::updateStatus($id, $body['order_status'], $body['admin_notes'] ?? null);
        $updated = Order::findById($id);
        Response::success($updated, 'Order status updated');
    }

    /**
     * GET /api/orders/:id/photo  (Admin)
     * Serves the reference photo file for download.
     */
    public static function downloadPhoto(array $params): void
    {
        $id = (int) $params['id'];
        $order = Order::findById($id);
        if (!$order) {
            Response::error('Order not found', 404);
        }

        $config = require __DIR__ . '/../../config/app.php';
        $rel = preg_replace('#^/uploads/#', '', $order['reference_photo']);
        $filePath = $config['upload_path'] . '/' . $rel;

        if (!file_exists($filePath)) {
            Response::error('Photo file not found', 404);
        }

        header('Content-Type: ' . mime_content_type($filePath));
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    }

    /**
     * DELETE /api/orders/:id  (Admin)
     * Removes order row and reference photo file if present.
     */
    public static function delete(array $params): void
    {
        $id = (int) $params['id'];
        $order = Order::findById($id);
        if (!$order) {
            Response::error('Order not found', 404);
        }

        $config = require __DIR__ . '/../../config/app.php';
        if (!empty($order['reference_photo'])) {
            $rel = preg_replace('#^/uploads/#', '', $order['reference_photo']);
            $filePath = $config['upload_path'] . '/' . $rel;
            if (is_file($filePath)) {
                @unlink($filePath);
            }
        }

        Order::delete($id);
        Response::success(null, 'Order deleted');
    }

    public static function notifyAdminForNewOrder(array $order): void
    {
        if (!function_exists('mail')) {
            error_log('Order email notification skipped: mail() unavailable');
            return;
        }

        $to = self::ADMIN_NOTIFICATION_EMAIL;
        $subject = 'New Order Received - ' . ($order['order_number'] ?? 'Madhan Arts');
        $safeAddress = preg_replace('/\s+/', ' ', (string) ($order['delivery_address'] ?? ''));
        $neededBy = !empty($order['needed_by_date']) ? (string) $order['needed_by_date'] : 'Not specified';
        $amount = 'INR ' . number_format((float) ($order['amount'] ?? 0), 2);

        $message = implode("\n", [
            'A new order has been placed on Madhan Arts.',
            '',
            'Order Number: ' . ($order['order_number'] ?? '-'),
            'Customer Name: ' . ($order['user_name'] ?? '-'),
            'Customer Email: ' . ($order['user_email'] ?? '-'),
            'Customer Phone: ' . ($order['user_phone'] ?? '-'),
            'Category: ' . ($order['category_name'] ?? '-'),
            'Size: ' . ($order['size_label'] ?? '-'),
            'Amount: ' . $amount,
            'Needed By: ' . $neededBy,
            'Delivery Address: ' . $safeAddress,
            'Reference Photo Path: ' . ($order['reference_photo'] ?? '-'),
            'Created At: ' . ($order['created_at'] ?? '-'),
        ]);

        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/plain; charset=UTF-8',
            'From: Madhan Arts <noreply@madhanarts.in>',
            'Reply-To: noreply@madhanarts.in',
            'X-Mailer: PHP/' . phpversion(),
        ];

        $ok = @mail($to, $subject, $message, implode("\r\n", $headers));
        if (!$ok) {
            error_log('Order email notification failed for order ' . ($order['order_number'] ?? 'unknown'));
        }
    }
}
