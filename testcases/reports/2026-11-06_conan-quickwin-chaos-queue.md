# Run report — Conan: Quick Win `p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce` (from OblivionRemasteredPerformanceFix)

## 1. Work

`[OWNER]` 2026-11-06 15:29 «нужно будет изучить проект https://github.com/LTSharpe/OblivionRemasteredPerformanceFix и понять, если в нём наработки, который мы
можем легко и просто как Quick Win взять в конан». Recon `researches/conan-oblivion-perffix-recon/README.md` shortlist item 2; acceptance — `HOUSE_RULES.md` rule 7
(an A-B-A flight: CPU and stutters no worse).

## 2. Contour

Conan Exiles 3.0.1 with the build, the owner's save, background path, 3840×2160; batch `ConanExiles/_config/bench-batches/q6-chaos-queue.txt` (A = 1000, B = 100000,
set live by `exec`); the flight `krinik-show` 175 s.

## 3. Runs

- 2026-11-06 15:40–15:59 +03:00: `bash bench-batch.sh bench-batches/q6-chaos-queue.txt` (warm-up, A1, B1, A2, B2 in one launch; `#read` of five cvars first).
- 2026-11-06 16:01 +03:00: the line added to the live `Engine.ini` (`python ini-temp.py add <Engine.ini> q6 p.Chaos…=100000`), a fresh launch, `pult.sh "exec p.Chaos…"`.

## 4. Checks

Hygiene: none.
Functional run: walked on the real game, the bench's numbers READ:

| Flight | value | fps (median) | 1 % low | stutters ≥50 ms | worst ms | CPU ms | GPU ms |
|---|---|---|---|---|---|---|---|
| A1 | 1000 | 53.3 (59.2) | 20.8 | 80 | 201 | 16.43 | 12.23 |
| B1 | 100000 | 55.4 (61.0) | 22.5 | 53 | 166 | 15.93 | 12.15 |
| A2 | 1000 | 54.2 (59.8) | 21.0 | 77 | 162 | 16.26 | 12.25 |
| B2 | 100000 | 54.9 (60.4) | 21.9 | 60 | 202 | 16.08 | 12.06 |

  Both pairs point the same way: stutters −28 % (78.5 → 56.5 mean; the difference 22 vs a same-side spread of 3–7), CPU −0.34 ms, fps +1.4. Read before the
  flights (Constructor values): this cvar 1000, `p.MaxPayloadSize` 100000, `r.GPUScene.ParallelUpdate` 2048, `r.Nanite.Streaming.NumInitialRootPages` 2048,
  `r.RHICmd.ParallelTranslate.Enable` true. After the edit: `p.Chaos… = "100000" LastSetBy: SystemSettingsIni` at the start of a fresh launch.

## 5. Found

1. The line passes rule 7 with margin — taken into the build's `Engine.ini` (`ConanExiles/_unpacked/KrinikConanGraphics/Engine.ini`, top of `[SystemSettings]`).
2. `r.GPUScene.ParallelUpdate` is already set in Conan (2048) — shortlist item 3 drops. `NumInitialRootPages` is 2048 (recon proposed 3072) — open.
3. This session's absolute numbers are worse than the 14:43–15:31 series (stutters 77–80 vs 33–56 at the same setting): drift between sessions — compare only
   inside one launch.
4. The live `Engine.ini` keeps the line with ini-temp's mark `; KUMM-TEMP q6` (copy `Engine.ini.bak-q6`); the next deploy of the build writes the file whole.

## 6. Traces

Bench lines (session task brfjsq0k2), `Saved/Logs/ConanSandbox.log` (12:41–12:59 UTC reads and sets; 13:02 the ini set); no crash.

## 7. Verdict

pass — the line is taken; the next shortlist item is `p.MaxPayloadSize=10000000` (start-up value: an A-B-A-B across launches with `ini-temp.py`).
