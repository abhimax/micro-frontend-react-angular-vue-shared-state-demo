import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RemotePage from './components/RemotePage';
import Overview from './components/Overview';
import { PatientApp, AppointmentApp, BillingApp } from './remotes';

// Client-side routing lives in the host. Each route renders either the
// dashboard, a single remote micro-frontend, or the combined Overview.
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<RemotePage Component={PatientApp} />} />
          <Route
            path="appointments"
            element={<RemotePage Component={AppointmentApp} />}
          />
          <Route path="invoices" element={<RemotePage Component={BillingApp} />} />
          <Route path="overview" element={<Overview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
