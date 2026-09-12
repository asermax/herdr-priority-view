interface PaneEvent {
  readonly pane_id: string;
  readonly agent_status?: string | null;
}

export const parsePaneEvent = (): PaneEvent | null => {
  const raw = process.env.HERDR_PLUGIN_EVENT_JSON;
  if (raw == null) return null;

  const parsed = JSON.parse(raw) as { data?: { pane_id?: string; agent_status?: string | null } };
  if (parsed.data?.pane_id == null) return null;

  return { pane_id: parsed.data.pane_id, agent_status: parsed.data.agent_status };
};
