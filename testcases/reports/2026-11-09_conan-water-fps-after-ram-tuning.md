# Run report — Conan: FPS after the RAM sub-timing tuning (still beaches + the krinik-show flight), then view distance 2.0 → 1.5

## 1. Work

Plan `plans/51_conan_water_fps_after_ram_tuning.md` (KAGO, on the owner's word) · cases `testcases/TC_conan_water_fps_after_ram_2026-11-09.md` (G1–G2, W0, R1–R7,
C1, F1, D0, D1–D6). Basis: the night «before» `testcases/reports/2026-11-09_conan-water-reflections-five-scenes.md` (sw, background) and the 11-08 flight baseline
`testcases/reports/2026-11-08_conan-overclock-baseline-pure-rays.md` (`oc-A1` / `oc-A2`, background, reflections `now`).

## 2. Contour

Game `D:\Games\Conan Exiles 3.0.1` with the build; RAM latency 93.5 ns median (KAGO `mem-latency.mjs` 15:26; before 109); machine lock `kumm` 15:26–16:4x; KCCP held off
(HOUSE_RULES 11.6c), handed back 16:4x. `no-power-throttle.ps1`, god on, `t.MaxFPS 141`, stand keeper off; per scene weather stopped + frozen, NPCs within 600 m frozen, 30 s, 11:00.
Three game sessions: PID 24712 (front, then background — crashed 16:06:32 on our freeze tool), PID 19576 (background, flights), PID 26056 (front, distance 1.5).

## 3. Runs

- 2026-11-09 15:26 `bash water-scenes.sh … sw` with a live / dead lock PID — G2.
- 15:3x a 15 s PresentMon probe + `bash static-bench.sh g1-test 10` — G1.
- 15:3x `NO_BENCH=1 bash water-scenes.sh <ws-warm> sw <5 scenes>` (front) — W0.
- 15:38–15:50 `bash water-scenes.sh <ws-ram> sw <5 scenes>` (front) — R1–R5 front.
- 15:5x `bash water-scenes.sh <ws-bg> sw "river_bend …"` (background) — C1; 15:55–16:05 the same for five scenes (background) — R1b–R5b.
- 16:06 `set-reflections.sh now` + two `bench-flight.sh krinik-show` — VOID: the game crashed on the first command (`freeze-npcs.lua` undo).
- 16:1x relaunch, the crash sequence again after the fix (freeze at delta_falls, teleport to oasis_falls, freeze, undo) — F1; then `set-reflections.sh now`, 30 s,
  `bench-flight.sh krinik-show ram-A1` · `ram-A2` (background) — R7.
- 16:18 `python _config/deploy-config.py Engine.ini` (distance 1.5), launch in front, live read-back — D0; 16:2x–16:39 warm-up + `water-scenes.sh <ws-d15> sw <5 scenes>` — D1–D5.

## 4. Checks

Hygiene: read-backs before every capture (RT 0 · ScreenTraces 0 for sw; «0.0 1.0» for `now`); every still capture 59.9–60.0 s, every flight 174.9 s, route done.
Functional run: the live game, front and background paths; PresentMon numbers READ from the batch outputs; frames looked at (sheets).

**RAM, still beaches (background vs the night's background), sw:**

| Scene | before | after | Δ |
|---|---|---|---|
| delta_falls (rain both times) | 66.9 | 64.1 | −4.2 % |
| delta_jungle | 64.2 | 66.0 | +2.8 % |
| river_bend | 74.0 | 72.1 (75.4 in C1) | −2.6 % (+1.9 %) |
| desert_arch | 70.0 | 72.0 | +2.9 % |
| oasis_falls | 74.5 | 75.5 | +1.3 % |
| mean | 69.92 | 69.94 | **0 %** |

The same scene's own spread ≈ 4 % (river_bend 75.4 / 72.1, ten minutes apart) — no RAM gain is seen on still scenes.

**RAM, the krinik-show flight (background, reflections `now`):** ram-A1 62.8 / median 67.9 / CPU 14.34 ms / 33 hitches; ram-A2 63.2 / 68.2 / 14.29 / 38 vs 11-08
oc-A1 61.5 / 67.3 / 14.41 / 26 and oc-A2 54.9 / 60.3 / 16.11 / 57 → +8 % avg and −6 % CPU vs the 11-08 mean, +2 % vs its better flight; today's pair within 0.6 %.

**The window path (C1):** river_bend front 70.8 vs background 75.4 — front −6 %; the front pass vs the night's background read −1.6 % (EXP-0494).

**Distance 1.5 (front vs front, sw):** D0 live 1.5 · 1.5 · 1.5, `r.StaticMeshLODDistanceScale` 0.75. delta_falls 62.6 → 66.7 (+6.5 %, rain both) · delta_jungle 63.7 → 69.2 (+8.6 %) ·
river_bend 70.8 → 75.4 (+6.5 %) · desert_arch 71.4 → 72.3 (+1.3 %) · oasis_falls 75.6 → 76.8 (+1.6 %) · mean 68.8 → 72.1 (**+4.7 %**), 0 hitches everywhere. Caveat: two
different game sessions; the per-scene spread is ≈ 4 %. Look: the pairs at sheet scale show no visible loss; the owner's eye at 4K — review folder 77.

## 5. Found

- The game crashed 16:06:32 (EXCEPTION_ACCESS_VIOLATION in UE4SS): `freeze-npcs.lua` kept refs of NPCs frozen at far beaches and wrote into them after they were unloaded —
  fixed (no stored refs, `IsValid()`), F1 pass, EXP-0495. The crash-report window closed, PID 14204.
- delta_falls rains despite `ForceStopAllWeathers` + `FreezeWeather` (third time) — its numbers carry the rain.
- The owner's frame at river_bend 15:45: the water reflection flickers / dark dashes — bug 89 (open).

## 6. Traces

CSVs and the journal `D:/Games/Conan Exiles Mods/_bench/` (2026-11-09_15*–16* `ws-*`, `ram-A1`, `ram-A2`); frames — scratchpad `ws-warm`, `ws-ram`, `ws-bg`, `ws-d15`;
review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\77_dalnost_1_5\` (five 2.0 | 1.5 pairs + README); crash `ConanSandbox/Saved/Crashes/UECC-Windows-2EA50B27…`.

## 7. Verdict

pass — the RAM effect measured both ways (still 0 %, flight +2…+8 %), distance 1.5 shipped in KrinikConanGraphics' Engine.ini and read back live (+4.7 % FPS on the beaches);
the look of 1.5 waits for the owner's eye (folder 77).
