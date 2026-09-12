import type { AgentInfo } from "./herdr-client";
import { reportAgent } from "./report-agent";
import { resolvePriority } from "./resolve-priority";

export const syncAgent = (agent: AgentInfo): Promise<void> => reportAgent(agent, resolvePriority(agent));
