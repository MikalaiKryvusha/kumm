# Mod notes — KrinikConanArchery (ours: the hero's bow)

> **Created:** 2026-10-30 · **Parent:** the mod-notes lock (KAIF #186); written from the manifest entry (`ConanExiles/modpack.json`) and plan 36 W34
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Two halves of one mod (`[OWNER]` «почему у нас какой-то BowFixes? Нельзя всё, что по стрельбе из лука - в один мод собрать?» · 2026-10-28;
name — «мод KrinikConanAim переименовываем в KrinikConanArchery»). Before: KrinikArrowAim and KrinikBowFixes.

## Where things are

- Kit pak `Mods/KrinikConanArchery.pak` (not in git): kit in mod mode `F:\CEUE5Devkit\UE4\Content\Mods\KrinikConanArchery` (`active.txt` — one active mod per
  kit) → `UnrealEditor-Cmd … -run=PythonScript -Script=_config/devkit/kit-archery-edit.py -ModDevKit -NullRHI` → `python _config/devkit/kit-buildmod.py
  KrinikConanArchery <out>` → copy into `_unpacked/KrinikConanArchery`. `modinfo.json` `devkitRevisionNumber` 1002 (else «Mod is too old», EXP-0354).
- Lua half `_unpacked/KrinikConanArchery/ue4ss` → `ue4ss/Mods/KrinikConanArchery` (install step). Load order: before `KrinikConanGameplay` (that one last).

## What it changes (manifest, version line 0.5.0–0.7.0)

| Half | Change |
|---|---|
| pak | the native draw montage `AM_combat_2h_bow_combo_heavy_c0`: the aim notify runs to the montage end (the camera no longer jumps back on a shot with RMB held); a mute sound notify keeps `S_ChargeFull` loaded |
| Lua | the hero's arrow flies to the camera's aim point; the arrow look; leaving the aim on RMB release; the camera above the arrow in first person; aim kept on a new draw; the full-charge sound only for the player's hero |
| Lua 0.5.0 | Oblivion Remastered ballistics: gravity 0.55, speed by the draw, minimum 0.5 |
| Lua 0.6.0 | the per-tick gravity recompute removed — the arrow's curve `FC_BowProjectileGravCurve_*` is dropped |
| Lua 0.7.0 | shooting in a jump: the bow fires in the air, a jump mid-draw takes off |

No overlaps: the 2h_bow montage is in the game's pak only among the build's 101 containers (`retoc list --path`, 2026-10-28). Cases — KUMM
`testcases/TC_conan_bow_*_2026-10-2*.md`.

## Version

2026-10-30: the version the pause-menu mod list shows = `modinfo.json` `versionMajor/Minor/Build` of the wrapper — set to **3.0.1** (`[OWNER]` «все моды
Krinik... получают версию 3.0.1» · 2026-10-28, chronicle) in the kit source, `kit/modinfo.json` and the built pak (`_config/devkit/set-pak-version.py`).

## Open

- seen 2026-10-30 16:28: the pause-menu list shows «v3.0.1» (report `testcases/reports/2026-10-30_conan-krinik-versions-3.0.1.md`).
