# Mod notes — Severe Weather Enhanced (Workshop 3721071602)

> **Created:** 2026-11-06 · **Parent:** the shared-rows check of the build (`researches/conan-table-conflicts/`), the knowledge-hook lock
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Weather by climate: temperature, its own storms (replaces the vanilla sandstorm lightning), dark dungeons, a physical sky light; half of the look
stands on fog (the build runs `r.Fog=1` for it). Settings — console `dc SW_config <word>`. Taken 2026-10-25 by `[OWNER]` «по моду погоды - ставим, попродуем
сразу с настройками тумана, как у него задано» (verbatim in `ConanExiles/modpack.json`, its `$comment`).

## Assets (inner container `SevereWeatherEnhanced-Windows.utoc`, `/Game/Mods/SevereWeatherEnhanced/`)

`DataTables/LFS_ItemTable` + `LFS_ItemTable_MergeController` (its items, merged into the game's `Items/ItemTable`), `SW_CMD` + `SW_CMD_MergeController`,
`SW_EnergyEventTable`, `SW_EnergyEventTableRP`, `SW_WeatherConditionsTable`; controller `SW_ModController`.

## Our edits — KRINIK MODIFIED

- `SW_ModController` «light enabled» True → False: at night the game's own light, not the mod's (`[OWNER]` 2026-10-26 «исплавляем его ночное освещение.
  возвращаем ваниль»). Recipe: `ConanExiles/_config/localization/asset-strings/SevereWeatherEnhanced__SW_ModController.tsv`, `patch-mod-asset.py build`;
  the library copy `_krinik-modified/3721071602`.

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract SevereWeatherEnhanced <Asset> <work>` → legacy + JSON.

## Open

- 2026-11-06: the item row `51420` of `Items/ItemTable` is written by this mod AND by Mines of Set (Caverns of Set) — the later one (Mines of Set) wins;
  being judged by `researches/mod-reconciliation/GUIDE.md`. Read 2026-11-06 09:37 +03:00 (`patch-mod-asset.py extract SevereWeatherEnhanced LFS_ItemTable`): `LFS_ItemTable`
  holds 15 rows, ALL vanilla item ids (51420, 52011, 91005, 52071, 52076, 52541, 91040, 52603, 52649, 52654, 52935, 95090, 95105, 91320, 51378) — the mod
  re-declares vanilla items (most likely their temperature modifiers: row 51420 carries `FirstModifier` = its own text key `LFS_ItemTable_51420_FirstModifier`);
  row 51420 = armour 38, `ArmorType` 10, tier 5, durability 660, weight 7.09, repair items 12516 ×10 and 14152 ×5. Next: the vanilla row and Mines of Set's
  row of 51420, field by field.
