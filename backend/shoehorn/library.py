import re
from pathlib import Path

from shoehorn import api

STEAM_ROOTS = (".local/share/Steam", ".steam/steam", ".steam/root")
TOOL_MANIFESTS = ("toolmanifest.vdf", "compatibilitytool.vdf")
REDISTRIBUTABLES = "228980"


def steam_root(home: Path) -> Path | None:
    for candidate in STEAM_ROOTS:
        root = home / candidate
        if (root / "steamapps").is_dir():
            return root
    return None


def library_dirs(home: Path) -> list[Path]:
    root = steam_root(home)
    if root is None:
        return []

    candidates = [root]
    folders = root / "steamapps" / "libraryfolders.vdf"
    if folders.is_file():
        text = folders.read_text(encoding="utf-8", errors="replace")
        candidates += [Path(p) for p in re.findall(r'"path"\s+"([^"]+)"', text)]

    seen: set[Path] = set()
    libraries: list[Path] = []
    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved in seen or not (resolved / "steamapps" / "common").is_dir():
            continue
        seen.add(resolved)
        libraries.append(resolved)
    return libraries


def compat_dir(home: Path, appid: str) -> Path | None:
    for library in library_dirs(home):
        candidate = library / "steamapps" / "compatdata" / appid
        if candidate.is_dir():
            return candidate
    return None


def playable(appid: str, path: Path) -> bool:
    """Whether an installed app is a game rather than plumbing. Proton builds
    and runtimes live beside games; their tool manifest is what gives them
    away."""
    if appid == REDISTRIBUTABLES:
        return False
    return not any((path / manifest).is_file() for manifest in TOOL_MANIFESTS)


def games(home: Path) -> list[api.Game]:
    found: list[api.Game] = []
    for library in library_dirs(home):
        for manifest in (library / "steamapps").glob("appmanifest_*.acf"):
            text = manifest.read_text(encoding="utf-8", errors="replace")
            fields: dict[str, str] = {}
            for key, value in re.findall(r'"(appid|name|installdir)"\s+"([^"]*)"', text):
                fields.setdefault(key, value)

            appid = fields.get("appid")
            install_dir = fields.get("installdir")
            if not appid or not install_dir:
                continue

            path = library / "steamapps" / "common" / install_dir
            if not path.is_dir() or not playable(appid, path):
                continue

            compat = library / "steamapps" / "compatdata" / appid
            found.append(
                {
                    "appid": appid,
                    "name": fields.get("name") or install_dir,
                    "path": str(path),
                    "prefix": str(compat / "pfx"),
                    "compat_path": str(compat),
                    "has_prefix": (compat / "pfx").is_dir(),
                }
            )
    return found
