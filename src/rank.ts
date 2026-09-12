import type { Priority } from "./priority";

const STATUS_RANK = {
  blocked: "0",
  done: "1",
  working: "2",
  idle: "3",
  unknown: "4",
} as const;

const UNRECOGNISED_STATUS_RANK = "4";

/**
 * herdr's own `status` sort orders the five states against each other in one
 * fixed way, so it cannot put blocked first and let priority decide the rest.
 * Folding attention order and priority into one token buys both, and makes the
 * order of `done` against `idle` ours to choose instead of herdr's.
 */
export const rank = (status: string | null | undefined, priority: Priority): string =>
  `${STATUS_RANK[status as keyof typeof STATUS_RANK] ?? UNRECOGNISED_STATUS_RANK}${priority}`;
