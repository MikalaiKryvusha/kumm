# Run report — Conan: does the log spam make hitches? (N1 vs N1 + quiet log, A-B-B-A)

## Work
Method point 4 of `researches/conan-hitch-profiler/README.md`: the hot code of the hitches left with N1 sat next to log-output strings, and the flight writes ≈ 50
lines / s (AlMerayah `Custom_PvE_Raid` GetWorld errors, `MergeDataTables`, Funcom login retries). Control pair before any fix.

## Contour
Front path, fresh launch per side, weather frozen, machine lock `kumm` from 21:38. Both sides `[/Script/NavigationSystem.RecastNavMesh] bDoFullyAsyncNavDataGathering=True`
(`_config/bench-batches/ini-n1.txt`); B adds `[Core.Log] LogScript=Error · LogModController=Error · LogHttp=Error` (`ini-n1-quietlog.txt`). The game's ini restored after
every launch (sha256 `e337d3fd9ee7…`).

## Runs
`bash ConanExiles/_config/ab-launch.sh <ini-n1.txt> <ini-n1-quietlog.txt> <A|B> <label>` — L1 A 21:39:00 (`log-L1-n1`) · L2 B 21:43:58 (`log-L2-quiet`, the game
did not close in 60 s — own PID 5380 stopped) · L3 B 21:50:23 (`log-L3-quiet`) · L4 A 21:55:21 (`log-L4-n1`, own PID 30388 stopped).

## Checks
Hygiene: async flag read back `true` in every launch; log line count per launch.
Functional run: four cold `krinik-show` flights on the real build, PresentMon only:

| Launch | FPS | 1 % low | hitches ≥ 50 ms | worst ms | first 60 s | log lines |
|---|---|---|---|---|---|---|
| L1 A | 58.6 | 25.8 | 26 | 85.7 | 12 | 13 434 |
| L2 B | 57.4 | 25.3 | 20 | 93.2 | 7 | 8 453 |
| L3 B | 58.8 | 26.2 | 17 | 129.4 | 6 | 8 326 |
| L4 A | 60.4 | 26.8 | 17 | 84.3 | 8 | 13 438 |

Quiet log: −37 % log lines; hitches A 26 · 17 vs B 20 · 17 — inside the A spread (9); worst frame not better (B has the 129 ms).

## Found
- The log volume is NOT a hitch driver at this level: the log-output strings near the hot code are witnesses, not the cause.
- `close-game.ps1` again left a game after 60 s twice (L2, L4) — the series scripts stop their own PID.

## Traces
`D:/Games/Conan Exiles Mods/_bench/2026-11-09_21*_log-L*.csv`, `bench-journal.jsonl`.

## Verdict
pass (a negative result) — muting the noisy log categories brings no measured gain; not shipped. The AlMerayah GetWorld errors stay a cleanliness item, not a
performance one.
