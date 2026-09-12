import { type AgentInfo, paneReportTokens } from "./herdr-client";
import { DEFAULT_PRIORITY, type Priority } from "./priority";
import { rank } from "./rank";
import { sessionKey } from "./session-key";

// `session` is the reverse index the release hook needs: it fires after herdr has
// already cleared the pane's agent, but pane tokens outlive the agent.
export const reportAgent = (agent: AgentInfo, priority: Priority): Promise<void> =>
  paneReportTokens(agent.pane_id, {
    rank: rank(agent.agent_status, priority),
    priority: priority === DEFAULT_PRIORITY ? null : `P${priority}`,
    session: sessionKey(agent),
  });

export const clearAgentTokens = (paneId: string): Promise<void> =>
  paneReportTokens(paneId, { rank: null, priority: null, session: null });
