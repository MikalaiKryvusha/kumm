# Run report — Conan 3.1.0: the bow sprint and the aim zoom with the sprint, jump and exhaustion (bug 93, Z7–Z10, S1b-310, S1d, S5b)

**Created:** 2026-11-16 21:24 +03:00 · **Run by:** the agent; the owner's hands for the runs of 20:33–21:13, the agent's real input (`mouse-seq.ps1`) under the owner's grant «комп твой» for 21:19–21:23 ·
**Version/build:** the Conan build on 3.1.0, pack working tree (KrinikConanArchery `main.lua` section «зум прицела и спринт» reworked five times this run; KrinikConanLocomotion `krinik_air_combat.lua` jump cost)

## 1. Work

Bug 93 «NEXT» on 3.1.0: the stand (a bow that wields), the control case of the bow sprint (S5b), the sprint-first draw (S1b-310), the Shift release with the draw held (S1d),
and the owner's new remarks of this run — the camera jerk on RMB in a sprint (Z7), the jerk at a stamina break standing (Z8), the zoom in a sprint jump (Z9), the free
mid-draw jump (Z10). Basis: `testcases/TC_conan_bow_sprint_2026-11-10.md` (section «On Conan 3.1.0»), the owner's words verbatim in `bugs/93_…`.

## 2. Contour

The owner's world on 3.1.0, the oasis beach (−80122, 247494 → along the shore), god on, hunger and thirst off; stamina honest from 21:07. The bow — a crafted 51401 from
quick slot 3 taken up by the owner's real «3» (`HasWeaponsEquipped` true). The game on the background path, brought forward by the owner or by `mouse-seq.ps1`. Recorder
`KUMM/.work/bow310/series-rec.lua` (every 15 ms, a row per change: substates 7 / 11 / 13 / 14 / 15 / 16 / 18, speed, MaxWalkSpeed, `bTrySprint`, `SprintKeyIsDown`, RMB,
the FOV controller's mode / target, the camera angle, its distance, the arm, falling, frame gaps over 45 ms). The machine lock taken 20:29.

## 3. Runs

All on 2026-11-16 (+03:00):
- 2026-11-16 20:35 · the owner, sprint-first series · `bash pult.sh "lua _G.__sr_s=75; return dofile('D:/work/ai_sandbox/KUMM/.work/bow310/series-rec.lua')"` · rows `series_b_2035_rows.txt`
- 20:42 · control, `krinik_bow_sprint` out of the game copy's section list · rows `control_2042_rows.txt`; restored by `powershell -File .\Deploy-ModPack.ps1 -PackDir D:\work\ai_sandbox\ConanExiles -Deploy -Only KrinikConanLocomotion` (md5 = pack)
- 20:45, 20:49, 20:53, 20:57, 21:01, 21:08, 21:12 · the owner's checks of fixes 1–5 · rows `fix_2045_rows.txt`, `fix2_2049_rows.txt`, `jump_2053_rows.txt`, `jump3_2057_rows.txt`, `stam_2101_rows.txt`, `final_2112_rows.txt`
- 21:19:39–21:20:09 · the agent: `powershell -File .\mouse-seq.ps1 -Seq "<S1…S4>" -MinIdle 0` · rows `self_2119_rows.txt`
- 21:23:00–21:23:24 · the agent: Z1→Z2→Z3 and Z8 by `mouse-seq.ps1` · rows `self2_2122_rows.txt`

## 4. Checks

Hygiene: `luac -p` of both mods after every edit; five judge rounds on the diffs (findings verified against the recorder rows before acting).
Functional run: the real product (the owner's world, real keys and mouse), the recorder rows and `UE4SS.log` read per case:
- ST1 stand — pass (the 19:05–19:18 «no draw on 3.1.0» was a bow that did not wield).
- S5b control — pass: with the section out, RMB in a sprint ends 7 at once (max 237, aim 75°); the sprint through the draw is the section's work.
- S1b-310 draw in a sprint — pass (8 presses: 7,11 → 7,11,16 → 7,11,15,16 at 810).
- S1d Shift up with the draw held — pass (16 kept, speed to 237, zoom back).
- Z7 RMB press / release in a sprint — fail at 20:35 (6° swing), pass after fix 2 (3 of 3 releases at 102°, no row of motion) and in the agent's S2.
- Z9 a sprint jump with the draw — fail at 20:53 (zoom in mid-air) and 20:58 (zoom at landing), pass in the agent's S4 (mode 2 / 102° through two flights and landings).
- Z10 the mid-draw jump costs stamina — pass («выносливость -20» per jump, 21:12, 21:20).
- Z2 → Z3 aim, then sprint, then Shift up — fail in the agent's S3b (21:20, the game's own sprint view took the aim, no zoom back), pass after the fix (21:23:05 «зум вернулся»).
- Z8 exhaustion standing — fail (0.26 s of zoom on a lowered bow; a wrong first fix 21:07 broke the standing aim — removed 21:10), pass 21:23:24 (16 → 14 at t 32.68, zoom-out from 32.70, done 32.79, the draw ends 32.95).
- No frame gap over 45 ms in any run with the gap column (21:01 onward).

## 5. Found

- The camera swing on RMB release in a sprint (Z7) — fixed.
- A stamina break: our zoom-back fired on «11 or 15» → 102° → 75° → 108° — fixed (needs the hold 16).
- A sprint jump zoomed in mid-air and at landing (Z9) — fixed (a jump from a sprint is the sprint until 7 is back or the sprint is let go).
- The mid-draw jump push was free (Z10) — fixed (the game's `GetStaminaJumpCost`).
- The aim kept 0.26 s on a bow lowered by exhaustion (Z8) — fixed.
- The zoom not given back when the game's sprint view took the aim (S3b) — fixed.
- Open: the bow-sprint section's worst call 4–8 ms in the owner's minutes (`[KrinikConanLocomotion:BowSprint]` 20:36 / 20:37 / 21:02) — over the 1 ms budget, to find.
- Process: the agent's own wrong guess about an event's parameters (21:07) cost the owner a round — memory `owner-offers-bow-testing` amended.

## 6. Traces

`KUMM/.work/bow310/*.txt` (recorder rows per run), `D:\Games\Conan Exiles 3.1.0\ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` (lines «зум и спринт», «усталость», «AirCombat»), stand
frames `KUMM/.work/bow310/stand_*.jpg`.

## 7. Verdict

partial — every case of the owner's design passes by the agent's real input after the last fix; the owner's own check of the final build is owed, and the bow-sprint cost
(4–8 ms worst call) is open.
