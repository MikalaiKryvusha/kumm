# Run report — Conan: frame-time baseline after the owner's CPU + DDR4 overclock, and the cost of reflections variant 6 «pure rays»


## 1. Work

`testcases/TC_conan_overclock_baseline_and_pure_rays_2026-11-08.md` — P1–P5 (the owner 2026-11-08 23:05 «2 - замер делаем, да», 23:16 «ты мог бы
прогон производительности запустить»).

## 2. Contour

game `D:\Games\Conan Exiles 3.0.1` with the build as installed at 23:18 (KrinikConanGameplay BEFORE the vanilla patches), background path
(`launch-bg.ps1`, PID 21272, 23:18:19), world by `enter-world-remote.sh` (26 s), `no-power-throttle.ps1` (throttle off PID 21272), stand keeper off, machine lock
`kumm` 23:17:47. The machine: the owner's light CPU + DDR4 overclock and steeper CPU fan curve (2026-11-08, HOUSE_RULES dossier).

## 3. Runs

one batch `oc_batch.sh` (scratchpad): for each step `set-reflections.sh <now|6>` (read back) → `bench-flight.sh krinik-show <label>`:
- 2026-11-08 23:20:40 → 23:35:57: `oc-A1` (now) · `oc-6a` (6) · `oc-A2` (now) · `oc-6b` (6), 174.9 s each.

## 4. Checks

Hygiene: read-backs «0.0 1.0» (now) and «1.0 0.0» (6) before each flight; every flight 174.9 s, route done.
Functional run: the live game on the background path; PresentMon numbers per flight READ from the batch output:

  | Flight | Variant | avg FPS | median | 1 % low | hitches ≥ 50 ms | worst ms | GPU ms | CPU ms |
  |---|---|---|---|---|---|---|---|---|
  | oc-A1 | as shipped | 61.5 | 67.3 | 25.9 | 26 | 147.1 | 11.87 | 14.41 |
  | oc-6a | pure rays | 48.8 | 52.8 | 22.7 | 42 | 137.8 | 13.61 | 18.44 |
  | oc-A2 | as shipped | 54.9 | 60.3 | 22.5 | 57 | 296.6 | 12.47 | 16.11 |
  | oc-6b | pure rays | 48.2 | 53.5 | 19.9 | 87 | 350.9 | 13.66 | 18.21 |

- P5 overclock: as shipped now avg 58.2 / median 63.8 / CPU 15.3 ms vs the pre-overclock rtb-A1 / rtb-A2 of 2026-11-08 12:5x (same route, background,
  throttle off) avg 49.8 / median 55.5 / CPU 17.6 ms → **≈ +17 % avg FPS, +15 % median, −13 % CPU per frame.** Caveat: the two batches ran at different real
  and in-game times; the A1→A2 drift inside this batch alone is 11 %.
- P5 variant 6: avg 48.5 vs 58.2 → **≈ −17 %**, median 53.2 vs 63.8 (−17 %), CPU +3.0 ms, GPU +1.5 ms, hitches 42 / 87 vs 26 / 57. Variant 6 costs about twice
  variant 5 (−8 %, 2026-11-08) — the two more screen paths it turns off hand more work to the rays.
- Interference: 23:25–23:27 a disk-wide grep of mine ran during `oc-6a` (stopped by TaskStop); `oc-6b` (clean) gives the same numbers as `oc-6a` within 1 FPS,
  so `oc-6a` is kept.

## 5. Found

- none (no defect; two measurements).

## 6. Traces

`D:\Games\Conan Exiles Mods\_bench\2026-11-08_23*_oc-*.csv` and `bench-journal.jsonl`; the batch output — scratchpad task `buu5v1vng`.

## 7. Verdict

pass — both numbers measured; the overclock gain carries the caveat of different times of the two batches.
