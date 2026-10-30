# Mod notes — KrinikConanGraphics (ours: the build's graphics in one mod)

> **Created:** 2026-10-30 · **Parent:** plan 36 W28 (lingering blood), W30 (arrow blood), the owner's «всё по графике Krinik сведём в один мод
> KrinikConanGraphics» (2026-10-30 ≈12:5x); written from the mod's own header (`_unpacked/KrinikConanGraphics/ue4ss/Scripts/main.lua`)
> **Status:** living notes
> **Outbound:** —

**What it is.** A Lua mod (`ue4ss/Mods/KrinikConanGraphics`) + the build's optimized `Engine.ini` (distances, shadows, fog, DLSS, the sun step), the ini
deployed by `Deploy-ModPack.ps1` through the manifest's `engineIni` field.

## Section 1 — blood on the ground lies 5 minutes (W28, DONE 2026-10-30 12:45)

- The game: a weapon hit (`BP_CollisionComponent.DoHandleHitFeedback`, attacker side) → `SpawnDecalAtLocation(M_blood_ground_decal, …, LifeSpan 3.0)`
  → `SetFadeOut(0.0, 3.0, true)`; the stain lives 3 s.
- The material draws the full stain only while `DecalLifetimeOpacity` ≈ 0.45–0.9 (frames 12:36).
- Ours: a post-hook of `/Script/Engine.DecalComponent:SetFadeOut` on the blood material → `SetFadeOut(hold_s − fade_s, fade_s)` + `SetFadeIn(−start × ramp, ramp)`
  (hold 300 s, start 0.5, rise 0.3); cap 200 stains, the oldest fades in 0.5 s. One event per stain, no polling.
- Can't: `SetLifeSpan` from Lua (TrivialObject); changing LifeSpan in a pre-hook of `SpawnDecalAtLocation` (UE4SS does not pass it on).
- Tested: report `testcases/reports/2026-10-30_conan-lingering-blood.md`. Open: the slider (W24); the cost below `os.clock`'s 1 ms step.

## Section 2 — arrow hits leave blood (W30, code in place 2026-10-30 23:53, the direct-call test pending)

Built: a post-hook of `BP_CollisionComponent_C:TakeProjectileDamage` set LAZILY on the first `BP_CollisionComponent_C` (at mod start the BP class
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
