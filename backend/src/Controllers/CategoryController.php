<?php

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Models\Category;

class CategoryController
{
    /**
     * GET /api/categories
     */
    public static function index(array $params): void
    {
        $categories = Category::findAll(true);
        Response::success($categories);
    }

    /**
     * GET /api/categories/all  (Admin — includes inactive)
     */
    public static function indexAll(array $params): void
    {
        $categories = Category::findAll(false);
        Response::success($categories);
    }

    /**
     * GET /api/categories/:slug
     */
    public static function show(array $params): void
    {
        $category = Category::findBySlug($params['slug']);
        if (!$category) {
            Response::error('Category not found', 404);
        }
        Response::success($category);
    }

    /**
     * POST /api/categories
     * Body: { name, description?, cover_image?, sort_order?, is_active? }
     */
    public static function create(array $params): void
    {
        $body = Validator::getJsonBody();
        $missing = Validator::required($body, ['name']);
        if (!empty($missing)) {
            Response::error('Category name is required', 422);
        }

        $name = Validator::sanitizeString($body['name']);
        $slug = $body['slug'] ?? Validator::createSlug($name);

        // Check for duplicate slug
        if (Category::findBySlug($slug)) {
            Response::error('A category with this name already exists', 409);
        }

        $id = Category::create([
            'name'        => $name,
            'slug'        => $slug,
            'description' => isset($body['description']) ? Validator::sanitizeString($body['description']) : null,
            'cover_image' => $body['cover_image'] ?? null,
            'sort_order'  => (int) ($body['sort_order'] ?? 0),
            'is_active'   => (int) ($body['is_active'] ?? 1),
        ]);

        $category = Category::findById($id);
        Response::success($category, 'Category created', 201);
    }

    /**
     * PUT /api/categories/:id
     * Body: { name?, description?, cover_image?, sort_order?, is_active? }
     */
    public static function update(array $params): void
    {
        $id = (int) $params['id'];
        $category = Category::findById($id);
        if (!$category) {
            Response::error('Category not found', 404);
        }

        $body = Validator::getJsonBody();
        $data = [];

        if (isset($body['name'])) {
            $data['name'] = Validator::sanitizeString($body['name']);
            $data['slug'] = $body['slug'] ?? Validator::createSlug($data['name']);
        }
        if (array_key_exists('description', $body)) {
            $data['description'] = $body['description'] ? Validator::sanitizeString($body['description']) : null;
        }
        if (array_key_exists('cover_image', $body)) {
            $data['cover_image'] = $body['cover_image'];
        }
        if (isset($body['sort_order'])) {
            $data['sort_order'] = (int) $body['sort_order'];
        }
        if (isset($body['is_active'])) {
            $data['is_active'] = (int) $body['is_active'];
        }

        Category::update($id, $data);
        $updated = Category::findById($id);
        Response::success($updated, 'Category updated');
    }

    /**
     * DELETE /api/categories/:id
     */
    public static function delete(array $params): void
    {
        $id = (int) $params['id'];
        $category = Category::findById($id);
        if (!$category) {
            Response::error('Category not found', 404);
        }

        Category::delete($id);
        Response::success(null, 'Category deleted');
    }
}
