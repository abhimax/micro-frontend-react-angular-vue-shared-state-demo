import Database from 'better-sqlite3';
import type { Patient } from './types.js';

// One synchronous SQLite connection. The .db file lives inside this service,
// so patient-service fully owns its data — no database is shared between
// microservices. (That's the whole point of the boundary.)
export const db = new Database('patient.db');

// Create the table once on startup if it doesn't already exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    phone TEXT,
    condition TEXT
  )
`);

// Seed a few rows the first time so the API has data to show in the demo.
const { count } = db.prepare('SELECT COUNT(*) AS count FROM patients').get() as {
  count: number;
};

if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO patients (name, age, gender, phone, condition) VALUES (?, ?, ?, ?, ?)',
  );

  const seed: Omit<Patient, 'id'>[] = [
    { name: 'Alice Perera', age: 34, gender: 'female', phone: '0771234567', condition: 'Hypertension' },
    { name: 'Bimal Silva', age: 52, gender: 'male', phone: '0719876543', condition: 'Diabetes' },
    { name: 'Chathuri Fernando', age: 28, gender: 'female', phone: '0765551212', condition: 'Asthma' },
  ];

  // A transaction inserts all seed rows atomically.
  const seedAll = db.transaction((rows: Omit<Patient, 'id'>[]) => {
    for (const r of rows) insert.run(r.name, r.age, r.gender, r.phone, r.condition);
  });
  seedAll(seed);
}
