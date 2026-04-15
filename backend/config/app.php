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
    'frontend_url'     => rtrim(getenv('FRONTEND_URL') ?: 'http://localhost:5173', '/'),
    'phonepe'          => [
        'merchant_id'    => getenv('PHONEPE_MERCHANT_ID') ?: '',
        'salt_key'       => getenv('PHONEPE_SALT_KEY') ?: '',
        'salt_index'     => getenv('PHONEPE_SALT_INDEX') ?: '1',
        'base_url'       => rtrim(getenv('PHONEPE_BASE_URL') ?: 'https://api-preprod.phonepe.com/apis/pg-sandbox', '/'),
        'redirect_path'  => getenv('PHONEPE_REDIRECT_PATH') ?: '/payment-result',
    ],
];
