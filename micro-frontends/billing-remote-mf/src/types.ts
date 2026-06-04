// Mirrors the contract exposed by billing-service.
export interface Invoice {
  id: number;
  patientId: number;
  serviceName: string;
  amount: number;
  status: string;
}
