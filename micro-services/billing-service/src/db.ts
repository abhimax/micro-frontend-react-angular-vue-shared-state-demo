import Database from 'better-sqlite3';
import type { Invoice } from './types.js';

// This service owns its own database file — separate from the others.
export const db = new Database('billing.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    serviceName TEXT,
    amount REAL,
    status TEXT
  )
`);

// Seed data the first time. patientId values match the patients in
// patient-service so the demo stays consistent across services.
const { count } = db.prepare('SELECT COUNT(*) AS count FROM invoices').get() as {
  count: number;
};

if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO invoices (patientId, serviceName, amount, status) VALUES (?, ?, ?, ?)',
  );

  const seed: Omit<Invoice, 'id'>[] = [
    { patientId: 1, serviceName: 'Cardiology Consultation', amount: 7500, status: 'paid' },
    { patientId: 2, serviceName: 'Blood Sugar Panel', amount: 3200, status: 'unpaid' },
    { patientId: 3, serviceName: 'Pulmonary Function Test', amount: 5400, status: 'pending' },
  ];

  const seedAll = db.transaction((rows: Omit<Invoice, 'id'>[]) => {
    for (const r of rows) insert.run(r.patientId, r.serviceName, r.amount, r.status);
  });
  seedAll(seed);
}
