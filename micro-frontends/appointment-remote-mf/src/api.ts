import type { Appointment } from './types';

// Base URL of the API gateway (single origin for all services). The gateway
// routes /appointments to appointment-service. Hard-coded for the demo; would
// come from an environment variable in a real deployment.
const API_BASE = 'http://localhost:4000';

// Fetch the list of appointments from the backend service.
export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetch(`${API_BASE}/appointments`);
  if (!res.ok) {
    throw new Error(`Failed to load appointments (HTTP ${res.status})`);
  }
  return res.json();
}
