import { parsePaneEvent } from "../src/event";
import { removePriority } from "../src/state";

const event = parsePaneEvent();

if (event != null) removePriority(event.pane_id);
