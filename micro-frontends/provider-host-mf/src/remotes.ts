import { lazy } from 'react';

// Each React remote is lazy-loaded from its own build over Module Federation.
// Defined once here so both the routed pages and the Overview can reuse them.
export const PatientApp = lazy(() => import('patient_remote_mf/App'));

// The Angular and Vue remotes are NOT React components — they expose a
// framework-agnostic mount/unmount module. Stable loaders keep the host's
// MountRemote effect from re-running on every render.
export const loadAngularAppointments = () =>
  import('appointment_angular_remote_mf/mount');

export const loadVueBilling = () => import('billing_vue_remote_mf/mount');
