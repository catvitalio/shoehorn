# Shoehorn

Install mods and fan translations into your Steam games without leaving Gaming Mode.

A mod or a fan translation almost always arrives as a Windows `setup.exe` that wants to
write into the game's own folder. On a Steam Deck that normally means switching to Desktop
Mode, hunting down the game's Proton prefix and running the installer by hand. Shoehorn
does it from the couch: pick the game, pick the installer, press Run. The installer opens
on screen like any other game, writes into that game's files, and gets out of your library
as soon as you close it.

It is a plugin for [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader).

## What you need

- Decky Loader.
- The game installed — and launched at least once, so that Steam has created the Windows
  environment the mod has to go into.
- The installer itself, downloaded somewhere on the machine.

## Using it

Open a game in your library, press the gear button and pick **Install a mod**. The same
thing lives in the Quick Access menu under the plug icon, where you can also choose any
installed game from a list.

1. **Choose .exe** — browse to the installer you downloaded.
2. **Run** — it opens as a window, like a game would.
3. Install as you would on Windows. The installer finds the game on its own; the folder it
   offers you is the real one.
4. Close the installer when it is done. Shoehorn removes the temporary library entry it
   made for it.

Non-Steam games added to your library work too, as long as Steam runs them through Proton.

The plugin follows your SteamOS language, and it also reads the language the installer was
written for, so a Russian or Chinese installer shows readable text instead of garbled
characters — provided your system has that language installed. If it does not, Shoehorn
says so rather than leaving you guessing.

If the game is still running, Shoehorn will ask you to close it first: anything written
into a game's Windows environment while it is open gets thrown away when it exits.

## Install

### SteamOS

In Gaming Mode open the Quick Access menu, go to the Decky tab, press the gear and turn on
**Developer mode**. A **Developer** tab appears; use its **Install from URL** with this
address:

```
https://github.com/catvitalio/shoehorn/releases/latest/download/Shoehorn.zip
```

Decky downloads and unpacks it, and Shoehorn shows up in the plugin list. If you would
rather handle the file yourself, take the same zip from the
[releases page](https://github.com/catvitalio/shoehorn/releases), put it on the Deck and
use **Install Plugin from ZIP File**, or unpack it by hand:

```sh
unzip Shoehorn.zip -d ~/homebrew/plugins
sudo systemctl restart plugin_loader
```

### NixOS

The flake exposes the built plugin as `packages.<system>.default`, so it can be linked into
Decky's plugin directory declaratively:

```nix
{
  inputs.shoehorn.url = "github:catvitalio/shoehorn";

  systemd.tmpfiles.rules = [
    "L+ ${config.jovian.decky-loader.stateDir}/plugins/Shoehorn - - - - ${inputs.shoehorn.packages.${pkgs.stdenv.hostPlatform.system}.default}"
  ];
}
```

`flake.lock` pins the version, and `nix flake update` moves it.

## Under the hood

How the installer ends up inside the game's Proton prefix, and the Steam internals that
make it possible: [docs/internals.md](docs/internals.md). It also covers the development
loop, if you want to change something.

## License

MIT
