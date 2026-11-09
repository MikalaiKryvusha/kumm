# Plan 51 — Conan: re-measure FPS on the five water beaches after the RAM sub-timing tuning, then view distance 1.5 (KAGO, 2026-11-09)

> **Created:** 2026-11-09 · written by the KAGO session on the owner's word (KAGO chat 2026-11-09 ~13:3x: «агенту в проект KUMM напиши задание — перемерить у пяти мест воды FPS после твоих достижений по RAM»)
> **Parent:** `testcases/reports/2026-11-09_conan-water-reflections-five-scenes.md` (the «before» numbers) · KAGO `STATUS.md` → «настройка ПРОЦЕССОРА и памяти», 09.11
> **Status:** 🟡 measured 2026-11-09 15:24–16:39 (KUMM) — S0 by proxy (latency 93.5 ns), S1–S4, S3b, S6 done: still beaches **0 %** from RAM (spread ≈ 4 %), the
> krinik-show flight **+2…+8 %**, distance 1.5 shipped and read back live, **+4.7 %** on the beaches; S5 told by voice 16:4x; open: the look of 1.5 by the owner's eye
> (review folder 77). Report `testcases/reports/2026-11-09_conan-water-fps-after-ram-tuning.md`; cases `testcases/TC_conan_water_fps_after_ram_2026-11-09.md`
> **Outbound:** the result goes to the owner (chat + voice) and one line back into KAGO's STATUS is welcome but not required

## Goal vector (Achieve)

The owner sees how much the 09.11 RAM sub-timing tuning added in Conan on the same five still river beaches, measured by the same protocol as the night run, so the number is comparable and not a guess.

## What changed on the machine (the only variable)

| | Night run 09.11 01:12–01:5x («before») | Now («after») |
|---|---|---|
| RAM | D.O.C.P. 3200 16-18-18-36, sub-timings on Auto: tRC 74 · tRRDS/L 6/8 · tFAW 34 · tWTRL 12 · tWR 24 · tRTP 12 · tRFC 560 · PowerDown on | same primaries; **tRC 64 · tRRDS/L 5/7 · tFAW 28 · tWTRL 10 · tWR 18 · tRTP 10 · tRFC 480 · PowerDown off** |
| Memory latency (KAGO `tools/mem-latency.mjs`, 512 MB) | ≈ 109 ns | **≈ 90 ns (−17 %)** |
| Stability | — | TestMem5 Extreme @ anta777: full program, «Тестирование закончено» 1:47:26, 0 errors |
| CPU | Ryzen Master Auto OC +200, 120/80/140, CO −10 | unchanged |

Expected effect (KAGO's estimate, NOT a measurement): about +3–6 % FPS where Conan is CPU-bound.

## Acceptance criteria

1. Scale: one-minute FPS avg / median per beach · Meter: `water-scenes.sh` captures (PresentMon), the same five scenes · Target: all five measured cleanly (each capture 59.9–60.0 s, read-backs before each, 0 hitch storms).
2. Scale: Δ % per scene and over five vs the «before» table below · Meter: `water-scenes-report.py` + a two-column table · Target: the numbers exist and are honest; any outcome (even ≈ 0 %) is a valid result.
3. Look unchanged: the shipped software reflections (sw) are what is measured — read back RT 0 · ScreenTraces 0 · TraceDistanceScale 4 · NumClipmaps 6 · ClipmapExtent 5000.

**«Before» (sw = the shipped mode, from the parent report):**

| Scene | sw avg / median |
|---|---|
| delta_falls (re-shoot, warm) | 66.9 / 67.4 |
| delta_jungle | 64.2 / 65.1 |
| river_bend | 74.0 / 75.9 |
| desert_arch | 70.0 / 72.1 |
| oasis_falls | 74.5 / 75.0 |

## Steps

- [x] **S0 — verify the RAM state first** (a BIOS reset would silently void the comparison): open ZenTimings (`C:\Program Files\ZenTimings\ZenTimings.exe`, needs admin) and check tRFC = 480, tRC = 64, PowerDown = Disabled. If not — stop and tell the owner (the settings live in his BIOS; KAGO recommended saving them as ASUS User Profile 2).
- [x] **S1 — the machine lock** (`D:/work/ai_sandbox/_tools/machine-lock.mjs take --who kumm …`), the stand keeper OFF, `no-power-throttle.ps1`, the same game build and Engine.ini as the night run.
- [x] **S2 — warm-up**: one discarded pass (the night run showed the first reflections switch in a session hitches hundreds of times — shader warm-up, not cost).
- [x] **S3 — measure**: `bash water-scenes.sh <ws> sw delta_falls delta_jungle river_bend desert_arch oasis_falls` (weather stopped + frozen, NPCs within 600 m frozen, 30 s settle, one minute each). **Only `sw`** — the owner: «только для нашей принятой sw рефлекции» (no `off`, no rays).
- [x] **S4 — report**: `testcases/reports/2026-11-09_conan-water-fps-after-ram-tuning.md` with the before/after table, Δ % per scene and the five-scene mean, CPU ms per frame if the captures give it; note the in-game time of day (the owner's earlier caveat: different time of day can move the number a few %).
- [x] **S5 — tell the owner** by voice (file first — `voice/<stamp>_<meaning>.txt`, the shared rules `D:/work/ai_sandbox/tools/silero_tts/VOICE_RULES.md`, «Николай, это КУММ. …») and in the chat; release the lock.

- [x] **S3b — back in by the owner 16:02** (`[OWNER]` «можешь разве что пролёты нашим демо ещё поделать»; cancelled 16:01 «это может если бегать по миру, но уже не будем
  такое проверять» — running across the world stays out). Proposed on his word
  (`[OWNER]` 2026-11-09 16:01 «наверное на статике не так много прироста. Где много потоков данных - там РАМ может дать приросты»): two `bench-flight.sh krinik-show` flights on the background path with the reflections of the 2026-11-08 baseline (`set-reflections.sh now`, switched once
  before — warm-up) vs `oc-A1` 61.5 / `oc-A2` 54.9 (report `2026-11-08_conan-overclock-baseline-pure-rays.md`). That baseline's own A1→A2 drift is 11 % — a delta inside it is
  «not seen», not «zero». The static noise is ≈ 4 % too (river_bend bg 75.4 at 15:5x, 72.1 at 16:0x).
- [x] **S6 — view distance 2.0 → 1.5, ONLY AFTER S3–S4** (the owner, KAGO chat 2026-11-09 ~13:4x: «дальность в конане ставим 1.5» · «остальное по конану не трогаем»).
  The distance keys that stand at 2.0 today (KAGO's read-only recon saw `r.ViewDistanceScale`, `foliage.LODDistanceScale`, `grass.CullDistanceScale` = 2.0) → **1.5** in
  KUMM's source of truth (KrinikConanGraphics' Engine.ini / the build), deploy, then READ BACK live through ConsoleBridge (`?r.ViewDistanceScale` etc. — the game is known
  to override some lines, see EXPERIENCE on `foliage.LODDistanceScale`). Nothing else changes: `r.StaticMeshLODDistanceScale` 0.75, reflections, grass density — untouched.
  If a key turns out not to be at 2.0 or its role is unclear — ask the owner before touching it. Then the same five beaches again (sw only) → a third column «RAM + distance 1.5»,
  and frames so the owner can judge the look; tell him by voice. Why after: changing the distance before S3 would mix two variables and void the RAM comparison.

## Risks

- The weather comes back on delta_falls despite the freeze (seen in the night run) — check the frames; re-shoot that scene if it rains.
- Another batch / PresentMon still alive (EXP-0493) — `ps` before starting, one batch only.
- Different in-game time of day than the night run — record it; if the light differs a lot, say so next to the Δ.
