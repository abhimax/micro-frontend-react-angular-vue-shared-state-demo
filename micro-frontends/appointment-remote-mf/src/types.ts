// Mirrors the contract exposed by appointment-service.
export interface Appointment {
  id: number;
  patientId: number;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: string;
}
