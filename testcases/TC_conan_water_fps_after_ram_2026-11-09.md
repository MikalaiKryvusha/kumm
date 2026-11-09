# TC — Conan: FPS on the five water beaches after the RAM sub-timing tuning, then view distance 1.5 (plan 51)

> **Created:** 2026-11-09 · plan `plans/51_conan_water_fps_after_ram_tuning.md` (written by KAGO on the owner's word)
> **Parent:** `TC_conan_water_reflections_five_scenes_2026-11-09.md` (the «before» numbers, background path)
> **Status:** 🟡 running from 2026-11-09 15:27 +03:00
> **Outbound:** the before/after table → the owner (chat + voice), one line to KAGO

## 1. Goal vector

Achieve: the owner sees how many FPS the 09.11 RAM sub-timing tuning added on the same five still river beaches, by the night run's protocol; then the same
beaches with view distance 1.5 (the owner's word «дальность в конане ставим 1.5»).

## 2. Stand

- Machine: RAM latency 93.5 ns median (KAGO `mem-latency.mjs`, 15:26; before 109) — the sub-timings hold (proxy; ZenTimings not opened, the owner at the keyboard).
- Neighbour session KCCP told to load nothing until the machine is handed back (HOUSE_RULES 11.6c), confirmed 15:25. Machine lock `kumm` taken 15:26 for 90 min. <!-- claim-ok: the lock's end is its duration, not a stamp -->
- Game `D:\Games\Conan Exiles 3.0.1` with the build, **FOREGROUND path** (the owner 15:28 «давай в фореграунде - это красиво, буду смотреть») — the night «before» ran
  in the BACKGROUND: one control scene is captured on the background path at the end (case C1) so the path is not mixed into the RAM delta.
- `no-power-throttle.ps1`, god on, `t.MaxFPS 141`, stand keeper OFF; per scene `water-scenes.sh` does: weather stopped + frozen, NPCs within 600 m frozen, 30 s, 11:00,
  60 s PresentMon.
- Settings: `sw` only (read back RT 0 · ScreenTraces 0 · TraceDistanceScale 4 · NumClipmaps 6 · ClipmapExtent 5000).

## 3. Cases

| # | Case | Expected | Status |
|---|---|---|---|
| G1 | `static-bench.sh` with a PresentMon already alive | «уже идёт захват», exit 5, the live capture untouched | — |
| G2 | `water-scenes.sh` with a lock holding a live PID / a dead PID | exit 5 / takes the lock and removes it on exit | pass 15:26 (exit 5; exit 0, lock gone) |
| W0 | warm-up pass, frames only (`NO_BENCH=1`) over the five scenes | the five views reached, no rain on the frames | — |
| R1–R5 | 60 s capture per scene, `sw`, RAM tuned | each capture 59.9–60.0 s, no hitch storm | — |
| R6 | five-scene mean vs «before» (66.9 · 64.2 · 74.0 · 70.0 · 74.5) | a Δ % per scene and the mean — any outcome is valid | pass 16:06 — background pass R1b–R5b: 64.1 (rain again) · 66.0 · 72.1 · 72.0 · 75.5 → −4.2 · +2.8 · −2.6 · +2.9 · +1.3 %, mean 69.94 vs 69.92 = **0 %** (without the rainy scene +1 %); the same scene's own spread ≈ 4 % (river_bend bg 75.4 / 72.1) — no RAM gain seen on still scenes |
| F1 | crash 16:06:32 (EXCEPTION_ACCESS_VIOLATION in UE4SS on `freeze-npcs.lua` undo — stale refs of NPCs frozen at five far beaches, unloaded since); fix: no stored refs, undo re-finds live Characters with dilation 0, `IsValid()` first. Case: freeze at delta_falls, teleport to oasis_falls (≈ 2.6 km away), freeze, undo | the game lives; «unfrozen N» with N > 0 | pass 16:1x — «frozen 51» · «frozen 43» · «unfrozen 43», the game answered «alive» after (the 51 were unloaded — the very objects the old undo wrote into) |
| R7 | two `krinik-show` flights, background, reflections `now` (the 11-08 baseline mode) vs `oc-A1` 61.5 / `oc-A2` 54.9 | a delta beyond the baseline's own 11 % drift, or «not seen» | pass 16:18 — ram-A1 62.8 / 67.9 / CPU 14.34 / 33 hitches, ram-A2 63.2 / 68.2 / 14.29 / 38 (the pair within 0.6 %); vs the 11-08 mean 58.2 / 63.8 / 15.26 → **+8 % avg, −6 % CPU**; vs the better 11-08 flight (61.5) +2 % — the gain is +2…+8 %, inside the baseline's drift at its low end |
| C1 | one scene again on the background path | its FPS vs the same scene in front: the path's own share | pass 15:5x — river_bend bg 75.4 vs front 70.8 (front −6 %): the front pass (R1–R5: 62.6 · 63.7 · 70.8 · 71.4 · 75.6, mean −1.6 % vs night bg) is NOT the RAM delta → the RAM delta is measured bg vs bg (R1b–R5b, running 15:5x); the distance delta front vs front (EXP-0494) |
| D0 | view distance keys 2.0 → 1.5 in KrinikConanGraphics' Engine.ini, read back live | `r.ViewDistanceScale`, `foliage.LODDistanceScale`, `grass.CullDistanceScale` = 1.5; `r.StaticMeshLODDistanceScale` 0.75 untouched | pass 16:2x — deployed by `deploy-config.py Engine.ini` (sha256 checked, backup `_config/backup/2026-11-09_161847`), a fresh launch in front: live 1.5 · 1.5 · 1.5 · 0.75, sg.ViewDistanceQuality 4, reflections sw unchanged — the ini lines reach the scene, the game does not override them at 1.5 |
| D1–D6 | the five scenes again, `sw`, distance 1.5 | a third column «RAM + distance 1.5» and frames for the owner's eye | — |
