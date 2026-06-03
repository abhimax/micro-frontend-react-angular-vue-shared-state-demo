// The shape of an invoice. Like appointments, `patientId` points at a patient
// owned by patient-service — no cross-database foreign key, by design.
export interface Invoice {
  id: number;
  patientId: number;
  serviceName: string;
  amount: number;
  status: string; // "paid" | "unpaid" | "pending"
}
