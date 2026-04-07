<?php

$config = [
    // sqlite = no MySQL required (default for local). Set to mysql + credentials for XAMPP/Docker/production.
    'driver'     => getenv('DB_DRIVER') ?: 'sqlite',
    'sqlite_path' => getenv('SQLITE_PATH') ?: (__DIR__ . '/../database/madhanarts.sqlite'),
    'host'       => getenv('DB_HOST') ?: 'localhost',
    'port'       => getenv('DB_PORT') ?: '3306',
    'database'   => getenv('DB_NAME') ?: 'madhan_arts',
    'username'   => getenv('DB_USER') ?: 'root',
    'password'   => getenv('DB_PASS') ?: '',
    'charset'    => 'utf8mb4',
];

$local = __DIR__ . '/database.local.php';
if (is_file($local)) {
    $config = array_merge($config, require $local);
}

return $config;
