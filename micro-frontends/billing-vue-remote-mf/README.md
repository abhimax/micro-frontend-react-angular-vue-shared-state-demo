# billing-vue-remote-mf

A Vue 3 Module Federation remote for the medical domain architecture demo. Displays invoices from the billing service.

## Running

```bash
npm install
npm run dev
```

Server runs on **http://localhost:3005**.

## Building

```bash
npm run build
```

Output goes to `dist/`.

## Architecture

- **Builds with:** Rsbuild + @rsbuild/plugin-vue
- **Shared deps:** Vue (singleton)
- **Exposes:** `./App` (Vue component)
- **Consumes from:** API Gateway at http://localhost:4000/invoices
- **Embedded by:** provider-host-mf over Module Federation

The host will load the remoteEntry.js at runtime to discover and lazy-load this app.
