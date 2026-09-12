export const VIEW_PARAMS = {
  label: "priority",
  sort: [
    { field: { token: "rank" }, order: "asc" },
    { field: "status", order: "asc" },
    { field: "state_change_seq", order: "asc" },
  ],
};
