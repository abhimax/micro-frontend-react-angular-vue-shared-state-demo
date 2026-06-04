import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  Receipt,
  LayoutDashboard,
  CircleX,
  type LucideIcon,
} from 'lucide-react';
import { fetchCount } from '../api';

// A count is a number when loaded, 'error' when its service is unreachable,
// or undefined while still loading.
type CountState = number | 'error';
type ResourceKey = 'patients' | 'appointments' | 'invoices';
type Counts = Partial<Record<ResourceKey, CountState>>;

interface Tile {
  to: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  accent: string; // icon badge background + colour
  tint: string; // big-number colour
  // Derive this tile's value from the loaded counts.
  getValue: (c: Counts) => CountState | undefined;
}

const tiles: Tile[] = [
  {
    to: '/patients',
    title: 'Patients',
    description: 'Browse patient records from patient-service',
    Icon: Users,
    accent: 'bg-blue-500/15 text-blue-400',
    tint: 'text-blue-300',
    getValue: (c) => c.patients,
  },
  {
    to: '/appointments',
    title: 'Appointments',
    description: 'View scheduled appointments from appointment-service',
    Icon: CalendarDays,
    accent: 'bg-green-500/15 text-green-400',
    tint: 'text-green-300',
    getValue: (c) => c.appointments,
  },
  {
    to: '/invoices',
    title: 'Invoices',
    description: 'Review billing invoices from billing-service',
    Icon: Receipt,
    accent: 'bg-orange-500/15 text-orange-400',
    tint: 'text-orange-300',
    getValue: (c) => c.invoices,
  },
  {
    to: '/overview',
    title: 'Overview',
    description: 'All three micro-frontends, plus the total record count',
    Icon: LayoutDashboard,
    accent: 'bg-purple-500/15 text-purple-400',
    tint: 'text-purple-300',
    // Total of the reachable services. Stays loading until all have resolved;
    // if every service is down, it reports 'error' too.
    getValue: (c) => {
      const values = [c.patients, c.appointments, c.invoices];
      if (values.some((v) => v === undefined)) return undefined;
      const numbers = values.filter((v): v is number => typeof v === 'number');
      return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) : 'error';
    },
  },
];

const Dashboard = () => {
  const [counts, setCounts] = useState<Counts>({});

  // Load each count INDEPENDENTLY so one down service only affects its own
  // tile — the others still show their numbers.
  useEffect(() => {
    const resources: ResourceKey[] = ['patients', 'appointments', 'invoices'];
    for (const resource of resources) {
      fetchCount(resource)
        .then((n) => setCounts((c) => ({ ...c, [resource]: n })))
        .catch(() => setCounts((c) => ({ ...c, [resource]: 'error' })));
    }
  }, []);

  // What to show in the top-right slot for a given tile.
  const renderValue = (tile: Tile): ReactNode => {
    const value = tile.getValue(counts);

    if (value === undefined) {
      // Still loading — show a skeleton.
      return <span className="inline-block h-9 w-10 animate-pulse rounded bg-white/10" />;
    }

    if (value === 'error') {
      // Service unreachable — show an X icon and a short message in place of the count.
      return (
        <span className="flex items-center gap-1.5 text-right text-red-400">
          <CircleX className="h-6 w-6 shrink-0" />
          <span className="text-xs font-medium leading-tight">
            Service not working
          </span>
        </span>
      );
    }

    return <span className={`text-4xl font-bold tabular-nums ${tile.tint}`}>{value}</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 mb-8 opacity-60">
        Each tile opens a separately-built micro-frontend. Counts are live from
        the API gateway.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const { to, title, description, Icon, accent } = tile;
          return (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                {renderValue(tile)}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-sm opacity-60">{description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
