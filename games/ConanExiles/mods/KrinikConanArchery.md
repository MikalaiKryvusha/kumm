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
- **Arrow meshes (Dev Kit probe `_config/devkit/kit-probe-arrow-mesh.py`, 2026-10-31 10:39):** every bow arrow `SM_*_arrow` under
  `/Game/Items/Weapons/Bow/` is ≈ 76–85 cm long along local **Z from 0** (`SM_basic_wood_arrow` Z −0.3…76.1, `SM_iron_arrow` −0.4…76.3,
  `SM_demon_bow_arrow` −0.1…84.7), ≈ 7 cm thick — the mesh origin is at ONE END of the arrow. The first depth-push try (10:34) measured the hit
  bone ≥ 60 cm ahead of the copy origin on a humanoid — the origin is the nock end, the tip ≈ 76 cm ahead. The push that hides the tip by `tip_in`:
  `clamp(depth − arrow_length + tip_in, into_body_cm, into_body_max_cm)` (arrow_length from the copy's `StaticMeshToShow` bounds or 76). Live now:
  the push capped to the old 15 cm, the depth logged (pack `e536ce9`); the formula waits for a stand with a LIVING target and a look at the arrows.
- **The copy is born ≈ 1.8 m SHORT of the hit (stand 2026-10-31 10:57–11:04, a summoned green Kappa, `_config/arrow-stand.sh`):** the hit's `ImpactPoint`
  stands 180–187 cm ahead of the copy origin along the flight in every hit, the mesh's local Z runs along the flight (factor 1.00 / 0.96), the tip at +76 cm —
  so the drawn arrow hung ≈ 1.1 m before the body (side frame: horizontal, in the air before the snout; the 60 cm push did not reach). Most likely the copy
  takes the projectile's place BEFORE its last flight step. **Live since pack `46e2069`:** push = clamp(impact − tip + `tip_in_cm` 10, 15, 200) — the tip goes
  to the impact point and 10 cm in; the bone depth only logged (toward the bone the head arrow would sink whole). Side frame after: the shaft enters the snout,
  the tip hidden (the owner 11:09: «мне показалось, что стрелы в капу начали нормально втыкаться»). Cases P4–P7 `TC_conan_arrows_follow_mob_body_2026-10-31_push.md`.
- Open (the owner 11:09): `[OWNER]` «я ее убил, и все стрелы пропали» · «что в регдоле трупа пропадают стрелы» — do the stuck copies vanish when the body goes
  ragdoll, and is it vanilla? Control: the same kill with `into_body = false`. A humanoid (P7) not run yet.
- Open: on a 1080p crop of the frozen boss no arrow was visible on the arm while 3 copies lived — where the copy draws relative to the bone (its
  relative location) is the next read; the owner's symptom (arrows hanging in the air beside a Kappa) — plan 36 W13.

## Open

- seen 2026-10-30 16:28: the pause-menu list shows «v3.0.1» (report `testcases/reports/2026-10-30_conan-krinik-versions-3.0.1.md`).
