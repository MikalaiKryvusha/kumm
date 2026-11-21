# Mod notes — Waystones Enhanced (third-party: player-built waystones and map travel between them)

> **Created:** 2026-11-21 · for case R21a of `testcases/TC_conan_rc3_critical_retest_2026-11-21.md` (#21, bug 79 — the world frozen behind an in-game loading screen)
> **Parent:** HOUSE_RULES rule 2 (one notes file per mod of a build) · `ConanExiles/modpack.json` entry «Waystones Enhanced»
> **Status:** 🔬 first notes 2026-11-21 23:27 +03:00 — from the mod's own description and a live dump; the waystone's classes NOT read yet · **Outbound:** —

## What it does

- Steam Workshop 3813660690 (`ConanExiles/_library/mods/_workshop/3813660690/WaystonesEnhanced.pak`, 2.3 MB, 2026-10-25); manifest comment: the owner's choice
  25.10 «берём в сборку, нужен перевод»; it overwrites no game file. An unofficial remake of Stormcast's Waystones for Conan Exiles Enhanced.
- The player's path (the mod's `modinfo.json`, verbatim steps): level 20 → Knowledge → Survival → learn **Wayfinder** → the Waystone recipe appears at the
  **Artisan Table** → craft and place at least two Waystones → Hold E on one to rename it → interact with a Waystone to open the world map → click another
  Waystone marker to travel. Server-side teleport and ownership checks; a protected arrival area keeps buildings off the landing point.

## Assets and functions

- The outer pak wraps a zen container set: `ConanSandbox/Mods/WaystonesEnhanced-Windows.{pak,ucas,utoc}` (+ LinuxServer, WindowsServer), `manifest.json`,
  `modinfo.json`. The ucas is Oodle-compressed: a raw byte search gives only `/Game/Mods/WaystonesEnhanced/UI/Textures/T_WSE_Icon` and a feat-like record next
  to the number **7770001** (`AlwaysHiddenInFeatWindow`, `AutoLearn` fields) — the Wayfinder feat id is a candidate, not proven.
- Live (2026-11-21 23:26, the owner's save, `pult.sh "dump WaystonesEnhanced"`): loaded at world entry are only `/Game/Mods/WaystonesEnhanced/UI/WSE_RenameDialog`
  and `WSE_ServerSettingsWindow`; the game map lists its map module `WSEMap` (GAME_ARCHITECTURE_INTERNAL_MAP, the module list). The waystone's placeable
  blueprint is loaded on demand — `FindAllOf('BlueprintGeneratedClass')` found none with the mod's path.
- `retoc to-legacy` of the mod's container alone fails («Extracted 0 (18 failed)») — it needs the game's `global.utoc` beside it.

## Our edits

None (the Russian translation the owner asked for is not done here yet).

## How to look inside / the stand for R21a (next)

1. Names: `retoc to-legacy` over a folder holding the game's `Content/Paks/global.utoc` AND the mod's container, `--filter WaystonesEnhanced` (the technique
   of `ConanExiles/_config/devkit/build-level-mod.py`); then the item row and the placeable class from the legacy assets.
2. The stand: god on, `exec MakeMeAdmin`, learn the feat (candidate `exec LearnFeat 7770001`, to prove) or spawn the waystone item by its id, place two
   waystones far apart (the oasis beach camp and a teleported spot), interact with one, click the other on the map.
3. The case: the world time read 5 s after the arrival, no «полноэкранный интерфейс: ОТКРЫТ» for `W_IngameLoadingScreen_C`, the heroine on her feet.

## Open

- The classes and the item id; whether the travel shows `W_IngameLoadingScreen_C` (bug 79's suspect) at all.
- The Russian translation (the owner's word of 2026-10-25).
