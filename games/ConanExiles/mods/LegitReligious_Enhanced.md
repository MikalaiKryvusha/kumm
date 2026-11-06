# Mod notes — LegitReligious / Legit Religious Enhanced (Workshop 3720748663)

> **Created:** 2026-11-06 · **Parent:** plan 45 step 6, the knowledge-hook lock; facts from `ConanExiles/modpack.json` and the container listed 2026-11-06 11:20 +03:00
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Makes religion matter: epic religious armour variants and several weapon kinds for most religions, crafted at the religious altars, the
recipes unlocked by the religion's blessing feat (the owner's pick of 2026-09-09; manifest). The manifest's risk line says «vanilla items are not rewritten» —
NOT true as read below: it re-declares vanilla item rows and ships a vanilla table whole.

## Assets (container `LegitReligious_Enhanced-Windows`, 9 assets, `retoc to-legacy` 2026-11-06 11:20 +03:00)

| Asset | What |
|---|---|
| `/Game/Mods/LegitReligious_Enhanced/BP_LegitReligiousModController` | the mod controller (merges the tables below) |
| `…/LegitReligiousItemTable` | its item rows → the game's `Items/ItemTable` (54 rows shared with Era of Trials, which loads later) |
| `…/LegitReligiousRecipeTable` | recipes → `Items/Recipes/RecipesTable` (5 rows shared with Era of Trials) |
| `…/LegitReligiousFeatTable` | feats (the blessing unlocks) |
| `…/LegitReligiousStatModificationTable`, `…/LegitReligiousVariationTable` | item stat modifications, item variations |
| **`/Game/Items/ItemStatModificationTable`** | a VANILLA asset path — the whole game table shipped in the pak (overlap kind 3, assets: whoever else ships it loses or wins whole) |

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract LegitReligious_Enhanced <Asset> <work>` → JSON.

## Open

- 2026-11-06 (plan 45 step 6), judged live 2026-11-06 11:41 +03:00: the 54 item rows are vanilla bows and religious weapons this mod re-declares with its own stamina costs,
  container size, repair item, descriptions and ammo list — all live 54/54; Era of Trials only appends its arrow 47210132 to the ammo (its `*_Merge` merges by
  field). The 5 Zathite dancer recipes: this mod fixes the vanilla «Venom-purified blood» ×0 to ×5; Era of Trials' redesign replaces the rows whole — the
  owner's choice, interview #032.
- The shipped vanilla `Items/ItemStatModificationTable` — check whether another mod of the build ships the same path (`mod-overrides.py`, plan 45 step 8).
