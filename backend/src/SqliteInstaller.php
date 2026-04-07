<?php

namespace App;

use PDO;

/**
 * One-time SQLite bootstrap from database/schema.sqlite.sql
 */
final class SqliteInstaller
{
    public static function ensureSchema(PDO $pdo, string $schemaPath): void
    {
        $check = $pdo->query(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'admins' LIMIT 1"
        );
        if ($check && $check->fetchColumn()) {
            return;
        }

        if (!is_readable($schemaPath)) {
            throw new \RuntimeException('SQLite schema file missing: ' . $schemaPath);
        }

        $sql = file_get_contents($schemaPath);
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            static fn (string $s): bool => $s !== ''
        );

        foreach ($statements as $statement) {
            $pdo->exec($statement);
        }
    }
}
