export const resolveFocusedPane = (): string => {
  const raw = process.env.HERDR_PLUGIN_CONTEXT_JSON;

  if (raw != null) {
    const ctx = JSON.parse(raw) as { focused_pane_id?: string | null };
    if (ctx.focused_pane_id != null) return ctx.focused_pane_id;
  }

  if (process.env.HERDR_PANE_ID) return process.env.HERDR_PANE_ID;

  throw new Error("Could not determine which pane to prioritize.");
};
