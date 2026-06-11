import { useEffect, useState } from 'react';
import './App.css';
import type { Patient } from './types';
import { fetchPatients } from './api';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              <tr key={p.id} className="border-b border-white/10">
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
