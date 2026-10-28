# Test cases — Conan bow, the owner's evening: crash on rapid fire, FP camera dip, TP twitch on a new draw

> **Created:** 2026-10-28 · **Basis:** the owner, chat 2026-10-28 ≈20:07–20:12, while playing in the agent's run: the crash report pasted
> («Unhandled Exception: EXCEPTION_ACCESS_VIOLATION reading address 0x0000000000000002», stack UE4SS ×11); «при быстрой стрельбе по ЛКМ без ПКМ в
> виде от первого лица - странно камера опускается чуть ниже, чем в idle состоянии - по хорошему, ниже опускать не нужно, только чуть правее
> двигать от idle состояния, как уже двигается»; «и камера все еще дергается при последовательных выстрел в ПКМ прикладке от третьего лица при
> начале нового натяжения».
> **Contour:** `D:\Games\Conan Exiles 3.0.1`, the agent's own run; crash forensics: UE4SS.log 20:06:55 `Error: [Lua::Registry::get_function_ref]
> Ref was not function` one second before the crash, after a series of «натяжка без ПКМ: камера над стрелой» lines (KrinikArrowAim). Cause class:
> worker-thread delays (`ExecuteWithDelay` / `LoopAsync`) hopping into `ExecuteInGameThread` — UE4SS bug #1180, EXP-0062 (camera mod, 08.09).
> Fix: all 8 enabled Lua mods moved to game-thread delayed actions (`ExecuteInGameThreadWithDelay`, `LoopInGameThreadWithDelay`), guard
> `_config/check-lua-game-thread.py`. Meter: `fov-sampler.lua` (FOV, RMB, FP arm offset, camera right/up from the hero, every 50 ms),
> real input `mouse-seq.ps1`, runner `rmb-case.sh`.

**Expected:**
- E1 No crash and no `Ref was not function` in UE4SS.log over 60 s of rapid fire (LMB clicks every ≈250 ms) in FP and in TP with RMB held.
- E2 FP, LMB without RMB: during the shift the camera's height above the hero (cam_up) never drops below its idle value by more than 1 cm; the
  shift is to the right (cam_right grows), as now.
- E3 TP, RMB held, consecutive shots: from the start of the second draw to its shot the FOV stays within the aim value ± 3° (no zoom-out blip).
- E4 Guard: `check-lua-game-thread.py` red (≥ 1) on the mods before the deploy, 0 after.

Dimensions: view (FP · TP) × input (LMB rapid without RMB · RMB held with LMB shots) × duration (one shot · 60 s series). Not covered: mounted,
crossbow, co-op.

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| G1 | Guard red before the deploy | `python -I -X utf8 _config/check-lua-game-thread.py` on the game mods before copying | 31 calls, red | pass | 2026-10-28 ≈20:2x: 31 calls in 7 enabled mods (KrinikPauseGameInMenu, camera mod, KrinikArrowAim…) |
| G2 | Guard green after the deploy | same after copying the 8 converted mods | 0 calls | pass | 20:1x: «вызовов рабочего потока: 0», exit 0 |
| L1 | Mods load and work after the conversion | relaunch; UE4SS.log: each of the 8 mods logs its load line; FPS counter updates; pult answers | all 8 load lines, no Lua errors | pass | relaunch 20:14:53: all 8 mods log live lines (camera zoom, counter on HUD, outline, locomotion, status, pause, pult entered the world, bow hook set); no Lua error lines |
| C1 | Crash stress FP | FP, bow, 60 s: `lclick, wait:190` × 240 | E1 | pass (thread fix, before the camera edits) | 20:21:56–20:23:01, 240 real clicks: game alive, 36 arrows in the minute (mod summary 20:22:59), `Ref was not function` 0 (the owner crashed after 9 shots) |
| C2 | Crash stress TP | TP, `rdown`, 60 s of `lclick, wait:900`, `rup` | E1 | pass | 20:23:35 — stamina ran out, 12 arrows (owner: «выносливость заканчивается»); repeat 20:27:08 with the run cheat `AdjustStaminaRegenMod(100)` + `AdjustStaminaCurrent(1000)`: 28 arrows in the minute, game alive, `Ref was not function` 0 |
| D0 | FP idle baseline | FP, no input, sample 2 s | cam_up idle value | pass | 20:1x: cam_up 73,9 cm steady, cam_right 7,5–8,3 |
| D1 | FP rapid LMB without RMB — dip reproduced (before the fix) | FP, sample 5 s, `lclick, wait:300` × 10 | cam_up below idle by > 1 cm (the defect) | pass (defect reproduced) | cam_up min 63,6 (−10,3 cm); pose alone 63,0–63,6, offset Z 6 gives 69; offset back to 0 between shots → dips |
| D2 | FP rapid LMB after the fix | same as D1 | E2 | fail → D3 | 20:29, idle 74,1: steady fire cam_up 74,0–77,6 (never below idle), right to 28,6; one sample 68,7 at the very first shot — the pose drops ≈70 ms before «arrow on the string»; Z ramp 100 ms too slow → `fp_hip_z_ms` 1 |
| D3 | FP rapid LMB, Z at once | same as D1 after the relaunch | E2 | partial | 20:45, idle 74,1: steady fire 74,0–77,6 (the dips of D1 gone), right to 29,5; first shot of a series still dips 72,7 → 67,2 at 1118–1171 ms for ≈100 ms — the «arrow on the string» signal comes ≈100 ms after the pose starts to drop, so an instant Z does not help. An earlier signal exists (`InpActEvt_PrimaryActionV2`, LMB press), but «is a bow in hands» is not readable by the pult (weapon getters have out params) — without it LMB melee in FP would shift the camera. Open |
| J1 | TP consecutive shots, RMB held — twitch reproduced | TP, sample 8 s, `rdown, wait:1800, lclick, wait:1800, lclick, wait:1800, lclick, wait:500, rup` | FOV leaves aim ± 3° at the new draw start (the defect) | pass (defect reproduced) | aim 75,0°; at 6062 ms 80,8° then back over ≈500 ms |
| J2 | TP consecutive shots after the fix | same as J1 | E3 | pass | 20:28: from settle (1813 ms) to release (7334 ms) FOV 75,0° on every sample (min = max = 75,0); mod log «новое натяжение с ПКМ — обзор держим 75.0°»; release → 107,4° in ≈120 ms |
