// Mirrors the contract exposed by patient-service. Keeping a local copy keeps
// the remote self-contained; in a larger setup this might be a shared package.
export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  condition: string;
}
