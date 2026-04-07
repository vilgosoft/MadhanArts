<?php

/**
 * Front controller for PHP's built-in server (`php -S ... router.php`).
 * Serves existing files as static assets; legacy uploads from backend/uploads;
 * otherwise runs the API entry point.
 */
require_once __DIR__ . '/serve-upload.php';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$file = __DIR__ . $path;
if ($path !== '/' && $path !== '' && is_file($file)) {
    return false;
}

if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    madhanarts_serve_upload_if_present($path);
}

require __DIR__ . '/index.php';
