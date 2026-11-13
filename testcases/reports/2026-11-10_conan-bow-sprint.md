# Test run report — Conan: sprint with the bow drawn (KrinikConanLocomotion · krinik_bow_sprint)

**Created:** 2026-11-10 19:57 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.0.1 build, pack `ConanExiles` working tree of 2026-11-10 evening,
UE4SS 1181

## 1. Work

The owner's order (2026-11-07 20:50 «Спринт и стрельбу делаем возможными одновременно»; 2026-11-10 19:09 «Спринт с луком делаем»): the hero sprints with the bow
drawn and shoots on the run. Basis and cases: `testcases/TC_conan_bow_sprint_2026-11-10.md`. Three builds: live remote hooks (lever discovery), section build 1,
section build 3 (after judge round 1).

## 2. Contour

The owner's save, the oasis camp and later `river_bend` (open ground), god on (`god-on.sh`), the bow `BP_bow_2h_C` on `Socket_Bow`, stamina refilled by the remote before
each case; the game on the background path; real input by `mouse-seq.ps1` only after `owner-idle.ps1` said FREE; sampler `ConanExiles/_config/sprint-bow-sample.lua`
(game-thread chain). REAL WORLD: accumulated — the owner's save and his whole build; data and machine — his PC; path — real mouse and keys into the game.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 19:23 | `mouse-seq.ps1 -Seq "kdown:W,kdown:0xA0,wait:2800,…"` (control, no draw) | 0 — sub 7, max 735 |
| 2 | 19:24 | `mouse-seq.ps1 -MinIdle 0 -Seq "rdown,wait:700,kdown:W,kdown:0xA0,wait:2800,…"` (no levers) | 0 — sub 11,15,16, max 214, K2_CanSprint false |
| 3 | 19:25 | same + remote post-hook `K2_CanSprint` only | 0 — can=true, max 214 (no sprint); the hook saw only the sampler's calls |
| 4 | 19:26 | same + remote hook `EvaluateMovement_RangeCombat` → false | 0 — sub 7,11,15,16, max 735 |
| 5 | 19:28 | `mouse-seq.ps1 -MinIdle 0 -Seq "rdown,wait:400,kdown:W,kdown:0xA0,wait:1800,lclick,…"` | 0 — Archery «#1 из лука, заряд 0.52» 19:28:20, the sprint went on |
| 6 | 19:33 | section build 1, cases S0 S1 S3 S4 S2 (`run_case` loop of `mouse-seq.ps1 -MinIdle 0`) | S0 S1 S2 S3 pass; S4 428 instead of 214 (fail) |
| 7 | 19:44 | build 2 (direction window), S1 S4b S2 | S1, S4b (diagonal 46°), S2 pass; S4 S3 refused by the owner-idle guard (exit 5) |
| 8 | 19:53–19:56 | build 3 (one gate, judge round 1), S0 … S2 | S0 pass at `river_bend`; S1 S4 S6 S3 S2 refused (exit 5: the owner at the keyboard / own input counted) |

## 4. Checks

Hygiene: none separate (the Lua loads; the section's log lines «перехват … поставлен», «окно направления спринта из таблицы игры: 0…65°»).
Functional run: real mouse and keys into the live game, the hero's substates, MaxWalkSpeed and speed READ by the sampler; the shot read in the Archery log.

| Case | Build 1 | Build 3 |
|---|---|---|
| S0 control | pass | pass (19:56, 735) |
| S1 draw + sprint | pass (735 with 15 / 16) | NOT RUN (owner at the keyboard) |
| S2 shot on the run | pass | NOT RUN |
| S3 draw + walk | pass (214) | NOT RUN |
| S4 draw + sprint sideways | fail (428) → build 2 window | NOT RUN |
| S6 draw + Shift standing | — (new after judge round 1) | NOT RUN |
| C1 cost | 2386 calls / 690 ms / worst 6 ms per minute (fail) | 2160–2217 calls, 14–67 ms, worst ≤ 1 ms tick per minute in the agent's minutes 19:53–19:55 — **CORRECTED 2026-11-13: not a pass**; the same build read «худший 2.000 мс» at 19:56:46 and 20:39–20:41 (the owner's play; judge round 2, finding 3) — re-measure on build 4 (bug 93) | <!-- claim-ok: 19:56 and 20:39–20:41 are log times of 2026-11-10, the date of the correction is 2026-11-13 -->

## 5. Found

- Build 1: sprint sideways with the bow drawn went to the «Side» row (428) — the game's direction window lives in the movement row, not in `EvaluateMovement_Sprint` (fixed in build 2).
- Build 1: the gate cost 690 ms a minute, worst 6 ms (fixed in build 3: a property read first, the gate cached for 5 ms).
- Judge round 1: K2_CanSprint forced true without the direction / movement gate (standing would enter the sprint substate) — fixed in build 3, case S6 owed.
- The agent's own probe scripts used `LoopAsync` whose stop flag was re-made each step — never stopped, off the game thread: the likely cause of the 19:14 crash
  (bug 85 forensics; `sprint-run-probe.lua` rewritten to a game-thread chain).

## 6. Traces

`ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` lines `[KrinikConanLocomotion:BowSprint]` and `[KrinikConanArchery] #1 из лука` (19:28:20, 19:33:50, 19:44:36); the crash
folder `UECC-Windows-67A04B4E49867DEF115B83A157440469_0000`; the bytecode read `EvaluateMovementType` (session scratchpad, re-made by `retoc-5.8 to-legacy --filter
BaseBPCombat` + `kismet-trace.py`); the table read — game map «The movement row».

## 7. Verdict

partial — the mechanic works by real input on builds 1–2 (sprint with the draw kept, a shot on the run); build 3 (the shipped one) is verified only by S0 and the
cost line; S1, S2, S3, S4, S6 on build 3 are owed to the next free-PC window.
