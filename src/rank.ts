import type { AgentInfo } from "./herdr-client";
import type { Priority } from "./priority";

const STATUS_RANK = {
  blocked: "0",
  done: "1",
  working: "2",
  idle: "3",
  unknown: "4",
} as const;

const UNRECOGNISED_STATUS_RANK = "4";

const SEQ_CEILING = 9_999_999_999;

/**
 * The view breaks ties by `state_change_seq` ascending, which puts the agent that
 * has waited longest first. Idle agents are not waiting on anyone, so for them the
 * most recently active should come first instead, and herdr's single sort list
 * cannot flip direction per status. Idle ranks carry an inverted seq to do it.
 */
const idleRecency = (seq: number | undefined): string =>
  seq == null ? "" : String(SEQ_CEILING - seq).padStart(String(SEQ_CEILING).length, "0");

/**
 * herdr's own `status` sort orders the five states against each other in one
 * fixed way, so it cannot put blocked first and let priority decide the rest.
 * Folding attention order and priority into one token buys both, and makes the
 * order of `done` against `idle` ours to choose instead of herdr's.
 */
export const rank = (
  { agent_status, state_change_seq }: Pick<AgentInfo, "agent_status" | "state_change_seq">,
  priority: Priority,
): string =>
  `${STATUS_RANK[agent_status as keyof typeof STATUS_RANK] ?? UNRECOGNISED_STATUS_RANK}${priority}${
    agent_status === "idle" ? idleRecency(state_change_seq) : ""
  }`;
