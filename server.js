const express = require('express');
const path = require('path');
const { ensureDatabase, getProducts, createOrder, getSalesHistory, buildSalesCsv, getDetailedOrders, getTopSellingProducts } = require('./db');

const app = express();
const preferredPort = Number(process.env.PORT) || 3001;
const candidatePorts = Array.from(new Set([preferredPort, 3002, 3003, 3004]));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Golopy API funcionando correctamente.' });
});

app.get('/api/menu', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al consultar productos:', error);
    res.status(500).json({ ok: false, message: 'No se pudo obtener el menú.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { customer, orderType, items } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ ok: false, message: 'La orden no tiene productos.' });
  }

  try {
    const order = await createOrder({ customer, orderType, items });
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error al guardar la orden:', error);
    return res.status(500).json({ ok: false, message: 'No se pudo registrar la orden.' });
  }
});

app.get('/api/sales', async (req, res) => {
  try {
    const rows = await getSalesHistory({
      startDate: req.query.startDate,
      endDate: req.query.endDate
    });

    res.json(rows);
  } catch (error) {
    console.error('Error al consultar historial de ventas:', error);
    res.status(500).json({ ok: false, message: 'No se pudo cargar el historial.' });
  }
});

app.get('/api/sales/export', async (req, res) => {
  try {
    const rows = await getSalesHistory({
      startDate: req.query.startDate,
      endDate: req.query.endDate
    });

    const csv = buildSalesCsv(rows);
    const fileName = `ventas-${Date.now()}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(csv);
  } catch (error) {
    console.error('Error al exportar ventas:', error);
    res.status(500).json({ ok: false, message: 'No se pudo exportar el historial.' });
  }
});

app.get('/api/orders/detail', async (req, res) => {
  try {
    const rows = await getDetailedOrders({
      search: req.query.search || '',
      startDate: req.query.startDate || '',
      endDate: req.query.endDate || ''
    });

    res.json(rows);
  } catch (error) {
    console.error('Error al consultar ordenes detalladas:', error);
    res.status(500).json({ ok: false, message: 'No se pudo cargar el detalle de ordenes.' });
  }
});

app.get('/api/products/top-selling', async (req, res) => {
  try {
    const rows = await getTopSellingProducts({
      startDate: req.query.startDate || '',
      endDate: req.query.endDate || ''
    });

    res.json(rows);
  } catch (error) {
    console.error('Error al consultar productos más vendidos:', error);
    res.status(500).json({ ok: false, message: 'No se pudo cargar el informe de productos.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Index.html'));
});

const startServer = (portIndex = 0) => {
  const port = candidatePorts[portIndex];
  const server = app.listen(port, () => {
    console.log(`Servidor Golopy corriendo en http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && portIndex < candidatePorts.length - 1) {
      console.warn(`Puerto ${port} ocupado. Intentando ${candidatePorts[portIndex + 1]}...`);
      startServer(portIndex + 1);
      return;
    }

    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  });
};

ensureDatabase()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.error('No se pudo inicializar la base de datos:', error);
    process.exit(1);
  });
