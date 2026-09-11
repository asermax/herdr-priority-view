import { send } from "./herdr-client";
import { VIEW_PARAMS } from "./view";

export const applyView = (): Promise<unknown> => send("agent.view.set", VIEW_PARAMS);
