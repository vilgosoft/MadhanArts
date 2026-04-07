<?php

/**
 * Use with Docker MySQL (see repo root docker-compose.yml):
 *   docker compose up -d
 *
 * Copy to database.local.php (or merge the password line into your existing file).
 */

return [
    'driver'   => 'mysql',
    'host'     => '127.0.0.1',
    'port'     => '3306',
    'database' => 'madhan_arts',
    'username' => 'root',
    'password' => 'madhanarts',
];
