import { Suspense, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Props {
  // The lazy-loaded remote component to render on this route.
  Component: ComponentType;
}

// Wraps a single remote micro-frontend: a "back to dashboard" link plus a
// Suspense boundary while the remote's code is fetched over the network.
const RemotePage = ({ Component }: Props) => {
  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm opacity-70 transition hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <Suspense fallback={<p className="opacity-70">Loading micro-frontend…</p>}>
        <Component />
      </Suspense>
    </div>
  );
};

export default RemotePage;
