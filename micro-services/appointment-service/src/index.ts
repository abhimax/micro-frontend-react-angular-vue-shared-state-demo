import express from 'express';
import cors from 'cors';
import { appointmentsRouter } from './routes/appointments.js';
import './db.js'; // creates the table + seeds data on startup

const app = express();
const PORT = process.env.PORT ?? 4002;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'appointment-service' });
});

app.use('/appointments', appointmentsRouter);

app.listen(PORT, () => {
  console.log(`appointment-service running on http://localhost:${PORT}`);
});
