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

- 2026-11-06 (plan 45): it wins 8 werewolf / werehyena rows of `LootTable_Resource` over Resource Stimulus Package (step 3, A — RSP unchanged). Its merge
  REPLACES WHOLE ROWS (seen live 2026-11-06 11:41 +03:00): on the 7 spawn rows it shares with Bosses My New Besties (`DT_EAA_Spawntable`: Silent Legion warriors 1–3, Siptah
  devolved bird / demon-spider / werewolf bosses, the white tiger; EAA changes only `NpcTags` and `LootTable`) BMNB's recruitability was lost.

## Our edits — the spawn merge (KRINIK MODIFIED, 2026-11-06 11:41 +03:00)

BMNB's `ProfessionTemplate` / `StatTemplate` / `StatModifierTemplate` / `NPCClass` of those 7 rows copied into `DT_EAA_Spawntable` — 21 `copyprop:` lines,
`ConanExiles/_config/krinik_patches/EnhancedArmoryAndArsenal__DT_EAA_Spawntable.tsv`, part of EAA's `krinikBuild`; rebuilt chunk 1 of 1472, live after: both
mods' fields 7/7 (plan 45 step 4).
