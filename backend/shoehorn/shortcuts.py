import re
from pathlib import Path

from shoehorn import api, library

OURS = "Shoehorn: "
APPID = re.compile(rb"\x02appid\x00(....)")
APPID_MASK = 0xFFFFFFFF


def field(chunk: bytes, key: bytes) -> str:
    found = re.search(rb"\x01" + key + rb"\x00([^\x00]*)\x00", chunk)
    return found.group(1).decode("utf-8", "replace").strip('"') if found else ""


def entries(home: Path) -> list[api.Shortcut]:
    """Every non-Steam library entry. Each is cut at the next one's appid, so a
    field Steam left out reads as empty instead of as its neighbour's."""
    root = library.steam_root(home)
    if root is None:
        return []

    found: list[api.Shortcut] = []
    for path in (root / "userdata").glob("*/config/shortcuts.vdf"):
        blob = path.read_bytes()
        marks = list(APPID.finditer(blob))
        for index, match in enumerate(marks):
            end = marks[index + 1].start() if index + 1 < len(marks) else len(blob)
            chunk = blob[match.start() : end]
            found.append(
                {
                    "appid": str(int.from_bytes(match.group(1), "little", signed=False)),
                    "name": field(chunk, b"AppName"),
                    "exe": field(chunk, b"Exe"),
                    "start_dir": field(chunk, b"StartDir"),
                    "launch_options": field(chunk, b"LaunchOptions"),
                }
            )
    return found


def games(home: Path) -> list[api.Game]:
    """Games added to Steam by hand or by another launcher. One whose target is
    a launcher rather than the game names no game directory, and is left out."""
    found: list[api.Game] = []
    for entry in entries(home):
        name = entry["name"]
        if not name or name.startswith(OURS):
            continue

        compat = library.compat_dir(home, entry["appid"])
        if compat is None or not (compat / "pfx").is_dir():
            continue

        executable = Path(entry["exe"])
        if entry["start_dir"]:
            installed = Path(entry["start_dir"])
        elif executable.suffix.lower() == ".exe":
            installed = executable.parent
        else:
            continue
        if not installed.is_dir():
            continue

        found.append(
            {
                "appid": entry["appid"],
                "name": name,
                "path": str(installed),
                "prefix": str(compat / "pfx"),
                "compat_path": str(compat),
                "has_prefix": True,
            }
        )
    return found


def ours(home: Path) -> list[int]:
    """Shortcuts this plugin created and did not get to clean up: the watcher
    that removes one when its installer exits does not survive a reload."""
    return [int(entry["appid"]) for entry in entries(home) if entry["name"].startswith(OURS)]


def find(home: Path, appid: int) -> api.Shortcut | None:
    """What Steam stored for a shortcut, read back from its own file."""
    wanted = str(appid & APPID_MASK)
    for entry in entries(home):
        if entry["appid"] == wanted:
            return entry
    return None
