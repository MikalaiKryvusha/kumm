# Mod notes — Resource Stimulus Package (Nexus 34)

> **Created:** 2026-11-06 · **Parent:** plan 45 step 3 (shared rows with EAA), the knowledge-hook lock; facts from `ConanExiles/modpack.json`
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** More resources from gathering: stones give iron, crystal and brimstone; iron veins — crystal and ice; corpses drop more. 32 KB, edits of the
loot tables only. It CONTAINS Stone Drop Brimstone (Nexus 10) — that one is not taken separately, or two mods would fight over the same tables (manifest).

## Assets (`ResourceStimulusPackage-Windows.utoc`, `/Game/Mods/ResourceStimulusPackage/`)

`ResourceStimulusPackage_LRT` (its loot-resource table, merged into the game's `Systems/Survival/Gathering/Gathering_v2/LootTable_Resource`),
`ResourceStimulusPackage_MC` (the mod controller), `preview`.

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract ResourceStimulusPackage ResourceStimulusPackage_LRT <work>`.

## Open

- 2026-11-06: 8 werewolf / werehyena rows of `LootTable_Resource` are also written by Enhanced Armory and Arsenal, which loads later and wins (plan 45 step 3).
  Read (`row-diff.py`): this mod's `ResourceStimulusPackage_LRT` carries those 8 rows EQUAL to the game's — nothing of it is lost; outcome A.
