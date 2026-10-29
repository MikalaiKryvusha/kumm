# Bug 66 — Conan 3.0.1: the game crashes inside UE4SS on rapid bow fire (our Lua mods hop from the worker thread into the game thread)

**Status:** ✅ DONE 2026-10-29 11:23 · **Severity:** S1 (crash in the owner's hands — his trust that our mods are stable) ·
**Version/build:** Conan Exiles 3.0.1, UE4SS v3.0.1 Beta #0 (SHA 83330635), 8 enabled Lua mods · **When/context:** 2026-10-28 20:06:55, the agent's
run; the owner was shooting the bow in first person (LMB without RMB) and pasted the crash report · **Fixing:** this session

## Goal vector
Avoid: a crash of the game caused by our Lua mods under frequent events. Done when no enabled Lua mod calls the worker-thread delay API (guard
`ConanExiles/_config/check-lua-game-thread.py` = 0) and 60 s of rapid fire in FP and TP produce no crash and no `Ref was not function` line.

## Symptom
The owner's paste: «Unhandled Exception: EXCEPTION_ACCESS_VIOLATION reading address 0x0000000000000002», stack UE4SS ×11, ConanSandbox ×6.

## Forensics
- UE4SS.log: 20:06:44–20:06:53 nine lines `[KrinikArrowAim] натяжка без ПКМ: камера над стрелой (1…9)` (rapid LMB in FP), then
  `20:06:55.22 Error: [Lua::Registry::get_function_ref] Ref was not function` · `No traceback`, crash folder 20:06:56
  (`Saved/Crashes/UECC-Windows-5990…`), callstack module `UE4SS.dll`.
- The agent's pult was idle since ≈20:03 (last command 113).

## Root cause
`ExecuteWithDelay` / `LoopAsync` run the mod's function on a UE4SS worker thread; our mods then call `ExecuteInGameThread` from there. Two
threads share one Lua state; under frequent events the registry ref is gone when the game thread runs it → access violation. The same class
crashed the game on 2026-09-08 (camera mod, UE4SS bug #1180, EXP-0062) and was written into the camera mod's comment — but never mechanized,
so `KrinikArrowAim` (written 2026-10-27/28) brought the pattern back: 7 delayed hops per draw/shot (charge end, RMB event, smooth shift steps
every frame, release poll).

## Fix
All 8 enabled Lua mods moved to game-thread delayed actions (`ExecuteInGameThreadWithDelay`, `LoopInGameThreadWithDelay`; docs.ue4ss.com →
Delayed Actions — present in this UE4SS build): ConanCameraControl 12, KrinikArrowAim 7, KrinikPauseGameInMenu 3, KrinikOblivionLocomotion 3,
KrinikHudOutline 2, ConanModPackStatus 2, KrinikFpsCounter 1, KrinikAgentRemote 1 (loops wrapped in `pcall` so an error does not stop the loop).
The agent's instrument `_config/fov-sampler.lua` had the same hop every 50 ms — converted too.

TWINS: searched `ExecuteWithDelay|LoopAsync|ExecuteAsync` in every `_unpacked/*/Scripts/*.lua` — 35 sites in the 8 enabled mods (fixed) + 3
disabled probes not shipped (ConanAttributeProbe 6, HosavRU 1, KrinikMenuProbe 1 — left, no `enabled.txt` in the game).

Guard: `python -I -X utf8 ConanExiles/_config/check-lua-game-thread.py` — red 31 on the game mods before the deploy (2026-10-28 ≈20:2x), 0 after.

## Verification
Cases G1–G2, L1, C1–C2 in `testcases/TC_conan_bow_crash_fp_dip_tp_twitch_2026-10-28.md`.

## Decisions made without the owner
- `[AI]` The disabled probes are not converted (not shipped, not running).

## Links
EXP-0062 · bug 65 (crash after re-entry, camera mod) · bug 64

## ✅ STATUS: DONE (2026-10-29 11:23 +03:00)

Hygiene: `check-lua-game-thread.py` — 0 worker-thread calls (also for `ConanModPackStatus` after its rewrite, bug 68).
Functional run: the owner's save, real input: FP by the real wheel, 12 LMB hold-draws (9 «натяжка без ПКМ» — the crash path of 2026-10-28 20:06),
TP 20 LMB clicks, 10 mixed RMB+LMB — the game alive 30 s after each series, «Ref was not function» 0, crash folders 15 → 15.
Cases `testcases/TC_conan_rapid_fire_no_crash_2026-10-29.md`.
REAL WORLD: accumulated — the owner's save and game folder; data and machine — his machine; path — real mouse input, verified on the real world.

## Decisions made without the owner (closing)

- `[AI]` The probes left in `ue4ss/Mods` without `enabled.txt` (ConanAttributeProbe, HosavRU, KrinikMenuProbe) stay — they do not load.
