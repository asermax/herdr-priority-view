import { agentList } from "../src/herdr-client";
import { DEFAULT_PRIORITY, isPriorityName, PRIORITY } from "../src/priority";
import { reportAgent } from "../src/report-agent";
import { resolveFocusedAgent } from "../src/resolve-focused-agent";
import { sessionKey } from "../src/session-key";
import { pruneTo, removePriority, setPriority } from "../src/state";

const name = process.argv[2] ?? "";

if (!isPriorityName(name)) {
  process.stderr.write(`priority-view: expected one of ${Object.keys(PRIORITY).join(", ")}, got '${name}'\n`);
  process.exit(2);
}

try {
  const agent = await resolveFocusedAgent();
  const priority = PRIORITY[name];
  const key = sessionKey(agent);

  await reportAgent(agent, priority);

  if (key != null) {
    if (priority === DEFAULT_PRIORITY) removePriority(key);
    else setPriority(key, priority);

    pruneTo((await agentList()).flatMap((live) => sessionKey(live) ?? []));
  }
} catch (err) {
  process.stderr.write(`priority-view: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
