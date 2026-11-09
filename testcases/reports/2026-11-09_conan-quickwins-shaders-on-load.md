# Run report — Conan quick wins tier A: shaders on load (A1 `niagara.CreateShadersOnLoad`), cross-launch A-B-A-B

## Work
Case set `testcases/TC_conan_quickwins_tier_a_2026-11-09.md`, cases A1-L1…L4 (basis: `researches/ue5-guru-tweaks-2026-11/README.md` §2.1 A1, §4 item 1).

## Contour
Game `D:\Games\Conan Exiles 3.0.1` with the build, background path (`launch-bg.ps1 -HoldSec 0` → `enter-world-remote.sh` → `no-power-throttle.ps1`), weather stopped and frozen,
stand keeper off; machine lock `kumm` from 19:00, KCCP and kumm-5d quiet by message (KCCP lock released 19:01). One cold `krinik-show` flight per launch.

## Runs
| Launch | Moment | Side | Commands | World entry (launch → «мир загружен») |
|---|---|---|---|---|
| L1 | 2026-11-09 19:02:21 | A (value 0, `LastSetBy: Constructor`) | `launch-bg.ps1 -HoldSec 0` · `enter-world-remote.sh` · `bench-flight.sh krinik-show qwA1-L1-base` | 66 s |
| L2 | 2026-11-09 19:11:43 | B (`ini-temp.py add … qwA1 niagara.CreateShadersOnLoad=1`; log `Set CVar [[niagara.CreateShadersOnLoad:1]]`) | same, label `qwA1-L2-niagara` | 69 s |

| Launch | FPS avg (median) | 1 % low | hitches ≥ 50 ms (ms) | worst | first 60 s: hitches (ms) · worst | CPU / GPU ms |
|---|---|---|---|---|---|---|
| L1 A | 58.3 (64.8) | 22.9 | 59 (3650.2) | 140.1 | 17 (1014.9) · 67.5 | 15.0 / 12.21 |

## Checks
Hygiene: S0, S1 of the case set (grep of the pack; `ini-temp.py` add/revert byte-equal).
Functional run: in progress.

## Found
in progress

## Traces
`D:/Games/Conan Exiles Mods/_bench/<stamp>_qwA1-*.csv`, `bench-journal.jsonl`; `ConanSandbox.log` `Set CVar` lines.

## Verdict
partial — series in progress.
