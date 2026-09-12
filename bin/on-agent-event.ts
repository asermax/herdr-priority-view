import { parsePaneEvent } from "../src/event";
import { agentGet } from "../src/herdr-client";
import { syncAgent } from "../src/sync-agent";

const event = parsePaneEvent();

if (event == null) process.exit(0);

try {
  // The agent may already be gone by the time the hook runs.
  const agent = await agentGet(event.pane_id).catch(() => null);

  if (agent != null) await syncAgent(agent);
} catch (err) {
  process.stderr.write(`priority-view: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
