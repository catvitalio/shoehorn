import asyncio
from pathlib import Path

import decky
from shoehorn import api, catalog, installer, library, prefix, shortcuts


def user_home() -> Path:
    return Path(decky.DECKY_USER_HOME)


class Plugin:
    async def list_games(self) -> list[api.Game]:
        return await asyncio.to_thread(catalog.installed_games, user_home())

    async def home(self) -> str:
        return str(user_home())

    async def describe_path(self, path: str) -> api.PathInfo:
        return await asyncio.to_thread(installer.describe, Path(path))

    async def stale_shortcuts(self) -> list[int]:
        return await asyncio.to_thread(shortcuts.ours, user_home())

    async def describe_shortcut(self, appid: int) -> api.Shortcut | None:
        return await asyncio.to_thread(shortcuts.find, user_home(), appid)

    async def installer_locale(self, path: str) -> api.LocaleReport:
        report = await asyncio.to_thread(installer.detect_locale, Path(path))
        decky.logger.info("installer_locale %s: %s", path, report)
        return report

    async def prepare_prefix(self, appid: str) -> api.PrepareReport:
        report = await asyncio.to_thread(self._seed, appid)
        decky.logger.info("prepare_prefix %s: %s", appid, report)
        return report

    @staticmethod
    def _seed(appid: str) -> api.PrepareReport:
        game = catalog.find(user_home(), appid)
        if game is None:
            raise LookupError(f"no installed game with appid {appid}")
        return prefix.seed(game, library.library_dirs(user_home()))

    async def _main(self) -> None:
        decky.logger.info(
            "shoehorn ready, %d games visible",
            len(catalog.installed_games(user_home())),
        )

    async def _unload(self) -> None:
        pass

    async def _uninstall(self) -> None:
        pass
