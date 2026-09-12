import type { Priority } from "./priority";

// The view sorts by this single token because herdr's sort fields cannot express
// "blocked before everything, then priority". Status and age are later sort keys.
export const rank = (status: string | null | undefined, priority: Priority): string =>
  `${status === "blocked" ? "0" : "1"}${priority}`;
