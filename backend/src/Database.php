<?php

namespace App;

use App\Helpers\Response;
use PDO;
use PDOException;
use RuntimeException;

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $config = require __DIR__ . '/../config/database.php';
            $driver = $config['driver'] ?? 'sqlite';

            if ($driver === 'sqlite') {
                self::$instance = self::connectSqlite($config);
            } else {
                self::$instance = self::connectMysql($config);
            }
        }

        return self::$instance;
    }

    private static function connectSqlite(array $config): PDO
    {
        $path = $config['sqlite_path'];
        $dir = dirname($path);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $dsn = 'sqlite:' . str_replace('\\', '/', $path);

        try {
            $pdo = new PDO($dsn, null, null, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $pdo->exec('PRAGMA foreign_keys = ON');

            $schemaFile = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'schema.sqlite.sql';
            SqliteInstaller::ensureSchema($pdo, $schemaFile);

            return $pdo;
        } catch (RuntimeException $e) {
            Response::error('SQLite setup failed: ' . $e->getMessage(), 500);
        } catch (PDOException $e) {
            Response::error('SQLite connection failed: ' . $e->getMessage(), 500);
        }

        throw new \LogicException('Unreachable');
    }

    private static function connectMysql(array $config): PDO
    {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            $config['host'],
            $config['port'],
            $config['database'],
            $config['charset']
        );

        try {
            return new PDO($dsn, $config['username'], $config['password'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            $hint = sprintf(
                ' (%s:%s, database "%s"). ',
                $config['host'],
                $config['port'],
                $config['database']
            );
            $help = 'Start MySQL, or remove driver => mysql from database.local.php to use built-in SQLite for local dev.';
            Response::error('Database connection failed' . $hint . $help, 500);
        }

        throw new \LogicException('Unreachable');
    }
}
