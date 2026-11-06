# Run report — Conan: the build vs the game without mod paks, A-B-A-B (MASTER_PLAN criterion 3)

## 1. Work

`MASTER_PLAN.md` criterion 3 (`[OWNER]` «не должно быть явных просадок производительности из-за модов» · 2026-10-26) — the build vs the game without paks within
fly-through noise over A-B-A-B pairs; plan 35 В1. Cases `testcases/TC_conan_build_vs_vanilla_paks_2026-11-06.md` (M1–M5).

## 2. Contour

Conan Exiles 3.0.1, `D:\Games\Conan Exiles 3.0.1`, the owner's save; background path (`launch-bg.ps1 -HoldSec 0`); the bench flight `krinik-show` (175 s) by
`_config/bench-batch.sh`; A — the build as shipped (`bench-batches/q5-build.txt`, new), B — `ConanSandbox/Mods/modlist.txt` renamed `.off` (`q4-vanilla.txt`; our
Lua instruments stay); 3840×2160; the machine lock for the series; the LBPR graft of the same day is in A.

## 3. Runs

- 2026-11-06 14:43–14:55 +03:00 A (launch 1): `bash bench-batch.sh bench-batches/q5-build.txt` · 14:55–15:07 B (launch 2): `mv modlist.txt modlist.txt.off`; `bash bench-batch.sh bench-batches/q4-vanilla.txt`
- 2026-11-06 15:07–15:19 +03:00 A (launch 3) · 15:20–15:31 B (launch 4); `powershell -File close-game.ps1` after each; modlist restored 15:31 (`ls Mods | grep modlist` → `modlist.txt`).

## 4. Checks

- Hygiene: none (no code changed for the run; `q5-build.txt` is a three-line batch).
- Functional run: four launches on the real game, each warm-up + 2 flights, the bench's numbers READ per flight:

| Flight | fps (median) | 1 % low | stutters ≥50 ms | worst ms | CPU ms | GPU ms |
|---|---|---|---|---|---|---|
| A1 (launch 1) | 57.9 (63.9) | 23.5 | 51 | 164 | 15.23 | 12.14 |
| A2 (launch 1) | 59.4 (65.7) | 23.3 | 56 | 181 | 14.80 | 12.06 |
| B1 (launch 2) | 63.8 (70.1) | 26.7 | 27 | 176 | 13.82 | 11.70 |
| B2 (launch 2) | 67.5 (72.7) | 30.5 | 16 | 167 | 13.34 | 11.62 |
| A3 (launch 3) | 56.9 (62.0) | 23.5 | 36 | 155 | 15.66 | 12.06 |
| A4 (launch 3) | 58.1 (63.5) | 24.3 | 33 | 149 | 15.31 | 12.05 |
| B3 (launch 4) | 62.7 (67.4) | 28.6 | 20 | 182 | 14.38 | 11.80 |
| B4 (launch 4) | 56.1 (61.4) | 23.6 | 49 | 119 | 15.81 | 12.47 |
| **A mean** | **58.1** | 23.7 | **44** | — | **15.25** | 12.08 |
| **B mean** | **62.5** | 27.4 | **28** | — | **14.34** | 11.90 |

  M1–M4 pass (numbers recorded); M5 — by the case's rule «the A-B difference ≤ the same-side spread»: fps 4.4 ≤ B's spread 11.4 (56.1–67.5), CPU 0.9 ms ≤ B's 2.5 —
  pass, narrowly.

## 5. Found

1. The build costs ≈ 0.9 ms of CPU per frame and ≈ 4 fps on average over the game without paks, with ≈ 16 more stutters ≥50 ms per 175 s flight; the difference is
   within the flight's noise only because one B flight (B4) was as bad as the build — A sits at B's low end in every measure.
2. The B world is not the A world (no mod NPCs, no Caverns of Set, no mod buildings — `bench-batches/README.md`): part of the difference is content, not cost.
3. The flight's own noise is large (B: 56–68 fps between flights of the same side) — a smaller effect needs more pairs.

## 6. Traces

The bench lines above (`bench-batch.sh` output, tasks bk751r015 / ba77tuis4 / bvq6efay2 / blf489wnt of the session); the bench's own files under
`ConanExiles/_config` (the batch log) and `Saved/Logs/ConanSandbox.log` per launch; no crash (close-game: «crash reporter: none» ×4).

## 7. Verdict

partial — criterion 3's rule holds over A-B-A-B, narrowly; the build is consistently a little heavier (+0.9 ms CPU, +16 stutters per flight). Next: split the cost by
pak groups (B + one group at a time) and by our Lua mods (plan 34), and more pairs for a tighter noise band.
