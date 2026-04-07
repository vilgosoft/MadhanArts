<?php

return [
    'jwt_secret'       => getenv('JWT_SECRET') ?: 'madhanarts-secret-change-in-production',
    'jwt_expiry'       => 86400, // 24 hours
    // Under public/ so PHP dev server & Apache can serve /uploads/... URLs
    'upload_path'      => __DIR__ . '/../public/uploads',
    'allowed_origins'  => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],
    'max_upload_size'  => 10 * 1024 * 1024, // 10MB
    'currency'         => 'INR',
];
