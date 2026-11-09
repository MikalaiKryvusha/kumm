# Run report — Conan quick win N1: navmesh geometry gathering off the game thread (`bDoFullyAsyncNavDataGathering=True`)

## Work
Candidate N1 of `researches/conan-hitch-profiler/README.md` (the hitch profiler named the Recast navmesh geometry gathering on the game thread as the longest flight
hitch and ≈ 24 % of the game thread). Basis: the owner's ask 2026-11-09 19:39 «что делает движок в моменты фризных кадров» and the quick-win order of STATUS.

## Contour
Game `D:\Games\Conan Exiles 3.0.1` with the build, FRONT path (the owner's word 21:00 «гоу, в фореграунде»), one fresh launch per side, weather stopped and frozen,
machine lock `kumm` taken 20:59 and released 21:22, KCCP closed its chat. B = `[/Script/NavigationSystem.RecastNavMesh] bDoFullyAsyncNavDataGathering=True` appended to
the game's `Saved/Config/Windows/Engine.ini` before the launch; the ini restored from its copy after every launch (sha256 `e337d3fd9ee7…` each time).

## Runs
| Launch | Moment | Side | Flag read back | Commands |
|---|---|---|---|---|
| L1 | 2026-11-09 21:00:21 | A | false | `bash ConanExiles/_config/n1-launch.sh A n1-L1-base` |
| L2 | 2026-11-09 21:06:06 | B | true | `bash ConanExiles/_config/n1-launch.sh B n1-L2-async` (the game did not close in 60 s — stopped by its PID 32496) |
| L3 | 2026-11-09 21:12:12 | B | true | `bash ConanExiles/_config/n1-launch.sh B n1-L3-async` |
| L4 | 2026-11-09 21:17:12 | A | false | `bash ConanExiles/_config/n1-launch.sh A n1-L4-base` |

## Checks
Hygiene: the flag read live by `GetPropertyValue` in every launch; the ini hash after every launch.
Functional run: four cold `krinik-show` flights on the real build in front, order A-B-B-A; numbers by `bench-report.py` and `bench-first60.py`:

| Launch | FPS avg (median) | 1 % low | hitches ≥ 50 ms (ms) | worst ms | first 60 s hitches | CPU / GPU ms |
|---|---|---|---|---|---|---|
| L1 A | 59.4 (65.9) | 23.8 | 35 (2242.3) | 164.0 | 12 | 14.76 / 11.92 |
| L2 B | 60.3 (65.4) | 27.0 | 19 (1198.9) | 93.6 | 7 | 14.87 / 11.86 |
| L3 B | 59.0 (63.9) | 26.3 | 25 (1518.0) | 101.0 | 7 | 15.21 / 12.11 |
| L4 A | 57.8 (63.6) | 23.6 | 50 (3192.5) | 187.0 | 15 | 15.32 / 12.07 |

- Hitches: A 35 · 50 (mean 42.5, spread 15) vs B 19 · 25 (mean 22) → **−48 %**; both B below both A.
- Worst frame: A 164 · 187 vs B 94 · 101 → **−43 %**. 1 % low: 23.7 → 26.7 (+12 %). First minute: 12 · 15 → 7 · 7. FPS: same (+1 %).
- The traced flight of 20:49 showed the navmesh loop gone from every thread with N1 (`hitch-threads.py`).

## Found
- `close-game.ps1` left the L2 game running after 60 s; `n1-launch.sh` now stops its own leftover PID.
- The single traced N1 flight's 356 ms worst frame did NOT repeat untraced (94 / 101 ms) — consistent with the hypothesis that it was the trace's own disk load.

## Traces
`D:/Games/Conan Exiles Mods/_bench/2026-11-09_2101*_n1-L1-base.csv`, `…_n1-L2-async.csv`, `…_n1-L3-async.csv`, `…_n1-L4-base.csv`; `bench-journal.jsonl`.

## Verdict
pass — N1 halves the flight hitches and cuts the worst frame by ≈ 40 % with no FPS cost. NOT shipped yet: the owner's word, and NPC pathing in play checked by eye.
