import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { DEFAULT_PRIORITY, type Priority } from "./priority";

type Priorities = Record<string, Priority>;

const statePath = (): string => {
  const dir = process.env.HERDR_PLUGIN_STATE_DIR;

  if (dir == null) {
    throw new Error("HERDR_PLUGIN_STATE_DIR is not set; this command must run inside a herdr plugin context.");
  }

  mkdirSync(dir, { recursive: true });

  return join(dir, "priorities.json");
};

const readPriorities = (): Priorities => {
  try {
    return JSON.parse(readFileSync(statePath(), "utf8")) as Priorities;
  } catch {
    return {};
  }
};

export const getPriority = (paneId: string): Priority => readPriorities()[paneId] ?? DEFAULT_PRIORITY;

export const setPriority = (paneId: string, priority: Priority): void => {
  const priorities = readPriorities();

  if (priority === DEFAULT_PRIORITY) {
    delete priorities[paneId];
  } else {
    priorities[paneId] = priority;
  }

  writeFileSync(statePath(), JSON.stringify(priorities, null, 2));
};

export const removePriority = (paneId: string): void => setPriority(paneId, DEFAULT_PRIORITY);
