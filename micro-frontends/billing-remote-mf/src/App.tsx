import { useEffect, useState } from 'react';
import './App.css';
import type { Invoice } from './types';
import { fetchInvoices } from './api';

const App = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load invoices from billing-service once, when the component mounts.
  useEffect(() => {
    fetchInvoices()
      .then(setInvoices)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 text-left">
      <h2 className="mb-4 text-2xl font-bold">Invoices</h2>

      {loading && <p className="opacity-70">Loading invoices…</p>}
      {error && <p className="text-red-400">⚠ {error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Patient</th>
              <th className="py-2 pr-4">Service</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-white/10">
                <td className="py-2 pr-4">{inv.id}</td>
                <td className="py-2 pr-4">{inv.patientId}</td>
                <td className="py-2 pr-4">{inv.serviceName}</td>
                <td className="py-2 pr-4">{inv.amount}</td>
                <td className="py-2 pr-4">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
