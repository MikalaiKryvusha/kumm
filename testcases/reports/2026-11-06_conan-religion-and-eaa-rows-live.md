# Test run report — religious weapons and recipes (LegitReligious / Era of Trials), EAA and dialogue spawn rows (plan 45 steps 4 and 6)

**Created:** 2026-11-06 11:40 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.0.1 working install; pack `ConanExiles` after `da05197`
(EAA rebuilt with the spawn merge for run 4)

## 1. Work

Plan 45: the 54 item rows and 5 recipe rows LegitReligious_Enhanced and Era of Trials both write (step 6); the 7 spawn rows BMNB and EAA both write and the 2
dialogue NPCs Heritage and Era of Trials both write (rest of step 4). Cases R0, R1, E0, E1, D0 of `testcases/TC_conan_boss_recruit_heritage_bmnb_2026-11-06.md`.

## 2. Contour

Live game tables after a world start, read by the remote with `_config/live-rows.lua` against each mod's own table; field lists from offline `row-diff.py`
over the vanilla tables (`retoc to-legacy` + `uaj tojson`) and the mods' tables (`patch-mod-asset.py extract`). Background path, machine lock held.
REAL WORLD: accumulated — the owner's working install and save; data and machine — his; path — the game's own load of the shipped paks.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-06 11:26 +03:00 | `live-rows.lua` on `Items/ItemTable` 54 rows, fields WeaponStamina×2, ItemContainerSize, RepairItem3, LongDesc, CompatableAmmunitions vs `LegitReligiousItemTable` | 0 · five fields SAME 54/54; ammo DIFF 54 = LR's list + Era of Trials' 47210132 on every row (checked by script) |
| 2 | 2026-11-06 11:28 +03:00 | `live-rows.lua` on `RecipesTable` 52645–52648, 52659, all 43 fields, vs LR and vs `EoT_DT_Religious_Recipe_Add` | 0 · live = Era of Trials' row on 43/43 fields ×5; LR's change (ingredient 2 quantity 0 → 5) absent |
| 3 | 2026-11-06 11:33 +03:00 | `live-rows.lua` on `SpawnDataTable` 7 rows vs BMNB (4 fields) and vs `DT_EAA_Spawntable` (NpcTags, LootTable); 2 dialogue rows vs Heritage / `EoT_DT_Religious_SpawnData_Merge`; `ru_names.lua` | 0 · BMNB's fields LOST on the 7 (live = vanilla values of EAA's row); EAA's SAME 7/7; the 2 NPCs SAME to both mods; Russian names read |
| 4 | 2026-11-06 11:35 +03:00 | `python -I -X utf8 _config/devkit/rebuild-krinik-paks.py --only EnhancedArmoryAndArsenal --expect-changed DT_EAA_Spawntable --install` | 1 · UAssetGUI wrote no asset — the copied `…_Warrior_1` names lacked their FName base in the name map; fixed in `patch-mod-asset.py` |
| 5 | 2026-11-06 11:36 +03:00 | the same command again | 0 · 1472 chunks identical, 1 changed on purpose (DT_EAA_Spawntable); installed |
| 6 | 2026-11-06 11:39 +03:00 | run 3's 7-row reads again with the merged EAA | 0 · BMNB's 4 fields SAME 7/7; EAA's NpcTags, LootTable SAME 7/7 |
| 7 | 2026-11-06 11:48 +03:00 | `live-rows.lua` on `ProfessionTemplateDataTable` 47 rows vs `TDI_Legin_TemplateTableProfession` (CraftingGroups, BonusRecipes, ThrallGroup) + a count of both mods' ids in the live lists | 0 · Ancient Civilization's group 47/47, TDI's kit 47/47; ThrallGroup «Crafter» 47/47 (plan 45 step 5) |

## 4. Checks

Hygiene: `row-diff.py` over the saved JSONs (54 items, 5 recipes, 7 + 2 spawn rows) — field lists per row; the build's own guards (to-zen control chunk byte-identical,
rows re-read after write).
Functional run: walked — the game's world load with the shipped paks; read — the live table values in the remote's replies (runs 1–3, 6).

| Case | Status | Observed |
|---|---|---|
| R0 | pass | 54 religious weapons: LegitReligious's stamina costs, container size, repair item, description live on 54/54; every bow's ammo list = LR's list + Era of Trials' arrow 47210132 — both mods kept (Era of Trials' `*_Merge` merges by field) |
| R1 | pass (a reading) | 5 Zathite dancer recipes = Era of Trials' rows on all 43 fields; LR's ingredient fix not applied — outcome C, interview #032 |
| E0 | fail → fixed | before: the 7 rows (Silent Legion ×3, Siptah devolved bird / spider / werewolf, white tiger) carried vanilla `StatTemplate` / `StatModifierTemplate` and vanilla `ProfessionTemplate` or `NPCClass` — not recruitable as BMNB means; EAA replaces whole rows |
| E1 | pass | after the merge (`EnhancedArmoryAndArsenal__DT_EAA_Spawntable.tsv`, 21 `copyprop:`): BMNB's 4 fields SAME 7/7, EAA's tags and loot SAME 7/7 |
| D0 | pass | Muriela the Artisan, Yakira: Heritage's faces and Era of Trials' vendor class both live |
| P0 | pass | 47 tier-4 crafters: both appends live (Ancient Civilization 3780759 / 3780751, TDI 22120501 / 22120500); Ancient Civilization's «Warrior» thrall group not applied — vanilla «Crafter» |

## 5. Found

- BMNB's recruitability was lost on 7 boss rows under EAA — merged natively into EAA's spawn table (KRINIK MODIFIED, pack commit of this run).
- The merge rule is decided by the LATER mod's way of merging, not by the table: in the same spawn table Heritage merges by field, EAA replaces whole rows
  (EXP-0458 widened; the guide, its Russian copy, the game map and `row-diff.py` corrected).
- `patch-mod-asset.py` `copyprop:` did not add an FName with a numeric suffix (`…_Warrior_1` is stored as base `…_Warrior` + number) — fixed.
- The 5 Zathite dancer recipes — outcome C, the owner's choice (interview #032).

## 6. Traces

`D:\Temp\claude\2979a53d4df93a2f\b28e2269-24c2-4684-94d1-c5c83312e18c\scratchpad\r0.txt` (54 items), `rec_eot.txt`, `rec_LegitReligiousRecipeTable.txt`, `rec_diff.txt`,
`eaa_diff.txt`, `rebuild-eaa.log`, `rebuild-eaa2.log`; `UE4SS.log` lines `[KrinikAgentRemote]` 11:25–11:40.

## 7. Verdict

pass — 54 + 2 rows carry both mods' changes; the 7 EAA boss rows merged and seen live; the 5 recipes wait for the owner (C). Not covered: knocking a boss
out and recruiting him in play (BMNB's function).
