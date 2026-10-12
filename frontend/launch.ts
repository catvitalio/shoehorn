import { Router } from "@decky/ui";

import { describeShortcut, preparePrefix, staleShortcuts, type Game, type Shortcut } from "./api";
import { type Key } from "./i18n";
import { note } from "./notify";
import { session, setSession } from "./session";

const TENFOOT_LAUNCH_SOURCE = 200;
const NO_LAUNCH_OPTION = -1;
const SHORTCUT_GAMEID_FLAG = BigInt(0x02000000);
const GAMEID_APPID_SHIFT = BigInt(32);
const NAME_PREFIX = "Shoehorn: ";
const POLL_ATTEMPTS = 20;
const POLL_INTERVAL = 150;

export type Outcome = { shortcut: number } | { error: Key };

/** One per shortcut, so a second install cannot orphan the first's cleanup. */
const watchers = new Map<number, { unregister(): void }>();

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Ask until the answer is the one being waited for, then give up and return
 * whatever came last. Steam fills its files and stores on its own schedule. */
const settle = async <T>(
  probe: () => Promise<T> | T,
  accept: (value: T) => boolean,
): Promise<T> => {
  let value = await probe();
  for (let attempt = 1; attempt < POLL_ATTEMPTS && !accept(value); attempt += 1) {
    await pause(POLL_INTERVAL);
    value = await probe();
  }
  return value;
};

const running = (appId: number): boolean =>
  (Router.RunningApps ?? []).some((app) => Number(app.appid) === appId);

export const stopWatching = (appId?: number) => {
  for (const [id, watcher] of watchers) {
    if (appId !== undefined && id !== appId) continue;
    watcher.unregister();
    watchers.delete(id);
  }
};

export const dropShortcut = (appId: number) => {
  stopWatching(appId);
  SteamClient.Apps.RemoveShortcut(appId);
  if (session.shortcut === appId) setSession("shortcut", undefined);
};

/** Remove the shortcut once its installer has exited. A running notification
 * has to arrive first, or a stale "not running" would delete the shortcut
 * before the launch it belongs to — except for one already known to run. */
const watchForExit = (appId: number, name: string, startedAlready = false) => {
  stopWatching(appId);

  let started = startedAlready;
  watchers.set(
    appId,
    SteamClient.GameSessions.RegisterForAppLifetimeNotifications((notification) => {
      if (notification.unAppID !== appId) return;

      if (notification.bRunning) {
        started = true;
        return;
      }
      if (!started) return;

      dropShortcut(appId);
      note("closedAndRemoved", { name });
    }),
  );
};

const installerName = (shortcutName: string | undefined, appId: number): string =>
  shortcutName?.replace(NAME_PREFIX, "") ?? String(appId);

/** Clean up after a previous run, whose watchers are gone. One still running
 * is adopted instead: a reload must not take the entry out from under an open
 * installer. */
export const dropStaleShortcuts = async () => {
  for (const appId of await staleShortcuts().catch(() => [])) {
    if (!running(appId)) {
      SteamClient.Apps.RemoveShortcut(appId);
      continue;
    }
    const stored = await describeShortcut(appId).catch(() => null);
    watchForExit(appId, installerName(stored?.name, appId), true);
  }
};

/** The 64-bit id Steam launches a non-Steam shortcut by. */
const shortcutGameId = (appId: number): string =>
  ((BigInt(appId) << GAMEID_APPID_SHIFT) | SHORTCUT_GAMEID_FLAG).toString();

export interface Request {
  game: Game;
  installer: string;
  locale?: string;
  previous?: number;
}

/** Run an installer inside a game's prefix, as a throwaway library entry (see
 * README). AddShortcut takes only a name and an executable — anything else it
 * is handed ends up parsed as arguments — so the rest is set field by field
 * afterwards, and read back to be sure Steam kept it. */
export const launchInstaller = async ({
  game,
  installer,
  locale,
  previous,
}: Request): Promise<Outcome> => {
  const prepared = await preparePrefix(game.appid);
  if ("reason" in prepared) {
    return { error: prepared.reason === "no prefix" ? "gameHasNoPrefix" : "prefixBusy" };
  }

  if (previous !== undefined && !running(previous)) dropShortcut(previous);

  const name = installer.split("/").pop() ?? installer;
  const created = await SteamClient.Apps.AddShortcut(`${NAME_PREFIX}${name}`, installer, "", "");

  SteamClient.Apps.SetShortcutName(created, `${NAME_PREFIX}${name}`);
  SteamClient.Apps.SetShortcutStartDir(created, game.path);

  const localeVars = locale ? `LANG=${locale} LC_ALL=${locale} ` : "";
  SteamClient.Apps.SetShortcutLaunchOptions(
    created,
    `${localeVars}STEAM_COMPAT_DATA_PATH="${game.compat_path}" %command%`,
  );

  /** Without a tool Steam runs a Windows installer natively, which ends the
   * moment it starts. */
  const inherited = window.appDetailsStore?.GetAppDetails(Number(game.appid))?.strCompatToolName;
  if (inherited) SteamClient.Apps.SpecifyCompatTool(created, inherited);
  else note("noCompatTool", { game: game.name });

  const kept = (stored: Shortcut | null) => !!stored?.launch_options.includes(game.compat_path);
  if (!kept(await settle(() => describeShortcut(created), kept))) {
    dropShortcut(created);
    return { error: "prefixOverrideLost" };
  }

  const overview = await settle(
    () => window.appStore?.GetAppOverviewByAppID(created),
    (candidate) => !!candidate?.gameid,
  );

  watchForExit(created, name);
  SteamClient.Apps.RunGame(
    overview?.gameid ?? shortcutGameId(created),
    "",
    NO_LAUNCH_OPTION,
    TENFOOT_LAUNCH_SOURCE,
  );

  return { shortcut: created };
};
