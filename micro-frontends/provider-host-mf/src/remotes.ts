import { lazy } from 'react';

// Each remote is lazy-loaded from its own build over Module Federation.
// Defined once here so both the routed pages and the Overview can reuse them.
export const PatientApp = lazy(() => import('patient_remote_mf/App'));
export const AppointmentApp = lazy(() => import('appointment_remote_mf/App'));
export const BillingApp = lazy(() => import('billing_remote_mf/App'));
