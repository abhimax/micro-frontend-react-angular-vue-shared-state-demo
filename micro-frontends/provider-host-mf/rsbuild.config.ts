import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'provider_host_mf',
      remotes: {
        // Loads each remote's manifest at runtime. The host stays decoupled —
        // a remote can be rebuilt/redeployed without rebuilding the host.
        patient_remote_mf:
          'patient_remote_mf@http://localhost:3001/mf-manifest.json',
        billing_vue_remote_mf:
          'billing_vue_remote_mf@http://localhost:3003/mf-manifest.json',
        // The Angular remote emits a classic remoteEntry.js (no mf-manifest.json),
        // so it is referenced by that file instead of the manifest.
        appointment_angular_remote_mf:
          'appointment_angular_remote_mf@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
