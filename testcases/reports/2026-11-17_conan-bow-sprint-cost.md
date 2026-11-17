# Test run report — Conan: the cost of the bow-sprint gate, measured and reduced (bug 93 «Cost»)

**Created:** 2026-11-17 06:07 +03:00 · **Run by:** the agent, real input only while `owner-idle.ps1` said FREE · **Version/build:** the Conan build on 3.1.0, KrinikConanLocomotion
`krinik_bow_sprint.lua` — the committed gate (after `9a33796`) instrumented, then v2 → v4 (pack `965f10f`)

## 1. Work

The section's worst call read 2–8 ms against the 1 ms budget of all mods (MASTER_PLAN, HOUSE_RULES rule 7). Basis: bug 93 «Cost — recon from the code»
(hypotheses: a GC step or a preempted thread vs our own work) and the acceptance «the worst call ≤ 1 ms over 5 minutes of sprint play». Cases: the bow sprint's
TC (`testcases/TC_conan_bow_sprint_2026-11-10.md` S1b, S3, S6) for the behaviour; the minute cost line and a call microbench for the cost.

## 2. Contour

The desert arch stand facing the open desert (`tp_ground.sh 17929 244723`, the wall stand's yaw + 180), the bow wielded by `ToggleWieldWeapon()`, stamina
refilled per chunk, the stand keeper's kill timer OFF (a still scene for a measurement — HOUSE_RULES 6b), the game IN FRONT for the cost runs (rule 6f).
REAL WORLD: accumulated — the owner's 3.1.0 world save and the whole build; data and machine — his PC (light CPU / RAM overclock since 2026-11-08); path — the
player's real keys (W, LShift, RMB, LMB).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-17 05:18–05:21 | committed gate + the split minute line: `bash ConanExiles/_config/sprint-cost-run.sh 6 25000 draw` | 0 · minute lines 05:19 / 05:20 / 05:21 |
| 2 | 2026-11-17 05:23 | `bash pult.sh "lua return dofile('…/microbench.lua')"` and `microbench2.lua` (standing; per-call prices) | 0 |
| 3 | 2026-11-17 05:26–05:29 | v2 (one substate list, properties, player memo): `sprint-cost-run.sh 6 25000 draw` | 0 · minute lines 05:27 / 05:28 / 05:29 |
| 4 | 2026-11-17 05:31 | `bash pult.sh "lua return dofile('…/sprint-gate-microbench.lua')"` while sprinting drawn (`mouse-seq.ps1 -Seq "rdown,wait:900,kdown:W,kdown:0xA0,wait:9000,…"`) | 0 |
| 5 | 2026-11-17 05:33–05:36 | v3 (+ the bow kept per draw, the out table reused): `sprint-cost-run.sh 6 25000 draw` | 0 · minute lines 05:34 / 05:35 / 05:36 |
| 6 | 2026-11-17 05:45 | v3 S1b + S3 + S6: `bash KUMM/.work/wallgrab/case.sh v3_s1b_s3_s6 14 "kdown:W,kdown:0xA0,wait:1000,rdown,wait:1300,lclick,…"` | 0 |
| 7 | 2026-11-17 05:52 | v4 (judge fixes) sprint drawn + stamina drained by the remote: `case.sh v4_tired 10 "kdown:W,kdown:0xA0,wait:1000,rdown,wait:5000,…"` + `AdjustStaminaCurrent(-500)` | 0 |
| 8 | 2026-11-17 06:04 | v4 cost chunks: `sprint-cost-run.sh 4 25000 draw` | 5 · the owner at the keyboard — not run |

## 4. Checks

Hygiene: `luac -p` after every edit; `check-lua-game-thread.py` on the Scripts folder — 0 worker-thread calls; one judge round on v3 (7 findings, no defect, 6 fixed, 1 verified by run 7).
Functional run: the player's sprint with the bow drawn by real keys on the game in front; the section's own minute lines in UE4SS.log READ per build; the 15 ms
recorder rows read for S1b / S3 / S6 and the exhaustion.

| Case | Status | What was read |
|---|---|---|
| the spike's owner (run 1) | found | full path over the 1 ms step: 136 / 299, 67 / 107, 70 / 110 (45–64 %); light path 12 / 1555 (0.8 %) — our work, not preemption |
| call prices (runs 2, 4) | found | InSubstate 30–38 µs, IsPlayerControlled 36, GetVelocity 42, GetAngleOfMovement 24, IsMovingOnGround 6, the bow walk 54–67, GetSubstateList 36, property reads 0–3; the whole gate old 313 µs, v2 147 µs; ≈ 5 KB garbage a gate; a full Lua collect 2 ms |
| v2 (run 3) | partial | full-path crossings 32 / 51 / 49 %; own time 79–83 ms a minute |
| v3 (run 5) | pass | full-path crossings 19 / 21 / 18 %; own time 99 → 52 → 38 ms a minute; worst 1 ms in the steady minutes |
| S1b / S3 / S6 on v3 (run 6) | pass | 7 at 660 through draw and shot («#1 из лука»); draw + W → 192, no 7; draw + Shift standing → no 7 |
| exhaustion on v4 (run 7) | pass | the list [3, 14] with InSubstate(14) yes; the draw broken, the sprint ended (384) |
| the worst call ≤ 1 ms over 5 minutes | partial | 1 ms (the clock's step) in the steady minutes of v3; 5 minutes of v4 not run |

## 5. Found

- The spikes were the section's own work — ≈ 10 reflected calls per gate at 25–42 µs each plus the garbage they leave — not a preempted thread.
- `os.clock` here steps by 1 ms; «over the step» counts are the honest cost meter at this resolution.

## 6. Traces

UE4SS.log `[KrinikConanLocomotion:BowSprint] за минуту …` lines 05:19–05:36; rows `KUMM/.work/wallgrab/v3_s1b_s3_s6.txt`, `v4_tired.txt`; the tools
`ConanExiles/_config/sprint-cost-run.sh`, `sprint-gate-microbench.lua`.

## 7. Verdict

partial — the cost fell to about a third and the behaviour holds on v3 / v4; the 5-minute v4 cost run is owed (the owner came to the PC).
