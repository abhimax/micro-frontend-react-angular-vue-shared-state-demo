import { useEffect, useState } from 'react';
import './App.css';
import type { Patient } from './types';
import { fetchPatients } from './api';
import { eventBus, EventNames } from '../../shared-event-bus';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    eventBus.emit(EventNames.PATIENT_SELECTED, { patientId: patient.id, patient });
  };

  const handleClearSelection = () => {
    setSelectedPatientId(null);
    eventBus.emit(EventNames.PATIENT_DESELECTED, {});
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Load patients from patient-service once, when the component mounts.
  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 text-left">
      <div className="flex items-center gap-2 align-middle mb-4">
        <h2 className="text-2xl font-bold">Patients</h2>
        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
          React
        </span>
      </div>

      {selectedPatient && (
        <div className="mb-4 bg-blue-600/20 px-4 py-2 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Selected Patient:</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors" onClick={handleClearSelection}>
              {selectedPatient.name} (ID: {selectedPatient.id}) ×
            </span>
          </div>
          <button
            onClick={handleClearSelection}
            className="text-sm text-blue-300 hover:text-white transition-colors underline"
          >
            Clear Selection
          </button>
        </div>
      )}

      {loading && <p className="opacity-70">Loading patients…</p>}
      {error && <p className="text-red-400">⚠ {error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Age</th>
              <th className="py-2 pr-4">Gender</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Condition</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                onClick={() => handlePatientClick(p)}
                className={`border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                  selectedPatientId === p.id ? 'bg-blue-600/20' : ''
                }`}
              >
                <td className="py-2 pr-4">{p.id}</td>
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4">{p.age}</td>
                <td className="py-2 pr-4">{p.gender}</td>
                <td className="py-2 pr-4">{p.phone}</td>
                <td className="py-2 pr-4">{p.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
