# Mod notes — Enhanced Armory and Arsenal (EAA)

> **Created:** 2026-11-06 · **Parent:** plan 45 steps 3–4 (shared rows), the knowledge-hook lock; facts from `ConanExiles/modpack.json` and bug 09
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** A large content mod: weapons, armour, gems, classes, bosses, an extended camera zoom (its `EAA_Zoom_C` — muted by our KrinikConanCamera,
key `mute_foreign_camera`, bug 09), its own Accessory System copy (`ModsShared`, the one the game loads — EXP-0371). KRINIK MODIFIED: the inventory button's
`Delay 1.0` → event-driven (bugs/64 item 17), the Accessory System `Delay 0.2` (manifest `krinikModified`).

## Assets merged into the game's tables (`/Game/Mods/EnhancedArmoryAndArsenal/Datatables/`)

Item tables (`DT_EAA_Itemtable`, `DT_EAA_Omegarte_Itemtable`, `DT_EA_X_DMT_ItemTable`), recipes (`DT_EAA_Recipes`, `DT_EAA_Omegarte_Recipes`), spawns
(`DT_EAA_Spawntable`, `DT_EAA_Omegarte_Spawntable`, `DT_EAA_Siptah_SpawnDataTable`, weighted spawns, `DT_AODSpawner_1…4`), professions, stat templates, resource
stats (`DT_EAA_ResourceStatTable`, `DT_EAA_WeaponTypeResourceStatTable`), loot (`DT_EAA_LootTable_Resource`, Siptah vault boss loot tables).

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract EnhancedArmoryAndArsenal <Table> <work>`.

## Open

- 2026-11-06 (plan 45): it wins 8 werewolf / werehyena rows of `LootTable_Resource` over Resource Stimulus Package (step 3) and 7 boss spawn rows over
  Bosses My New Besties (step 4).
