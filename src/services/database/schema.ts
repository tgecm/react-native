export const DATABASE_NAME = 'teleshop_admin.db';
export const DATABASE_VERSION = '1.0';

export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    username TEXT,
    phone TEXT,
    photo_url TEXT,
    order_count INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0,
    created_at TEXT,
    bot_id INTEGER,
    synced_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    bot_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    compare_price REAL,
    category_id INTEGER,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TEXT,
    synced_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    bot_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    synced_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    bot_id INTEGER NOT NULL,
    user_id INTEGER,
    customer_name TEXT,
    customer_phone TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT,
    shipping_address TEXT,
    notes TEXT,
    items TEXT,
    created_at TEXT,
    updated_at TEXT,
    synced_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS chats (
    user_id INTEGER NOT NULL,
    bot_id INTEGER NOT NULL,
    name TEXT,
    username TEXT,
    last_message TEXT,
    last_message_time TEXT,
    unread_count INTEGER DEFAULT 0,
    photo_url TEXT,
    PRIMARY KEY (user_id, bot_id),
    synced_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_user_id INTEGER NOT NULL,
    bot_id INTEGER NOT NULL,
    text TEXT,
    file_id TEXT,
    file_type TEXT,
    sender TEXT NOT NULL,
    timestamp TEXT,
    synced_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    expires_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pending_changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    action TEXT NOT NULL,
    record_id INTEGER,
    data TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    synced INTEGER DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_products_bot_id ON products(bot_id);
  CREATE INDEX IF NOT EXISTS idx_orders_bot_id ON orders(bot_id);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_chats_bot_id ON chats(bot_id);
  CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_user_id, bot_id);
  CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache(expires_at);
`;
