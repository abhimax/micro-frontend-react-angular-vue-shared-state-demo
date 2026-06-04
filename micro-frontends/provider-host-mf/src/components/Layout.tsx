import { Link, Outlet } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

// App shell: a top bar (clicking the logo returns to the dashboard) and the
// active route rendered into <Outlet />.
const Layout = () => {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Stethoscope className="h-6 w-6 text-cyan-400" />
            <span>Medical Domain Console</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
