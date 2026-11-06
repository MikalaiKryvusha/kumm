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
| 54 | `Items/ItemTable` | LegitReligious_Enhanced → EraOfTrials | two religion mods over the same vanilla religious items — whose item stats and names stand |
| 47 | `SpawnTable/ProfessionTemplateDataTable` | Asghaard_Ancient_Civilization → TDI_LegendaryRepair | armorer templates: Asghaard's edits lost to TDI's |
| 17 | `SpawnTable/SpawnDataTable` | BossesMyNewBesties → Heritage | boss / elite spawn rows: Heritage's version stands |
| 8 | `Gathering_v2/LootTable_Resource` | ResourceStimulusPackage → EnhancedArmoryAndArsenal | werewolf / werehyena harvest loot: EAA's stands, RSP's boost lost there |
| 7 | `SpawnTable/SpawnDataTable` | BossesMyNewBesties → EnhancedArmoryAndArsenal | Siptah / Black Pool bosses |
| 5 | `Items/Recipes/RecipesTable` | LegitReligious_Enhanced → EraOfTrials | religious recipes |
| 2 | `SpawnTable/SpawnDataTable` | Heritage → EraOfTrials | dialogue NPCs Muriela, Yakira |
| 2 | `UI/Data/DataTables/DT_UIModuleTable` | ProximityParty → Simple_Minimap (→ LLHighlight → AlMerayah_Reborn) | Xevyr's shared rows `XCS_Panel`, `Xev_MouseInteraction` — one author's own family, most likely identical |
| 1 | `Items/ItemTable` · 51420 | SevereWeatherEnhanced → Mines_of_Set | one item id claimed by two unrelated mods — the likeliest real clash |

## Next

1. Item 51420: read both mods' rows (which item each means) — a real id clash if they differ.
2. The 54 + 5 religious rows: compare LegitReligious and EraOfTrials values for a few rows — identical or a lost change.
3. Asghaard → TDI (47) and RSP → EAA (8): what each side changes in the row; decide the order or a merged row (native, `HOUSE_RULES.md` rule 8).
