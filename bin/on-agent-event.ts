import { parsePaneEvent } from "../src/event";
import { agentGet } from "../src/herdr-client";
import { reportAgent } from "../src/report-agent";
import { getPriority } from "../src/state";

const event = parsePaneEvent();

if (event == null) process.exit(0);

try {
  // agent_detected carries no status, so fall back to asking herdr for it.
  const status = event.agent_status ?? (await agentGet(event.pane_id).then((a) => a.agent_status, () => null));

  await reportAgent(event.pane_id, status, getPriority(event.pane_id));
} catch (err) {
  process.stderr.write(`priority-view: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
