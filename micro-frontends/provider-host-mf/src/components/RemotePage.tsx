import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
}

// Page shell for a single remote: a "back to dashboard" link plus whatever
// content the route provides (a React remote in <Suspense>, or the Angular
// remote via <MountRemote>).
const RemotePage = ({ children }: Props) => {
  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm opacity-70 transition hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      {children}
    </div>
  );
};

export default RemotePage;
