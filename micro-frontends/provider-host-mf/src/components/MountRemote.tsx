import { useEffect, useRef } from 'react';

// The framework-agnostic contract a non-React remote exposes.
export interface MountModule {
  mount: (el: HTMLElement) => void | Promise<void>;
  unmount: () => void;
}

interface Props {
  // A stable function that lazy-imports the remote's mount module.
  loader: () => Promise<MountModule>;
}

// Adapter that lets the React host embed a remote built with ANY framework.
// Instead of rendering a React component, it gives the remote a plain <div>
// and calls the remote's own mount()/unmount() lifecycle. This is what makes
// the architecture technology-agnostic (e.g. an Angular remote).
const MountRemote = ({ loader }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mod: MountModule | null = null;
    let cancelled = false;

    loader().then((m) => {
      if (cancelled || !ref.current) return;
      mod = m;
      m.mount(ref.current);
    });

    // On unmount, let the remote tear down its own app (e.g. destroy the
    // Angular ApplicationRef) so we don't leak it across route changes.
    return () => {
      cancelled = true;
      mod?.unmount();
    };
  }, [loader]);

  return <div ref={ref} />;
};

export default MountRemote;
