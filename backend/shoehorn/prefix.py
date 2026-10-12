import fcntl
from pathlib import Path

from shoehorn import api

STUB_STEAM = Path("drive_c/Program Files (x86)/Steam")
STUB_STEAM_WINDOWS = "C:\\Program Files (x86)\\Steam"
UNINSTALL_KEYS = (
    "Software\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Uninstall",
    "Software\\\\Wow6432Node\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Uninstall",
)
PREFIX_LOCK = "pfx.lock"
REGISTRY_FILE = "system.reg"
SECTION_TIME = 0


def drive_map(prefix: Path) -> list[tuple[Path, str]]:
    drives: list[tuple[Path, str]] = []
    for device in (prefix / "dosdevices").glob("?:"):
        try:
            target = device.resolve(strict=True)
        except OSError:
            continue
        if target.is_dir():
            drives.append((target, device.name.upper()))
    drives.sort(key=lambda entry: len(entry[0].parts), reverse=True)
    return drives


def windows_path(target: Path, drives: list[tuple[Path, str]]) -> str | None:
    for root, letter in drives:
        if target == root:
            return f"{letter}\\"
        if root in target.parents:
            tail = "\\".join(target.relative_to(root).parts)
            return f"{letter}\\{tail}"
    return None


def library_vdf(paths: list[str]) -> str:
    entries = "".join(
        f'\t"{index}"\n\t{{\n\t\t"path"\t\t"{path.replace(chr(92), chr(92) * 2)}"\n\t}}\n'
        for index, path in enumerate(paths)
    )
    return f'"LibraryFolders"\n{{\n{entries}}}\n'


def link(source: Path, target: Path) -> bool:
    if target.is_symlink():
        if target.readlink() == source:
            return False
        target.unlink()
    elif target.exists():
        return False
    target.parent.mkdir(parents=True, exist_ok=True)
    target.symlink_to(source)
    return True


def stub_path(installed: Path) -> str:
    """The path the game would have on Windows, real inside the prefix thanks
    to the symlink `seed` makes, and stable where a drive letter is not."""
    return f"{STUB_STEAM_WINDOWS}\\steamapps\\common\\{installed.name}"


def in_use(compat_path: Path) -> bool:
    """Whether Proton still holds this prefix. Wine rewrites the registry
    wholesale from memory when its server stops, so a write made now is both
    invisible to what is running and gone once it exits."""
    lock = compat_path / PREFIX_LOCK
    if not lock.is_file():
        return False
    try:
        with lock.open("r") as handle:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
            fcntl.flock(handle, fcntl.LOCK_UN)
    except OSError:
        return True
    return False


def registry_entry(appid: str, name: str, installed: str) -> str:
    escaped = installed.replace("\\", "\\\\")
    return "".join(
        f"\n[{parent}\\\\Steam App {appid}] {SECTION_TIME}\n"
        f'"DisplayName"="{name}"\n'
        f'"InstallLocation"="{escaped}"\n'
        for parent in UNINSTALL_KEYS
    )


def registry_matches(text: str, appid: str, installed: str) -> bool:
    """Whether both uninstall keys already name this directory. The written
    block itself cannot be compared: wine renumbers the section headers."""
    marker = f'"InstallLocation"="{installed.replace(chr(92), chr(92) * 2)}"'
    found = 0
    ours = False
    for line in text.splitlines():
        if line.startswith("["):
            ours = f"Steam App {appid}]" in line
        elif ours and line.startswith(marker):
            found += 1
    return found >= len(UNINSTALL_KEYS)


def without_entry(text: str, appid: str) -> str:
    kept: list[str] = []
    ours = False
    for line in text.splitlines(keepends=True):
        if line.startswith("["):
            ours = f"Steam App {appid}]" in line
        if not ours:
            kept.append(line)
    return "".join(kept)


def replace_registry_entry(system: Path, appid: str, entry: str, text: str) -> None:
    system.write_text(without_entry(text, appid).rstrip("\n") + "\n" + entry, encoding="utf-8")


def seed(game: api.Game, libraries: list[Path]) -> api.PrepareReport:
    """Make the stub Steam inside the prefix lead to the real installation, by
    each of the three routes an installer takes to find a game (see README).

    The files can be written at any time; the registry cannot be written into a
    prefix that is in use, so a seeding that needs it reports the prefix busy
    and leaves the rest in place.
    """
    prefix = Path(game["prefix"])
    if not prefix.is_dir():
        return {"reason": api.PrefixProblem.NO_PREFIX}

    installed = Path(game["path"])
    stub = prefix / STUB_STEAM / "steamapps"
    done: list[str] = []

    drives = drive_map(prefix)
    paths = [p for p in (windows_path(library, drives) for library in libraries) if p]
    if paths:
        index = prefix / STUB_STEAM / "config" / "libraryfolders.vdf"
        content = library_vdf(paths)
        if not index.is_file() or index.read_text(encoding="utf-8", errors="replace") != content:
            index.parent.mkdir(parents=True, exist_ok=True)
            index.write_text(content, encoding="utf-8")
            done.append("libraryfolders.vdf")

    steamapps = installed.parent.parent
    manifest = steamapps / f"appmanifest_{game['appid']}.acf"
    if manifest.is_file() and link(manifest, stub / manifest.name):
        done.append(manifest.name)

    if link(installed, stub / "common" / installed.name):
        done.append(f"common/{installed.name}")

    windows_dir = stub_path(installed)
    system = prefix / REGISTRY_FILE
    if system.is_file():
        text = system.read_text(encoding="utf-8", errors="replace")
        if not registry_matches(text, game["appid"], windows_dir):
            if in_use(Path(game["compat_path"])):
                return {"reason": api.PrefixProblem.IN_USE}
            entry = registry_entry(game["appid"], game["name"], windows_dir)
            replace_registry_entry(system, game["appid"], entry, text)
            done.append("registry")

    return {
        "linked": done,
        "paths": paths,
        "game_dir": str(installed),
        "windows_dir": windows_dir,
    }
