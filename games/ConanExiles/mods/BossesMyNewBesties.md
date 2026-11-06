# Mod notes — Bosses My New Besties (Nexus 18)

> **Created:** 2026-11-06 · **Parent:** plan 45 step 4, the knowledge-hook lock; facts from `ConanExiles/modpack.json`
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Bosses, minibosses and unique NPCs can be knocked out and recruited as thralls. With the 100-follower limit it loads the game thread — if
stutters come, check this pair first (manifest).

## Assets

`/Game/Mods/BossesMyNewBesties/BMNB_SpawnDataTable` — its spawn rows, merged into the game's `Systems/SpawnTable/SpawnDataTable` (the boss rows it makes
recruitable).

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract BossesMyNewBesties BMNB_SpawnDataTable <work>`.

## Open

- 2026-11-06 (plan 45 step 4): 17 of its boss / elite spawn rows are overwritten by Heritage, 7 by EAA (both load later). Likely different fields (this mod —
  recruitability; Heritage — faces; EAA — its bosses) → a B merge to read field by field.
