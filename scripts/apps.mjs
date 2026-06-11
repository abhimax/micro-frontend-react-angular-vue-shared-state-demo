// Single source of truth for every app in the project.
// `color` is a concurrently colour name; `port` is what the app listens on.
export const APPS = [
  {
    key: "gateway",
    dir: "micro-services/api-gateway",
    port: 4000,
    color: "gray",
  },
  {
    key: "patient-svc",
    dir: "micro-services/patient-service",
    port: 4001,
    color: "blue",
  },
  {
    key: "appt-svc",
    dir: "micro-services/appointment-service",
    port: 4002,
    color: "green",
  },
  {
    key: "bill-svc",
    dir: "micro-services/billing-service",
    port: 4003,
    color: "yellow",
  },
  {
    key: "host",
    dir: "micro-frontends/provider-host-mf",
    port: 3000,
    color: "magenta",
  },
  {
    key: "patient-mf",
    dir: "micro-frontends/patient-remote-mf",
    port: 3001,
    color: "cyan",
  },
  {
    key: "appt-mf",
    dir: "micro-frontends/appointment-angular-remote-mf",
    port: 3002,
    color: "white",
  },
  {
    key: "bill-mf",
    dir: "micro-frontends/billing-remote-mf",
    port: 3003,
    color: "red",
  },
];
