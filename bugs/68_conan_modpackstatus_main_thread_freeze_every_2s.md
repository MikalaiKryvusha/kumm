# Bug 68 — a freeze of ≈ 115 ms every 2.12 s: ConanModPackStatus polls the whole session on the main thread

**Status:** 🔧 fix pending verification · **Severity:** S1 (the owner's play; his rule «моды уважительно к главному потоку» broken by our own mod)
**Version/build:** Conan Exiles Enhanced 3.0.1, the 3.0.1 build of the pack · **When/context:** 2026-10-29 10:3x, the owner playing in the agent's run

## Symptom

`[OWNER]` «есть какие-то фризы раз в 3 секунды примерно» · «можно сейчас профайлером посмотреть, что это лагает?» · «я просил писать моды
уважительно к главному потоку =(» · «как мы это поняли на опыте Сварога!» · 2026-10-29.

## Forensics

PresentMon 30 s, hero idle (`--process_name ConanSandbox-Win64-Shipping.exe --timed 30`, 2026-10-29 10:4x): median frame 11.7 ms (85 fps), 14 spikes of
107–124 ms, **period 2.12 s exactly**, all CPU (`MsCPUBusy` 107–124, `MsGPUBusy` 10–16). Period 2.12 = a 2000 ms chained delay + ≈ 120 ms of work.

Candidates with 2000 ms: `ConanModPackStatus` (`check_interval_ms = 2000`) and `KrinikHudOutline` (`POLL_MS = 2000`). Measured by the remote on the
game thread: `FindFirstOf('W_NewHealthUI_C')` 3 ms (KrinikHudOutline's whole poll) — not it; `FindAllOf('UserWidget')` 1928 objects 5 ms +
`GetFullName` loop 21 ms; full scan of `ConanSandbox.log` (2 MB) 30 ms.

## Root cause

`ConanModPackStatus` tick (since September, kept alive for the whole session by `hud_scale`): every 2 s — `mounted_paks()` reads the whole game log
(30 ms), `apply_hud_scale()` walks all 1928 `UserWidget` reading each class name (≈ 26 ms), plus the menu and modal checks. The comment in the code
called the cost «честная и мелкая». The 2026-10-28 move of every Lua timer to the game thread (bug 66) put this work on the main thread.

## Fix

`_unpacked/ConanModPackStatus/Scripts/main.lua`: the tick lives only `cfg.checks` ticks (≈ 60 s); the pak count stops reading the log once all paks
are found; the HUD scale searches `FindAllOf(W_SmoothHP_C)` (2 ms) and runs on `NotifyOnNewObject(W_SmoothHP_C)` (500 / 2000 ms after creation);
the menu hiding runs on `NotifyOnNewObject(W_MainMenu_MainMenu_C)`; the tick logs its worst cost. Deployed to the game 2026-10-29 10:4x — takes effect
at the next launch. Cases — `testcases/TC_conan_modpackstatus_main_thread_freeze_2026-10-29.md`.

TWINS: searched `LoopInGameThreadWithDelay|ExecuteInGameThreadWithDelay` loops in the enabled Lua mods — periodic main-thread work also in
`KrinikHudOutline` (FindFirstOf every 2 s, 3 ms), `KrinikPauseGameInMenu` (poll 250 ms), `ConanCameraControl` (reapply 16 ms, target recheck 30 ms,
agent channel file 1 s), `KrinikOblivionLocomotion` (1 s), `KrinikFpsCounter` (250 ms, a display refresh). The 30 s record shows no other periodic
spike above median + 3 ms (phase folding at 0.25/0.5/1/2 s — flat). Their move to events is plan 34 — asked of the owner (his order of 2026-10-29:
other debts are asked first).

Fixing: this session.

## Decisions made without the owner

(at closing)

## Links

bug 66 (Lua timers moved to the game thread) · plan 34 (our Conan mods on events) · `HOUSE_RULES.md` §1 rule 7.
