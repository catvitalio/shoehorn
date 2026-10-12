import { staticClasses } from "@decky/ui";
import { definePlugin } from "@decky/api";
import { FaShoePrints } from "react-icons/fa";

import { dropStaleShortcuts, stopWatching } from "./launch";
import { patchGameMenu } from "./menu";
import { Panel } from "./panel";
import { PLUGIN_NAME } from "./qam";

export default definePlugin(() => {
  void dropStaleShortcuts();
  const menu = patchGameMenu();

  return {
    name: PLUGIN_NAME,
    titleView: <div className={staticClasses.Title}>{PLUGIN_NAME}</div>,
    content: <Panel />,
    icon: <FaShoePrints />,
    onDismount: () => {
      menu.unpatch();
      stopWatching();
    },
  };
});
