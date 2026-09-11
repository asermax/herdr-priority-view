# herdr-new-priority-view

A [herdr](https://herdr.dev) plugin that replaces the agent panel ordering with one
that keeps the agent that has been waiting the longest at the top.

herdr's built-in `agent_panel_sort = "priority"` pushes the agent that changed
state most recently to the top. When several agents finish in quick succession,
the ones that finished long ago keep sliding down and get neglected. This plugin
sets an agent view over the socket API that sorts by status (blocked, done,
idle, unknown, working) and, within each status, by herdr's state-change
sequence ascending, so the oldest waiting agent comes first.

## How it works

herdr keeps a single active agent view, set through `agent.view.set`. The plugin
runs once on server startup and sets that view under the source
`asermax.new-priority-view`. The sidebar shows the view label, `oldest first`.

There is nothing to toggle. To go back to the built-in ordering, disable the
plugin and clear the view:

```bash
herdr plugin disable asermax.new-priority-view
```

## Requirements

- herdr >= 0.9.0
- [bun](https://bun.sh) on the PATH of the herdr server
