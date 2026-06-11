/// <reference types="@rsbuild/core/types" />

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

/**
 * Type declaration for the federated remote `patient_remote_mf`.
 * The plugin also emits richer `@mf-types`, but this keeps `import()` typed
 * without extra tsconfig wiring.
 */
declare module 'patient_remote_mf/App' {
  import type React from 'react';
  const App: React.ComponentType;
  export default App;
}

declare module 'billing_remote_mf/App' {
  import type React from 'react';
  const App: React.ComponentType;
  export default App;
}

// The Angular remote is framework-agnostic: it exposes mount/unmount, not a
// React component.
declare module 'appointment_angular_remote_mf/mount' {
  export function mount(el: HTMLElement): void | Promise<void>;
  export function unmount(): void;
}
