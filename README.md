# Medical Domain Architecture Demo

A teaching demo of **micro-frontend + API gateway + micro-service** architecture.
A Module Federation host composes three independently-built React remotes; each
remote talks (through a single API gateway) to its own Express micro-service,
and each service owns its own SQLite database.

```
Browser → Host :3000
            ├── Patient remote :3001 ──┐
            ├── Appointment remote :3002 ┤ fetch (single origin)
            └── Billing remote :3003 ──┘
                       │
                       ▼
              API Gateway :4000   ── GET /patients/:id/summary aggregates all three
            ┌──────────┼───────────┐
            ▼          ▼            ▼
   patient :4001  appointment :4002  billing :4003
        │              │                 │
   patient.db     appointment.db    billing.db
```

| App                 | Port | Type        |
| ------------------- | ---- | ----------- |
| provider-host-mf    | 3000 | MF host (React) |
| patient-remote-mf   | 3001 | MF remote (React) |
| appointment-remote-mf | 3002 | MF remote (React, legacy — superseded by Angular) |
| billing-remote-mf   | 3003 | MF remote (React) |
| appointment-angular-remote-mf | 3004 | MF remote (**Angular**) |
| api-gateway         | 4000 | gateway     |
| patient-service     | 4001 | service     |
| appointment-service | 4002 | service     |
| billing-service     | 4003 | service     |

> **Technology-agnostic note:** the appointments tile is served by an **Angular**
> remote (`appointment-angular-remote-mf`), consumed by the **React** host over
> Module Federation. It exposes a framework-neutral `mount()/unmount()` instead
> of a React component, and the host embeds it via a small adapter
> ([MountRemote.tsx](micro-frontends/provider-host-mf/src/components/MountRemote.tsx)).
> The original React appointment remote (3002) is kept temporarily for comparison.

## Run everything

From this root folder:

```bash
npm install          # installs the launcher deps (one-time, root only)
npm run install:all  # installs deps in all 8 apps (one-time)
npm run dev          # pick which apps to run, then start them
```

`npm run dev` shows a **checkbox menu with every app pre-selected** — press
Enter to run all, or use ↑/↓ + space to deselect the ones you don't need. The
selected apps run in one terminal, each line prefixed with the app name
(e.g. `gateway`, `patient-mf`).

Press **Ctrl+C once** to stop them — a cleanup step frees the ports of whatever
you launched, so no dev server is left orphaned.

### Stop specific apps

To stop only *some* apps while the rest keep running, open a **second terminal**
and run:

```bash
npm run stop          # checkbox of RUNNING apps (all pre-selected) — pick what to kill
npm run stop:all      # stop everything, no prompt
node scripts/stop.mjs host appt-svc   # stop specific apps by key
```

`npm run stop` lists only the apps currently running and lets you choose which
to kill; the others keep going in the first terminal.

Then open **http://localhost:3000**.

### Skip the menu

```bash
npm run dev:all         # run everything, no prompt
npm run dev:services    # gateway + the 3 backend services
npm run dev:frontends   # host + the 3 frontend remotes

# or name specific apps:
node scripts/dev.mjs host gateway patient-mf
```

Valid app keys: `gateway`, `patient-svc`, `appt-svc`, `bill-svc`, `host`,
`patient-mf`, `appt-mf`, `bill-mf`, `appt-ng` (the Angular appointment remote).

## Layout

- [`micro-frontends/`](micro-frontends/) — the host and three remotes (React + Rsbuild + Module Federation)
- [`micro-services/`](micro-services/) — the API gateway and three services (Express + better-sqlite3 + TypeScript); see its [README](micro-services/README.md)
