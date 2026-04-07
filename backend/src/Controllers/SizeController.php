<?php

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Models\Size;

class SizeController
{
    /**
     * GET /api/sizes
     */
    public static function index(array $params): void
    {
        $sizes = Size::findAll(true);
        Response::success($sizes);
    }

    /**
     * POST /api/sizes
     */
    public static function create(array $params): void
    {
        $body = Validator::getJsonBody();
        $missing = Validator::required($body, ['label']);
        if (!empty($missing)) {
            Response::error('Size label is required', 422);
        }

        $id = Size::create([
            'label'       => Validator::sanitizeString($body['label']),
            'description' => isset($body['description']) ? Validator::sanitizeString($body['description']) : null,
            'sort_order'  => (int) ($body['sort_order'] ?? 0),
            'is_active'   => (int) ($body['is_active'] ?? 1),
        ]);

        $size = Size::findById($id);
        Response::success($size, 'Size created', 201);
    }

    /**
     * PUT /api/sizes/:id
     */
    public static function update(array $params): void
    {
        $id = (int) $params['id'];
        $size = Size::findById($id);
        if (!$size) {
            Response::error('Size not found', 404);
        }

        $body = Validator::getJsonBody();
        $data = [];

        if (isset($body['label'])) {
            $data['label'] = Validator::sanitizeString($body['label']);
        }
        if (array_key_exists('description', $body)) {
            $data['description'] = $body['description'] ? Validator::sanitizeString($body['description']) : null;
        }
        if (isset($body['sort_order'])) {
            $data['sort_order'] = (int) $body['sort_order'];
        }
        if (isset($body['is_active'])) {
            $data['is_active'] = (int) $body['is_active'];
        }

        Size::update($id, $data);
        $updated = Size::findById($id);
        Response::success($updated, 'Size updated');
    }

    /**
     * DELETE /api/sizes/:id
     */
    public static function delete(array $params): void
    {
        $id = (int) $params['id'];
        if (!Size::findById($id)) {
            Response::error('Size not found', 404);
        }

        Size::delete($id);
        Response::success(null, 'Size deleted');
    }
}
