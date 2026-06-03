import { Router } from 'express';
import { db } from '../db.js';
import type { Invoice } from '../types.js';

// Mounted under "/invoices" in index.ts.
export const invoicesRouter = Router();

// GET /invoices — list them all.
invoicesRouter.get('/', (_req, res) => {
  const invoices = db.prepare('SELECT * FROM invoices').all();
  res.json(invoices);
});

// GET /invoices/:id — one invoice, or 404.
invoicesRouter.get('/:id', (req, res) => {
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) {
    res.status(404).json({ error: 'Invoice not found' });
    return;
  }
  res.json(invoice);
});

// POST /invoices — create. patientId + serviceName are required.
invoicesRouter.post('/', (req, res) => {
  const { patientId, serviceName, amount, status } = req.body as Partial<Invoice>;
  if (!patientId || !serviceName) {
    res.status(400).json({ error: 'patientId and serviceName are required' });
    return;
  }
  const result = db
    .prepare(
      'INSERT INTO invoices (patientId, serviceName, amount, status) VALUES (?, ?, ?, ?)',
    )
    .run(patientId, serviceName, amount ?? 0, status ?? 'unpaid');
  const created = db.prepare('SELECT * FROM invoices WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /invoices/:id — update (404 if not found); omitted fields stay as-is.
invoicesRouter.put('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM invoices WHERE id = ?')
    .get(req.params.id) as Invoice | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Invoice not found' });
    return;
  }
  const { patientId, serviceName, amount, status } = req.body as Partial<Invoice>;
  db.prepare(
    'UPDATE invoices SET patientId = ?, serviceName = ?, amount = ?, status = ? WHERE id = ?',
  ).run(
    patientId ?? existing.patientId,
    serviceName ?? existing.serviceName,
    amount ?? existing.amount,
    status ?? existing.status,
    req.params.id,
  );
  const updated = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /invoices/:id — 404 if missing, 204 on success.
invoicesRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Invoice not found' });
    return;
  }
  res.status(204).send();
});
