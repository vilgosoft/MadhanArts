<?php

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Models\GalleryItem;
use App\Models\Category;

class GalleryController
{
    /**
     * GET /api/gallery
     */
    public static function index(array $params): void
    {
        $items = GalleryItem::findAll(true);
        Response::success($items);
    }

    /**
     * GET /api/gallery/category/:categoryId
     */
    public static function byCategory(array $params): void
    {
        $categoryId = (int) $params['categoryId'];
        $category = Category::findById($categoryId);
        if (!$category) {
            Response::error('Category not found', 404);
        }

        $items = GalleryItem::findByCategory($categoryId);
        Response::success([
            'category' => $category,
            'items'    => $items,
        ]);
    }

    /**
     * POST /api/gallery
     * Expects multipart/form-data with 'image' file and 'category_id', 'title?' fields.
     */
    public static function create(array $params): void
    {
        if (!isset($_FILES['image'])) {
            Response::error('Image file is required', 422);
        }
        if (empty($_POST['category_id'])) {
            Response::error('Category ID is required', 422);
        }

        $categoryId = (int) $_POST['category_id'];
        if (!Category::findById($categoryId)) {
            Response::error('Category not found', 404);
        }

        $file = $_FILES['image'];
        $config = require __DIR__ . '/../../config/app.php';

        // Validate file
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes, true)) {
            Response::error('Only JPEG, PNG, and WebP images are allowed', 422);
        }
        if ($file['size'] > $config['max_upload_size']) {
            Response::error('File size exceeds 10MB limit', 422);
        }

        // Save file
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('gallery_') . '.' . $ext;
        $uploadDir = $config['upload_path'] . '/gallery';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $destPath = $uploadDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::error('Failed to save uploaded file', 500);
        }

        $imageUrl = '/uploads/gallery/' . $filename;

        $id = GalleryItem::create([
            'category_id' => $categoryId,
            'image_url'   => $imageUrl,
            'title'       => isset($_POST['title']) ? Validator::sanitizeString($_POST['title']) : null,
            'sort_order'  => (int) ($_POST['sort_order'] ?? 0),
            'is_active'   => (int) ($_POST['is_active'] ?? 1),
        ]);

        $item = GalleryItem::findById($id);
        Response::success($item, 'Gallery image uploaded', 201);
    }

    /**
     * PUT /api/gallery/:id
     */
    public static function update(array $params): void
    {
        $id = (int) $params['id'];
        $item = GalleryItem::findById($id);
        if (!$item) {
            Response::error('Gallery item not found', 404);
        }

        $body = Validator::getJsonBody();
        $data = [];

        if (isset($body['category_id'])) {
            $data['category_id'] = (int) $body['category_id'];
        }
        if (array_key_exists('title', $body)) {
            $data['title'] = $body['title'] ? Validator::sanitizeString($body['title']) : null;
        }
        if (isset($body['sort_order'])) {
            $data['sort_order'] = (int) $body['sort_order'];
        }
        if (isset($body['is_active'])) {
            $data['is_active'] = (int) $body['is_active'];
        }

        GalleryItem::update($id, $data);
        $updated = GalleryItem::findById($id);
        Response::success($updated, 'Gallery item updated');
    }

    /**
     * POST /api/gallery/:id/image
     * Replace the image for an existing gallery item.
     */
    public static function replaceImage(array $params): void
    {
        $id = (int) $params['id'];
        $item = GalleryItem::findById($id);
        if (!$item) {
            Response::error('Gallery item not found', 404);
        }

        if (!isset($_FILES['image'])) {
            Response::error('Image file is required', 422);
        }

        $file = $_FILES['image'];
        $config = require __DIR__ . '/../../config/app.php';

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes, true)) {
            Response::error('Only JPEG, PNG, and WebP images are allowed', 422);
        }
        if ($file['size'] > $config['max_upload_size']) {
            Response::error('File size exceeds 10MB limit', 422);
        }

        // Delete old file
        $rel = preg_replace('#^/uploads/#', '', $item['image_url']);
        $oldPath = $config['upload_path'] . '/' . $rel;
        if (file_exists($oldPath)) {
            unlink($oldPath);
        }

        // Save new file
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('gallery_') . '.' . $ext;
        $uploadDir = $config['upload_path'] . '/gallery';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $destPath = $uploadDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::error('Failed to save uploaded file', 500);
        }

        $imageUrl = '/uploads/gallery/' . $filename;
        GalleryItem::update($id, ['image_url' => $imageUrl]);

        $updated = GalleryItem::findById($id);
        Response::success($updated, 'Gallery image replaced');
    }

    /**
     * DELETE /api/gallery/:id
     */
    public static function delete(array $params): void
    {
        $id = (int) $params['id'];
        $item = GalleryItem::findById($id);
        if (!$item) {
            Response::error('Gallery item not found', 404);
        }

        // Delete the file
        $config = require __DIR__ . '/../../config/app.php';
        $rel = preg_replace('#^/uploads/#', '', $item['image_url']);
        $filePath = $config['upload_path'] . '/' . $rel;
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        GalleryItem::delete($id);
        Response::success(null, 'Gallery item deleted');
    }
}
