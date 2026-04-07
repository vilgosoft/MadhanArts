<?php

return [
    'jwt_secret'       => getenv('JWT_SECRET') ?: 'madhanarts-secret-change-in-production',
    'jwt_expiry'       => 86400, // 24 hours
    'upload_path'      => __DIR__ . '/../uploads',
    'allowed_origins'  => ['http://localhost:5173', 'http://localhost:3000'],
    'max_upload_size'  => 10 * 1024 * 1024, // 10MB
    'currency'         => 'INR',
];
