export const PRIORITY = {
  high: "1",
  normal: "2",
  low: "3",
} as const;

export type PriorityName = keyof typeof PRIORITY;
export type Priority = (typeof PRIORITY)[PriorityName];

export const DEFAULT_PRIORITY: Priority = PRIORITY.normal;

export const isPriorityName = (value: string): value is PriorityName => value in PRIORITY;
