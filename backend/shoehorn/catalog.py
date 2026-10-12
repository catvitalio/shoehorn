from pathlib import Path

from shoehorn import api, library, shortcuts


def installed_games(home: Path) -> list[api.Game]:
    games = library.games(home) + shortcuts.games(home)
    games.sort(key=lambda game: game["name"].lower())
    return games


def find(home: Path, appid: str) -> api.Game | None:
    for game in installed_games(home):
        if game["appid"] == appid:
            return game
    return None
