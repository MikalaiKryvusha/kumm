# Run report — Conan: water reflections on five river beaches — no reflection · rays · software Lumen with reach; frames without the interface and one-minute FPS

## 1. Work

`testcases/TC_conan_water_reflections_five_scenes_2026-11-09.md` — S0, H1, W1–W5, F1–F6 (the owner 2026-11-09 00:07 – 00:47, verbatim in the TC header and HOUSE_RULES 11.6b).

## 2. Contour

Game `D:\Games\Conan Exiles 3.0.1` with the build, background path (PID 6908, 00:10:56), `no-power-throttle.ps1`, machine lock `kumm`; the stand keeper OFF (verified «[stand-keeper]
stopped» 00:48:40); per setting: weather stopped and frozen, NPCs within 600 m frozen, 30 s, then the frame and the capture. Beaches by the vista-fitted map + `shore-find.lua`.

## 3. Runs

- 2026-11-09 00:16 – 00:44 scouting (map markers, top-down frames, `beach-try.sh`, `shore-try.sh`) — markers are centres; the hero drowned once on a sea-floor point (00:29).
- 2026-11-09 00:44 – 01:02 three overlapping batches (a TaskStop-ped batch kept running) — captures cut to 7–39 s: VOID, CSVs moved to `_bench/_void_2026-11-09/`.
- 2026-11-09 01:02 – 01:10 `bash water-scenes.sh <ws> off,6,sw <5 scenes>` — scene 1 done, exit 4 at scene 2 (the 132-NPC freeze answered late, game alive).
- 2026-11-09 01:12 – 01:39 `bash water-scenes.sh <ws2> off,6,sw delta_jungle river_bend desert_arch oasis_falls` — exit 0.
- 2026-11-09 01:40 `C:/Python314/python.exe -X utf8 _config/water-scenes-report.py "D:/Games/Conan Exiles Mods/_bench" <review folder 76>`.

## 4. Checks

Hygiene: every capture 59.9–60.0 s; read-backs «0 0» (off, sw) and «1 0» (6) before each.
Functional run: the live game on the background path — 15 frames without the interface READ by eye (H1 pass: no HUD); 15 one-minute captures READ:

| Scene | off avg / median | rays (6) | software with reach (sw) |
|---|---|---|---|
| delta_falls | 56.2 / 62.1 | 31.2 / 31.5 (444 hitches) | 31.8 / 59.5 (630 hitches) |
| delta_jungle | 65.1 / 65.9 | 61.9 / 62.5 | 64.2 / 65.1 |
| river_bend | 74.2 / 74.8 | 72.1 / 72.7 | 74.0 / 75.9 |
| desert_arch | 71.7 / 73.8 | 67.5 / 69.0 | 70.0 / 72.1 |
| oasis_falls | 75.6 / 77.0 | 68.0 / 68.5 | 74.5 / 75.0 |

F6: over five scenes rays −12.3 % FPS (+3.6 ms CPU), sw −8.3 % (+2.9 ms); without delta_falls (its 6 / sw ran right after the first ray-tracing switch and hitched hundreds of
times while off was clean) rays ≈ −6 %, sw ≈ −1 %. Look (by eye, frames): off — sky-coloured water; rays — sharp near reflections of the rocks, the far water sky-light;
sw — warm, soft reflections of the cliffs and the shore over the whole water. delta_falls should be re-shot (6 and sw); its frames also show RAIN — the weather came back at that scene despite ForceStopAllWeathers + FreezeWeather (to check).

## 5. Found

- A stopped background batch keeps running (EXP-0493) — three batches cut each other's captures; guard still to build (`static-bench.sh` refusing while a PresentMon lives).
- The remote's answer window is shorter than a 132-NPC freeze — the freeze call is now non-fatal.

## 6. Traces

Review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\76_voda_5_plyazhey_otrazheniya\` (a subfolder per scene: triple frame, 4K frames, FPS chart; `fps_table.md`);
CSVs `_bench/2026-11-09_01*_ws-*.csv`; batch log `scratchpad/ws2/log.txt`.

## 7. Verdict

partial — four scenes measured cleanly, delta_falls' rays / sw captures carry hundreds of hitches and need a re-shot; the look is the owner's verdict.
