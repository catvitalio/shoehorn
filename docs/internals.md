# Internals

What Shoehorn does behind the panel, and the Steam internals it leans on. None of this is
needed to use the plugin — see the [README](../README.md) for that.

## Running an installer in a game's prefix

Steam will only put a window on screen for something in its own library, so Shoehorn
borrows that machinery instead of fighting it. It registers the installer as a throwaway
non-Steam shortcut whose `STEAM_COMPAT_DATA_PATH` points at **the game's** prefix rather
than one of its own, inherits the compatibility tool the game itself runs under, and
launches it. The installer then runs under the same Proton as the game, writes into the
same prefix, and appears in Gaming Mode like any other title. The shortcut is removed
again when the installer exits.

Finding the game is the other half, and installers do it in at least three different ways,
all of which Proton leaves broken. Before launching, Shoehorn seeds the prefix so each one
works:

- **`config/libraryfolders.vdf`.** Installers read `InstallPath` from the registry, which
  Proton points at a stub Steam under `drive_c`, and look for the library index at the
  path Steam abandoned years ago. Proton writes one only under `steamapps/`.
- **Symlinks in the stub.** Others skip the index and join `InstallPath` with
  `steamapps/common/<installdir>`, which lands inside the stub unless the real directory
  and manifest are linked in.
- **`Uninstall\Steam App <appid>`.** Windows Steam writes an uninstall entry per game with
  its `InstallLocation`; Proton writes none, so an installer that trusts it reports the
  game as missing.

The library index is written with paths taken from that prefix's own drive map rather than
assumed, because `S:` is not the same place in every prefix — sometimes the Steam root,
sometimes `steamapps`, sometimes absent — so the right answer is read from `dosdevices/`.
The registry entry instead points at the stub, `C:\Program Files (x86)\Steam\steamapps\
common\<game>`, which is real inside the prefix thanks to the symlink above: it is the
same path the game would have on Windows, and a mod that stores it in its own config or
uninstaller will still resolve it later.

The shortcut is temporary, so it is cleaned up in two directions. A watcher per shortcut
removes it when its installer exits; one that outlived a plugin reload is adopted on the
next load — still running, so it keeps its library entry — while the rest are removed.

Seeding is also refused rather than attempted when the prefix is in use: wine rewrites
`system.reg` wholesale from memory when its server stops, so an uninstall entry written
while the game is still open is invisible to it and gone afterwards. Proton holds a lock
on `pfx.lock` for exactly as long as that matters, so that is what gets asked.

The installer's language is taken from the language ids on its PE resources, and passed in
as `LANG`/`LC_ALL` so its ANSI strings are decoded with the code page they were written
in. Without it a Russian installer renders as `Íàæìèòå Äàëåå`.

A game's gear menu in the library gains an **Install a mod** entry next to _Properties_.
It opens the Quick Access panel on Shoehorn's page with that game already selected, which
is the same panel reachable from the Decky menu — the entry is a shortcut into it, not a
second flow, so anything the panel learns to install later is reachable from the menu for
free. It only appears for a game that is installed and already has a prefix, which is
exactly when there is somewhere to install into.

## The library context menu

The **Install a mod** entry reaches into Steam's own React tree: the menu class is not
exported, so it is found by a string inside it, and the appid has to be re-read from the
component being rendered rather than the one captured when the patch was installed —
otherwise every game offers the first game's prefix. Each step fails into a no-op, since a
missing menu entry is a far better outcome than a broken library. The entry is anchored on
_Properties_, which is also what tells the gear menu apart from its own _Manage_ submenu:
Steam renders both with the same `Menu` class, so a patch on it fires for both, and the
submenu's entries close over `launchSource` just like the play button does — anchoring on
that instead puts the entry in both places. Opening the panel on our own page is
`DeckyState.setActivePlugin`, the call Decky's own plugin list makes. The technique is
borrowed from [decky-steamgriddb](https://github.com/SteamGridDB/decky-steamgriddb).

Patches on Steam's prototypes outlive the plugin, so every one of them is handed back for
`unpatch` on dismount. One that is forgotten keeps answering with the unloaded plugin's
state, and only a restart of the Steam UI clears it.

## Development

`nix develop` brings the toolchain (node, pnpm, just, rsync, ty, zip).

```sh
export SHOEHORN_HOST=root@steam-machine
export SHOEHORN_PLUGINS=/home/youruser/homebrew/plugins
export SHOEHORN_OWNER=youruser:users

just deploy   # build, rsync, and the plugin reloads itself
just logs     # follow decky-loader
just fmt      # format the frontend, config and docs
just check    # prettier --check and type-check the backend
just bundle   # Shoehorn.zip, the artifact a release carries
```

Decky watches `dist/index.js` and `main.py` and reloads the plugin on change, so `just
deploy` is the whole loop — no service restart. Two things make that work:

- `"debug"` in `plugin.json` flags. Without it the loader logs _"is already loaded and has
  requested to not be re-loaded"_ and does nothing.
- a real directory, not a symlink. The watcher is an inotify watch on the plugins
  directory and does not follow symlinks, so a store path or a symlinked checkout never
  fires.

Avoid `systemctl restart decky-loader` while developing: the unit runs with
`KillMode=process`, so a restart leaves the old plugin process alive, and an orphaned
plugin busy-loops on its dead IPC socket at 100% of a core. Hot reload unloads cleanly.

`dist/index.js` is committed so that packaging is a plain copy and installing needs no
JavaScript toolchain. Rebuild it with `pnpm build` and commit the result with the source.
The source map emitted beside it is not committed — it is thirty times the size of the
bundle and nothing but local devtools reads it.

A release is the zip, published where SteamOS can fetch it by URL:

```sh
just bundle
gh release create v0.1.0 Shoehorn.zip --generate-notes
```

The README points at `releases/latest/download/Shoehorn.zip`, which GitHub resolves to the
newest release's asset, so the install instructions never name a version.

Everything that crosses the RPC boundary is described twice, once per language:
`backend/shoehorn/api.py` as `TypedDict`s and `frontend/api.ts` as interfaces. Nothing
enforces that the two agree, so they are kept side by side and small on purpose — a field
added on one side is meant to be obvious when missing on the other.

The backend is stdlib-only on purpose: Decky runs it under its own interpreter, and
vendored wheels built for another Python's ABI are a reliable way to lose an afternoon.

## Planned work

### Unpacking archives into a game's folder

The easy half, and the original plan: extract a `.zip`/`.7z` over the game directory,
backing up whatever it overwrites so it can be undone. Dropped while the installer path
was being made to work, and worth bringing back.

### Controller navigation inside installers

An installer is an ordinary Windows dialog with no idea a gamepad exists, so today it
needs the trackpad or stick-driven cursor. Game launchers appear to behave better because
they read the gamepad themselves, not because Steam translates anything for them.

What was established while looking into it:

- No stock template does this. Nothing under `Steam/controller_base/` binds `key_press UP`
  or `DOWN` at all — `basicui_gamepad.vdf` ("Official Configuration for Big Picture") binds
  the d-pad to Steam's own UI rather than to keys, and `controller_generic_wasd.vdf` is a
  game layout where the d-pad is `1`/`2`/`3`/`4` and A is `SPACE`.
- So it needs a config of our own, binding d-pad to the arrow keys, A to Enter and B to
  Escape. Inno Setup dialogs respond to those.
- Applying one is `SteamClient.Input.SetSelectedConfigForApp(appId, controllerIndex, url,
…)`. The url forms, read off Steam's own files, are `autosave://<path to vdf>`,
  `workshop://<id>` and `template://<name>.vdf`.
- The selection per app lives in
  `steamapps/common/Steam Controller Configs/<user>/config/configset_controller_<kind>.vdf`,
  keyed by appid, where `<kind>` is the controller family (`8bitdo`, `neptune`, `xboxone`,
  `ps5`, `generic`, …).

The open questions are whether one config written for `controller_generic` covers every
family or a variant is needed per kind, and whether Steam keeps a selection made for a
shortcut that is deleted minutes later.
