import { agentGet } from "../src/herdr-client";
import { isPriorityName, PRIORITY } from "../src/priority";
import { reportAgent } from "../src/report-agent";
import { resolveFocusedPane } from "../src/resolve-focused-pane";
import { setPriority } from "../src/state";

const name = process.argv[2] ?? "";

if (!isPriorityName(name)) {
  process.stderr.write(`priority-view: expected one of ${Object.keys(PRIORITY).join(", ")}, got '${name}'\n`);
  process.exit(2);
}

try {
  const paneId = resolveFocusedPane();
  const priority = PRIORITY[name];

  setPriority(paneId, priority);

  // The focused pane may not host an agent yet; the priority still applies once it does.
  const status = await agentGet(paneId).then((agent) => agent.agent_status, () => null);
  await reportAgent(paneId, status, priority);
} catch (err) {
  process.stderr.write(`priority-view: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
