<?php

require_once __DIR__ . '/serve-upload.php';
$__uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '/';
if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    madhanarts_serve_upload_if_present($__uriPath);
}
unset($__uriPath);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Router;
use App\Middleware\CorsMiddleware;
use App\Middleware\AuthMiddleware;
use App\Middleware\AdminMiddleware;
use App\Controllers\AuthController;
use App\Controllers\CategoryController;
use App\Controllers\GalleryController;
use App\Controllers\SizeController;
use App\Controllers\PricingController;
use App\Controllers\OrderController;
use App\Controllers\UserController;
use App\Helpers\Response;

// ──────────────────────────────────────
// Bootstrap
// ──────────────────────────────────────
header('Content-Type: application/json');

$router = new Router();

// Global middleware
$router->addMiddleware([CorsMiddleware::class, 'handle']);

// Root (browser or health check — was returning "Route not found")
$router->get('/api', static function (array $params): void {
    Response::success([
        'service' => 'Madhan Arts API',
        'examples' => [
            'GET /api/categories',
            'GET /api/gallery',
            'GET /api/sizes',
        ],
    ], 'OK');
});

// ──────────────────────────────────────
// Auth Routes
// ──────────────────────────────────────
$router->post('/api/auth/admin/login', [AuthController::class, 'adminLogin']);
$router->post('/api/auth/register',    [AuthController::class, 'register']);
$router->post('/api/auth/login',       [AuthController::class, 'userLogin']);
$router->get('/api/auth/me',          [AuthController::class, 'me'],
    [[AuthMiddleware::class, 'handle']]);

// ──────────────────────────────────────
// Category Routes
// ──────────────────────────────────────
// Public
$router->get('/api/categories',       [CategoryController::class, 'index']);
// Admin (must be before :slug to avoid conflict)
$router->get('/api/categories/all',   [CategoryController::class, 'indexAll'],
    [[AdminMiddleware::class, 'handle']]);
// Public (after /all to avoid conflict)
$router->get('/api/categories/:slug', [CategoryController::class, 'show']);
// Admin
$router->post('/api/categories',      [CategoryController::class, 'create'],
    [[AdminMiddleware::class, 'handle']]);
$router->put('/api/categories/:id',   [CategoryController::class, 'update'],
    [[AdminMiddleware::class, 'handle']]);
$router->delete('/api/categories/:id', [CategoryController::class, 'delete'],
    [[AdminMiddleware::class, 'handle']]);

// ──────────────────────────────────────
// Gallery Routes
// ──────────────────────────────────────
// Public
$router->get('/api/gallery',                      [GalleryController::class, 'index']);
$router->get('/api/gallery/category/:categoryId', [GalleryController::class, 'byCategory']);
// Admin
$router->post('/api/gallery',     [GalleryController::class, 'create'],
    [[AdminMiddleware::class, 'handle']]);
$router->put('/api/gallery/:id',  [GalleryController::class, 'update'],
    [[AdminMiddleware::class, 'handle']]);
$router->delete('/api/gallery/:id', [GalleryController::class, 'delete'],
    [[AdminMiddleware::class, 'handle']]);

// ──────────────────────────────────────
// Size Routes
// ──────────────────────────────────────
// Public
$router->get('/api/sizes', [SizeController::class, 'index']);
// Admin
$router->post('/api/sizes',      [SizeController::class, 'create'],
    [[AdminMiddleware::class, 'handle']]);
$router->put('/api/sizes/:id',   [SizeController::class, 'update'],
    [[AdminMiddleware::class, 'handle']]);
$router->delete('/api/sizes/:id', [SizeController::class, 'delete'],
    [[AdminMiddleware::class, 'handle']]);

// ──────────────────────────────────────
// Pricing Routes
// ──────────────────────────────────────
// Public
$router->get('/api/pricing/category/:categoryId', [PricingController::class, 'byCategory']);
$router->get('/api/pricing/calculate',            [PricingController::class, 'calculate']);
// Admin
$router->get('/api/pricing',        [PricingController::class, 'index'],
    [[AdminMiddleware::class, 'handle']]);
$router->post('/api/pricing',       [PricingController::class, 'create'],
    [[AdminMiddleware::class, 'handle']]);
$router->put('/api/pricing/:id',    [PricingController::class, 'update'],
    [[AdminMiddleware::class, 'handle']]);
$router->delete('/api/pricing/:id', [PricingController::class, 'delete'],
    [[AdminMiddleware::class, 'handle']]);

// ──────────────────────────────────────
// Users (Admin)
// ──────────────────────────────────────
$router->get('/api/users', [UserController::class, 'index'],
    [[AdminMiddleware::class, 'handle']]);
$router->put('/api/users/:id', [UserController::class, 'update'],
    [[AdminMiddleware::class, 'handle']]);

// ──────────────────────────────────────
// Order Routes
// ──────────────────────────────────────
$router->post('/api/orders',   [OrderController::class, 'create'],
    [[AuthMiddleware::class, 'handle']]);
$router->get('/api/orders',    [OrderController::class, 'index'],
    [[AuthMiddleware::class, 'handle']]);
$router->get('/api/orders/:id', [OrderController::class, 'show'],
    [[AuthMiddleware::class, 'handle']]);
$router->put('/api/orders/:id/status', [OrderController::class, 'updateStatus'],
    [[AdminMiddleware::class, 'handle']]);
$router->get('/api/orders/:id/photo', [OrderController::class, 'downloadPhoto'],
    [[AdminMiddleware::class, 'handle']]);

// ──────────────────────────────────────
// Resolve the request
// ──────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$uri    = $_SERVER['REQUEST_URI'];

$router->resolve($method, $uri);
