const test = require('node:test');
const assert = require('node:assert/strict');
const { getSalesHistory, buildSalesCsv, getDetailedOrders, getTopSellingProducts } = require('../db');

test('getSalesHistory debe devolver un array', async () => {
  const rows = await getSalesHistory();
  assert.ok(Array.isArray(rows));
});

test('buildSalesCsv debe crear un contenido CSV con encabezados', () => {
  const csv = buildSalesCsv([
    {
      receipt_number: 'ORD-0001',
      customer: 'Cliente Test',
      order_type: 'Para Llevar',
      subtotal: 100,
      itbis: 18,
      total: 118,
      created_at: '2026-09-21 12:00:00',
      item_count: 2
    }
  ]);

  assert.match(csv, /receipt_number/);
  assert.match(csv, /ORD-0001/);
});

test('getDetailedOrders debe devolver ordenes con detalle de items', async () => {
  const rows = await getDetailedOrders({ search: '' });
  assert.ok(Array.isArray(rows));
  if (rows.length > 0) {
    assert.ok(Array.isArray(rows[0].items));
    assert.ok(rows[0].receipt_number);
  }
});

test('getTopSellingProducts debe devolver productos con cantidad y ingreso', async () => {
  const rows = await getTopSellingProducts();
  assert.ok(Array.isArray(rows));
  if (rows.length > 0) {
    assert.ok(typeof rows[0].name === 'string');
    assert.ok(Number.isFinite(Number(rows[0].sold_quantity)));
  }
});
