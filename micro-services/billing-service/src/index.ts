import express from 'express';
import cors from 'cors';
import { invoicesRouter } from './routes/invoices.js';
import './db.js'; // creates the table + seeds data on startup

const app = express();
const PORT = process.env.PORT ?? 4003;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'billing-service' });
});

app.use('/invoices', invoicesRouter);

app.listen(PORT, () => {
  console.log(`billing-service running on http://localhost:${PORT}`);
});
