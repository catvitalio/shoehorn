import { FileSelectionType, openFilePicker } from "@decky/api";

import { describePath, detectLocale, home, type Game } from "./api";
import { launchInstaller } from "./launch";
import { failed, failedWith, note } from "./notify";
import { session, setSession } from "./session";

const INSTALLER_EXTENSIONS = ["exe", "msi", "bat", "cmd"];

/** The language the installer's dialogs were written in, worth a word only
 * when the system lacks it — then its text is mojibake. */
export const detectAndWarn = async (path: string): Promise<string | undefined> => {
  const report = await detectLocale(path).catch(() => null);
  setSession("locale", report?.locale ?? undefined);
  setSession("localeMissing", report?.missing ?? undefined);
  if (report?.missing) note("localeMissing", { locale: report.missing });
  return report?.locale ?? undefined;
};

/** Browse for an installer. The picker's confirm button submits whatever
 * directory is open, so a folder arrives as an ordinary answer and becomes the
 * next starting point instead. */
export const chooseInstaller = async (): Promise<string | undefined> => {
  const start = session.browseFrom ?? (await home().catch(() => "/home"));
  const picked = await openFilePicker(
    FileSelectionType.FILE,
    start,
    true,
    true,
    undefined,
    INSTALLER_EXTENSIONS,
  );
  if (!picked?.realpath) return undefined;

  const info = await describePath(picked.realpath);
  if (!info.is_file) {
    setSession("browseFrom", picked.realpath);
    note(info.is_dir ? "pickedFolder" : "pickedNotFile", { name: info.name });
    return undefined;
  }

  setSession("installer", picked.realpath);
  setSession("browseFrom", info.parent);
  await detectAndWarn(picked.realpath);
  return picked.realpath;
};

export const runInstaller = async (game: Game, installer: string): Promise<void> => {
  setSession("busy", true);
  try {
    const outcome = await launchInstaller({
      game,
      installer,
      locale:
        session.locale ?? (session.localeMissing ? undefined : await detectAndWarn(installer)),
      previous: session.shortcut,
    });

    if ("error" in outcome) failed(outcome.error, { game: game.name });
    else setSession("shortcut", outcome.shortcut);
  } catch (error) {
    failedWith(error);
  } finally {
    setSession("busy", false);
  }
};
