import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { Priority } from "./priority";

type Entries = Record<string, Priority>;

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

export const getPriority = (key: string): Priority | undefined => readEntries()[key];

export const setPriority = (key: string, priority: Priority): void =>
  writeEntries({ ...readEntries(), [key]: priority });

export const removePriority = (key: string): void => {
  const entries = readEntries();

  delete entries[key];

  writeEntries(entries);
};

/**
 * Closing a pane fires no agent release, so an entry can outlive its conversation.
 * Pressing a priority key is the safe moment to drop those: every agent has been
 * detected by then, so a key with no live session belongs to a gone conversation.
 */
export const pruneTo = (liveKeys: readonly string[]): void => {
  const entries = readEntries();
  const live = new Set(liveKeys);

  for (const key of Object.keys(entries)) {
    if (!live.has(key)) delete entries[key];
  }

  writeEntries(entries);
};
