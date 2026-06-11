import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RemotePage from './components/RemotePage';
import MountRemote from './components/MountRemote';
import Overview from './components/Overview';
import { PatientApp, BillingApp, loadAngularAppointments } from './remotes';

// Client-side routing lives in the host. Each route renders either the
// dashboard, a single remote micro-frontend, or the combined Overview.
// Appointments is served by an ANGULAR remote (mounted via MountRemote);
// the others are React remotes.
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="patients"
            element={
              <RemotePage>
                <Suspense
                  fallback={
                    <p className="opacity-70">Loading patient module…</p>
                  }
                >
                  <PatientApp />
                </Suspense>
              </RemotePage>
            }
          />
          <Route
            path="appointments"
            element={
              <RemotePage>
                <MountRemote loader={loadAngularAppointments} />
              </RemotePage>
            }
          />
          <Route
            path="invoices"
            element={
              <RemotePage>
                <Suspense
                  fallback={
                    <p className="opacity-70">Loading billing module…</p>
                  }
                >
                  <BillingApp />
                </Suspense>
              </RemotePage>
            }
          />
          <Route path="overview" element={<Overview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
