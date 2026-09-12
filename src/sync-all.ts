import { agentList } from "./herdr-client";
import { reportAgent } from "./report-agent";
import { getPriority } from "./state";

export const syncAll = async (): Promise<void> => {
  const agents = await agentList();

  await Promise.all(agents.map((agent) => reportAgent(agent.pane_id, agent.agent_status, getPriority(agent.pane_id))));
};
