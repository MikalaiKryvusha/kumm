# Test run report — Conan: the jump off a climbed wall (KrinikConanLocomotion `krinik_wall_jump`)

**Created:** 2026-11-14 15:38 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.1.0 CL 383024, the Krinik build, KrinikConanLocomotion with the new
section deployed 15:32 (`Deploy-ModPack.ps1 -Only KrinikConanLocomotion`)

## 1. Work

The owner's design (2026-11-02 09:07, game map «Climbing»): Jump while climbing pushes the hero a little along the wall's normal and a little up. Cases W1–W6 of
`testcases/TC_conan_wall_jump_2026-11-14.md`.

## 2. Contour

The owner's world, background launch, god on; the desert arch wall (`tp_ground.sh 17929 244723`); the climb and the press by the remote — the hero's own jump input
events + the native `Climb(false)` in the air (`_config/wall-stand.lua`). REAL WORLD: accumulated — his world and save; data and machine — his PC; path — the remote's
twin of Space, NOT his key (W5 open).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-14 15:27 +03:00 | `bash pult.sh "lua _G.__ws_step='jumpwall'; return dofile('…/_config/wall-stand.lua')"` on the wall, no section yet | 0 · W2: mode 7 kept, speed 0 |
| 2 | 2026-11-14 15:33 +03:00 | the same after a failed climb (on the ground) | 0 · W3: an ordinary jump, no wall-jump line |
| 3 | 2026-11-14 15:34 +03:00 | `find` → `climb` (`_G.__ws_climbcall=true`) → `jumpwall` | 0 · W1: pushed off |
| 4 | 2026-11-14 15:35 +03:00 | the same with `gfxcapture` recording `_scratch/walljump/wj1.mp4` | 0 · clip: climbing → airborne off the wall → standing |
| 5 | 2026-11-14 15:38 +03:00 | climb, the hero turned 180° by the remote, `jumpwall` | 0 · W4: no push |

## 4. Checks

Hygiene: `luac -p krinik_wall_jump.lua main.lua` — ok; the section's load and hook lines in `UE4SS.log`.
Functional run: the climb and the press in the owner's world by the hero's own input events; READ — the section's log lines, the samples (movement mode, place,
speed every 0.1 s), the clip by eye (frame sheet `KUMM/.work/perks/shots/wj_sheet.webp`).

| Case | Status | Observation |
|---|---|---|
| W1 | pass | «прыжок со стены: толчок 250 от стены по нормали (0.94, -0.35) и 350 вверх (1)»; mode 7 → 3; velocity (231, −87, 308); +156 cm off and +63 cm at 0.7 s |
| W2 | pass | the game alone does nothing on Jump while climbing |
| W3 | pass | ground jump ordinary, no wall-jump line |
| W4 | pass | «впереди не стена — оставлено игре (1)», mode 7 kept |
| W5 | not run | the owner's real Space — his play / a free PC |
| W6 | partial | AirCombat's «выстрел в воздухе разрешён» (7)–(10) logged on the falls after the wall pushes — both sections live on the same jumps; no arrow fired |

## 5. Found

- The push comes after the SECOND jump event (with a 0.8 s gap between the events the push waited for it) — the same moment as the game's own ground jump.

## 6. Traces

`ConanExiles/_scratch/walljump/wj1.mp4`; the `[KrinikConanLocomotion:WallJump]` lines in the game's `UE4SS.log` of the 15:32 launch.

## 7. Verdict

partial — W1–W4 pass by the remote's twin of the key; the owner's real Space (W5) and the bow air shot alongside (W6) are open.
