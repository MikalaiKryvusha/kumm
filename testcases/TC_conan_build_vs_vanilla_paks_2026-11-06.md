# Test cases — Conan: the build vs the game without mod paks, A-B-A-B (MASTER_PLAN criterion 3, plan 35 В1)

> **Created:** 2026-11-06 · **Parent:** `MASTER_PLAN.md` «What matters now» criterion 3 (`[OWNER]` «не должно быть явных просадок производительности из-за модов» ·
> 2026-10-26); `plans/35_conan_build_turnkey_quality.md` В1
> **Status:** 🔧 written before the run
> **Outbound:** —

**Test basis.** Criterion 3: the build vs the game without paks — the difference stays within fly-through noise over A-B-A-B pairs. Noise — the spread of
the two flights inside one launch and between the two launches of the same side.

**Dimensions.** Side (A — the build as shipped; B — `modlist.txt` renamed, no mod paks, our Lua instruments stay) · order (A-B-A-B, so drift over time shows) ·
the bench's own measures (`bench-flight.sh krinik-show`: frame-time median and worst, stutters, CPU busy). Not covered: other routes, multiplayer, long play.

## Stand

- `D:\Games\Conan Exiles 3.0.1`, the owner's save; background path `launch-bg.ps1 -HoldSec 0`, `enter-world-remote.sh`, screen 3840×2160; batches
  `_config/bench-batches/q5-build.txt` (A) and `q4-vanilla.txt` (B); the machine lock for the whole series; nothing else of ours running.

## Cases

| # | Situation | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| M1 | A, launch 1 | warm-up + 2 flights | numbers recorded | pass | 14:44–14:55: A1 57.9 fps (median 63.9), 1 % low 23.5, stutters ≥50 ms 51, worst 164 ms, CPU 15.23 ms, GPU 12.14; A2 59.4 (65.7), 23.3, 56, 181, 14.80, 12.06 |
| M2 | B, launch 2 (modlist off) | warm-up + 2 flights | numbers recorded | pass | 14:55–15:07: V1 63.8 fps (70.1), 1 % low 26.7, stutters 27, worst 176 ms, CPU 13.82, GPU 11.70; V2 67.5 (72.7), 30.5, 16, 167, 13.34, 11.62 |
| M3 | A, launch 3 | warm-up + 2 flights | numbers recorded | pass | 15:07–15:19: A1 56.9 fps (62.0), 1 % low 23.5, stutters 36, worst 155 ms, CPU 15.66, GPU 12.06; A2 58.1 (63.5), 24.3, 33, 149, 15.31, 12.05 |
| M4 | B, launch 4 | warm-up + 2 flights | numbers recorded | pass | 15:20–15:31: V1 62.7 fps (67.4), 1 % low 28.6, stutters 20, worst 182 ms, CPU 14.38, GPU 11.80; V2 56.1 (61.4), 23.6, 49, 119, 15.81, 12.47 |
| M5 | the four launches | compare A vs B against the noise (A1 vs A3, B2 vs B4) | the A-B difference ≤ the same-side spread | pass (narrowly) | fps: A 56.9–59.4 (mean 58.1), B 56.1–67.5 (mean 62.5) — difference 4.4 ≤ B's own spread 11.4; CPU A 15.25 vs B 14.34 ms mean (+0.9 ms, B's spread 2.5); stutters ≥50 ms A 33–56 (mean 44) vs B 16–49 (mean 28). The rule holds, but A sits at the low end in every measure — see the report |
