import { agentViewSet } from "../src/herdr-client";
import { syncAll } from "../src/sync-all";
import { VIEW_PARAMS } from "../src/view";

try {
  await agentViewSet(VIEW_PARAMS);
  await syncAll();
} catch (err) {
  process.stderr.write(`priority-view: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
