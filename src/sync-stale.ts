import { agentList } from "./herdr-client";
import { rank } from "./rank";
import { resolvePriority } from "./resolve-priority";
import { syncAgent } from "./sync-agent";

/**
 * Focus events fire on every pane switch, so only agents whose rank no longer
 * matches their status get rewritten; the rest would be a redraw for nothing.
 */
export const syncStale = async (): Promise<void> => {
  const agents = await agentList();

  await Promise.all(
    agents
      .filter((agent) => agent.tokens?.rank !== rank(agent, resolvePriority(agent)))
      .map(syncAgent),
  );
};
