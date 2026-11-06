# Mod notes — KrinikConanGraphics (ours: the build's graphics in one mod)

> **Created:** 2026-10-30 · **Parent:** plan 36 W28 (lingering blood), W30 (arrow blood), the owner's «всё по графике Krinik сведём в один мод
> KrinikConanGraphics» (2026-10-30 ≈12:5x); written from the mod's own header (`_unpacked/KrinikConanGraphics/ue4ss/Scripts/main.lua`)
> **Status:** living notes
> **Outbound:** —

**What it is.** A Lua mod (`ue4ss/Mods/KrinikConanGraphics`) + the build's optimized `Engine.ini` (distances, shadows, fog, DLSS, the sun step), the ini
deployed by `Deploy-ModPack.ps1` through the manifest's `engineIni` field.

## Engine.ini — the physics rebuild queue (2026-11-06 16:00 +03:00, Quick Win from OblivionRemasteredPerformanceFix)

`p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce=100000` at the top of `[SystemSettings]` (Conan's default read live: 1000). A-B-A-B in one launch
(batch `ConanExiles/_config/bench-batches/q6-chaos-queue.txt`): stutters ≥50 ms 80/77 → 53/60, CPU 16.43/16.26 → 15.93/16.08 ms; report
`testcases/reports/2026-11-06_conan-quickwin-chaos-queue.md`. Read at the same time (Constructor values): `p.MaxPayloadSize` 100000, `r.GPUScene.ParallelUpdate`
2048, `r.Nanite.Streaming.NumInitialRootPages` 2048, `r.RHICmd.ParallelTranslate.Enable` true.

## Engine.ini — the sun step stays 2.0, the bias −1.0 (bug 67, 2026-11-06)

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
