import type { AgentInfo } from "./herdr-client";
import { DEFAULT_PRIORITY, isPriority, type Priority } from "./priority";
import { getEntry } from "./state";

// The live rank token wins; the file only matters when tokens are gone, which is
// the case right after a server restart.
export const resolvePriority = (agent: AgentInfo): Priority => {
  const fromRank = agent.tokens?.rank?.charAt(1);
  if (isPriority(fromRank)) return fromRank;

  return getEntry(agent)?.priority ?? DEFAULT_PRIORITY;
};
