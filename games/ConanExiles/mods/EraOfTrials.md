# Mod notes — Era of Trials (Workshop 3744562094, Orero; KRINIK MODIFIED)

> **Created:** 2026-11-06 · **Parent:** plan 45 steps 4 and 6, the knowledge-hook lock; facts from `ConanExiles/modpack.json` and bugs/64 item 17
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Vanilla+ religions (version 1.2.1, kit 1002): seven religions with light / medium / heavy armour sets and six-plus weapon kinds each, religious
perks, shrine desecration targets, magic-school icons on «Снаряжение». Taken 2026-10-25: `[OWNER]` «Era of Trials - давай берём, но будет встраивать в сборку так.
чтобы все моды работали корректно» (manifest).

## Assets merged into the game's tables

`EoT_DT_Religious_ItemTable_MergeControl`, `EoT_DT_Religious_Feat_MergeControl`, `EoT_DT_Religious_NPCDialogues_MergeControl`,
`EoT_DT_Religious_SpawnData_MergeControl`, `EoT_DT_Religious_WeightedSpawnTable_Add` (their tables → the game's item, feat, dialogue, spawn tables).

## Our edits — KRINIK MODIFIED

Religious perks in Russian (`EoT_DT_ReligiousPerkData`, 17 perks), shrine desecration places (`EoT_DT_DesecrationTargets`, 47 names); the magic-school icons on
«Снаряжение» injected on the event, not after `Delay 0.1` (bugs/64 item 17, `KrinikPauseGameInMenu` → KrinikConanUI).

## Its tables — two kinds, two merges (listed 2026-11-06 11:41 +03:00, `retoc to-legacy --filter DT_`, 78 tables under `/Game/Mods/EraOfTrials/Systems/DataTables/…`)

- **`*_Merge` + `*_MergeControl`** (`EoT_DT_Religious_ItemTable_Merge` — 1 row, 53501; `EoT_DT_BowCompatableAmmunitions_Merge` — 86 rows, all fields empty
  but `CompatableAmmunitions`; `EoT_DT_Religious_SpawnData_Merge` — 7 dialogue NPCs; `…_Feat_Merge`, `…_NPCDialogues_Merge`, `EoT_DT_ItemStatModificationDisplay_Merge`):
  merged FIELD BY FIELD — empty fields leave the earlier value, arrays are appended (seen live: every bow keeps LegitReligious's ammo list + this mod's arrow
  47210132; Muriela and Yakira keep Heritage's faces and get this mod's vendor class).
- **`*_Add`** (`EoT_DT_Religious_Item_Add` 343 rows, `…_Recipe_Add` 323, `…_SpawnData_Add` 64 priests, `…_Feat_Add`, `…_EquipmentTemplate_Add`, …): whole
  rows — the 5 Zathite dancer recipes live are this mod's rows on all 43 fields (interview #032).

## Open

- 2026-11-06 (plan 45): over LegitReligious_Enhanced — 54 weapons judged B (both kept), 5 recipes C → interview #032; over Heritage — 2 dialogue NPCs B (both kept).
