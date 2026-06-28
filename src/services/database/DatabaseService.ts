import SQLite from 'react-native-sqlite-storage';
import { DATABASE_NAME, SCHEMA } from './schema';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabase({
    name: DATABASE_NAME,
    location: 'default',
  });

  await executeSchema(db);
  return db;
};

const executeSchema = async (database: SQLite.SQLiteDatabase) => {
  const statements = SCHEMA.split(';').filter((s) => s.trim().length > 0);
  for (const statement of statements) {
    await database.executeSql(statement + ';');
  }
};

// ── Generic Cache Methods ──

export const cacheData = async (key: string, data: any, ttlMinutes = 60) => {
  const database = await getDatabase();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  await database.executeSql(
    'INSERT OR REPLACE INTO cache (key, data, expires_at) VALUES (?, ?, ?)',
    [key, JSON.stringify(data), expiresAt],
  );
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  const database = await getDatabase();
  const [results] = await database.executeSql(
    'SELECT data, expires_at FROM cache WHERE key = ?',
    [key],
  );

  if (results.rows.length === 0) return null;

  const row = results.rows.item(0);
  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    await database.executeSql('DELETE FROM cache WHERE key = ?', [key]);
    return null;
  }

  return JSON.parse(row.data) as T;
};

export const clearExpiredCache = async () => {
  const database = await getDatabase();
  await database.executeSql('DELETE FROM cache WHERE expires_at IS NOT NULL AND expires_at < datetime(\'now\')');
};

// ── Products Offline ──

export const saveProductsOffline = async (botId: number | string, products: any[]) => {
  const database = await getDatabase();
  const botIdNum = Number(botId);

  await database.transaction(async (tx) => {
    await tx.executeSql('DELETE FROM products WHERE bot_id = ?', [botIdNum]);
    for (const product of products) {
      await tx.executeSql(
        `INSERT OR REPLACE INTO products
          (id, bot_id, name, description, price, compare_price, category_id, image_url, stock, sort_order, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id, botIdNum, product.name, product.description || null,
          product.price, product.compare_price || null, product.category_id || null,
          product.image_url || null, product.stock || 0, product.sort_order || 0,
          product.status || 'active', product.created_at || null,
        ],
      );
    }
  });
};

export const getProductsOffline = async (botId: number | string): Promise<any[]> => {
  const database = await getDatabase();
  const [results] = await database.executeSql(
    'SELECT * FROM products WHERE bot_id = ? ORDER BY sort_order ASC',
    [Number(botId)],
  );

  const products: any[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    products.push(results.rows.item(i));
  }
  return products;
};

// ── Orders Offline ──

export const saveOrdersOffline = async (botId: number | string, orders: any[]) => {
  const database = await getDatabase();
  const botIdNum = Number(botId);

  await database.transaction(async (tx) => {
    await tx.executeSql('DELETE FROM orders WHERE bot_id = ?', [botIdNum]);
    for (const order of orders) {
      await tx.executeSql(
        `INSERT OR REPLACE INTO orders
          (id, bot_id, user_id, customer_name, customer_phone, total_amount, status,
           payment_method, payment_status, shipping_address, notes, items, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id, botIdNum, order.user_id || null, order.customer_name || null,
          order.customer_phone || null, order.total_amount, order.status,
          order.payment_method || null, order.payment_status || null,
          order.shipping_address || null, order.notes || null,
          JSON.stringify(order.items || []), order.created_at || null,
          order.updated_at || null,
        ],
      );
    }
  });
};

export const getOrdersOffline = async (botId: number | string, statusFilter?: string): Promise<any[]> => {
  const database = await getDatabase();
  const params: any[] = [Number(botId)];
  let sql = 'SELECT * FROM orders WHERE bot_id = ?';

  if (statusFilter && statusFilter !== 'all') {
    sql += ' AND status = ?';
    params.push(statusFilter);
  }

  sql += ' ORDER BY created_at DESC';

  const [results] = await database.executeSql(sql, params);
  const orders: any[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const item = results.rows.item(i);
    if (item.items && typeof item.items === 'string') {
      item.items = JSON.parse(item.items);
    }
    orders.push(item);
  }
  return orders;
};

export const closeDatabase = async () => {
  if (db) {
    await db.close();
    db = null;
  }
};
