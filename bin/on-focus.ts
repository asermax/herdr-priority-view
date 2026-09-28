import { syncStale } from "../src/sync-stale";

// Focusing a tab marks its agents seen, turning `done` into `idle`. herdr does not
// run plugin hooks for that status change, so the focus events stand in for it.
try {
  await syncStale();
} catch (err) {
  process.stderr.write(`priority-view: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
