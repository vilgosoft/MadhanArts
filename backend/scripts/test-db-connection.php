<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Database;

$config = require __DIR__ . '/../config/database.php';
$driver = $config['driver'] ?? 'sqlite';

echo "Driver: {$driver}\n";

if ($driver === 'sqlite') {
    echo "SQLite file: {$config['sqlite_path']}\n";
}

try {
    $pdo = Database::getConnection();
    echo "OK — connected.\n";
    if ($driver === 'sqlite') {
        $n = (int) $pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();
        echo "admins table rows: {$n}\n";
    }
} catch (Throwable $e) {
    echo "FAIL — " . $e->getMessage() . "\n";
    exit(1);
}
