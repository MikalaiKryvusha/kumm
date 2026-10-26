# Bug 65 — Conan crash in UE4SS after leaving to the main menu and re-entering the world: the camera mod writes into the departed hero

**Status:** 🔧 fix pending verification
**Severity:** S1 — the owner's game crashed mid-session (EXCEPTION_ACCESS_VIOLATION), his trust in the build
**Version/build:** Conan Exiles Enhanced 3.0.1, build pack `ConanExiles` · `ConanCameraControl` (commit `070d959`), `KrinikArrowAim` 0.1.0
**When/context:** 2026-10-26 23:13:25, owner's session; minutes after `dc SW_config disable_custom_GI` → owner left to the main menu → the agent re-entered the world by the pult (`enter-world-remote.sh`)
**Fixing:** this session (commit `070d959`); verification — the owner's next menu exit / re-entry

## Goal vector
Avoid: a Lua mod of the build never writes into a game object that is not the live hero, so leaving to the menu and coming back never crashes the game.
Fit criterion: after a menu exit and re-entry, `UE4SS.log` has 0 lines «было TrivialObject» and the game survives 10 minutes of play with bow shots.

## Symptom
The owner's paste (23:13): `Unhandled Exception: EXCEPTION_ACCESS_VIOLATION reading address 0x000001435c99ebe9`, call stack — UE4SS frames, then `ConanSandbox_Win64_Shipping`, `kernel32`, `ntdll`. Crash folder `Saved/Crashes/UECC-Windows-BCA4054943BD8EF5F2D548ABA36C7FCE_0000` (23:13:25). No CrashReportClient process remained.

## Repro (not yet deterministic)
1. In the world, leave to the main menu (ESC → exit to main menu).
2. Enter the world again («Продолжить»).
3. Read `UE4SS.log`: from that moment `ConanCameraControl` prints «зум ThirdPersonCameraMinArmLength: было TrivialObject: … -> 130» (and Max, InterpSpeed) every ≈35 ms.
4. Within ≈1 minute — the crash.
`exec disconnect` by the pult does nothing in single player (23:17), so the agent cannot reproduce step 1 alone yet.

## Forensics
- `grep -c "было TrivialObject" UE4SS.log` — 4032 lines from 23:12:28 to 23:13:25; before the re-entry the same lines read numbers («было 130.0 -> 130», 22:57:54).
- The zoom guard (`main.lua`, the block reading `owner.TPCameraSocketOffsetTarget`) compared the target with the config every tick; the read returned garbage → `same = false` every tick → `write_pull_target` + `apply_zoom_range(owner)` every tick, into an object whose properties read as `TrivialObject` (not the live hero).
- Same minute, second suspect: `KrinikArrowAim` called `BP_PlayerFovController:SetFieldOfViewTarget(1)` from inside the post-hook of the same function (installed live at 23:11); last lines before the crash — shot #2 at 23:13:25.07, aim samples +0/+50 ms.

## Root cause / Hypotheses
1. (likely) The camera mod kept its old spring arm / owner after the hero was destroyed by the menu exit, and wrote float properties into freed or foreign memory every tick.
2. (possible) Re-entrant call of a BP function from its own UE4SS hook.

## Fix
- `ConanCameraControl`: the guard checks that the target reads as numbers; otherwise it writes nothing and asks for a rescan (once per 2 s). `apply_zoom_range` skips any field that does not read as a number.
- `KrinikArrowAim`: the FOV hold (re-entrant call) is off (`FOV_HOLD_ENABLED = false`).
- Relaunched 23:15 (`launch-bg.ps1` under the machine lock), world entered by the pult: `KrinikArrowAim` started by UE4SS itself, 0 «TrivialObject» lines. The menu exit / re-entry not re-walked (needs the owner's ESC menu).

## Guard (S1 package)
The type checks above ARE the guard (a write happens only into a field that reads as a number). Not yet proven red on the broken
version: the broken state needs a menu exit, which the pult cannot do (`disconnect` is a no-op). `GAP:` proof on the owner's next
menu exit; `ON-REAL-PATH: NOT YET`. Twin sweep owed: every Lua mod of the build that caches a game object across a world reload
(`KrinikHudOutline`, `KrinikFpsCounter`, `KrinikPauseGameInMenu`, `ConanModPackStatus`, `KrinikArrowAim` — `last_shot_pc`).

## Verification on the owner's path (2026-10-26 23:23)
Owner: «перезашёл» (ESC → main menu → «Продолжить»). `UE4SS.log`: 23:23:16 (main menu loaded, `/Game/Maps/Startup`) — «зум
ThirdPersonCameraMinArmLength: поле читается как TrivialObject … — не живой герой, запись пропущена» and «сторож: цель камеры не
читается (герой сменился?) — запись остановлена, ищу камеру заново» — two stops in total; 23:23:22 world loaded; 23:23:23 the mod
re-adopted the new hero's arm (numeric fields: Min 130, Max 2125, step 54); 23:23:48 «ЗУМ: штанга=455.0 | цель=455.0». «было
TrivialObject» writes — 0. Game alive. `ON-REAL-PATH:` the owner's menu exit / re-entry 23:23 — the guard went off exactly on the broken
state (proved red on the real threat). Hygiene: none. Functional run: the owner's re-entry, log read. Status stays 🔧 until a
10-minute play with shots after a re-entry; twin sweep still owed.

## Decisions made without the owner
- `[AI]` Turned the FOV hold off instead of searching for a safe variant first — a crash outranks a camera nuisance.

## Links
`plans/36_conan_build_debts_plans.md` item 34 · `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`
