import { applyView } from "../src/apply";

try {
  await applyView();
} catch (err) {
  process.stderr.write(`new-priority-view: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
