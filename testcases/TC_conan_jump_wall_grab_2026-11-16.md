# Test cases — Conan: a jump into a wall grabs it (KrinikConanLocomotion, bug 105)

> **Created:** 2026-11-16 · **Parent:** `bugs/105_conan_jump_into_wall_does_not_grab.md`; the owner 2026-11-16 21:44 +03:00 (verbatim in the bug)
> **Status:** cases written 2026-11-16 21:44 +03:00, before the fix · **Outbound:** —

**Basis.** `[OWNER]` 2026-11-16 21:38 «Нужно чтобы герой если он летит в прыжке и касается стены - он цепляется за неё» · 21:42 «а нужно бежать к стене, на бегу
прыгнуть так, чтобы в полёте в стену ударится». The cause (recon just before this file, rows `wall_*_rows.txt`): vanilla grabs in the air only while Space is HELD;
the release clears `bWantsToClimb`.

**Stand.** The desert arch (17929, 244723 → `tp_ground.sh`), `wall-stand.lua find` twice (the climbable wall, yaw ≈ 159), the hero moved 3 m back along the wall
normal, facing it; god on, hunger off; real input by `mouse-seq.ps1` only while `owner-idle.ps1` says FREE; recorder `KUMM/.work/bow310/series-rec.lua` (`mm` movement
mode — 7 climbing, 3 falling; `wc` `bWantsToClimb`; `air`). Dimensions: Space tap / held × run-up / standing × wall / no wall × after a wall push; left out: gamepad,
swimming, mounted.

| Case | Steps (real input) | Expected | Status |
|---|---|---|---|
| G1 run-up jump, Space TAPPED 80 ms | W 0.45 s from 3 m, Space tap, W 1.5 s | the touch in the air → mm 7 (grab) | FAIL before the fix (rows `wall_b_rows.txt`: mm 3, falls) |
| G2 run-up jump, Space HELD | as G1, Space held 1.2 s | mm 7 (vanilla) — unchanged by the fix | pass before the fix (`wall_d_rows.txt`) |
| G3 control — sections out | G1 with Locomotion's sections out of the game copy | vanilla: no grab (proves who decides) | owed |
| G4 a jump with no wall ahead | W + Space tap in the open | lands normally, no climb, no stuck wish after landing (`wc` false on the ground) | owed |
| G5 the wall push does not re-grab the same wall | climb, Space (the `krinik_wall_jump` push) | pushed ≈ 0.5 m off, lands (or grabs only another wall) | owed |
| G6 wall to wall | two walls ≈ 1.5 m apart: push off one toward the other | grabs the second wall without holding Space | owed (needs a stand with two walls) |
| G7 a jump with the bow drawn into a wall | RMB held, W, Space tap into the wall | the owner's choice: grab (bow away) or not — ask before building | owed |
| G8 a jump onto a low rock / a slope | Space tap onto a waist-high rock | no climb onto non-climbable surfaces (the game's own rule) | owed |
