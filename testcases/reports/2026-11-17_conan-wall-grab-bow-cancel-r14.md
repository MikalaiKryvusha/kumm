# Test run report — Conan: the bow's draw stance ends at a wall grab (bug 105 G7, builds r12 → r15)

**Created:** 2026-11-17 04:59 +03:00 · **Run by:** the agent, real input (`mouse-seq.ps1`) only while `owner-idle.ps1` said FREE ·
**Version/build:** the Conan build on 3.1.0, pack working tree after `a3a6111` — KrinikConanLocomotion `krinik_wall_jump.lua` r12 → r13 → r14,
`krinik_air_combat.lua` (the shared `bow_in_hand`), `krinik_bow_sprint.lua` (reads it)

## 1. Work

The rest of judge round 2 of `cancel_draw` and the judges of 2026-11-17 (rounds 1–2 on r12 / r13): the stance re-read on the deferred step, the bow montage
stopped by identity (never «whatever is current»), a second look 300 ms after the cancel that ends a stance come back on the wall, honest log lines (read back,
the substates listed), the error of the grab call logged, one `bow_in_hand` for the three sections. Basis: the owner's decision of 2026-11-16 23:24 and his rule
of 23:51 (judge only while RMB is held — verbatim in `bugs/105_conan_jump_into_wall_does_not_grab.md`); cases `testcases/TC_conan_jump_wall_grab_2026-11-16.md`,
section «Re-run on r12».

## 2. Contour

The desert arch stand (`tp_ground.sh 17929 244723`, `wall-stand.lua find` ×2, `back.lua` 200 / 300 cm, `stand-keeper.sh` god + the 20 s kill timer), the game in
front (`launch-fg.ps1`), the owner's world save on 3.1.0; the 15 ms recorder `KUMM/.work/bow310/series-rec.lua` with a new `mt=` column (`GetCurrentMontage()`).
Stamina refilled by the remote before a case after G1 ran out of it. The bow wielded by `ToggleWieldWeapon()` after a restart (the save brought it sheathed; the
hot-bar key did nothing because the hero was still hanging on the wall from the previous case — off the wall first by `ExitClimbing()`).
REAL WORLD: accumulated — the owner's save and his game install with the whole 66-mod build; data and machine — his save, his PC; path — the player's own keys
(RMB, W, Space, LShift, LMB) sent as real input to the game in front.

## 3. Runs

All on 2026-11-17 (+03:00); `bash KUMM/.work/wallgrab/case.sh <name> <s> "<steps>"` unless named.

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-17 04:36–04:37 | r12 load: `powershell -File launch-fg.ps1` · `bash enter-world-remote.sh` | 0 · sections loaded, no «нет проверки» line |
| 2 | 2026-11-17 04:39 | montage probe by the remote during a draw: `bash pult.sh "lua return dofile('…/montage-probe.lua')"` ×9 | the draw = `AM_combat_2h_bow_combo_heavy_c0`; the remote's ≈ 2 s latency missed the release |
| 3 | 2026-11-17 04:40 | `case.sh shot_probe 6 "rdown,wait:2500,lclick,wait:1500,rup,wait:300"` | 0 · draw, shot, release tail and redraw = one montage |
| 4 | 2026-11-17 04:43:44 | r13 G7: `case.sh r13_g7 7 "rdown,wait:1500,kdown:W,wait:450,kdown:0x20,wait:80,kup:0x20,wait:1300,kup:W,wait:1800,rup,wait:300"` + 14 window frames | pass |
| 5 | 2026-11-17 04:45:19 | r13 G7e: `case.sh r13_g7e 6 "kdown:W,wait:450,kdown:0x20,wait:30,rdown,wait:50,kup:0x20,wait:300,kup:W,wait:2000,rup,wait:300"` + 6 frames | pass (the first try 04:44 refused: owner BUSY) |
| 6 | 2026-11-17 04:46:03 | r13 G1: `case.sh r13_g1 5 "kdown:W,wait:450,kdown:0x20,wait:80,kup:0x20,wait:1500,kup:W,wait:300"` | pass (grab), then the exhausted fall (stamina) |
| 7 | 2026-11-17 04:46:34 | r13 G7g: `case.sh r13_g7g 9 "rdown,wait:1500,kdown:W,wait:450,kdown:0x20,wait:80,kup:0x20,wait:300,kup:W,wait:1000,rup,wait:200,kdown:S,wait:1400,kup:S,wait:600,kdown:0x20,wait:80,kup:0x20,wait:1200,rdown,wait:1200,rup,wait:300"` | pass |
| 8 | 2026-11-17 04:47:46 | r13 S1b: `case.sh r13_sprint 6 "kdown:W,kdown:0xA0,wait:1000,rdown,wait:1300,lclick,wait:500,rup,wait:200,kup:0xA0,kup:W,wait:300"` | pass |
| 9 | 2026-11-17 04:55:4x | r14 G7: `case.sh r14_g7 7 "rdown,wait:1500,kdown:W,wait:450,kdown:0x20,wait:80,kup:0x20,wait:300,kup:W,wait:2500,rup,wait:300"` (after a run with the bow sheathed — unarmed, not counted) | pass |
| 10 | 2026-11-17 04:57:0x | r14 G7e: `case.sh r14_g7e 6 "kdown:W,wait:450,kdown:0x20,wait:30,rdown,wait:50,kup:0x20,wait:300,kup:W,wait:2000,rup,wait:300"` | pass |
| 11 | 2026-11-17 05:02 | r15 G7: `case.sh r15_g7 7 "rdown,wait:1500,kdown:W,wait:450,kdown:0x20,wait:80,kup:0x20,wait:300,kup:W,wait:2500,rup,wait:300"` | pass |
| 12 | 2026-11-17 05:11 | r15 G7e: `case.sh r15_g7e 6 "kdown:W,wait:450,kdown:0x20,wait:30,rdown,wait:50,kup:0x20,wait:300,kup:W,wait:2000,rup,wait:300"` (05:03 refused: owner BUSY) | pass |
| 13 | 2026-11-17 05:12 | r15 G1 with the bow in hand, no draw: `case.sh r15_g1bow 5 "kdown:W,wait:450,kdown:0x20,wait:80,kup:0x20,wait:1500,kup:W,wait:300"` | pass |

## 4. Checks

Hygiene: `luac -p` on the three files after every edit; `check-lua-game-thread.py` on the Scripts folder — «вызовов рабочего потока: 0»; three judge rounds (the
third on r14 — its result in the commit message).
Functional run: the player's path — real RMB / W / Space / S / LShift / LMB on the game in front, every row of the 15 ms recorder read for the whole time RMB was
held, the WallJump log lines read, frames looked at by the agent's own eye.

| Case | Status | What was read |
|---|---|---|
| R12-a load | pass | r12 and r13 starts: sections loaded, the three WallJump hooks set, no «нет проверки» |
| shot probe | info | RMB → 11 → 11,16 → 11,15,16; LMB → 16 ends; 11,15 on in the same montage 0.7 s; none 0.25 s; a held RMB → 11 again — written into the game map |
| R12-G7 (r13) | pass | grab 4.53 s with 11,15,16 → empty at once, montage none, view 75 → 107; RMB held ≈ 2.5 s on the wall, no relapse; frames `r13/g7_04.jpg`, `g7_05.jpg` — the climbing pose, the bow in the left hand, no aim view |
| R12-G7e (r13) | pass | RMB down in the flight at 2.43 (11), grab 2.64 → empty; RMB held to 4.81 on the wall, no relapse; frame `r13/g7e_4.jpg` — the hang pose with the bow |
| R12-G1 (r13) | pass | the tapped jump grabs (mm 7 at 2.38); the fall 0.6 s later is substate 14 — stamina gone (the game's rule) |
| R12-G7g (r13) | pass | after the cancel: dropped off, the game's own jump ran (mm 3), a new RMB drew (11 + the draw montage) — the attack flag left nothing behind (judge r12 item 4) |
| R12-S1b (r13) | pass | 7 at 660 through 7,11,15,16, the shot «#1 из лука», 7 at 660 after — the shared `bow_in_hand` in the sprint gate |
| G7 (r14) | pass | grab 3.93 → empty; log «… (подсостояния 11,15,16): анимация лука остановлена AM_combat_2h_bow_combo_heavy_c0 … висит на стене, стойки лука нет, атака игры false» and the 300 ms read the same; RMB held to 6.52 (2.6 s), no relapse |
| G7e (r14) | pass | RMB down in the flight at 2.18 (11), grab 2.36 → empty; log «… (подсостояния 11): … остановлена …», 300 ms the same; RMB held to 4.56 (2.2 s), no relapse |
| G7 (r15: judge r14's hardening — the re-check armed first and for every bow grab, montages told by object, a paused one stopped too) | pass | grab 3.85 → empty; the same two log lines; RMB held to 6.77 (2.9 s), no relapse |
| G7e (r15) | pass | RMB down at 2.18 in the flight, grab 2.58 → empty; log «(подсостояния 11): … остановлена …», 300 ms the same; RMB held to 4.56, no relapse |
| G1 with the bow, no draw (r15) | pass | the tapped jump grabs (mm 7 at 2.64); no cancel line, no error line from WallJump |

## 5. Found

- The montage of the draw IS the montage of the shot's release and of a redraw (one asset) — not a defect, a fact for the code (stop by identity, written into
  the game map «Монтаж натяжки»).
- The stand trap: a case that ends on the wall leaves the hero hanging; the next case's hot-bar key does nothing there (the game keeps weapons sheathed while
  climbing). `ExitClimbing()` by the remote before the next case.
- No defect of the change.

## 6. Traces

Rows `KUMM/.work/wallgrab/r13_g7.txt`, `r13_g7e.txt`, `r13_g1.txt`, `r13_g7g.txt`, `r13_sprint.txt`, `r14_g7.txt`, `r14_g7e.txt`, `shot_probe.txt`; frames
`KUMM/.work/wallgrab/r13/`; the game log `Conan Exiles 3.1.0/ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` 04:36–04:57 (WallJump / AirCombat lines).

## 7. Verdict

pass — G7 and G7e by the owner's rule (read while RMB is held) on r14 and the final r15 (pack `9a33796`); G1 with the bow on r15; G1, G7g and the bow sprint on r13 (r14 changed only `krinik_wall_jump.lua`'s cancel
block — not their code path). Not covered: the relapse branch (never fired live), the top of the wall (waits for the owner — interview #037 Q1), G6.
