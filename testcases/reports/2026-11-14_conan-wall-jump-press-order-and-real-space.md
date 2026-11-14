# Test run report — Conan wall jump: the press / release order, W1 / W7 re-run, W5 by a real Space

**Created:** 2026-11-14 16:37 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.1.0, pack `456bfda` (KrinikConanLocomotion `krinik_wall_jump`, judge round 2)

## 1. Work

The first item of the handover: re-run W1 and W7 of `testcases/TC_conan_wall_jump_2026-11-14.md` on pack `456bfda` (the judge's round-2 edit was deployed but
never run), and the player's path W5 (a real Space on the wall) while the PC was free. Basis: the owner's design (TC header) and the judge's round-2 owed item
«a long hold of the grab press still pushes».

## 2. Contour

The owner's world on the working install `D:\Games\Conan Exiles 3.1.0`, the game started by `launch-bg.ps1` (background path, PID 7904), world entered by the
remote; stand — the desert arch (`tp_ground.sh 17929 244723`), god on, `_config/wall-stand.lua`. Machine lock taken 16:28. REAL WORLD: accumulated — the owner's
save and his 66 mods as deployed; data and machine — his PC; path — the remote's twin of Space for W1 / W7, a REAL Space through `mouse-seq.ps1` (SendInput, the
game brought forward and the window given back) for W5.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-14 16:30 +03:00 | `bash pult.sh "lua _G.__ibp_filter='Jump'; return dofile('…/_config/input-bindings-probe.lua')"` | `Jump event 1 -> …_27 · Jump event 0 -> …_26` |
| 2 | 2026-11-14 16:32 +03:00 | `bash pult.sh "lua _G.__ws_crel=0.35; _G.__ws_climbcall=true; _G.__ws_step='climb'; …"` (true order, press at 0.15) | no climb (mode 3 → 1) — the take-off came before the remote's climb request |
| 3 | 2026-11-14 16:33 +03:00 | `bash pult.sh "lua _G.__ws_cpress=0.35; _G.__ws_crel=0.6; _G.__ws_climbcall=true; _G.__ws_step='climb'; …"` | mode 7 from 0.40 s to 1.2 s; no WallJump line |
| 4 | 2026-11-14 16:33 +03:00 | `bash pult.sh "lua _G.__ws_rel=0.25; _G.__ws_step='jumpwall'; …"` | log «прыжок со стены … (1)», pushed off |
| 5 | 2026-11-14 16:34 +03:00 | `powershell -File mouse-seq.ps1 -Seq "wait:600,kdown:0x20,wait:120,kup:0x20,wait:1200"` (hero on the wall by run 3's steps) | exit 0; log «прыжок со стены … (2)» |
| 6 | 2026-11-14 16:38 +03:00 | `powershell -File mouse-seq.ps1 -Seq "wait:500,kdown:0x20,wait:80,kup:0x20,wait:100,rdown,wait:450,lclick,wait:150,rup,wait:1200"` (hero on the wall) | push (3), no draw, no arrow |
| 7 | 2026-11-14 16:39 +03:00 · 16:44 | `bash pult.sh "lua _G.__ws_step='airshot'; …"` (ground, control) | draw at 0.31 s, arrows #1, #2 |
| 8 | 2026-11-14 16:40 +03:00 · 16:43 · 16:45 | `airshot` after the wall climb (16:43 and 16:45 with `_G.__ws_exit8=true`; 16:45 with a guarded debug hook on `DebugActionTryFailure`) | no draw; «NotAggressive» ×2 |
| 9 | 2026-11-14 16:47–16:52 +03:00 | remote samples of `GetCharacterState()` / the active montage through climb → push → landing; a push up 750 | EquipItem 1.35 s by a timer |
| 10 | 2026-11-14 17:01 +03:00 | (judge round 1 fixes in the stand) `climb` with the defaults; `airshot` on the wall and on the ground with the bow socket | climbed; wall: `bow@Socket_Bow` from 0.10 s, state 3 to 1.40 s |
| 11 | 2026-11-14 17:02 +03:00 | a guarded debug post-hook on `HandleOnMovementModeChanged` (mode, state, bow socket, substate 8), then `climb` + `jumpwall` | at the push: mode 3 ×2, state 4, `sheath_bow`, sub8 true |
| 12 | 2026-11-14 17:03 +03:00 | the 17:0x mod edit deployed (`Deploy-ModPack.ps1 -Deploy -Only KrinikConanLocomotion`), `close-game.ps1`, `launch-bg.ps1`, `enter-world-remote.sh` | fresh game, world in 8 s |
| 13 | 2026-11-14 17:04 +03:00 | `climb` with `_G.__ws_cpress2=0.6; _G.__ws_crel=0.5`, then `jumpwall` | «нажатие раньше 0.4 с … (1)», then push (1) |
| 14 | 2026-11-14 17:05 +03:00 | a new `climb` + `jumpwall` | push (2) |
| 15 | 2026-11-14 17:1x +03:00 | (judge round 4 fixes) `climb`; `climb` then `jumpwall` 0.5 s later (overlap) | `events: press@0.35 release@0.61`; «(older chain stopped at 0.51: press@0.35 release@0.51)»; the hero did not move — move / look input ignored (bug 102) |

## 4. Checks

Hygiene: NONE (no lint or unit for Lua mods; the deploy's own verify 114 present, 0 missing)
Functional run: the climb and the jump on the wall walked in the owner's world by the remote's input events (true order) and by a real Space; READ — the
class's binding table, the stand's mode / place / velocity samples, `UE4SS.log` lines of the mod, the hero's place before and after.

| Case | Status | Observation |
|---|---|---|
| bindings | pass | PRESS = `InpActEvt_Jump_K2Node_InputActionEvent_26` (InputKeyEvent 0), RELEASE = `_27` (1); the stand had them swapped — fixed (`wall-stand.lua`, `_G.__ws_cpress` added) |
| W7 (true order) | pass | press at 0.35 s → take-off, climb from 0.40 s; release at 0.6 s on the wall → no WallJump line, mode 7 kept to 1.2 s |
| W1r | pass | the press `_26` at 0.05 s → log «толчок 250 … (0.94, −0.35) и 350 вверх (1)» 64 ms after the command; velocity (231, −87, 303); +192 cm off, peak +62 cm at 0.4 s |
| W5 | pass | a REAL Space on the wall → log «прыжок со стены … (2)» at the press; the hero from (17456, 245081, −19668) mode 7 to (17707, 244975, −19892) mode 1 — 2.5 m off along the normal |
| judge round 2 «long hold pushes» | refuted | the release never calls StartJump (bindings + run 3) — a long hold cannot push |
| W6 control (ground jump) | pass | step `airshot` 16:39 and 16:44: draw (substate 11) at 0.31 s in the air, arrows #1, #2 fired (Archery «копия стрелы #N: удар …») |
| W8 | pass | run 13: a press 0.2 s after the grab → «прыжок на стене: нажатие раньше 0.4 с после захвата стены — лазание остаётся (1)», mode 7 kept; a later press pushed |
| W9 | pass | run 14: a second climb after a push → «прыжок со стены … (2)»; 0 «ошибка» lines in `UE4SS.log` |
| stand runner (rounds 1 and 4) | pass | runs 10, 13–15: defaults climb; a release never before its press; the real moments listed; an overlapped chain stops, sends its owed release and says so in the newer chain's samples |
| W6 (wall push) | blocked | a real Space + RMB / LMB 16:38 and the remote twin 16:40–16:45: no draw; `DebugActionTryFailure` → «NotAggressive»; after `ExitClimbing` the character state is EquipItem (3) for 1.35 s by a timer (push up 750: back to Aggressive at 1.35 s airborne, landed 1.78 s); our flight ≈ 1.1 s. The owner's call — interview #035 |

## 5. Found

- The stand `wall-stand.lua` fired the jump RELEASE as «the press» and the PRESS as «the release» (since 15:2x); the judge's round-1 blocker, the code comment and
  EXP-0530 inherited the order. Fixed in the stand; the comment of `krinik_wall_jump.lua`, the game map, the mod notes and the TC corrected; EXP-0531.
- The 0.4 s rule's log line said «это отпускание захвата» — wrong cause; reworded (deployed, runs at the next game start — TC W8).
- The bow cannot be drawn in the flight after a wall push: the game re-equips the weapon for 1.35 s after any climb exit (state EquipItem), longer than the
  flight. Substate 8 also stays: AirCombat's take-off hook runs at the push but sees the bow still in its sheath (state 4 Passive, `sheath_bow`) and
  leaves 8 (corrected 17:02 by a debug hook — the first reading «the hook does not run» was false). Not shipped as a fix — the feel is the owner's (interview #035).
- `InSubstate(40)` answers true together with 8 — 40 is outside `ECharacterSubState` (0–22): an artefact of the probe's 0..40 loop, not a state.

## 6. Traces

`D:\Games\Conan Exiles 3.1.0\ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` lines 16:32:59–16:34:10 (`[KrinikConanLocomotion:WallJump]`, `[AirCombat]`); the stand
samples are quoted in the TC rows W1r, W7, W5.

## 7. Verdict

pass — W1 and W7 hold on pack `456bfda` in the true input order, the player's path W5 works by a real Space, and the 17:0x edit holds W8 / W9 on a fresh
game. W6 blocked by the game's re-equip window (interview #035); the numbers 250 / 350 — the owner's eye. Found on the way: bug 102 (move / look input left
ignored after the hub session of 17:07–17:14, not yet reproduced).
