import { loadLabels } from "./config";
import { type AgentInfo, paneReportTokens } from "./herdr-client";
import { PRIORITY, type Priority } from "./priority";
import { rank } from "./rank";
import { sessionKey } from "./session-key";

// Normal-priority agents carry no visible token so their rows look unchanged.
const label = (priority: Priority): string | null => {
  const labels = loadLabels();

  if (priority === PRIORITY.high) return labels.high;
  if (priority === PRIORITY.low) return labels.low;

  return null;
};

// `session` is the reverse index the release hook needs: it fires after herdr has
// already cleared the pane's agent, but pane tokens outlive the agent.
export const reportAgent = (agent: AgentInfo, priority: Priority): Promise<void> =>
  paneReportTokens(agent.pane_id, {
    rank: rank(agent.agent_status, priority),
    priority: label(priority),
    session: sessionKey(agent),
  });

export const clearAgentTokens = (paneId: string): Promise<void> =>
  paneReportTokens(paneId, { rank: null, priority: null, session: null });
