# Run report — Conan 3.1.0: a jump into a wall grabs it after a short Space tap (bug 105) and the wall push costs stamina (bug 106 item 1)

**Created:** 2026-11-16 22:59 +03:00 · **Run by:** the agent, real input (`mouse-seq.ps1`) only while `owner-idle.ps1` said FREE · **Version/build:** the Conan build on 3.1.0,
pack working tree — KrinikConanLocomotion `krinik_wall_jump.lua` builds r1 → r7 (the G7 bow-draw builds r8 → r11 — their runs and frames in the TC rows G7 / G7c / G7e)

## 1. Work

Bug 105: the owner's «в прыжке герой не цепляется за стену» (verbatim in the bug); the cause read 21:44 (the Space release clears `bWantsToClimb`). Bug 106 item 1: the push off
a wall must cost stamina (the owner 22:31, mid-run). Basis: `testcases/TC_conan_jump_wall_grab_2026-11-16.md`, cases G1–G10.

## 2. Contour

The owner's world on 3.1.0, the desert arch (`tp_ground.sh 17929 244723`, `wall-stand.lua find` ×2 → the climbable wall, yaw 159; `KUMM/.work/wallgrab/back.lua` → 3 m off
along the normal, facing it); `stand-keeper.sh` (god, enemies within 600 m killed every 20 s) — the stamina bar stayed honest (G10). The game on the background path, PIDs
28452 (control), 35976 (r1), r3, 36172 (r4), 14552 (r5), each closed by PID after its builds. Recorder `KUMM/.work/bow310/series-rec.lua` (15 ms, a row per change:
falling, `MovementMode`, `bWantsToClimb`); case runner `KUMM/.work/wallgrab/case.sh`; debug probes `hook-order.lua`, `stamina-probe.lua` (remote's Lua state). Machine lock
taken 22:19.

## 3. Runs

All on 2026-11-16 (+03:00), `bash KUMM/.work/wallgrab/case.sh <name> <s> "<mouse-seq steps>"` unless named:
- 22:22 · G3 control, Locomotion's `enabled.txt` out of the game copy · `mouse-seq.ps1 -Seq "kdown:W,wait:450,kdown:0x20,wait:80,kup:0x20,wait:1500,kup:W,wait:300"` · `g3_control_rows.txt`
- 22:26 / 22:27 / 22:29 / 22:30 · build r1: G1, G5, G1, G5b · `g1_fix_rows.txt`, `g5_push_rows.txt`, `g5b_r1_rows.txt`
- 22:35–22:38 · build r3: G1 (ground climb, then a short hop from 3.5 m), G4 with `hook-order.lua` armed · `g1_r3_rows.txt`, `g1_r3b_rows.txt`, `g4_dbg_rows.txt`
- 22:44–22:53 · build r4: G4 (open), G1 ×4 (30 ms tap), G10 first read, G5b, G5c, G9 · `g4_open_r4_rows.txt`, `g1_r4*_rows.txt`, `g5b_r4_rows.txt`, `g5c_r4_rows.txt`, `g9_r4_rows.txt`
- 22:57–22:58 · build r5 (final): G1, G5b + G10 by `stamina-probe.lua`, G4 (open) · `g1_r5_rows.txt`, `g5b_r5_rows.txt`, `g4_open_r5_rows.txt`
- 23:04–23:06 · build r6 (after judge round 2: the effect-based dedupe, the re-wish only when a release cleared a wish, the guard state before the charge): G1, G5b +
  G10 (79 → 59), G4 (open) · `g1_r6_rows.txt`, `g5b_r6_rows.txt`, `g4_open_r6_rows.txt`
- 23:14–23:20 · build r7 (after judge round 3: `left_wc` refreshed at every mode change, the state tied to the pawn's address, `wished` off before ExitClimbing), under the
  owner's grant «гоняй» 23:16: G1 ×4, G5b + G10 (81 → 61, no false «лазание кончилось» at the push), G4 (open), G9, G5c, the exhausted case (the game drops the hero) ·
  `g1_r7*_rows.txt`, `g5b_r7_rows.txt`, `g4_open_r7_rows.txt`, `g9_r7_rows.txt`, `g5c_r7_rows.txt`, `g10b_r7_rows.txt`
- rows in `KUMM/.work/wallgrab/`; the mod's and the probes' lines in `UE4SS.log` of the r5 launch (earlier launches' lines are gone — the log is rewritten at launch; quoted in the TC)

## 4. Checks

Hygiene: `luac -p` after every edit; judge round 1 on r1 (8 findings: 5 confirmed and fixed, 1 declined, 1 TC wording, 1 the owner's bow question); judge round 2 on r5 — see the commit.
Functional run: the real product (the owner's world, real keys), the recorder rows and the mod log read per case:
- G3 control — pass: vanilla bounces off on a tap.
- G1 tap jump into the wall — pass on r1 and r5 (r4 four times): the re-wish at the release, mode 7 at the touch.
- G2 held Space — pass before the fix (unchanged).
- G4 a jump in the open — fail on r3 (the landing clear lost), pass on r4 and r5.
- G5 / G5b / G5c the push — G5b fail on r1 (the same wall re-caught 0.13 s after the push), pass on r4 and r5; G5c pass on r4.
- G9 climbing down from a wall our wish gave — pass on r4.
- G10 the push's stamina — pass on r5: 79 → 59.
- G8 — partial (slopes at the wall's base, not a rock). G6 (two walls), G7 (the bow — the owner's choice) — not run.

## 5. Found

- UE4SS fires a hook registered on `InpActEvt_Jump_K2Node_InputActionEvent_27` for `_26` too (FName number) — the press and the release are one hook (EXP-0542, game map).
- One key event can reach the hook twice in the same moment (22:47:43.5360 / .5362).
- After the push inside `StartJump` the rest of the press body sets the wish again.
- Vanilla hanging still on a wall costs no stamina and regenerates none (81 / 108 for 15 s) — bug 106 item 2.

## 6. Traces

`KUMM/.work/wallgrab/*_rows.txt` (git-ignored), `UE4SS.log` of the 3.1.0 game (r5 launch), the TC rows.

## 7. Verdict

partial — the grab after a tap, the push guard, the landing / climb-end clear and the push's stamina pass by real input on r7 (r6 / r7 regression lines in Runs);
the exhausted refusal is unreachable (the game drops the hero, r7 23:20); G6 and a rock for G8 are not run; G7 is OPEN (TC G7 / G7e); the owner's final check is owed.
