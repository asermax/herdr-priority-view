import { paneReportTokens } from "./herdr-client";
import { DEFAULT_PRIORITY, type Priority } from "./priority";
import { rank } from "./rank";

// Normal-priority agents carry no visible token so their rows look unchanged.
export const reportAgent = (paneId: string, status: string | null | undefined, priority: Priority): Promise<void> =>
  paneReportTokens(paneId, {
    rank: rank(status, priority),
    priority: priority === DEFAULT_PRIORITY ? null : `P${priority}`,
  });
