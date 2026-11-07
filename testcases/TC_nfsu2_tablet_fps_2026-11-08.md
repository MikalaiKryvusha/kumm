# Test cases — Underground 2 Revived on the owner's tablet: FPS per setting

**Created:** 2026-11-08 · **Under test:** the port's settings and the game's graphics options on HEADWOLF Titan 1 · **Version/build:** nfsu2.xyz release of 2026-11-07 (game module 0d7cf059 and later), Chrome 156 WebAPK
**Test basis:** the owner's words (plan 50 header, verbatim) — ≥ 50 FPS, best picture, 120 if no visible loss; the port's own notes (`discord-bot/knowledge.md`: resolution rows, frame-rate pacing, phone graphics).

## 1. Goal vector

Achieve: the owner's free roam in the main world runs at ≥ 50 FPS sustained with the best picture this budget allows; every setting chosen by a row below.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHILE the owner drives in the main world away from the spawn, the game shall render ≥ 50 FPS | median of `#fps` over 20 s, `pause 0`, `drive 2` · ≥ 50 |
| R2 | WHILE the owner plays for 10 minutes, the frame rate shall not fall more than 10 % | FPS at minute 10 vs minute 1 · ≤ 10 % drop |

## 3. Coverage matrix

| Dimension | Values covered | NOT covered (risk) |
|---|---|---|
| Render scale (`render`) | 0.5 · 0.75 · 1.0 | 1.5 / 2.0 — above native, pointless on this GPU |
| In-game resolution row | native-size row · 720p | 1080p / 1440p rows — the port's notes say they draw more than 75 % |
| Car + road reflections | off · on (car 3, road 3) | intermediate levels — measured noise ±4 FPS hides them |
| Other options (DoF, glow, shadows, car LOD) | measured 2026-11-07 (research doc), 0–4 FPS each | re-measure skipped: below noise |
| Players' cars | 0 · 16 · 32 (main world, spawn) | 48 / 64 — the owner's 64 was the worst case already (2026-11-07) |
| `roam_rate`, `other_headlights` | default · low / off | `roam_delay`, `roam_extrap` — network smoothing, not frame cost |
| Frame rate cap | 60 · 120 · 30 | 240 / uncapped — benchmark only |
| Display refresh | 144 Hz (owner's) · 120 Hz | 90 / 60 Hz |
| Time | first minute · 10-minute soak | longer sessions |

## 4. Stand

- Place GPU: own empty world (`roam_room = krtest77`), the car standing at the garage door after «Возвращение в город»; camera behind the car. Place crowd: the main world, the same spot (every player spawns there).
- Driving state only: menus closed, counter `pause 0` and `drive 2`; settle 10 s, then `sample.js` 20 s (median / worst FPS, frame ms, tris, cars near).
- Thermal status from `dumpsys thermalservice` logged per case; the tablet on battery, background apps as the owner left them.
- Machinery: CDP over `adb forward tcp:9333 localabstract:chrome_devtools_remote` — `setini.sh` (settings.ini), `setreg.js` (registry.txt), `cdp-keys.mjs` (keys), `to_city.sh` (Play → city), `sample.js`, `shot.sh` (scratchpad tools of the session).
- After the run: the owner's world back to the main one, the chosen settings applied, the game quit without saving (no progress played).

## 5. Cases

| ID | Stand | Setting under test | Expected | Status | Observation |
|---|---|---|---|---|---|
| R2a | — | in-game resolution rows: list and the render size of each | rows named, sizes from the log | | |
| G1 | empty | scale 0.5, reflections off | > G2 if GPU-bound | | |
| G2 | empty | scale 0.75, reflections off | ≈ 49 (2026-11-07) | | |
| G3 | empty | scale 1.0, reflections off | < G2 if GPU-bound | | |
| G4 | empty | scale 0.5, reflections on | ≥ 50 would allow beauty + FPS | | |
| G5 | empty | scale 0.75, reflections on | ≈ 36 (2026-11-07) | | |
| G6 | empty | best of G1–G5, in-game row native vs 720p | the native row per the port notes | | |
| C1 | crowd | best G config, cars 16 | | | |
| C2 | crowd | best G config, cars 32 | | | |
| C3 | crowd | best G config, cars 0 | the crowd's cost without cars drawn | | |
| C4 | crowd | `roam_rate` 10 | | | |
| C5 | crowd | `other_headlights = off` | | | |
| F1 | empty | best config, fps 120 | reachable? | | |
| F2 | empty | display 120 Hz vs 144 Hz at fps 60: frame-time spread | 120 Hz even | | |
| M4 | main, city | chosen config, driving away from the spawn | ≥ 50 (R1) | | |
| T1 | main, city | chosen config, 10 minutes | ≤ 10 % drop (R2) | | |
| A1 | — | control: G2 repeated at the end | ≈ G2 (thermal drift check) | | |
