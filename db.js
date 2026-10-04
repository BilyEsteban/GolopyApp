const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'golopy.db');
const db = new sqlite3.Database(dbPath);

const defaultProducts = [
  {
    id: 'bacon',
    name: 'Bacon',
    price: 339,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Carne de Res 100%,Queso Cheddar,Tocino Crujiente',
    customIngredients: 'Cebolla Caramelizada,Pepinillos,Salsa Especial'
  },
  {
    id: 'bacon-go',
    name: 'Bacon Go',
    price: 439,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Doble Carne de Res,Doble Queso,Tocino',
    customIngredients: 'Cebolla Caramelizada,Salsa de la Casa'
  },
  {
    id: 'chicken-go',
    name: 'Chicken Go',
    price: 249,
    category: 'Pollo',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Pollo Empanizado Crispy,Queso',
    customIngredients: 'Tomate,Lechuga,Cebolla,Pepinillos,Mayonesa'
  },
  {
    id: 'clasica',
    name: 'Hamburguesa Clásica',
    price: 229,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Carne de Res 100%,Queso Cheddar',
    customIngredients: 'Tomate,Lechuga,Cebolla,Pepinillos,Salsa Golopy'
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni Burger',
    price: 319,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Carne de Res,Pepperoni Grillado,Queso Fundido',
    customIngredients: 'Cebolla Caramelizada,Pepinillos,Salsa de Tomate Especiada'
  },
  {
    id: 'mega',
    name: 'Mega Hamburguesa',
    price: 695,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=600&q=80',
    coreIngredients: '3 Carnes de Res,6 Tocinetas,Triple Queso,Papas Incluidas',
    customIngredients: 'Pepinillos,Salsa Ranch,Salsa BBQ'
  },
  {
    id: 'pechurina-mini',
    name: 'Pechurina Mini',
    price: 359,
    category: 'Pollo',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Tiras de Pollo Empanizadas,Papas Incluidas',
    customIngredients: 'Salsa BBQ,Salsa Honey Mustard,Salsa Ranch,Salsa Ketchup'
  },
  {
    id: 'papas-medianas',
    name: 'Papas Medianas',
    price: 60,
    category: 'Acompañantes',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Papas Fritas Crujientes',
    customIngredients: 'Sal de la Casa,Ketchup al lado'
  },
  {
    id: 'milkshake-oreo',
    name: 'Milkshake Oreo',
    price: 190,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Galletas Oreo,Helado de Vainilla,Carnation,Chantilly,Hershey',
    customIngredients: ''
  },
  {
    id: 'milkshake-mora',
    name: 'Milkshake Mora',
    price: 270,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80',
    coreIngredients: 'Mora Natural,Helado Cremoso,Crema Chantilly,Sirope Hershey',
    customIngredients: ''
  }
];

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function runExec(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

async function ensureDatabase() {
  await runExec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      coreIngredients TEXT,
      customIngredients TEXT
    )
  `);

  const columns = await runQuery('PRAGMA table_info(products)');
  if (!columns.some((column) => column.name === 'active')) await runExec('ALTER TABLE products ADD COLUMN active INTEGER NOT NULL DEFAULT 1');
  if (!columns.some((column) => column.name === 'taxable')) await runExec('ALTER TABLE products ADD COLUMN taxable INTEGER NOT NULL DEFAULT 1');
  await runExec('CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
  await runExec(`CREATE TABLE IF NOT EXISTS app_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'Cajero',
    active INTEGER NOT NULL DEFAULT 1,
    permissions TEXT NOT NULL DEFAULT '{}'
  )`);

  await runExec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_number TEXT NOT NULL,
      customer TEXT NOT NULL,
      order_type TEXT NOT NULL,
      subtotal REAL NOT NULL,
      itbis REAL NOT NULL,
      total REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runExec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      item_total REAL NOT NULL,
      selected_customs TEXT,
      FOREIGN KEY(order_id) REFERENCES orders(id)
    )
  `);

  const productCount = await runQuery('SELECT COUNT(*) AS count FROM products');
  if ((productCount[0]?.count || 0) === 0) {
    const insertPromises = defaultProducts.map((product) => runExec(
      `INSERT INTO products (id, name, price, category, image, coreIngredients, customIngredients)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [product.id, product.name, product.price, product.category, product.image, product.coreIngredients, product.customIngredients]
    ));

    await Promise.all(insertPromises);
  }
}

async function getProducts() {
  const rows = await runQuery('SELECT * FROM products ORDER BY category, name');
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    image: row.image,
    coreIngredients: row.coreIngredients ? row.coreIngredients.split(',') : [],
    customIngredients: row.customIngredients ? row.customIngredients.split(',').filter(Boolean) : [],
    active: row.active !== 0,
    taxable: row.taxable !== 0
  }));
}

async function saveProduct(product) {
  const id = product.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const list = (value) => Array.isArray(value) ? value.join(',') : String(value || '');
  await runExec(`INSERT INTO products (id,name,price,category,image,coreIngredients,customIngredients,active,taxable)
    VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
    name=excluded.name,price=excluded.price,category=excluded.category,image=excluded.image,
    coreIngredients=excluded.coreIngredients,customIngredients=excluded.customIngredients,
    active=excluded.active,taxable=excluded.taxable`, [
    id, product.name, Number(product.price), product.category, product.image || '',
    list(product.coreIngredients), list(product.customIngredients), product.active === false ? 0 : 1,
    product.taxable === false ? 0 : 1
  ]);
  return (await getProducts()).find((item) => item.id === id);
}

async function getSettings() {
  const rows = await runQuery('SELECT key,value FROM app_settings');
  return rows.reduce((result, row) => {
    try { result[row.key] = JSON.parse(row.value); } catch { result[row.key] = row.value; }
    return result;
  }, {});
}

async function saveSettings(settings) {
  for (const [key, value] of Object.entries(settings)) {
    await runExec('INSERT INTO app_settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', [key, JSON.stringify(value)]);
  }
  return getSettings();
}

async function getUsers() {
  const rows = await runQuery('SELECT id,name,email,role,active,permissions FROM app_users ORDER BY name');
  return rows.map((row) => ({ ...row, active: row.active !== 0, permissions: (() => { try { return JSON.parse(row.permissions || '{}'); } catch { return {}; } })() }));
}

async function saveUser(user) {
  const fields = [user.name, user.email, user.role || 'Cajero', user.active === false ? 0 : 1, JSON.stringify(user.permissions || {})];
  if (user.id) await runExec('UPDATE app_users SET name=?,email=?,role=?,active=?,permissions=? WHERE id=?', [...fields, user.id]);
  else await runExec('INSERT INTO app_users(name,email,role,active,permissions) VALUES(?,?,?,?,?)', fields);
  return getUsers();
}

async function createOrder({ customer, orderType, items }) {
  const products = await getProducts();
  const settings = await getSettings();
  const taxRate = Number(settings.invoice?.taxRate ?? 18) / 100;
  const subtotal = items.reduce((total, item) => total + Number(item.unitPrice || 0) * Number(item.quantity || 0), 0);
  const itbis = items.reduce((total, item) => {
    const product = products.find((entry) => entry.id === (item.productId || item.id));
    return total + (product?.taxable ? Number(item.unitPrice || 0) * Number(item.quantity || 0) * taxRate : 0);
  }, 0);
  const total = subtotal + itbis;
  const receiptNumber = `ORD-${Date.now().toString().slice(-6)}`;

  const orderInsert = await runExec(
    `INSERT INTO orders (receipt_number, customer, order_type, subtotal, itbis, total)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [receiptNumber, customer || 'Cliente General', orderType || 'Para Llevar', subtotal, itbis, total]
  );

  const orderId = orderInsert.id;

  for (const item of items) {
    const selected = Array.isArray(item.selectedCustoms) ? item.selectedCustoms.join(',') : '';
    const itemTotal = Number(item.unitPrice || 0) * Number(item.quantity || 0);

    await runExec(
      `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, item_total, selected_customs)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, item.productId || item.id || 'unknown', item.name, Number(item.quantity || 1), Number(item.unitPrice || 0), itemTotal, selected]
    );
  }

  return {
    ok: true,
    receiptNumber,
    customer: customer || 'Cliente General',
    orderType: orderType || 'Para Llevar',
    subtotal: Number(subtotal.toFixed(2)),
    itbis: Number(itbis.toFixed(2)),
    total: Number(total.toFixed(2)),
    items
  };
}

async function getSalesHistory({ startDate, endDate } = {}) {
  let sql = `
    SELECT
      o.id,
      o.receipt_number,
      o.customer,
      o.order_type,
      o.subtotal,
      o.itbis,
      o.total,
      o.created_at,
      COUNT(oi.id) AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE 1 = 1
  `;

  const params = [];

  if (startDate) {
    sql += ' AND date(o.created_at) >= date(?)';
    params.push(startDate);
  }

  if (endDate) {
    sql += ' AND date(o.created_at) <= date(?)';
    params.push(endDate);
  }

  sql += ' GROUP BY o.id, o.receipt_number, o.customer, o.order_type, o.subtotal, o.itbis, o.total, o.created_at ORDER BY o.created_at DESC';

  const rows = await runQuery(sql, params);

  return rows.map((row) => ({
    id: row.id,
    receipt_number: row.receipt_number,
    customer: row.customer,
    order_type: row.order_type,
    subtotal: Number(row.subtotal),
    itbis: Number(row.itbis),
    total: Number(row.total),
    created_at: row.created_at,
    item_count: Number(row.item_count || 0)
  }));
}

async function getDetailedOrders({ search = '', startDate = '', endDate = '' } = {}) {
  let sql = `
    SELECT
      o.id,
      o.receipt_number,
      o.customer,
      o.order_type,
      o.subtotal,
      o.itbis,
      o.total,
      o.created_at
    FROM orders o
    WHERE 1 = 1
  `;

  const params = [];

  if (search) {
    sql += ' AND o.receipt_number LIKE ?';
    params.push(`%${search}%`);
  }

  if (startDate) {
    sql += ' AND date(o.created_at) >= date(?)';
    params.push(startDate);
  }

  if (endDate) {
    sql += ' AND date(o.created_at) <= date(?)';
    params.push(endDate);
  }

  sql += ' ORDER BY o.created_at DESC';

  const orders = await runQuery(sql, params);

  const result = [];

  for (const order of orders) {
    const items = await runQuery(
      `SELECT product_name, quantity, unit_price, item_total, selected_customs
       FROM order_items
       WHERE order_id = ?
       ORDER BY id ASC`,
      [order.id]
    );

    result.push({
      id: order.id,
      receipt_number: order.receipt_number,
      customer: order.customer,
      order_type: order.order_type,
      subtotal: Number(order.subtotal),
      itbis: Number(order.itbis),
      total: Number(order.total),
      created_at: order.created_at,
      items: items.map((item) => ({
        product_name: item.product_name,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        item_total: Number(item.item_total),
        selected_customs: item.selected_customs ? item.selected_customs.split(',').filter(Boolean) : []
      }))
    });
  }

  return result;
}

async function getTopSellingProducts({ startDate = '', endDate = '' } = {}) {
  let sql = `
    SELECT
      oi.product_name AS name,
      SUM(oi.quantity) AS sold_quantity,
      SUM(oi.item_total) AS revenue,
      COUNT(DISTINCT oi.order_id) AS order_count
    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.order_id
    WHERE 1 = 1
  `;

  const params = [];

  if (startDate) {
    sql += ' AND date(o.created_at) >= date(?)';
    params.push(startDate);
  }

  if (endDate) {
    sql += ' AND date(o.created_at) <= date(?)';
    params.push(endDate);
  }

  sql += ' GROUP BY oi.product_name ORDER BY sold_quantity DESC, revenue DESC LIMIT 10';

  const rows = await runQuery(sql, params);

  return rows.map((row) => ({
    name: row.name,
    sold_quantity: Number(row.sold_quantity || 0),
    revenue: Number(row.revenue || 0),
    order_count: Number(row.order_count || 0)
  }));
}

function buildSalesCsv(rows) {
  const headers = ['receipt_number', 'customer', 'order_type', 'subtotal', 'itbis', 'total', 'created_at', 'item_count'];

  const csvRows = rows.map((row) => [
    row.receipt_number,
    row.customer,
    row.order_type,
    row.subtotal,
    row.itbis,
    row.total,
    row.created_at,
    row.item_count
  ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','));

  return [headers.join(','), ...csvRows].join('\n');
}

module.exports = {
  ensureDatabase,
  getProducts,
  createOrder,
  getSalesHistory,
  getDetailedOrders,
  getTopSellingProducts,
  buildSalesCsv,
  saveProduct,
  getSettings,
  saveSettings,
  getUsers,
  saveUser,
  db
};
