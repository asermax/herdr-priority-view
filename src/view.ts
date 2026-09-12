export const VIEW_SOURCE = "asermax.priority-view";

// `status` ascending sorts alphabetically: blocked, done, idle, unknown, working.
// `state_change_seq` is herdr's global state-change counter, so ascending puts the
// agent that has been waiting the longest first within each status.
export const VIEW_PARAMS = {
  source: VIEW_SOURCE,
  label: "priority",
  sort: [
    { field: "status", order: "asc" },
    { field: "state_change_seq", order: "asc" },
  ],
};
