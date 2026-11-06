# Mod notes — Storage Reach Expanded (Workshop 3733835102)

> **Created:** 2026-11-06 12:16 +03:00 · **Parent:** plan 45 step 8, the knowledge-hook lock; facts from `ConanExiles/modpack.json` and the table check the same day
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Raises the three «build and craft from chests» radii from the vanilla 4 000 to 15 000 (`BuildFromStorageRadius` and the two craft radii; the
owner's pick of 2026-09-09; manifest). Its console commands `SRE.show`, `SRE.reset`, `SRE.set` (actor `/Game/Mods/StorageReachExpanded/Local/BP_SRE_DataCmd_*`).

## Assets

- **`/Game/Systems/Cheats/CustomConsoleCommandsDataTable`** — a VANILLA table shipped whole (override matrix 2026-11-06 12:16 +03:00): 23 rows = 20 game rows unchanged + its
  3 `SRE.*`; the 5 console commands of 3.0.1 (`LoadoutGranter`, `SetDurability`, `Grimoire`, `GrimoireEldritch`, `Corruption`) missing — a stale copy.

## Our edits — KRINIK MODIFIED (2026-11-06 12:21 +03:00)

`CustomConsoleCommandsDataTable` is rebuilt at every build as the GAME's table + this mod's 3 rows: `_config/krinik_patches/StorageReachExpanded__CustomConsoleCommandsDataTable.tsv`
= `vanilla+own:`, `krinikBuild` with `PATCH_VIEW`. Live: the 5 commands of 3.0.1 and the 3 `SRE.*` present. Original `_patch-originals/StorageReachExpanded.pak`,
library copy `_krinik-modified/3733835102`.

## Open

- none.
