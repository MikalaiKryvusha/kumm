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
| M1 | A, launch 1 | warm-up + 2 flights | numbers recorded | — | |
| M2 | B, launch 2 (modlist off) | warm-up + 2 flights | numbers recorded | — | |
| M3 | A, launch 3 | warm-up + 2 flights | numbers recorded | — | |
| M4 | B, launch 4 | warm-up + 2 flights | numbers recorded | — | |
| M5 | the four launches | compare A vs B against the noise (A1 vs A3, B2 vs B4) | the A-B difference ≤ the same-side spread | — | |
