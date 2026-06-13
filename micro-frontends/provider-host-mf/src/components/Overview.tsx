import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MountRemote from './MountRemote';
import { PatientApp, loadAngularAppointments, loadVueBilling } from '../remotes';

// Composes all three remotes on a single page — the classic micro-frontend
// "shell aggregates many remotes" view. Each remote loads independently, so
// each gets its own Suspense boundary.
const Overview = () => {
  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm opacity-70 transition hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <h1 className="mb-6 text-3xl font-bold">Overview</h1>

      <div className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-white/5">
          <Suspense fallback={<p className="p-6 opacity-70">Loading patients…</p>}>
            <PatientApp />
          </Suspense>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5">
          {/* Angular remote — mounted via the framework-agnostic adapter. */}
          <MountRemote loader={loadAngularAppointments} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5">
          <MountRemote loader={loadVueBilling} />
        </section>
      </div>
    </div>
  );
};

export default Overview;
