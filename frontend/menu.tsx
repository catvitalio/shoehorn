import {
  MenuItem,
  afterPatch,
  fakeRenderComponent,
  findInReactTree,
  findInTree,
  findModuleByExport,
  type Patch,
} from "@decky/ui";

import { listGames } from "./api";
import { t } from "./i18n";
import { openPanelFor } from "./qam";
import { session, setSession } from "./session";

export interface MenuPatch {
  unpatch(): void;
}

const ITEM_KEY = "shoehorn-install-mod";
const CACHE_TTL = 30_000;

type MenuNode = { key?: unknown; props?: { children?: unknown } } & Record<string, any>;

let refreshed = 0;

/** Keep the game list warm: a menu renders in one pass with nothing to await,
 * and the answer only changes when a game is installed or removed. */
const refreshGames = (): void => {
  if (Date.now() - refreshed < CACHE_TTL) return;
  refreshed = Date.now();
  listGames()
    .then((games) => setSession("games", games))
    .catch(() => undefined);
};

const installable = (appid: string): boolean =>
  session.games.some((game) => game.appid === appid && game.has_prefix);

const item = (appid: string) => (
  <MenuItem key={ITEM_KEY} onSelected={() => openPanelFor(appid)}>
    {t("installMod")}
  </MenuItem>
);

/** Where "Properties…" sits, or -1. Also the test for which menu this is: the
 * gear menu and its "Manage" submenu share the Menu class, and both carry an
 * item mentioning `launchSource`, but only the top level has Properties. */
const propertiesIndex = (children: MenuNode[]): number =>
  children.findIndex((child) =>
    findInReactTree(child, (node) => !!node?.onSelected?.toString().includes("AppProperties")),
  );

const dedupe = (children: MenuNode[]): void => {
  for (let index = children.length - 1; index >= 0; index -= 1) {
    if (children[index]?.key === ITEM_KEY) children.splice(index, 1);
  }
};

const ownerAppid = (node: MenuNode | undefined): string | undefined => {
  const appid = node?._owner?.pendingProps?.overview?.appid;
  return appid === undefined ? undefined : String(appid);
};

const treeAppid = (tree: unknown): string | undefined => {
  const found = findInTree(tree, (node) => !!node?.app?.appid, {
    walkable: ["props", "children"],
  });
  return found?.app?.appid === undefined ? undefined : String(found.app.appid);
};

const menuAppid = (component: MenuNode): string =>
  ownerAppid(component) ?? treeAppid(component?.props?.children) ?? "";

/** The appid of the menu being rendered, taken from the owner of its own
 * nodes. The last opened one is a fallback for a tree that names no game. */
const liveAppid = (children: MenuNode[], fallback: string): string => {
  const sibling = children.find((child) => {
    const appid = ownerAppid(child);
    return appid !== undefined && appid !== fallback;
  });
  return ownerAppid(sibling) ?? treeAppid(children) ?? fallback;
};

/** Steam's context menu class. It is not exported under a usable name, so the
 * module is found by a string inside it and the class by rendering a sibling
 * that returns it. */
const libraryContextMenu = (): MenuNode | null => {
  try {
    const module = findModuleByExport(
      (exported: any) =>
        !!exported?.toString && exported.toString().includes("().LibraryContextMenu"),
    );
    const sibling = Object.values(module ?? {}).find(
      (value: any) =>
        typeof value?.toString === "function" && value.toString().includes("navigator:"),
    );
    if (!sibling) return null;
    return (fakeRenderComponent(sibling as any) as any)?.type ?? null;
  } catch (error) {
    console.error("[Shoehorn] context menu not found:", error);
    return null;
  }
};

/** Add "Install a mod" to a game's gear menu. Every step may fail into a
 * no-op; a missing item beats a broken library. Patches on Steam's prototypes
 * outlive the plugin, so all of them are handed back for `unpatch` — a
 * forgotten one answers with the unloaded plugin's state. */
export const patchGameMenu = (): MenuPatch => {
  const LibraryContextMenu = libraryContextMenu();
  if (!LibraryContextMenu) return { unpatch: () => undefined };

  refreshGames();

  const patches: Patch[] = [];
  const patchedMenus = new WeakSet<object>();
  let lastOpened = "";

  const addItem = (children: unknown): void => {
    if (!Array.isArray(children)) return;
    dedupe(children);

    const properties = propertiesIndex(children);
    if (properties < 0) return;

    refreshGames();
    const appid = liveAppid(children, lastOpened);
    if (installable(appid)) children.splice(properties, 0, item(appid) as MenuNode);
  };

  const patchMenuClass = (prototype: object): void => {
    if (patchedMenus.has(prototype)) return;
    patchedMenus.add(prototype);

    patches.push(
      afterPatch(prototype, "render", (_args, result: any) => {
        addItem(result?.props?.children?.[0]);
        return result;
      }),
      /** The children array is reused between opens, so a stale copy of our
       * item has to go even when React skips the re-render. */
      afterPatch(prototype, "shouldComponentUpdate", (args: any, shouldUpdate: any) => {
        const next = args?.[0]?.children;
        if (Array.isArray(next)) {
          dedupe(next);
          if (shouldUpdate === true) addItem(next);
        }
        return shouldUpdate;
      }),
    );
  };

  let reachedMenuClass = false;

  patches.push(
    afterPatch(LibraryContextMenu.prototype, "render", (_args, component: MenuNode) => {
      lastOpened = menuAppid(component);

      if (!reachedMenuClass) {
        reachedMenuClass = true;
        patches.push(
          afterPatch(component, "type", (_typeArgs, rendered: any) => {
            const prototype = rendered?.type?.prototype;
            if (prototype) patchMenuClass(prototype);
            return rendered;
          }),
        );
      } else {
        /** Later opens render a component the type patch never saw. */
        addItem(component?.props?.children);
      }

      return component;
    }),
  );

  return {
    unpatch: () => {
      for (const patch of patches.reverse()) {
        try {
          patch.unpatch();
        } catch (error) {
          console.error("[Shoehorn] context menu unpatch failed:", error);
        }
      }
      patches.length = 0;
    },
  };
};
