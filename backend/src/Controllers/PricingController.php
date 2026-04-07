<?php

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Models\PricingRule;
use App\Models\Category;
use App\Models\Size;

class PricingController
{
    /**
     * GET /api/pricing  (Admin)
     */
    public static function index(array $params): void
    {
        $rules = PricingRule::findAll();
        Response::success($rules);
    }

    /**
     * GET /api/pricing/category/:categoryId  (Public)
     */
    public static function byCategory(array $params): void
    {
        $categoryId = (int) $params['categoryId'];
        if (!Category::findById($categoryId)) {
            Response::error('Category not found', 404);
        }

        $rules = PricingRule::findByCategory($categoryId);
        Response::success($rules);
    }

    /**
     * GET /api/pricing/calculate?category_id=X&size_id=Y  (Public)
     */
    public static function calculate(array $params): void
    {
        $categoryId = (int) ($_GET['category_id'] ?? 0);
        $sizeId     = (int) ($_GET['size_id'] ?? 0);

        if (!$categoryId || !$sizeId) {
            Response::error('category_id and size_id are required', 422);
        }

        $rule = PricingRule::findByCategoryAndSize($categoryId, $sizeId);
        if (!$rule) {
            Response::error('No pricing available for this combination', 404);
        }

        Response::success([
            'category_name' => $rule['category_name'],
            'size_label'    => $rule['size_label'],
            'price'         => $rule['price'],
            'currency'      => $rule['currency'],
        ]);
    }

    /**
     * POST /api/pricing  (Admin)
     * Body: { category_id, size_id, price }
     */
    public static function create(array $params): void
    {
        $body = Validator::getJsonBody();
        $missing = Validator::required($body, ['category_id', 'size_id', 'price']);
        if (!empty($missing)) {
            Response::error('Missing fields: ' . implode(', ', $missing), 422);
        }

        $categoryId = (int) $body['category_id'];
        $sizeId     = (int) $body['size_id'];

        if (!Category::findById($categoryId)) {
            Response::error('Category not found', 404);
        }
        if (!Size::findById($sizeId)) {
            Response::error('Size not found', 404);
        }

        // Check for existing rule
        $existing = PricingRule::findByCategoryAndSize($categoryId, $sizeId);
        if ($existing) {
            Response::error('Pricing rule already exists for this category and size', 409);
        }

        $id = PricingRule::create([
            'category_id' => $categoryId,
            'size_id'     => $sizeId,
            'price'       => (float) $body['price'],
            'currency'    => $body['currency'] ?? 'INR',
            'is_active'   => (int) ($body['is_active'] ?? 1),
        ]);

        $rule = PricingRule::findById($id);
        Response::success($rule, 'Pricing rule created', 201);
    }

    /**
     * PUT /api/pricing/:id  (Admin)
     */
    public static function update(array $params): void
    {
        $id = (int) $params['id'];
        if (!PricingRule::findById($id)) {
            Response::error('Pricing rule not found', 404);
        }

        $body = Validator::getJsonBody();
        $data = [];

        if (isset($body['price'])) {
            $data['price'] = (float) $body['price'];
        }
        if (isset($body['is_active'])) {
            $data['is_active'] = (int) $body['is_active'];
        }

        PricingRule::update($id, $data);
        $updated = PricingRule::findById($id);
        Response::success($updated, 'Pricing rule updated');
    }

    /**
     * DELETE /api/pricing/:id  (Admin)
     */
    public static function delete(array $params): void
    {
        $id = (int) $params['id'];
        if (!PricingRule::findById($id)) {
            Response::error('Pricing rule not found', 404);
        }

        PricingRule::delete($id);
        Response::success(null, 'Pricing rule deleted');
    }
}
