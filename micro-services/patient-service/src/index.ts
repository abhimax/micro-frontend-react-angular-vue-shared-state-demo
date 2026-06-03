import express from 'express';
import cors from 'cors';
import { patientsRouter } from './routes/patients.js';
import './db.js'; // creates the table + seeds data on startup

const app = express();
const PORT = process.env.PORT ?? 4001;

// Allow the micro-frontends (localhost:3000–3003) to call this API from the browser.
app.use(cors());
// Parse JSON request bodies into req.body.
app.use(express.json());

// Health check — a quick way to ask "is this service up?".
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'patient-service' });
});

// Mount all patient endpoints under /patients.
app.use('/patients', patientsRouter);

app.listen(PORT, () => {
  console.log(`patient-service running on http://localhost:${PORT}`);
});
