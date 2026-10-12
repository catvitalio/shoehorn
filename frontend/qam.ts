import { Navigation, QuickAccessTab } from "@decky/ui";

import { setSession } from "./session";

export const PLUGIN_NAME = "Shoehorn";

/** Open this plugin's Quick Access page with a game already chosen, through
 * the same call Decky's own plugin list makes. */
export const openPanelFor = (appid: string): void => {
  setSession("appid", appid);
  setSession("installer", undefined);
  setSession("locale", undefined);
  setSession("localeMissing", undefined);
  window.DeckyPluginLoader?.deckyState?.setActivePlugin(PLUGIN_NAME);
  Navigation.OpenQuickAccessMenu(QuickAccessTab.Decky);
};
