import Database from 'better-sqlite3';
import type { Appointment } from './types.js';

// This service owns its own database file — separate from patient-service.
export const db = new Database('appointment.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    doctorName TEXT,
    department TEXT,
    date TEXT,
    time TEXT,
    status TEXT
  )
`);

// Seed data the first time. patientId values (1, 2, 3) line up with the
// patients seeded in patient-service so the demo joins make sense.
const { count } = db.prepare('SELECT COUNT(*) AS count FROM appointments').get() as {
  count: number;
};

if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO appointments (patientId, doctorName, department, date, time, status) VALUES (?, ?, ?, ?, ?, ?)',
  );

  const seed: Omit<Appointment, 'id'>[] = [
    { patientId: 1, doctorName: 'Dr. Jayasuriya', department: 'Cardiology', date: '2026-06-10', time: '09:30', status: 'scheduled' },
    { patientId: 2, doctorName: 'Dr. Wickramasinghe', department: 'Endocrinology', date: '2026-06-11', time: '14:00', status: 'scheduled' },
    { patientId: 3, doctorName: 'Dr. Mendis', department: 'Pulmonology', date: '2026-06-12', time: '11:15', status: 'completed' },
  ];

  const seedAll = db.transaction((rows: Omit<Appointment, 'id'>[]) => {
    for (const r of rows)
      insert.run(r.patientId, r.doctorName, r.department, r.date, r.time, r.status);
  });
  seedAll(seed);
}
