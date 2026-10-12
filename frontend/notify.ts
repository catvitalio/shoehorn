import { toaster } from "@decky/api";

import { t, type Key } from "./i18n";

export const note = (key: Key, values?: Record<string, string>) =>
  toaster.toast({ title: "Shoehorn", body: t(key, values) });

export const failed = (key: Key, values?: Record<string, string>) =>
  toaster.toast({ title: `Shoehorn: ${t("failed")}`, body: t(key, values) });

export const failedWith = (error: unknown) =>
  toaster.toast({ title: `Shoehorn: ${t("failed")}`, body: String(error) });
