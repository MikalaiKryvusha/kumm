# Mod notes — KrinikConanGameplay (ours: levels without a cap + Agility speed)

> **Created:** 2026-10-30 · **Parent:** the mod-notes lock (KAIF #186); written from the manifest entry (`ConanExiles/modpack.json`), plan 36 W32, ideas/04
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** The build's gameplay as one mod (`[OWNER]` «KrinikOblivionLocomotion · KrinikLevelUncapped · Идет в мод KrinikConanGameplay» · 2026-10-30 ≈13:0x):
the pak (formerly KrinikLevelUncapped, a fork of MrSerji's Level 1000 — the owner 13.09 «делай, но это будет наш мод - форк») and the Lua section
`krinik_oblivion_locomotion` (formerly KrinikOblivionLocomotion 0.3.0).

## Where things are

- Pak (not in git), built with no kit: `python -I -X utf8 _config/devkit/build-level-mod.py --name KrinikConanGameplay --work <empty folder outside the
  pack> --out _unpacked/KrinikConanGameplay` (needs the MrS archive in the library and `_tools/retoc`, `_tools/UAssetGUI`, `_tools/repak`; step 6 checks
  3 × 10 000 rows against the generators). The builder writes `modinfo.json` itself — the version = the manifest's `packVersion` (1.0.0) since 2026-10-31.
- Lua `_unpacked/KrinikConanGameplay/ue4ss/Scripts/main.lua` + `krinik_oblivion_locomotion.lua` → `ue4ss/Mods/KrinikConanGameplay`; log prefix
  «[KrinikConanGameplay:<section>]». The pak stays LAST in the load order (it replaces three vanilla progression tables whole).

## What it changes

| Half | Change | Numbers |
|---|---|---|
| pak | `/Game/Systems/Progression/DT_ExperienceSystemLevel`, `DT_AttributeSystem`, `DT_FeatsPerLevel` on the VANILLA paths, no controller BP; **seen live 2026-10-31 12:08**: `CheatManager:SetLevel(65)` → badge 65, «(4 031)» to the next = 500 × √65 (report `2026-10-31_conan-level-uncap-live.md`) | 10 000 levels; XP per level 500 × L^0.5 (anchor 175 → 500 by the owner 16.09; total 333 358 180, generator `_config/xp-table.py`); one attribute point every level; knowledge points by the vanilla formula with cap 16 (48 every 10th level), 191 316 at level 10 000 |
| Lua | +3 cm/s to run, sprint and jump per Agility point (the owner 13.09: as in Oblivion); the hero taken by the spawn event, no scene search every second (29.10); **seen live 2026-10-31 12:05** with points spent in «Хар-ки»: Athleticism 2/3/4 → MaxWalkSpeed 296.4/298.4/300.3, JumpZ 432 at 4; `SetStat` does not move an attribute in 3.0.1 (report `2026-10-31_conan-agility-law-live.md`) | — |

Another mod that injects rows into these tables by its own controller (EAA writes row 7 of `DT_AttributeSystem`) still injects on top.

## Version

`modinfo.json` version = the BUILD version **1.0.0** since 2026-10-31 15:5x, in the built pak (`set-pak-version.py`) and in `build-level-mod.py` (reads
`packVersion`) — `[OWNER]` «в сбоке моды Krinik ставим по версии сборки 1.0.0» · 2026-10-31 15:39, superseding 3.0.1 of 2026-10-28.

## Open

- seen 2026-10-31 15:51: the pause-menu list shows «v1.0.0» (report `testcases/reports/2026-10-31_conan-krinik-versions-1.0.0.md`).
