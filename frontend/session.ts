import { useEffect, useState } from "react";

import type { Game } from "./api";

/** State that has to outlive the panel: Steam unmounts a Quick Access panel's
 * contents whenever anything is drawn over it, a dropdown included. */
export interface Session {
  games: Game[];
  appid?: string;
  installer?: string;
  browseFrom?: string;
  locale?: string;
  localeMissing?: string;
  shortcut?: number;
  busy?: boolean;
}

export const session: Session = { games: [] };

const listeners = new Set<() => void>();

/** Write a value and redraw. Usable outside React, which the context-menu
 * entry needs. */
export function setSession<K extends keyof Session>(key: K, value: Session[K]): void {
  session[key] = value;
  for (const listener of listeners) listener();
}

/** Read a value, following it while mounted. Read live rather than snapshotted
 * at mount, because an awaited call returns exactly when the panel is being
 * rebuilt — including into the gap before the subscription exists. */
export function useSession<K extends keyof Session>(
  key: K,
): [Session[K], (value: Session[K]) => void] {
  const [, redraw] = useState(0);
  const rendered = session[key];

  useEffect(() => {
    const listener = () => redraw((count) => count + 1);
    listeners.add(listener);
    if (session[key] !== rendered) listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [rendered, (next: Session[K]) => setSession(key, next)];
}
