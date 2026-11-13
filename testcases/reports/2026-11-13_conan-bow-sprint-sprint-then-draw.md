# Test run report — Conan: a sprint started BEFORE the draw survives the draw (bug 93, KrinikConanLocomotion · krinik_bow_sprint builds 5–7)

**Created:** 2026-11-13 10:44 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.0.1 build, pack `ConanExiles` working tree, UE4SS 1181

## 1. Work

The owner's bug (2026-11-13 09:14 «в момент натяжения, когда выполняется приближение камеры - спринт прерывается»): a sprint started before the draw broke
at the draw. Basis and cases: `testcases/TC_conan_bow_sprint_2026-11-10.md` — S1b (sprint first, then RMB, shot, keep running), S3 (draw + walk, no Shift),
S6 (draw + Shift standing); bug `bugs/93_conan_bow_sprint_breaks_when_drawing_during_sprint.md`.

## 2. Contour

The owner's test save `Game_1` (his new game of 2026-11-10), the hero (level 10) with bow 51401 that the hero CRAFTED by recipe 51401 and took up by a real
hot-bar key «3»; arrows 53612 in the backpack; god on (`god-on.sh`), creatures within 60 m killed (`quiet-stand.lua`), stamina refilled; stand
`tp_ground.sh 98739 205258`, run direction along the shore (control yaw ≈ 350, set by the owner 10:42); the game on the background path, real input by
`mouse-seq.ps1` after the owner-idle guard said FREE; sampler `ConanExiles/_config/sprint-bow-sample.lua` (100 ms request, ≈ 0.22 s real step).
REAL WORLD: accumulated — the owner's build and his own test save; data and machine — his PC; path — real keys and mouse into the game.

## 3. Runs

| # | Moment | Command | Outcome |
|---|---|---|---|
| 1 | 2026-11-13 10:26 | standing control: `mouse-seq.ps1 -Seq "rdown,wait:2500,lclick,wait:600,rup"` | 11 → 11,15,16 → shot «#1 … 3715 см/с» — the bow is truly wielded |
| 2 | 2026-11-13 10:30 | build 5, S1b: `mouse-seq.ps1 -Seq "kdown:W,kdown:0xA0,wait:1000,rdown,wait:1300,lclick,wait:500,rup,wait:200,kup:0xA0,kup:W"` | 7 at 660 through 7,11,15,16; «#2 из лука, заряд 0.19» |
| 3 | 2026-11-13 10:33 | build 6, S1b + S3 + S6 in one sequence (S1b as above, then `rdown,wait:600,kdown:W,wait:1500,kup:W,rup`, then `rdown,wait:600,kdown:0xA0,wait:1500,kup:0xA0,rup`) | all three as expected |
| 4 | 2026-11-13 10:43 | build 7 (no third lever), the same sequence along the shore | all three as expected |

## 4. Checks

Hygiene: `luac -p` of every build; the section's load lines «перехват K2_CanSprint поставлен», «перехват EvaluateMovement_RangeCombat поставлен».
Functional run: real keys and mouse into the live game; READ — the hero's substates, speed, MaxWalkSpeed, K2_CanSprint, bTrySprint, SprintKeyIsDown every step; the
KrinikConanArchery shot line.

| Case | Build 7 (run 4) | Status |
|---|---|---|
| S1b sprint first, then draw, shot, keep running | 7,39 at 660 → 7,11,39 → 7,11,15,16,39 at 660, try true → «#1 из лука, заряд 0.19» at 10:43:50 → 7 at 660 until the keys' release | pass |
| S3 draw + walk, no Shift | 11,15,16 at 192 (this hero's aim speed), no 7 | pass |
| S6 draw + Shift standing | 11,15,16, speed 0, try true, no 7 | pass |
| C1 cost | the minute of the runs on build 6: 2218 calls, 47 ms, «худший 2.000 мс» (clock step 1 ms) | open — a frame-time A-B owed |

## 5. Found

- The earlier runs of this session (09:4x–10:2x) had no real bow (fists, then a bow model the remote put into the equipment slot): their conclusions —
  «build 4 refuted», «WeaponEquipped stops the sprint at the draw» — were withdrawn (bug 93). Weapons made by `AddItemTemplate` cannot be wielded.
- With a wielded bow an RMB in a sprint does not call `WeaponEquipped`; the third lever (builds 5–6) never fired and was removed in build 7.
- The worst callback still reads 2 ms at a 1 ms clock step (finding 3 of judge round 2) — open.

## 6. Traces

`ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` lines `[KrinikConanLocomotion:BowSprint]` and `[KrinikConanArchery] #1 из лука` (10:26, 10:30, 10:33, 10:43);
the sampler's strings (session chat); frames `frame1`–`frame5` (session scratchpad) of the stand problems.

## 7. Verdict

pass — S1b, S3, S6 on build 7 by real input on the owner's save; open: S8 (overloaded hero), S9 (bow sheathed in a sprint), C1 (cost), the owner's own play.
