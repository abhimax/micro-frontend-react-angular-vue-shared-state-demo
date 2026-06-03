// The shape of an appointment record. `patientId` refers to a patient that
// lives in patient-service — there is no cross-database foreign key here;
// the two services are intentionally independent.
export interface Appointment {
  id: number;
  patientId: number;
  doctorName: string;
  department: string;
  date: string; // e.g. "2026-06-10"
  time: string; // e.g. "09:30"
  status: string; // "scheduled" | "completed" | "cancelled"
}
