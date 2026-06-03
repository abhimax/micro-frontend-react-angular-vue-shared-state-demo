import { Router } from 'express';
import { db } from '../db.js';
import type { Appointment } from '../types.js';

// Mounted under "/appointments" in index.ts.
export const appointmentsRouter = Router();

// GET /appointments — list them all.
appointmentsRouter.get('/', (_req, res) => {
  const appointments = db.prepare('SELECT * FROM appointments').all();
  res.json(appointments);
});

// GET /appointments/:id — one appointment, or 404.
appointmentsRouter.get('/:id', (req, res) => {
  const appointment = db
    .prepare('SELECT * FROM appointments WHERE id = ?')
    .get(req.params.id);
  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.json(appointment);
});

// POST /appointments — create. patientId + doctorName are required.
appointmentsRouter.post('/', (req, res) => {
  const { patientId, doctorName, department, date, time, status } =
    req.body as Partial<Appointment>;
  if (!patientId || !doctorName) {
    res.status(400).json({ error: 'patientId and doctorName are required' });
    return;
  }
  const result = db
    .prepare(
      'INSERT INTO appointments (patientId, doctorName, department, date, time, status) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .run(
      patientId,
      doctorName,
      department ?? null,
      date ?? null,
      time ?? null,
      status ?? 'scheduled',
    );
  const created = db
    .prepare('SELECT * FROM appointments WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /appointments/:id — update (404 if not found); omitted fields stay as-is.
appointmentsRouter.put('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM appointments WHERE id = ?')
    .get(req.params.id) as Appointment | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  const { patientId, doctorName, department, date, time, status } =
    req.body as Partial<Appointment>;
  db.prepare(
    'UPDATE appointments SET patientId = ?, doctorName = ?, department = ?, date = ?, time = ?, status = ? WHERE id = ?',
  ).run(
    patientId ?? existing.patientId,
    doctorName ?? existing.doctorName,
    department ?? existing.department,
    date ?? existing.date,
    time ?? existing.time,
    status ?? existing.status,
    req.params.id,
  );
  const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /appointments/:id — 404 if missing, 204 on success.
appointmentsRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.status(204).send();
});
