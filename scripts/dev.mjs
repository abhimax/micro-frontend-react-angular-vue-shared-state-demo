// Interactive launcher for all the apps.
//
//   node scripts/dev.mjs            -> checkbox menu (all apps pre-selected)
//   node scripts/dev.mjs all        -> run everything, no prompt
//   node scripts/dev.mjs host gateway  -> run only the named apps, no prompt
//
// Whatever you launch, Ctrl+C frees those ports (no orphaned dev servers).

import { spawn, execSync } from 'node:child_process';
import { APPS } from './apps.mjs';

// Decide which apps to run: from args, or via an interactive checkbox.
async function selectApps() {
  const args = process.argv.slice(2).filter(Boolean);

  if (args.includes('all')) return APPS;

  if (args.length) {
    const wanted = new Set(args);
    const chosen = APPS.filter((a) => wanted.has(a.key));
    if (chosen.length === 0) {
      console.error(`No matching apps for: ${args.join(' ')}`);
      console.error(`Valid keys: ${APPS.map((a) => a.key).join(', ')}`);
      process.exit(1);
    }
    return chosen;
  }

  // No args + no TTY (e.g. piped/CI): default to running everything.
  if (!process.stdin.isTTY) return APPS;

  const { default: checkbox } = await import('@inquirer/checkbox');
  const selectedKeys = await checkbox({
    message: 'Select apps to run (↑/↓ move, space toggles, enter confirms):',
    choices: APPS.map((a) => ({
      name: `${a.key.padEnd(12)} :${a.port}`,
      value: a.key,
      checked: true, // all selected by default
    })),
    loop: false,
  });
  const set = new Set(selectedKeys);
  return APPS.filter((a) => set.has(a.key));
}

const apps = await selectApps();
if (apps.length === 0) {
  console.log('Nothing selected. Exiting.');
  process.exit(0);
}

// Free the ports of the apps we launched.
function cleanup() {
  for (const a of apps) {
    try {
      const pids = execSync(`lsof -ti :${a.port} -sTCP:LISTEN`, {
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
      if (pids) execSync(`kill ${pids.split('\n').join(' ')}`, { stdio: 'ignore' });
    } catch {
      // nothing listening on that port — fine.
    }
  }
}

const names = apps.map((a) => a.key).join(',');
const colors = apps.map((a) => a.color).join(',');
const commands = apps.map((a) => `npm --prefix ${a.dir} run dev`);

console.log(`Starting: ${apps.map((a) => a.key).join(', ')}`);
const child = spawn('npx', ['concurrently', '-n', names, '-c', colors, ...commands], {
  stdio: 'inherit',
});

let cleaned = false;
function stopAll() {
  if (cleaned) return;
  cleaned = true;
  console.log('\nStopping apps...');
  cleanup();
  process.exit(0);
}

process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
child.on('exit', stopAll);
