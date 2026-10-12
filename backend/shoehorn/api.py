from enum import StrEnum
from typing import NotRequired, TypedDict


class Game(TypedDict):
    """An installed game, whether Steam's own or a shortcut someone added."""

    appid: str
    name: str
    path: str
    prefix: str
    compat_path: str
    has_prefix: bool


class Shortcut(TypedDict):
    """A non-Steam library entry, as stored in shortcuts.vdf."""

    appid: str
    name: str
    exe: str
    start_dir: str
    launch_options: str


class PathInfo(TypedDict):
    name: str
    parent: str
    is_file: bool
    is_dir: bool


class LocaleReport(TypedDict):
    locale: str | None
    language: NotRequired[str]
    missing: NotRequired[str | None]


class PrefixProblem(StrEnum):
    NO_PREFIX = "no prefix"
    IN_USE = "prefix in use"


class PrefixUnusable(TypedDict):
    reason: PrefixProblem


class PrefixSeeded(TypedDict):
    linked: list[str]
    paths: list[str]
    game_dir: str
    windows_dir: str


PrepareReport = PrefixUnusable | PrefixSeeded
