<?php

/**
 * ── Production App Configuration ──
 *
 * Copy this to app.php (replacing the existing one) for production,
 * OR just update the values in the existing app.php.
 */
return [
    'jwt_secret'       => 'CHANGE-THIS-TO-A-RANDOM-64-CHAR-STRING',  // ← Generate a strong secret!
    'jwt_expiry'       => 86400, // 24 hours
    'upload_path'      => __DIR__ . '/../public/uploads',
    'allowed_origins'  => [
        'https://madhanarts.in',
        'https://www.madhanarts.in',
        // Add your actual domain here
    ],
    'max_upload_size'  => 10 * 1024 * 1024, // 10MB
    'currency'         => 'INR',
];
