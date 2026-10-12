import {
  ButtonItem,
  DropdownItem,
  Field,
  Navigation,
  PanelSection,
  PanelSectionRow,
} from "@decky/ui";
import { useQuickAccessVisible } from "@decky/api";
import { useEffect, useMemo } from "react";

import { listGames } from "./api";
import { t } from "./i18n";
import { chooseInstaller, runInstaller } from "./install";
import { dropShortcut } from "./launch";
import { failedWith, note } from "./notify";
import { useSession } from "./session";

const optionData = (option: unknown): string | undefined => {
  if (typeof option === "string") return option;
  if (option && typeof option === "object" && "data" in option) {
    return String((option as { data: unknown }).data);
  }
  return undefined;
};

export function Panel() {
  const [games, setGames] = useSession("games");
  const [appid, setAppid] = useSession("appid");
  const [installer] = useSession("installer");
  const [shortcut] = useSession("shortcut");
  const [busy] = useSession("busy");
  const visible = useQuickAccessVisible();

  const game = games.find((candidate) => candidate.appid === appid);

  const gameOptions = useMemo(
    () => games.map((candidate) => ({ data: candidate.appid, label: candidate.name })),
    [games],
  );

  useEffect(() => {
    if (!visible) return;
    listGames().then(setGames).catch(failedWith);
  }, [visible]);

  const run = () => {
    if (game && installer) void runInstaller(game, installer);
  };

  const cleanUp = () => {
    if (shortcut === undefined) return;
    dropShortcut(shortcut);
    note("shortcutRemoved");
  };

  return (
    <>
      <PanelSection title={t("game")}>
        <PanelSectionRow>
          <DropdownItem
            label={t("game")}
            menuLabel={t("installedGames")}
            strDefaultLabel={t("pickGame")}
            rgOptions={gameOptions}
            selectedOption={appid}
            onChange={(option) => setAppid(optionData(option))}
          />
        </PanelSectionRow>
        {game && (
          <PanelSectionRow>
            <Field label={game.has_prefix ? t("prefix") : t("noPrefix")} focusable>
              <div style={{ fontSize: "0.7em", wordBreak: "break-all" }}>
                {game.has_prefix ? game.prefix : t("noPrefixHint")}
              </div>
            </Field>
          </PanelSectionRow>
        )}
      </PanelSection>

      <PanelSection title={t("installer")}>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            disabled={!appid || busy}
            onClick={() => void chooseInstaller()}
          >
            {installer?.split("/").pop() ?? t("chooseExe")}
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={!game || !installer || busy} onClick={run}>
            {t("run")}
          </ButtonItem>
        </PanelSectionRow>
        {shortcut !== undefined && (
          <>
            <PanelSectionRow>
              <ButtonItem
                layout="below"
                description={t("openInLibraryHint")}
                onClick={() => {
                  Navigation.Navigate(`/library/app/${shortcut}`);
                  Navigation.CloseSideMenus();
                }}
              >
                {t("openInLibrary")}
              </ButtonItem>
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" description={t("removeShortcutHint")} onClick={cleanUp}>
                {t("removeShortcut")}
              </ButtonItem>
            </PanelSectionRow>
          </>
        )}
      </PanelSection>
    </>
  );
}
