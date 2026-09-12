import type { AgentInfo } from "./herdr-client";
import { reportAgent } from "./report-agent";
import { resolvePriority } from "./resolve-priority";
import { getEntry, setEntry } from "./state";

export const syncAgent = (agent: AgentInfo): Promise<void> => {
  const priority = resolvePriority(agent);

  if (getEntry(agent) != null) setEntry(agent, priority);

  return reportAgent(agent.pane_id, agent.agent_status, priority);
};
