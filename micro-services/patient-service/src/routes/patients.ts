import { Router } from 'express';
import { db } from '../db.js';
import type { Patient } from '../types.js';

// All routes here are mounted under "/patients" in index.ts.
export const patientsRouter = Router();

// GET /patients — list every patient.
patientsRouter.get('/', (_req, res) => {
  const patients = db.prepare('SELECT * FROM patients').all();
  res.json(patients);
});

// GET /patients/:id — one patient, or 404 if it doesn't exist.
patientsRouter.get('/:id', (req, res) => {
  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  if (!patient) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }
  res.json(patient);
});

// POST /patients — create a patient. 400 if required input is missing,
// 201 (Created) with the new row on success.
patientsRouter.post('/', (req, res) => {
  const { name, age, gender, phone, condition } = req.body as Partial<Patient>;
  if (!name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const result = db
    .prepare('INSERT INTO patients (name, age, gender, phone, condition) VALUES (?, ?, ?, ?, ?)')
    .run(name, age ?? null, gender ?? null, phone ?? null, condition ?? null);
  const created = db.prepare('SELECT * FROM patients WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /patients/:id — update an existing patient (404 if not found).
// Any field left out of the body keeps its current value.
patientsRouter.put('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM patients WHERE id = ?')
    .get(req.params.id) as Patient | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }
  const { name, age, gender, phone, condition } = req.body as Partial<Patient>;
  db.prepare(
    'UPDATE patients SET name = ?, age = ?, gender = ?, phone = ?, condition = ? WHERE id = ?',
  ).run(
    name ?? existing.name,
    age ?? existing.age,
    gender ?? existing.gender,
    phone ?? existing.phone,
    condition ?? existing.condition,
    req.params.id,
  );
  const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /patients/:id — 404 if it wasn't there, 204 (No Content) on success.
patientsRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }
  res.status(204).send();
});
