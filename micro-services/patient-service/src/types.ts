// The shape of a patient record. This is the typed "contract" the service
// exposes — routes and the DB layer both speak in terms of this interface.
export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  condition: string;
}
