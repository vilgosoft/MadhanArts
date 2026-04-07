<?php

/**
 * Stream a file under /uploads/... from public/uploads or legacy backend/uploads.
 * Used by router.php and index.php entry (before JSON API).
 */
function madhanarts_serve_upload_if_present(string $uriPath): bool
{
    if ($uriPath === '' || $uriPath === '/' || !str_starts_with($uriPath, '/uploads/')) {
        return false;
    }

    $relative = substr($uriPath, strlen('/uploads/'));
    $relative = str_replace('\\', '/', $relative);
    if ($relative === '' || $relative[0] === '/') {
        return false;
    }
    foreach (explode('/', $relative) as $segment) {
        if ($segment === '' || $segment === '.' || $segment === '..') {
            http_response_code(403);
            echo 'Forbidden';
            exit;
        }
    }

    $publicFile = __DIR__ . '/' . str_replace('/', DIRECTORY_SEPARATOR, 'uploads/' . $relative);
    if (is_file($publicFile)) {
        madhanarts_stream_file($publicFile);

        return true;
    }

    $legacyFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR
        . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $relative);
    if (is_file($legacyFile)) {
        madhanarts_stream_file($legacyFile);

        return true;
    }

    return false;
}

function madhanarts_stream_file(string $path): void
{
    $mime = @mime_content_type($path) ?: 'application/octet-stream';
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string) filesize($path));
    header('Cache-Control: public, max-age=86400');
    readfile($path);
    exit;
}
