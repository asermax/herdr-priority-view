import { agentList } from "./herdr-client";
import { syncAgent } from "./sync-agent";

export const syncAll = async (): Promise<void> => {
  const agents = await agentList();

  await Promise.all(agents.map(syncAgent));
};
