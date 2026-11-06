# Research 01 — rows of the game's data tables written by two or more mods of the Conan 3.0.1 build

> **Created:** 2026-11-06 · **Parent:** the owner's question 2026-11-06 09:27 («у нас есть инструмент, который подсветил Warning, что 2 или более модов писанули в
> одну строку?»); the build's acceptance criterion 2 (`MASTER_PLAN.md`: no row where a mod silently loses its change)
> **Status:** 🔬 found 2026-11-06 09:31 +03:00 — 143 shared rows listed, none judged yet
> **Outbound:** the owner — which shared rows are intended (Xevyr's mods share UI rows by design) and which are losses

## How it was read

`python -X utf8 ConanExiles/_config/who-overwrites-table.py --shared-rows` over `ConanSandbox.log` of a world start of the build (2026-11-06 09:29; the trial
start also carried Northern Timber, which shares no row). The game logs only OVERWRITES of an existing row: a row ADDED by mod A and then overwritten by B
appears as B alone — the list below is a lower bound. The last mod in a chain wins the row (load order of `modlist.txt`).

Full list: `shared_rows_2026-11-06.txt` (143 rows).

## Summary

| Rows | Table | Chain (the last one wins) | First reading |
|---:|---|---|---|
| 54 | `Items/ItemTable` | LegitReligious_Enhanced → EraOfTrials | judged 2026-11-06 (live): vanilla bows and religious weapons — LegitReligious's stats live 54/54, Era of Trials only appends its arrow to the ammo; both kept (`mod-reconciliation/REGISTER.md`) |
| 47 | `SpawnTable/ProfessionTemplateDataTable` | Asghaard_Ancient_Civilization → TDI_LegendaryRepair | armorer templates — first reading «Asghaard's edits lost» NOT confirmed: TDI merges by field on `Armorer_4` (2026-10-26, `ConanExiles/docs/17`); the 47 rows wait for a live check (plan 45 step 5) |
| 17 | `SpawnTable/SpawnDataTable` | BossesMyNewBesties → Heritage | boss / elite spawn rows: Heritage merges by field — live, both mods' changes stand (BMNB's recruitability + Heritage's races, 17 of 17; judged 2026-11-06 11:16 +03:00, `mod-reconciliation/REGISTER.md`). Corrected: «Heritage's version stands» read the log's «overwriting» as a whole-row win |
| 8 | `Gathering_v2/LootTable_Resource` | ResourceStimulusPackage → EnhancedArmoryAndArsenal | werewolf / werehyena harvest loot — judged A: RSP re-declares the rows unchanged, nothing lost (corrected: «RSP's boost lost» was the first reading) |
| 7 | `SpawnTable/SpawnDataTable` | BossesMyNewBesties → EnhancedArmoryAndArsenal | Siptah / Black Pool bosses — judged live: EAA replaces whole rows, BMNB's recruitability was lost → merged into EAA's table, both live 7/7 |
| 5 | `Items/Recipes/RecipesTable` | LegitReligious_Enhanced → EraOfTrials | the 5 Zathite dancer recipes — C (Era of Trials' redesign stands whole; LegitReligious's fix of a vanilla zero lost) → interview #032 |
| 2 | `SpawnTable/SpawnDataTable` | Heritage → EraOfTrials | dialogue NPCs Muriela, Yakira — judged live: both kept (Heritage's faces, Era of Trials' vendor class) |
| 2 | `UI/Data/DataTables/DT_UIModuleTable` | ProximityParty → Simple_Minimap (→ LLHighlight → AlMerayah_Reborn) | Xevyr's shared rows `XCS_Panel`, `Xev_MouseInteraction` — one author's own family, most likely identical |
| 1 | `Items/ItemTable` · 51420 | SevereWeatherEnhanced → Mines_of_Set | NOT two items under one id (corrected 2026-11-06 09:34 +03:00): 51420 is a VANILLA armour piece (armour 38, tier 5, durability 660) that both mods re-declare — Severe Weather's `LFS_ItemTable` holds 15 vanilla ids, Mines of Set's item table re-declares the Grey One set 51420–51424; the fields each changes against vanilla decide the case (`RESOLUTION_GUIDE.md`) |

## Next

Done 2026-11-06 except: Asghaard → TDI (47) — a live check by `_config/live-rows.lua` (plan 45 step 5); the 5 recipes — the owner (interview #032). The log's
«overwriting» never says whether a row was replaced whole or merged by field — that is the later mod's own way, seen only live (`mod-reconciliation/GUIDE.md`).
