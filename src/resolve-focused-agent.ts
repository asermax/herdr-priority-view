import { agentGet, type AgentInfo } from "./herdr-client";

export const resolveFocusedAgent = (): Promise<AgentInfo> => {
  const raw = process.env.HERDR_PLUGIN_CONTEXT_JSON;
  const ctx = raw == null ? {} : (JSON.parse(raw) as { focused_pane_id?: string | null });
  const paneId = ctx.focused_pane_id ?? process.env.HERDR_PANE_ID;

  if (paneId == null) throw new Error("Could not determine which pane to prioritize.");

  return agentGet(paneId).catch(() => {
    throw new Error(`focused pane ${paneId} has no agent`);
  });
};
