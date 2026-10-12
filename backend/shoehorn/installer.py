import locale
import struct
import threading
from collections import Counter
from pathlib import Path

from shoehorn import api

LOCALE_CANDIDATES = (
    "ru_RU",
    "uk_UA",
    "en_US",
    "en_GB",
    "de_DE",
    "fr_FR",
    "es_ES",
    "it_IT",
    "pl_PL",
    "pt_BR",
    "cs_CZ",
    "tr_TR",
    "ja_JP",
    "ko_KR",
    "zh_CN",
    "zh_TW",
)

RESOURCE_LOCALES = {
    0x0404: "zh_TW",
    0x0405: "cs_CZ",
    0x0407: "de_DE",
    0x0409: "en_US",
    0x040A: "es_ES",
    0x040C: "fr_FR",
    0x0410: "it_IT",
    0x0411: "ja_JP",
    0x0412: "ko_KR",
    0x0415: "pl_PL",
    0x0416: "pt_BR",
    0x0419: "ru_RU",
    0x041F: "tr_TR",
    0x0422: "uk_UA",
    0x0804: "zh_CN",
    0x0809: "en_GB",
    0x0816: "pt_PT",
}

PRIMARY_LANGUAGE_MASK = 0x3FF

DOS_PE_POINTER = 0x3C
PE_SECTION_COUNT = 4 + 2
PE_OPTIONAL_SIZE = 4 + 16
PE_OPTIONAL_HEADER = 4 + 20
PE32_MAGIC = 0x10B
PE32_DIRECTORY_TABLE = 96
PE64_DIRECTORY_TABLE = 112
RESOURCE_DIRECTORY = 2 * 8
SECTION_HEADER = 40
SECTION_ADDRESSES = 8
SECTION_RAW_OFFSET = 20
DIRECTORY_COUNTS = 12
DIRECTORY_HEADER = 16
DIRECTORY_ENTRY = 8
SUBDIRECTORY = 0x80000000
SUBDIRECTORY_OFFSET = 0x7FFFFFFF
LANGUAGE_LEVEL = 3

PRIMARY_LOCALES = {
    0x04: "zh_CN",
    0x05: "cs_CZ",
    0x07: "de_DE",
    0x09: "en_US",
    0x0A: "es_ES",
    0x0C: "fr_FR",
    0x10: "it_IT",
    0x11: "ja_JP",
    0x12: "ko_KR",
    0x15: "pl_PL",
    0x16: "pt_BR",
    0x19: "ru_RU",
    0x1F: "tr_TR",
    0x22: "uk_UA",
}


_probed: list[str] | None = None
_probe_lock = threading.Lock()


def available_locales() -> list[str]:
    """Which UTF-8 locales glibc can set, asked once because the probe moves
    the process-wide locale to find out. The answer changes only when the
    system is rebuilt, which restarts the plugin anyway."""
    global _probed
    with _probe_lock:
        if _probed is None:
            _probed = probe_locales()
    return _probed


def probe_locales() -> list[str]:
    previous = locale.setlocale(locale.LC_CTYPE)
    found: list[str] = []
    try:
        for name in LOCALE_CANDIDATES:
            candidate = f"{name}.UTF-8"
            try:
                locale.setlocale(locale.LC_CTYPE, candidate)
            except locale.Error:
                continue
            found.append(candidate)
    finally:
        locale.setlocale(locale.LC_CTYPE, previous)
    return found


def resource_languages(data: bytes) -> Counter[int]:
    """The language ids stamped on a PE file's resources, which is the only
    reliable statement a binary makes about the code page of its ANSI text."""
    found: Counter[int] = Counter()
    if data[:2] != b"MZ":
        return found

    header = struct.unpack_from("<I", data, DOS_PE_POINTER)[0]
    if data[header : header + 4] != b"PE\0\0":
        return found

    section_count = struct.unpack_from("<H", data, header + PE_SECTION_COUNT)[0]
    optional_size = struct.unpack_from("<H", data, header + PE_OPTIONAL_SIZE)[0]
    optional = header + PE_OPTIONAL_HEADER
    is_pe32 = struct.unpack_from("<H", data, optional)[0] == PE32_MAGIC
    directories = optional + (PE32_DIRECTORY_TABLE if is_pe32 else PE64_DIRECTORY_TABLE)
    rva = struct.unpack_from("<I", data, directories + RESOURCE_DIRECTORY)[0]
    if not rva:
        return found

    base = None
    sections = optional + optional_size
    for index in range(section_count):
        entry = sections + index * SECTION_HEADER
        virtual_size, virtual_address = struct.unpack_from("<II", data, entry + SECTION_ADDRESSES)
        raw = struct.unpack_from("<I", data, entry + SECTION_RAW_OFFSET)[0]
        if virtual_address <= rva < virtual_address + max(virtual_size, 1):
            base = raw + (rva - virtual_address)
            break
    if base is None:
        return found

    def walk(offset: int, level: int) -> None:
        if level > LANGUAGE_LEVEL or offset + DIRECTORY_HEADER > len(data):
            return
        named, numbered = struct.unpack_from("<HH", data, offset + DIRECTORY_COUNTS)
        for index in range(named + numbered):
            entry = offset + DIRECTORY_HEADER + index * DIRECTORY_ENTRY
            if entry + DIRECTORY_ENTRY > len(data):
                return
            name, child = struct.unpack_from("<II", data, entry)
            if child & SUBDIRECTORY:
                walk(base + (child & SUBDIRECTORY_OFFSET), level + 1)
            elif level == LANGUAGE_LEVEL and not name & SUBDIRECTORY:
                found[name] += 1

    walk(base, 1)
    return found


def detect_locale(path: Path) -> api.LocaleReport:
    try:
        data = path.read_bytes()
    except OSError:
        return {"locale": None}

    installed = available_locales()
    for language, _ in resource_languages(data).most_common():
        if not language:
            continue
        name = RESOURCE_LOCALES.get(language) or PRIMARY_LOCALES.get(
            language & PRIMARY_LANGUAGE_MASK
        )
        if not name:
            continue

        wanted = f"{name}.UTF-8"
        available = wanted in installed
        return {
            "language": f"0x{language:04X}",
            "locale": wanted if available else None,
            "missing": None if available else wanted,
        }
    return {"locale": None}


def describe(path: Path) -> api.PathInfo:
    return {
        "name": path.name,
        "parent": str(path.parent),
        "is_file": path.is_file(),
        "is_dir": path.is_dir(),
    }
