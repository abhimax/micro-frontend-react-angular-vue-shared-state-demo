import { createConfig } from "@ng-rsbuild/plugin-angular";

// Builds the Angular app with Rsbuild and exposes it as a Module Federation
// remote. The Angular plugin owns the build pipeline, so MF is configured via
// Rsbuild's native `moduleFederation` field (NOT the generic plugin), which
// integrates with the underlying rspack build.
//
// Exported as a function because createConfig() is async and this Rsbuild
// version expects a config object or a (possibly async) function.
export default () =>
  createConfig({
    options: {
      browser: "./src/main.ts",
      index: "./src/index.html",
      polyfills: ["zone.js"],
      tsConfig: "./tsconfig.json",
      styles: [],
      assets: [],
    },
    rsbuildConfigOverrides: {
      server: {
        port: 3002,
      },
      moduleFederation: {
        options: {
          name: "appointment_angular_remote_mf",
          filename: "remoteEntry.js",
          // Framework-agnostic entry point the host calls.
          exposes: {
            "./mount": "./src/mount.ts",
          },
          // Share nothing: this remote is fully self-contained and ships its
          // own Angular runtime, independent of the React host and remotes.
          shared: {},
        },
      },
      tools: {
        rspack: {
          output: {
            // Lets the remote load its own chunks from :3002 when embedded.
            uniqueName: "appointment_angular_remote_mf",
            publicPath: "auto",
          },
        },
      },
    },
  });
