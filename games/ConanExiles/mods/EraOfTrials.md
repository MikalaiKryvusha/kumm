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

## Open

- 2026-11-06 (plan 45): wins 54 item + 5 recipe rows over LegitReligious_Enhanced (step 6) and 2 dialogue-NPC spawn rows over Heritage (step 4).
