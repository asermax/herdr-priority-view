# herdr-priority-view

A [herdr](https://herdr.dev) plugin that replaces the agent panel ordering and lets
you assign a priority to each agent.

herdr's built-in `agent_panel_sort = "priority"` pushes the agent that changed
state most recently to the top, so agents that finished long ago slide down and
get neglected. This plugin sets an agent view that orders the panel as:

1. blocked agents, higher priority first
2. everything else, higher priority first
3. within the same priority, by status (done, idle, unknown, working)
4. within the same status, the agent that has been waiting the longest first

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

Priorities are stored per pane id under the plugin state dir and reapplied on
server startup.

## How it works

herdr keeps a single active agent view, set through `agent.view.set`. Its sort
fields cannot express "blocked first, then priority", so the plugin writes a
`rank` metadata token per agent pane (blocked flag plus priority) and the view
sorts by that token, then status, then herdr's state-change sequence. Event hooks
on `pane.agent_detected`, `pane.agent_status_changed`, and `pane.closed` keep the
token current; there is no long-running process.

## Requirements

- herdr >= 0.9.0
- [bun](https://bun.sh) on the PATH of the herdr server
