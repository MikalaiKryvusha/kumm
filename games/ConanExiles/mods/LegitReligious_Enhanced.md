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
- ~~The shipped vanilla `Items/ItemStatModificationTable`~~ — judged 2026-11-06 12:09 +03:00 (plan 45 step 8): a STALE copy (1 653 rows, values = 3.0.1, none of its own), 51 rows of
  3.0.1 missing (Derketo Acolyte set, Anvil Keeper armour) — live 0/51. No other mod ships the path.

## Our edits — KRINIK MODIFIED (2026-11-06 12:09 +03:00)

The `ItemStatModificationTable` chunk is replaced by the GAME's own version at every build: `_config/krinik_patches/LegitReligious_Enhanced__ItemStatModificationTable.tsv`
= `vanilla:` (a `patch-mod-asset.py` operation), `krinikBuild` with `PATCH_VIEW` (the shared view held the game's copy of the same path — the to-zen guard caught
it). Live after: 51/51, total 3 404 rows. Original: `_patch-originals/LegitReligious_Enhanced.pak`; library copy `_krinik-modified/3720748663`.
Rebuilt on 3.1.0 2026-11-13 21:2x (`rebuild-krinik-paks.py --only LegitReligious_Enhanced --against-original --install`): the installed table = the 3.1.0 game's 1 725 rows
(3.0.1 had 1 704); the author's original lacks 72 of them — `ConanExiles/_config/stale-copy-check.py LegitReligious_Enhanced Items/ItemStatModificationTable`. In game — not
seen on 3.1.0 yet (`live-rows.lua`).
