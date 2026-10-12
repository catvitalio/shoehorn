import { callable } from "@decky/api";

export interface Game {
  appid: string;
  name: string;
  path: string;
  prefix: string;
  compat_path: string;
  has_prefix: boolean;
}

export interface PathInfo {
  name: string;
  parent: string;
  is_file: boolean;
  is_dir: boolean;
}

export interface LocaleReport {
  language?: string;
  locale: string | null;
  missing?: string | null;
}

export type PrepareReport =
  | { reason: "no prefix" | "prefix in use" }
  | { linked: string[]; paths: string[]; game_dir: string; windows_dir: string };

export interface Shortcut {
  appid: string;
  name: string;
  exe: string;
  start_dir: string;
  launch_options: string;
}

export const listGames = callable<[], Game[]>("list_games");
export const home = callable<[], string>("home");
export const describePath = callable<[path: string], PathInfo>("describe_path");
export const staleShortcuts = callable<[], number[]>("stale_shortcuts");
export const describeShortcut = callable<[appid: number], Shortcut | null>("describe_shortcut");
export const preparePrefix = callable<[appid: string], PrepareReport>("prepare_prefix");
export const detectLocale = callable<[path: string], LocaleReport>("installer_locale");
