// Mirrors the contract exposed by appointment-service (same shape the React
// remote used — only the framework rendering it has changed).
export interface Appointment {
  id: number;
  patientId: number;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: string;
}
