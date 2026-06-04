import type { Invoice } from './types';

// Base URL of the API gateway (single origin for all services). The gateway
// routes /invoices to billing-service. Hard-coded for the demo; would come
// from an environment variable in a real deployment.
const API_BASE = 'http://localhost:4000';

// Fetch the list of invoices from the backend service.
export async function fetchInvoices(): Promise<Invoice[]> {
  const res = await fetch(`${API_BASE}/invoices`);
  if (!res.ok) {
    throw new Error(`Failed to load invoices (HTTP ${res.status})`);
  }
  return res.json();
}
