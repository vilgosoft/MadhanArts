-- ============================================
-- Madhan Arts - Database Schema
-- MySQL 8.0+
-- ============================================

CREATE DATABASE IF NOT EXISTS madhan_arts
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE madhan_arts;

-- ============================================
-- 1. ADMINS — Email/Password login
-- ============================================
CREATE TABLE admins (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,  -- bcrypt hash
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 2. USERS (Customers) — OTP-based login
-- ============================================
CREATE TABLE users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NULL UNIQUE,
  phone       VARCHAR(20)   NULL UNIQUE,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- At least one contact method required (enforced at app level)
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
) ENGINE=InnoDB;

-- ============================================
-- 3. OTP_TOKENS — Stores pending OTPs
-- ============================================
CREATE TABLE otp_tokens (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  identifier  VARCHAR(255)  NOT NULL,  -- email or phone
  otp_code    VARCHAR(6)    NOT NULL,
  expires_at  DATETIME      NOT NULL,
  verified    TINYINT(1)    DEFAULT 0,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_identifier (identifier),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

-- ============================================
-- 4. CATEGORIES — Art types managed by admin
-- ============================================
CREATE TABLE categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150)  NOT NULL,         -- e.g. "Pencil Sketch Portrait"
  slug        VARCHAR(150)  NOT NULL UNIQUE,  -- e.g. "pencil-sketch-portrait"
  description TEXT          NULL,
  cover_image VARCHAR(500)  NULL,             -- representative image URL
  sort_order  INT           DEFAULT 0,
  is_active   TINYINT(1)    DEFAULT 1,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 5. GALLERY_ITEMS — Portfolio images
-- ============================================
CREATE TABLE gallery_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED  NOT NULL,
  image_url   VARCHAR(500)  NOT NULL,
  title       VARCHAR(200)  NULL,
  sort_order  INT           DEFAULT 0,
  is_active   TINYINT(1)    DEFAULT 1,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id)
) ENGINE=InnoDB;

-- ============================================
-- 6. SIZES — Available canvas/paper sizes
-- ============================================
CREATE TABLE sizes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label       VARCHAR(50)   NOT NULL UNIQUE,  -- e.g. "A4", "A3", "A2"
  description VARCHAR(200)  NULL,             -- e.g. "210 x 297 mm"
  sort_order  INT           DEFAULT 0,
  is_active   TINYINT(1)    DEFAULT 1
) ENGINE=InnoDB;

-- ============================================
-- 7. PRICING_RULES — Category + Size = Price
-- ============================================
CREATE TABLE pricing_rules (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED  NOT NULL,
  size_id     INT UNSIGNED  NOT NULL,
  price       DECIMAL(10,2) NOT NULL,  -- in smallest major currency unit
  currency    VARCHAR(3)    DEFAULT 'INR',
  is_active   TINYINT(1)    DEFAULT 1,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (size_id)     REFERENCES sizes(id)      ON DELETE CASCADE,
  UNIQUE KEY  uq_category_size (category_id, size_id)
) ENGINE=InnoDB;

-- ============================================
-- 8. ORDERS — Customer orders
-- ============================================
CREATE TABLE orders (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number      VARCHAR(20)   NOT NULL UNIQUE,       -- e.g. "MA-20260407-0001"
  user_id           INT UNSIGNED  NOT NULL,
  category_id       INT UNSIGNED  NOT NULL,
  size_id           INT UNSIGNED  NOT NULL,
  pricing_rule_id   INT UNSIGNED  NOT NULL,
  reference_photo   VARCHAR(500)  NOT NULL,              -- uploaded photo path
  amount            DECIMAL(10,2) NOT NULL,
  currency          VARCHAR(3)    DEFAULT 'INR',
  payment_gateway   VARCHAR(20)   NULL,                  -- 'stripe' or 'razorpay'
  payment_id        VARCHAR(255)  NULL,                  -- gateway transaction ID
  payment_status    ENUM('pending','paid','failed','refunded')
                                  DEFAULT 'pending',
  order_status      ENUM('received','in_progress','completed','delivered','cancelled')
                                  DEFAULT 'received',
  admin_notes       TEXT          NULL,
  created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)         REFERENCES users(id),
  FOREIGN KEY (category_id)     REFERENCES categories(id),
  FOREIGN KEY (size_id)         REFERENCES sizes(id),
  FOREIGN KEY (pricing_rule_id) REFERENCES pricing_rules(id),

  INDEX idx_user       (user_id),
  INDEX idx_status     (order_status),
  INDEX idx_payment    (payment_status),
  INDEX idx_created    (created_at)
) ENGINE=InnoDB;

-- ============================================
-- SEED: Default admin account
-- Password: "admin123" (change immediately in production)
-- bcrypt hash of "admin123"
-- ============================================
INSERT INTO admins (name, email, password) VALUES
('Madhan', 'admin@madhanarts.com', '$2y$12$LJ3m4ys3Gz8y1w5TQf9z8OeYv7FG0oN3qHxK9R2vW1bXc4dE6fGhI');

-- ============================================
-- SEED: Default sizes
-- ============================================
INSERT INTO sizes (label, description, sort_order) VALUES
('A5', '148 x 210 mm', 1),
('A4', '210 x 297 mm', 2),
('A3', '297 x 420 mm', 3),
('A2', '420 x 594 mm', 4),
('A1', '594 x 841 mm', 5);
