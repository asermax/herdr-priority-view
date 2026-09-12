interface PaneEvent {
  readonly pane_id: string;
  readonly released: boolean;
}

export const parsePaneEvent = (): PaneEvent | null => {
  const raw = process.env.HERDR_PLUGIN_EVENT_JSON;
  if (raw == null) return null;

  const parsed = JSON.parse(raw) as { data?: { pane_id?: string; released?: boolean } };
  if (parsed.data?.pane_id == null) return null;

  return { pane_id: parsed.data.pane_id, released: parsed.data.released === true };
};
