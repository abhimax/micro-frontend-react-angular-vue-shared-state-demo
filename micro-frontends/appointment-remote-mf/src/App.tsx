import { useEffect, useState } from 'react';
import './App.css';
import type { Appointment } from './types';
import { fetchAppointments } from './api';

const App = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load appointments from appointment-service once, when the component mounts.
  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 text-left">
      <h2 className="mb-4 text-2xl font-bold">Appointments</h2>

      {loading && <p className="opacity-70">Loading appointments…</p>}
      {error && <p className="text-red-400">⚠ {error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Patient</th>
              <th className="py-2 pr-4">Doctor</th>
              <th className="py-2 pr-4">Department</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-b border-white/10">
                <td className="py-2 pr-4">{a.id}</td>
                <td className="py-2 pr-4">{a.patientId}</td>
                <td className="py-2 pr-4">{a.doctorName}</td>
                <td className="py-2 pr-4">{a.department}</td>
                <td className="py-2 pr-4">{a.date}</td>
                <td className="py-2 pr-4">{a.time}</td>
                <td className="py-2 pr-4">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
