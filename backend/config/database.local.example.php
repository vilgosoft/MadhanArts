<?php

/**
 * Local MySQL — only if you use XAMPP/phpMyAdmin/Docker MySQL instead of built-in SQLite.
 *
 * 1. Copy this file to database.local.php (same folder).
 * 2. You MUST set driver => mysql (default in config is sqlite, no server needed).
 * 3. Create database `madhan_arts` and import database/schema.sql in phpMyAdmin.
 */

return [
    'driver'   => 'mysql',
    'host'     => '127.0.0.1',
    'port'     => '3306',
    'database' => 'madhan_arts',
    'username' => 'root',
    'password' => '',
];
