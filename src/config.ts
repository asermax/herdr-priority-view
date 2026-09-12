import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PRIORITY, type PriorityName } from "./priority";

type Labels = Record<Exclude<PriorityName, "normal">, string>;

const DEFAULTS: Labels = {
  high: `P${PRIORITY.high}`,
  low: `P${PRIORITY.low}`,
};

export const configPath = (): string => join(process.env.HERDR_PLUGIN_CONFIG_DIR ?? ".", "config.toml");

interface RawConfig {
  readonly labels?: Partial<Labels>;
}

const readRawConfig = (): RawConfig => {
  try {
    return Bun.TOML.parse(readFileSync(configPath(), "utf8")) as RawConfig;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw new Error(`${configPath()}: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export const loadLabels = (): Labels => ({ ...DEFAULTS, ...readRawConfig().labels });
