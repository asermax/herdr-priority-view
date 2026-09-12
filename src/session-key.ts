import type { AgentInfo } from "./herdr-client";

// Priorities are keyed by conversation, not by pane, so they survive a pane move
// and a server restart. Agents herdr cannot map to a session keep their priority
// only for as long as their pane metadata lives.
export const sessionKey = (agent: AgentInfo): string | null => agent.agent_session?.value ?? null;
