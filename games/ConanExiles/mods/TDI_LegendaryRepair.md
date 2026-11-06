# Mod notes — TDI_LegendaryRepair (Workshop 3723127994)

> **Created:** 2026-11-06 11:45 +03:00 · **Parent:** plan 45 step 5, the knowledge-hook lock; facts from `ConanExiles/modpack.json` and the container listed the same day
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Repair kits for legendary and unique items, made by a tier-4 blacksmith or armorer; the «Perfect» kit repairs with no durability loss (one of
the small QoL mods added 2026-10-25; manifest).

## Assets merged into the game's tables

`/Game/Mods/TDI_LegendaryRepair/DataTables/TDI_Legin_TemplateTableProfession` — crafter profession rows, merged into `SpawnTable/ProfessionTemplateDataTable` by
`TDI_LegKit_ProfessionTemplateMergeControll`: it adds its repair-kit recipe to the tier-4 crafters' `BonusRecipes` and writes empty / None in the fields it does
not mean to change (`ThrallTier 0`, `StatTemplate None`) — the game keeps the earlier values there (live 2026-10-26, `ConanExiles/docs/17` item 2: `Armorer_4`
31 bonus recipes = 30 vanilla + 22120501).

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract TDI_LegendaryRepair TDI_Legin_TemplateTableProfession <work>`.

## Open

- plan 45 step 5, judged live 2026-11-06 11:49 +03:00: its repair kit lives in `BonusRecipes` on all 47 tier-4 crafter rows it shares with Ancient Civilization (22120501
  armorers, 22120500 blacksmiths), next to that mod's crafting group — it merges by field (B, nothing to do).
