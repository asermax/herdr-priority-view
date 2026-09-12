import { DEFAULT_PRIORITY, isPriorityName, PRIORITY } from "../src/priority";
import { reportAgent } from "../src/report-agent";
import { resolveFocusedAgent } from "../src/resolve-focused-agent";
import { removeEntry, setEntry } from "../src/state";

const name = process.argv[2] ?? "";

if (!isPriorityName(name)) {
  process.stderr.write(`priority-view: expected one of ${Object.keys(PRIORITY).join(", ")}, got '${name}'\n`);
  process.exit(2);
}

try {
  const agent = await resolveFocusedAgent();
  const priority = PRIORITY[name];

  if (priority === DEFAULT_PRIORITY) {
    removeEntry(agent);
  } else {
    setEntry(agent, priority);
  }

  await reportAgent(agent.pane_id, agent.agent_status, priority);
} catch (err) {
  process.stderr.write(`priority-view: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
