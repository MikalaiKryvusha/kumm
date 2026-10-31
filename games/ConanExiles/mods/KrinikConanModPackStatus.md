# Mod notes — KrinikConanModPackStatus (ours: the build's health line in the main menu)

> **Created:** 2026-10-31 · **Parent:** the rename `ConanModPackStatus` → `KrinikConanModPackStatus` (`[OWNER]` «Наши моды начинаются отныне с Krinik» · names
> «KrinikConanCamera + KrinikConanModPackStatus» · 2026-10-31 16:3x; HOUSE_RULES rule 19); written from the mod's header (`Scripts/main.lua`) and the manifest
> **Status:** living notes — the ONE place for this mod's internals (no notes file before the rename)
> **Outbound:** —

**What it is.** A Lua mod (UE4SS): a line in the main menu that answers «is my build alive?» — its presence proves the UE4SS Lua loader runs, its text says how
many of the build's pak mods the game mounted (read from the game's own `ConanSandbox.log` mount lines, never by scanning engine objects). It also sets up the
main menu (the HUD scale, the news frame, the offline-play window) by its `config.lua`.

## Where things are

- Source `ConanExiles/_unpacked/KrinikConanModPackStatus/` (until 2026-10-31 `_unpacked/ConanModPackStatus/`) → game `ue4ss/Mods/KrinikConanModPackStatus`.
- `Scripts/main.lua` (`MOD_NAME = "KrinikConanModPackStatus"`, log prefix `[KrinikConanModPackStatus]`), `config.lua` (12.9 KB live; the owner's live copy carried
  over at the rename, byte-equal).
- History in the header: the first version (2026-09-08) crashed the game by constructing a TextBlock — the mod now only changes the text of an existing label.

## Checks

- In game 2026-10-31 16:41: «[KrinikConanModPackStatus] СБОРКА: моды 66/66 (эталон 66 модов)».
