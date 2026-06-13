import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginVue(),
    pluginModuleFederation({
      name: 'billing_vue_remote_mf',
      // The manifest the host loads to discover this remote's exposes.
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/mount.ts',
      },
      shared: {
        vue: { singleton: true, requiredVersion: false },
      },
    }),
  ],
  server: {
    port: 3003,
  },
});
