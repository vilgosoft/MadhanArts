-- ============================================
-- Migration: Add delivery_address & needed_by_date to orders
-- Run this on an EXISTING database to add the new columns.
-- Safe to run multiple times (uses IF NOT EXISTS logic).
-- ============================================

-- MySQL version
-- Check if column exists before adding (MySQL 8.0+)
SET @dbname = DATABASE();

SELECT COUNT(*) INTO @col_exists
FROM information_schema.columns
WHERE table_schema = @dbname AND table_name = 'orders' AND column_name = 'delivery_address';

SET @sql = IF(@col_exists = 0,
  'ALTER TABLE orders ADD COLUMN delivery_address TEXT NOT NULL DEFAULT \'\' AFTER reference_photo',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @col_exists
FROM information_schema.columns
WHERE table_schema = @dbname AND table_name = 'orders' AND column_name = 'needed_by_date';

SET @sql = IF(@col_exists = 0,
  'ALTER TABLE orders ADD COLUMN needed_by_date DATE NULL AFTER delivery_address',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
