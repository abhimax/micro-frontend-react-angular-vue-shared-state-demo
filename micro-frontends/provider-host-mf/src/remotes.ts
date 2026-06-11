import { lazy } from 'react';

// Each React remote is lazy-loaded from its own build over Module Federation.
// Defined once here so both the routed pages and the Overview can reuse them.
export const PatientApp = lazy(() => import('patient_remote_mf/App'));
export const BillingApp = lazy(() => import('billing_remote_mf/App'));

// The Angular appointment remote is NOT a React component — it exposes a
// framework-agnostic mount/unmount module. A stable loader keeps the host's
// MountRemote effect from re-running on every render.
export const loadAngularAppointments = () =>
  import('appointment_angular_remote_mf/mount');
