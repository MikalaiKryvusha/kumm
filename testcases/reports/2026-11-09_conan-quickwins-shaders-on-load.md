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
| L2 B | 56.8 (63.1) | 22.8 | 48 (3200.1) | 138.9 | 16 (1029.8) · 82.9 | 15.42 / 12.08 |
| L3 A | 60.8 (67.7) | 23.7 | 47 (2931.3) | 127.5 | 13 (767.2) · 79.6 | 14.35 / 11.94 |
| L4 B | 58.5 (64.5) | 25.0 | 28 (1934.3) | 224.8 | 10 (645.4) · 84.9 | 15.09 / 12.05 |
| L5 B (order reversed) | 57.0 (62.8) | 23.7 | 31 (2062.2) | 165.0 | 15 (973.5) · 100.6 | 15.51 / 12.08 |
| L6 A | 55.0 (60.8) | 22.5 | 49 (3196.0) | 167.0 | 16 (983.6) · 84.1 | 16.01 / 12.38 |

Launches L3–L6 at 19:18:34, 19:23:51, 19:29:12, 19:34:32 (same commands, labels `qwA1-L3-base`, `qwA1-L4-niagara`, `qwA1-L5-niagara`, `qwA1-L6-base`); world entry
22–24 s after «Продолжить» in every launch. RAM (working set) / VRAM after the flight: L2 6.50 GB / 10 999 MiB (read mid-flight at 6.36), L3 7.42 / 11 417,
L4 7.27 / 11 421, L5 — / 11 327, L6 7.41 / 11 187 (L1 not read).

## Checks
Hygiene: S0, S1 of the case set (grep of the pack; `ini-temp.py` add/revert byte-equal; the revert fix proven on a copy, then on the game after L4–L5).
Functional run: six cold `krinik-show` flights on the real build, background path, one per fresh launch, the cvar read back in `ConanSandbox.log` each launch.
- Hitches per flight: A 59 · 47 · 49 (mean 51.7, spread 12) vs B 48 · 28 · 31 (mean 35.7) → **−31 %**; pair differences 11 · 19 · 18 — two of three beyond the
  A spread; the reversed pair (L5 B before L6 A) keeps the sign, so the falling trend over launches (driver cache warming) does not make the whole gain.
- First 60 s: A 17 · 13 · 16 vs B 16 · 10 · 15 — no clear change (the flight's first minute is world streaming, not effect first use).
- FPS, CPU, GPU, RAM, VRAM: within the spread — no cost seen. Worst frame: not better (B has the single worst, 224.8 ms in L4).

## Found
- The game drops ini comment lines on exit and keeps the cvar line → `ini-temp.py revert` refused (19:17); fixed (a pairs sidecar), proven on a copy and on the game.

## Traces
`D:/Games/Conan Exiles Mods/_bench/<stamp>_qwA1-*.csv`, `bench-journal.jsonl`; `ConanSandbox.log` `Set CVar` lines.

## Verdict
pass for the flight proxy — `niagara.CreateShadersOnLoad=1` cuts flight hitches by ≈ 31 % with no measured cost; NOT shipped yet: the owner's word first; the first
fight (the line's real target) is not measured (case CB blocked).
