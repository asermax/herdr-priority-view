import { parsePaneEvent } from "../src/event";
import { removeEntriesForPane } from "../src/state";

const event = parsePaneEvent();

if (event != null) removeEntriesForPane(event.pane_id);
