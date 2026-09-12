# herdr-priority-view

A [herdr](https://herdr.dev) plugin that replaces the agent panel ordering and lets
you assign a priority to each agent.

herdr's built-in `agent_panel_sort = "priority"` pushes the agent that changed
state most recently to the top, so agents that finished long ago slide down and
get neglected. This plugin sets an agent view that orders the panel as:

1. by status: blocked, then done, then working, then idle, then unknown
2. within a status, higher priority first
3. within a priority, the agent that has been waiting the longest first

## Priorities

Every agent starts at normal priority and looks like it always did. The `high`
and `low` actions mark the focused agent's pane, and the mark shows up in the
sidebar as `P1` or `P3` once you add the `$priority` token to your row layout:

```toml
[ui.sidebar.agents]
rows = [
  ["state_icon", { token = "$priority", rules = [
    { equals = "P1", fg = "#f38ba8", bold = true },
    { equals = "P3", dim = true },
  ] }, "machine", "workspace", "tab"],
  ["agent"],
]

[[keys.command]]
key = "prefix+1"
type = "plugin_action"
command = "asermax.priority-view.high"
description = "priority: high"

[[keys.command]]
key = "prefix+2"
type = "plugin_action"
command = "asermax.priority-view.normal"
description = "priority: normal"

[[keys.command]]
key = "prefix+3"
type = "plugin_action"
command = "asermax.priority-view.low"
description = "priority: low"
```

Priorities are stored in the plugin state dir keyed by agent session id alone, so
they follow the conversation across pane moves and survive a server restart. A
priority dies with its conversation: when the agent exits, its entry and its
tokens go, so resuming that conversation later starts it back at normal.

## How it works

herdr keeps a single active agent view, set through `agent.view.set`. Its `status`
sort orders the five states in one fixed way, so it cannot rank statuses and then
let priority decide the rest. The plugin writes a `rank` metadata token per agent
pane instead, holding the status rank and the priority digit, and the view sorts
by that token and then by herdr's state-change sequence. Event hooks
on `pane.agent_detected` and `pane.agent_status_changed` recompute the token from
the live rank token, falling back to the state file when tokens are missing after
a restart. There is no long-running process.

When an agent exits, herdr fires `pane.agent_detected` with `released: true`, but
by then it has already cleared the pane's agent and its session id. Pane metadata
outlives the agent, so the plugin keeps the session id in a `session` token on the
pane and the release hook reads it back to delete the right entry. Closing a pane
outright fires no release event, so entries whose conversation is no longer live
are pruned the next time a priority key is pressed.

## Requirements

- herdr >= 0.9.0
- [bun](https://bun.sh) on the PATH of the herdr server
