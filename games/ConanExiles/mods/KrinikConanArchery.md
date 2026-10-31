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

## Stuck arrow copies (plan 36 W13, facts of 2026-10-31)

- A shot leaves a `BP_DummyProjectile_C` copy (`/Game/Items/Weapons/BP_DummyProjectile.BP_DummyProjectile_C`, root `StaticMeshComponent`); the game removes
  copies a few seconds later. Our Lua logs each copy: «копия стрелы #N: удар в <component>, кость удара <bone>, прицеплена к <parent>, сокет <socket>».
- A HIT on a humanoid boss: the copy's root is attached to the creature's `CharacterMesh0`, socket = the hit bone (`b_L_lowerarm` ×3), still attached
  at +2 s (birth watch `NotifyOnNewObject` + reads at +0.3 s / +2 s on the game thread). A MISS into the ground: no attach parent, socket None.
- **Where the game puts the copy (bytecode, 2026-10-31 10:3x: `retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter BP_BaseProjectile
  <_paksview-3.0.1> <work>` → `uaj exports … VER_UE5_6` → `UAssetGUI tojson … VER_UE5_8` → `kismet-trace.py … SpawnDummyProjectile`):**
  `BP_BaseProjectile.SpawnDummyProjectile` spawns `BP_DummyProjectile` (deferred) at `GetAdjustedProjectileImpactPosition` = the hit's
  `ImpactPoint` (the collision surface — capsule or physics body, NOT the visible skin), rotation = mesh rotation ∘ `ProjectileOnGroundRotationOffset`,
  and hands it `HitResultFromProjectile`, `StaticMeshToShow`, `ProjectileDummyLifetime`, `IsLootable`, `ProjectileItemTemplateID`,
  `ProjectileVelocityOnImpact`; the copy attaches itself to the hit bone. `AdjustImpactLocation` only moves the flying projectile 10 cm forward
  (`Double 10.0`). So a creature whose physics bodies are thicker than its skin (the Kappa's shell) gets arrows standing off its skin — and they
  ride the bone, so they hang «in the air» beside it as it moves. A fix lives in the copy's placement: push it along its flight direction from the
  impact point toward the bone (or onto the mesh surface) before the attach.
- Open: on a 1080p crop of the frozen boss no arrow was visible on the arm while 3 copies lived — where the copy draws relative to the bone (its
  relative location) is the next read; the owner's symptom (arrows hanging in the air beside a Kappa) — plan 36 W13.

## Open

- seen 2026-10-30 16:28: the pause-menu list shows «v3.0.1» (report `testcases/reports/2026-10-30_conan-krinik-versions-3.0.1.md`).
