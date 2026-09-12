import { paneGet } from "./herdr-client";
import { clearAgentTokens } from "./report-agent";
import { removePriority } from "./state";

/**
 * A priority dies with its conversation. The tokens go too, so a new agent
 * started in the same pane does not inherit the old priority through them.
 */
export const releaseAgent = async (paneId: string): Promise<void> => {
  const pane = await paneGet(paneId).catch(() => null);
  const key = pane?.tokens?.session;

  if (key != null) removePriority(key);

  if (pane != null) await clearAgentTokens(paneId);
};
