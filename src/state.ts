import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { AgentInfo } from "./herdr-client";
import type { Priority } from "./priority";

interface Entry {
  readonly priority: Priority;
  readonly pane_id: string;
}

type Entries = Record<string, Entry>;

const statePath = (): string => {
  const dir = process.env.HERDR_PLUGIN_STATE_DIR;

  if (dir == null) {
    throw new Error("HERDR_PLUGIN_STATE_DIR is not set; this command must run inside a herdr plugin context.");
  }

  mkdirSync(dir, { recursive: true });

  return join(dir, "priorities.json");
};

const readEntries = (): Entries => {
  try {
    return JSON.parse(readFileSync(statePath(), "utf8")) as Entries;
  } catch {
    return {};
  }
};

const writeEntries = (entries: Entries): void => writeFileSync(statePath(), JSON.stringify(entries, null, 2));

// Priorities follow the conversation, so the agent session id is the key. Panes
// without a session fall back to their pane id, which herdr also keeps stable.
export const entryKey = (agent: AgentInfo): string => agent.agent_session?.value ?? `pane:${agent.pane_id}`;

export const getEntry = (agent: AgentInfo): Entry | undefined => readEntries()[entryKey(agent)];

export const setEntry = (agent: AgentInfo, priority: Priority): void => {
  const entries = readEntries();

  entries[entryKey(agent)] = { priority, pane_id: agent.pane_id };

  writeEntries(entries);
};

export const removeEntry = (agent: AgentInfo): void => {
  const entries = readEntries();

  delete entries[entryKey(agent)];

  writeEntries(entries);
};

export const removeEntriesForPane = (paneId: string): void => {
  const entries = readEntries();

  for (const [key, entry] of Object.entries(entries)) {
    if (entry.pane_id === paneId) delete entries[key];
  }

  writeEntries(entries);
};
