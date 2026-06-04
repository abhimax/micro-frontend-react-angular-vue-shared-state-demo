import type { Patient } from './types';

// Base URL of the API gateway (single origin for all services). The gateway
// routes /patients to patient-service. Hard-coded for the demo; in a real
// deployment this would come from an environment variable.
const API_BASE = 'http://localhost:4000';

// Fetch the list of patients from the backend service.
export async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch(`${API_BASE}/patients`);
  if (!res.ok) {
    throw new Error(`Failed to load patients (HTTP ${res.status})`);
  }
  return res.json();
}
