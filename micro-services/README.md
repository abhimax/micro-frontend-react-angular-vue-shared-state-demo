# Micro-services

Three independent backend services (each with its **own** SQLite database) plus
an **API gateway** that gives the frontend a single origin.
Built with Express + better-sqlite3 + TypeScript (ESM).

| Service              | Port | Database        | Resource        |
| -------------------- | ---- | --------------- | --------------- |
| **api-gateway**      | 4000 | —               | routes + aggregates |
| patient-service      | 4001 | `patient.db`    | `/patients`     |
| appointment-service  | 4002 | `appointment.db`| `/appointments` |
| billing-service      | 4003 | `billing.db`    | `/invoices`     |

Each service also exposes `GET /health`.

## API gateway (port 4000)

The frontends talk **only** to the gateway — they never call ports 4001–4003
directly. The gateway:

- **Proxies** `/patients`, `/appointments`, `/invoices` to the matching service
  (using `http-proxy-middleware`, paths preserved).
- **Aggregates** with `GET /patients/:id/summary`, which calls all three
  services and merges one patient + their appointments + their invoices into a
  single response. This is the answer to "who joins data across separate
  databases?" — the gateway does, at request time.

```bash
cd api-gateway && npm install && npm run dev
```

Start the three services first, then the gateway.

## Running a service

Open one terminal per service (they run independently):

```bash
cd patient-service     # or appointment-service / billing-service
npm install            # first time only
npm run dev            # tsx watch — restarts on file change
```

- `npm run dev` — development with auto-reload
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled build

On first start each service creates its table and seeds 3 rows if empty.
The `*.db` files and `node_modules/` are git-ignored.

## REST conventions

All three resources follow the same CRUD shape, e.g. for patients:

| Method + path        | Success | Notes                          |
| -------------------- | ------- | ------------------------------ |
| `GET /patients`      | 200     | list all                       |
| `GET /patients/:id`  | 200     | 404 if not found               |
| `POST /patients`     | 201     | 400 if required fields missing |
| `PUT /patients/:id`  | 200     | 404 if not found               |
| `DELETE /patients/:id` | 204   | 404 if not found               |

## Cross-service data

`appointment.patientId` and `invoice.patientId` reference patients owned by
patient-service. There is **no foreign key across databases** — each service
owns its data. The seed IDs (1, 2, 3) line up so the demo stays consistent.
Joining that data is the **gateway's** job — see `GET /patients/:id/summary`.
