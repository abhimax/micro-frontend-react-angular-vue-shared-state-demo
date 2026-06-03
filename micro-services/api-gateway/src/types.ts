// Minimal shapes the gateway needs for the aggregation endpoint. Each service
// owns the full definition; the gateway only cares about patientId for joining.
export interface Appointment {
  id: number;
  patientId: number;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: string;
}

export interface Invoice {
  id: number;
  patientId: number;
  serviceName: string;
  amount: number;
  status: string;
}
