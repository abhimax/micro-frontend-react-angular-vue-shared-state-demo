import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Appointment, Invoice } from './types.js';

const app = express();
const PORT = process.env.PORT ?? 4000;

// Where the three backend services live. The frontend never needs to know
// these — it only talks to the gateway on one origin (localhost:4000).
const PATIENT_URL = 'http://localhost:4001';
const APPOINTMENT_URL = 'http://localhost:4002';
const BILLING_URL = 'http://localhost:4003';

// One place to configure CORS for the whole system.
app.use(cors());

// Health check for the gateway itself.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// --- Aggregation endpoint -------------------------------------------------
// GET /patients/:id/summary — the gateway calls all three services and merges
// the result into one response. This is the answer to "who joins data that
// lives in separate databases?": a gateway / BFF does, at request time.
//
// Defined BEFORE the /patients proxy so it handles this path itself instead
// of forwarding it to patient-service.
app.get('/patients/:id/summary', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const patientRes = await fetch(`${PATIENT_URL}/patients/${id}`);
    if (patientRes.status === 404) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    const patient = await patientRes.json();

    // Fetch appointments + invoices in parallel, then keep only this patient's.
    const [appointments, invoices] = await Promise.all([
      fetch(`${APPOINTMENT_URL}/appointments`).then((r) => r.json() as Promise<Appointment[]>),
      fetch(`${BILLING_URL}/invoices`).then((r) => r.json() as Promise<Invoice[]>),
    ]);

    res.json({
      patient,
      appointments: appointments.filter((a) => a.patientId === id),
      invoices: invoices.filter((inv) => inv.patientId === id),
    });
  } catch {
    // Any service being down surfaces as a 502 from the gateway.
    res.status(502).json({ error: 'Failed to aggregate data from services' });
  }
});

// --- Proxies --------------------------------------------------------------
// Forward each resource to its service, preserving the full path
// (e.g. GET /patients/2 -> patient-service GET /patients/2).
app.use(
  createProxyMiddleware({
    pathFilter: (path) => path === '/patients' || path.startsWith('/patients/'),
    target: PATIENT_URL,
    changeOrigin: true,
  }),
);
app.use(
  createProxyMiddleware({
    pathFilter: (path) => path === '/appointments' || path.startsWith('/appointments/'),
    target: APPOINTMENT_URL,
    changeOrigin: true,
  }),
);
app.use(
  createProxyMiddleware({
    pathFilter: (path) => path === '/invoices' || path.startsWith('/invoices/'),
    target: BILLING_URL,
    changeOrigin: true,
  }),
);

app.listen(PORT, () => {
  console.log(`api-gateway running on http://localhost:${PORT}`);
  console.log('  proxies: /patients -> :4001, /appointments -> :4002, /invoices -> :4003');
  console.log('  aggregates: GET /patients/:id/summary');
});
