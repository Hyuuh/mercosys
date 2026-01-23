import express from 'express';
import cors from 'cors';
import { pool } from './db';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Customers ---
app.get('/api/customers', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, full_name as "fullName", created_at as "createdAt" FROM customers ORDER BY created_at DESC',
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO customers (email, full_name) VALUES ($1, $2) RETURNING id, email, full_name as "fullName", created_at as "createdAt"',
      [email, fullName],
    );
    console.log(`[DB] Customer created: ${rows[0].id} - ${rows[0].email}`);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- Products ---
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, sku, name, price::float, created_at as "createdAt" FROM products ORDER BY created_at DESC',
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { sku, name, price } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO products (sku, name, price) VALUES ($1, $2, $3) RETURNING id, sku, name, price::float, created_at as "createdAt"',
      [sku, name, price],
    );
    console.log(`[DB] Product created: ${rows[0].id} - ${rows[0].sku}`);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- Orders ---
app.get('/api/orders', async (req, res) => {
  try {
    const { rows: orders } = await pool.query(`
        SELECT
            o.id,
            o.customer_id as "customerId",
            o.total_price::float as "totalPrice",
            o.status,
            o.placed_at as "placedAt",
            o.expires_at as "expiresAt",
            c.full_name as "customerName"
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        ORDER BY o.placed_at DESC
      `);

    const orderIds = orders.map((o: any) => o.id);
    let itemsMap: Record<string, any[]> = {};

    if (orderIds.length > 0) {
      const { rows: items } = await pool.query(
        `
            SELECT
                oi.id,
                oi.order_id as "orderId",
                oi.product_id as "productId",
                oi.quantity,
                oi.unit_price::float as "unitPrice",
                p.name as "productName"
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ANY($1)
        `,
        [orderIds],
      );

      items.forEach((item: any) => {
        if (!itemsMap[item.orderId]) itemsMap[item.orderId] = [];
        itemsMap[item.orderId].push(item);
      });
    }

    const result = orders.map((o: any) => ({
      ...o,
      items: itemsMap[o.id] || [],
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { customerId, totalPrice, status, items } = req.body;

    // Insert Order
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (customer_id, total_price, status)
         VALUES ($1, $2, $3)
         RETURNING id, customer_id as "customerId", total_price::float as "totalPrice", status, placed_at as "placedAt"`,
      [customerId, totalPrice, status || 'pending'],
    );
    const newOrder = orderRows[0];

    // Insert Items
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                 VALUES ($1, $2, $3, $4)`,
          [newOrder.id, item.productId, item.quantity, item.unitPrice],
        );
      }
    }

    await client.query('COMMIT');
    console.log(
      `[DB] Order created: ${newOrder.id} for Customer ${customerId} with ${items?.length || 0} items`,
    );
    res.json(newOrder);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { customerId, totalPrice, status, items } = req.body;

    // Update Order
    const { rows: orderRows } = await client.query(
      `UPDATE orders
       SET customer_id = $1, total_price = $2, status = $3
       WHERE id = $4
       RETURNING id, customer_id as "customerId", total_price::float as "totalPrice", status, placed_at as "placedAt"`,
      [customerId, totalPrice, status, id],
    );

    if (orderRows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    const updatedOrder = orderRows[0];

    // Delete existing items to replace them
    await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);

    // Insert new items
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [id, item.productId, item.quantity, item.unitPrice],
        );
      }
    }

    await client.query('COMMIT');
    console.log(`[DB] Order updated: ${id}`);
    res.json(updatedOrder);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM orders WHERE id = $1', [id]);

    if (rowCount === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    console.log(`[DB] Order deleted: ${id}`);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
