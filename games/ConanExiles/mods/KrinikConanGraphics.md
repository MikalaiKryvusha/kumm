# Mod notes — KrinikConanGraphics (ours: the build's graphics in one mod)

> **Created:** 2026-10-30 · **Parent:** plan 36 W28 (lingering blood), W30 (arrow blood), the owner's «всё по графике Krinik сведём в один мод
> KrinikConanGraphics» (2026-10-30 ≈12:5x); written from the mod's own header (`_unpacked/KrinikConanGraphics/ue4ss/Scripts/main.lua`)
> **Status:** living notes
> **Outbound:** —

**What it is.** A Lua mod (`ue4ss/Mods/KrinikConanGraphics`) + the build's optimized `Engine.ini` (distances, shadows, fog, DLSS, the sun step), the ini
deployed by `Deploy-ModPack.ps1` through the manifest's `engineIni` field.

## Kit pak — the foliage WPO bound (bug 67 FIXED 2026-11-07 19:10)

`KrinikConanGraphics.pak` overrides `/FLX_Materials/Materials/Environment/Core/M_Foliage` with `MaxWorldPositionOffsetDisplacement` **100 cm** (vanilla 0): Nanite pads the
wind into the leaf cluster bounds, so the turning sun no longer drops leaflets from the shadow (blink 12–16 % → 0.06–0.44 %). Rebuild: kit editor
`-run=PythonScript -Script=_config/devkit/kit-foliage-wpo.py` (env `KRINIK_WPO_BOUND`) → move `active.txt` to `UE4/Content/Mods/KrinikConanGraphics` →
`kit-buildmod.py KrinikConanGraphics <out>` → `active.txt` back to KrinikConanUI. The kit asset is modified in place (backup `kit_asset_backups/M_Foliage.uasset.orig`).
Load order: before KrinikConanGameplay. All foliage on `M_Foliage` gets the bound.

## Kit pak — conservative shadow raster for foliage (REFUTED 2026-11-07 18:51 — did not reduce the blink; dropped; the patch stays in `engine_shader_patches/`)

The owner's decision 2026-11-07 18:31 (bug 67, verbatim there): leaf shadows cast in every frame — conservative coverage in the Nanite shadow raster. The raster of
WPO foliage is a MATERIAL shader, so the mod overrides `/FLX_Materials/Materials/Environment/Core/M_Foliage` (shared by all foliage) cooked by the kit with the patched
`Nanite/NaniteRasterizer.ush` (`_config/devkit/engine_shader_patches/`, VSM permutation only). Kit mod folder `F:/CEUE5Devkit/UE4/Content/Mods/KrinikConanGraphics`
(`Local/CookInfo.ini` → `FilesToCook=/FLX_Materials/…/M_Foliage.uasset`; `kit-buildmod.py` cooks plugin packages via `PLUGIN_ROOTS`). The kit's shader is restored
from `.orig` after each cook. Not built / not seen in game yet; open: the palm MIs' own static switches, the kit CL 378787 vs the game 379176.

## Engine.ini — view distance 1.5 (2026-11-09 16:2x, the owner's word via KAGO)

`r.ViewDistanceScale`, `foliage.LODDistanceScale`, `grass.CullDistanceScale` 2.0 → **1.5** (`[OWNER]` KAGO chat 2026-11-09 ~13:4x «дальность в конане ставим 1.5» · «остальное
по конану не трогаем», plan 51 S6); `r.StaticMeshLODDistanceScale` 0.75 untouched. Read back live 1.5 · 1.5 · 1.5 after a fresh launch — these `[SystemSettings]` lines DO reach
the scene (the file's old warning that the game overrides them is refuted for them; `sg.ViewDistanceQuality` stays 4). +4.7 % FPS on five still beaches (plan 51 report).
**Accepted by the owner's eye** (review folder 77): `[OWNER]` 2026-11-09 16:47 «дальность на 1.5 не победнела. Чуууууть-чуть 2.0 приятнее, но не настолько, чтобы прям
заметить разницу. А вот 5% Кадров нам нужны!»

## Engine.ini — the physics rebuild queue (2026-11-06 16:00 +03:00, Quick Win from OblivionRemasteredPerformanceFix)

`p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce=100000` at the top of `[SystemSettings]` (Conan's default read live: 1000). A-B-A-B in one launch
(batch `ConanExiles/_config/bench-batches/q6-chaos-queue.txt`): stutters ≥50 ms 80/77 → 53/60, CPU 16.43/16.26 → 15.93/16.08 ms; report
`testcases/reports/2026-11-06_conan-quickwin-chaos-queue.md`. Read at the same time (Constructor values): `p.MaxPayloadSize` 100000, `r.GPUScene.ParallelUpdate`
2048, `r.Nanite.Streaming.NumInitialRootPages` 2048, `r.RHICmd.ParallelTranslate.Enable` true.

## Engine.ini — the sun step 0.0025 since 2026-11-07 16:12 (bug 67; 0.005 from 15:5x)

`DynamicSky.SolarUpdateAngleDelta=0.0025` (16:12 «тень нужно ещё плавнее в 2 раза»; before: 0.005) — the owner's eye live at the oasis: 0.03 → 0.01 → 0.005 «вот теперь тени ПЛАВНЫЕ!!!!» (15:45); every step ≥ 0.1° rejected
(14:53). The leaf-shadow flicker stays open — the fix goes into the leaf material (shadow-only enlargement), not into the sun step.

## Engine.ini — the sun step stays 2.0, the bias −1.0 (bug 67, 2026-11-06) — superseded above

An interim 0.25 / −1.5 was prepared 20:37 and REVERTED before deploy: the measurement behind it was void (overexposed HDR capture, time of day not fixed —
report `testcases/reports/2026-11-06_conan-palm-shadow-sun-step.md`). Note for the re-run: the game's own Cine bias is −1.5, ours −1.0.

## Section 1 — blood on the ground lies 5 minutes (W28, DONE 2026-10-30 12:45)

- The game: a weapon hit (`BP_CollisionComponent.DoHandleHitFeedback`, attacker side) → `SpawnDecalAtLocation(M_blood_ground_decal, …, LifeSpan 3.0)`
  → `SetFadeOut(0.0, 3.0, true)`; the stain lives 3 s.
- The material draws the full stain only while `DecalLifetimeOpacity` ≈ 0.45–0.9 (frames 12:36).
- Ours: a post-hook of `/Script/Engine.DecalComponent:SetFadeOut` on the blood material → `SetFadeOut(hold_s − fade_s, fade_s)` + `SetFadeIn(−start × ramp, ramp)`
  (hold 300 s, start 0.5, rise 0.3); cap 200 stains, the oldest fades in 0.5 s. One event per stain, no polling.
- Can't: `SetLifeSpan` from Lua (TrivialObject); changing LifeSpan in a pre-hook of `SpawnDecalAtLocation` (UE4SS does not pass it on).
- Tested: report `testcases/reports/2026-10-30_conan-lingering-blood.md`. Open: the cost below `os.clock`'s 1 ms step.
- **The slider — DONE 21:08** (plan 38 phase 2, the «Моды Krinik'а» page «KrinikConanGraphics»): `CFG.hold_s` comes from the shared store
  `<game>\ConanSandbox\Saved\KrinikSettings.lua` key `gfx_blood` (seconds; absent — 300) at load, and again when the shared number `KrinikSettingsVersion`
  (`ModRef:GetSharedVariable`, set by the hub on «Сохранить») differs from the one seen — checked at every stain, no timer; floor `fade_s + 1`. Seen: 60 s
  after a save, 300 s after a reset (report `testcases/reports/2026-10-31_conan-hub-phase2-first-batch.md`, G1).

## Section 2 — arrow hits leave blood (W30, seen working by a direct call 2026-10-31 08:24; a real bow shot — the owner's first shot)

**2026-10-31:** the POST-hook of this Blueprint function never ran (a remote probe hook printed «pre», never «post», 08:06) — the section works in the
PRE-hook now (target and `bLocked` are known before the call). Stand: the target's OWN component by `GetComponentByClass(StaticFindObject(
'/Game/Systems/Combat/BP_CollisionComponent.BP_CollisionComponent_C'))` (the hero's via `GetOwner()` failed silently on 10-30); call
`comp:TakeProjectileDamage({}, {}, target, nil, nil, 0, {}, false)` — `Combo` is a struct, `0` there is refused. Cases A2c, A3 pass.

Built (first, 2026-10-30): a post-hook of `BP_CollisionComponent_C:TakeProjectileDamage` set LAZILY on the first `BP_CollisionComponent_C` (at mod start the BP class
is not loaded: «no UFunction with the specified name was found»); on a Character target, not blocked — `SpawnDecalAtLocation(/Game/Effects/blood/
M_blood_ground_decal, (64, 67…95, 67…95), feet = actor Z − capsule half height, Pitch −90, random Yaw, 3 s)` + `SetFadeOut(0, 3)` so section 1 extends it.
The native stain (hook 23:50): size (32, 67…95, 67…95), Pitch −90, random Yaw, life 3 s. Cases `testcases/TC_conan_arrow_blood_2026-10-30.md`
(A1 pass; A2 blocked — the remote's component lookup fails silently).

### Before the code (recon)

The owner: «Стрелы её не кладут - странно. Можем сделать, чтобы стрела, попадающая во врага - тоже кровь на землю давала?» (2026-10-30 ≈12:5x).
Route (plan 36 W30): on the target's projectile hit (`BP_CollisionComponent.TakeProjectileDamage`) spawn `M_blood_ground_decal` the way
`DoHandleHitFeedback` does (a ground trace under the hit, the same size and rotation) and call `SetFadeOut(0, 3)` — section 1 then extends it.
Needs: the decal size/rotation from the bytecode of `DoHandleHitFeedback`; a stand where arrows hit a target (the hero's shot needs input — a
background twin: a projectile spawned by the remote).

## Engine.ini — water reflections: software Lumen with reach (2026-11-09 01:48, the owner's pick)

`r.RayTracing.Enable=0`, `r.Lumen.Reflections.ScreenTraces=0`, `r.Lumen.Reflections.DistantScreenTraces=0`, `r.Lumen.TraceDistanceScale=4`, `r.AOGlobalDistanceField.NumClipmaps=6`,
`r.LumenScene.GlobalSDF.ClipmapExtent=5000` at the top of `[SystemSettings]` — `[OWNER]` 2026-11-09 01:47 «Твой вариант програмных отражений ОХУЕНЕН. самый красивый. Его и берём».
Read back live after a launch (01:50). Cost on five still river beaches ≈ −1.5 % FPS vs no reflection (rays ≈ −6 %); report `testcases/reports/2026-11-09_conan-water-reflections-five-scenes.md`.
A measurement after switching a reflection mode for the first time in a game session hitches on shader warm-up — switch once before measuring.
**Open — bug 89 (2026-11-09 15:45):** the owner sees the water reflection flicker like the palm-leaf shadows did (dark dashes and grain at `river_bend`); cause not yet found.
