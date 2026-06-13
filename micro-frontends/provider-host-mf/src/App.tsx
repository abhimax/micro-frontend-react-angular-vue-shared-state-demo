import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RemotePage from './components/RemotePage';
import MountRemote from './components/MountRemote';
import Overview from './components/Overview';
import { PatientApp, loadAngularAppointments, loadVueBilling } from './remotes';

// Client-side routing lives in the host. Each route renders either the
// dashboard, a single remote micro-frontend, or the combined Overview.
// Appointments and invoices are non-React remotes (mounted via MountRemote);
// patients is a React remote.
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
                <MountRemote loader={loadVueBilling} />
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
