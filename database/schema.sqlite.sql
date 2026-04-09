-- Madhan Arts — SQLite schema for local dev (no MySQL server required)
-- Loaded automatically on first API request when driver = sqlite

PRAGMA foreign_keys = ON;

CREATE TABLE admins (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE,
  phone      TEXT UNIQUE,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE TABLE otp_tokens (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  identifier TEXT NOT NULL,
  otp_code   TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  verified   INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_otp_identifier ON otp_tokens (identifier);
CREATE INDEX idx_otp_expires ON otp_tokens (expires_at);

CREATE TABLE categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1,
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE gallery_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  image_url   TEXT NOT NULL,
  title       TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1,
  created_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
CREATE INDEX idx_gallery_category ON gallery_items (category_id);

CREATE TABLE sizes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  label       TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1
);

CREATE TABLE pricing_rules (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  size_id     INTEGER NOT NULL,
  price       REAL NOT NULL,
  currency    TEXT DEFAULT 'INR',
  is_active   INTEGER DEFAULT 1,
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE CASCADE,
  UNIQUE (category_id, size_id)
);

CREATE TABLE orders (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number      TEXT NOT NULL UNIQUE,
  user_id           INTEGER NOT NULL,
  category_id       INTEGER NOT NULL,
  size_id           INTEGER NOT NULL,
  pricing_rule_id   INTEGER NOT NULL,
  reference_photo   TEXT NOT NULL,
  delivery_address  TEXT NOT NULL DEFAULT '',
  needed_by_date    TEXT,
  amount            REAL NOT NULL,
  currency          TEXT DEFAULT 'INR',
  payment_gateway   TEXT,
  payment_id        TEXT,
  payment_status    TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','failed','refunded')),
  order_status      TEXT NOT NULL DEFAULT 'received'
    CHECK (order_status IN ('received','in_progress','completed','delivered','cancelled')),
  admin_notes       TEXT,
  created_at        TEXT DEFAULT (datetime('now')),
  updated_at        TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (size_id) REFERENCES sizes(id),
  FOREIGN KEY (pricing_rule_id) REFERENCES pricing_rules(id)
);
CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_orders_order_status ON orders (order_status);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);
CREATE INDEX idx_orders_created ON orders (created_at);

INSERT INTO admins (name, email, password) VALUES
('Madhan', 'admin@madhanarts.com', '$2y$12$dOuQKUEeZYWsJVCdIj6veu5ruUT8BptOw.ERp4pw0KPhxe7KRMR6m');

INSERT INTO sizes (label, description, sort_order) VALUES
('A5', '148 x 210 mm', 1),
('A4', '210 x 297 mm', 2),
('A3', '297 x 420 mm', 3),
('A2', '420 x 594 mm', 4),
('A1', '594 x 841 mm', 5);
