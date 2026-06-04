// Stop apps — selectively or all at once.
//
//   node scripts/stop.mjs           -> checkbox of RUNNING apps (all pre-selected)
//   node scripts/stop.mjs all       -> stop everything that's running, no prompt
//   node scripts/stop.mjs host appt-svc  -> stop only the named apps
//
// Run this in a second terminal while `npm run dev` keeps going in the first.

import { execSync } from 'node:child_process';
import { APPS } from './apps.mjs';

// PIDs currently listening on a port (empty string if none).
function listeners(port) {
  try {
    return execSync(`lsof -ti :${port} -sTCP:LISTEN`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function killPort(port) {
  const pids = listeners(port);
  if (!pids) return false;
  try {
    execSync(`kill ${pids.split('\n').join(' ')}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Which running apps should we stop?
async function chooseApps(running) {
  const args = process.argv.slice(2).filter(Boolean);

  if (args.includes('all')) return running;

  if (args.length) {
    const wanted = new Set(args);
    return running.filter((a) => wanted.has(a.key));
  }

  // No args + no TTY: stop everything that's running.
  if (!process.stdin.isTTY) return running;

  const { default: checkbox } = await import('@inquirer/checkbox');
  const keys = await checkbox({
    message: 'Select apps to STOP (↑/↓ move, space toggles, enter confirms):',
    choices: running.map((a) => ({
      name: `${a.key.padEnd(12)} :${a.port}`,
      value: a.key,
      checked: true, // all running apps pre-selected
    })),
    loop: false,
  });
  const set = new Set(keys);
  return running.filter((a) => set.has(a.key));
}

const running = APPS.filter((a) => listeners(a.port) !== '');
if (running.length === 0) {
  console.log('No apps are currently running.');
  process.exit(0);
}

const toStop = await chooseApps(running);
if (toStop.length === 0) {
  console.log('Nothing selected. No apps stopped.');
  process.exit(0);
}

console.log('Stopping apps...');
for (const a of toStop) {
  const ok = killPort(a.port);
  console.log(`  ${ok ? 'stopped' : 'not running'}: ${a.key} (:${a.port})`);
}
