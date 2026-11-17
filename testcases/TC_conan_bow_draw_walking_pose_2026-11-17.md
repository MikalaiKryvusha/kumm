# Test cases — Conan: the bow draw while walking keeps the standing draw (interview #038, bug 104)

**Created:** 2026-11-17 · **Under test:** the edit of `AB_human_male`'s AnimGraph (the torso slot `AttackMontageTorso3rd` layered over the locomotion) in a Krinik pak ·
**Version/build:** the Conan build on 3.1.0, pack `ee7e31c` + the edit (not built yet)
**Test basis:** `[OWNER]` 2026-11-17 09:18 (interview #038, verbatim there): A — «Как стоя»: while walking in the draw the right hand stays at the chin and the string is fully drawn,
as standing. The owner's symptom of 2026-11-16 18:40 (bug 104): the right hand with the arrow moves off the string when the hero starts moving.

## 1. Goal vector

Achieve: walking (W / A / D / S) in a full bow draw shows the same draw as standing — the right hand at the chin, the full string length, the arrow on the string;
the legs walk as before.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHILE the hero walks in a full draw, the right hand shall stay where it is in the standing full draw | the hand's place on a side frame vs the standing frame · the side-camera pair of bug 104 (`fixed-cam.lua`, 06:11 stand) · the same place by eye; the `b_r_hand` bone's offset from `b_head` read by the remote ≤ 3 cm from standing |
| R2 | WHILE the hero walks in a full draw, the legs shall keep the game's walking animation | a side clip · the walk cycle visible, no sliding |
| R3 | WHEN the draw ends (shot or RMB released) while walking, the arms shall return to the game's walking pose | a clip · no frozen arm |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered (risk named) |
|---|---|---|
| direction | W, A, D, S | diagonals (same blend — low) |
| speed | walk; sprint with the bow (bug 93 gate) | crouch-walk (its own pose branch — to read in the graph) |
| view | third person (side camera) | first person (the first-person body has its own slot `AttackMontageTorso1st` — checked after) |
| input | real RMB held (the remote's draw is not held — EXP: bug 107 runs) | — |

## 4. Cases

Stand: the 06:11 stand of bug 104 — the bow in hand, a side camera `fixed-cam.lua` 2.3 m to the right, chest height; RMB held by real input (`mouse-seq.ps1`, owner-idle FREE).

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| W1 | Standing full draw → frame: the hand at the chin (the reference) | baseline | [NOT-TESTED] |
| W2 | Full draw, W held 2 s → frame at 1 s: the hand as in W1 | partition (forward) | [NOT-TESTED] |
| W3 | A / D / S held → as W2 | partition (strafe, back) | [NOT-TESTED] |
| W4 | Sprint with the bow drawn (bug 93 gate) → the hand as W1 | partition (sprint) | [NOT-TESTED] |
| W5 | Release RMB while walking → the arms back to the walking pose | state (draw → no draw) | [NOT-TESTED] |
| W6 | First person: the draw while walking | partition (view) | [NOT-TESTED] |

## 5. Control cases — MUST

| # | Control → expected: the behaviour is absent | Status + evidence |
|---|---|---|
| K1 | The build before the edit (and vanilla, Archery + Locomotion out) — walking moves the hand forward, the draw shorter | pass · bug 104 frames `s1_stand` / `s2_walk`, `c1_stand_vanilla` / `c2_walk_vanilla` (2026-11-17 06:11–06:15) |

## 6. Verdict

[NOT-TESTED]
