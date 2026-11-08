# Run report — Conan: XP base 1000 live, water reflections A-E and the ray-tracing cost, HUD grey

- **Work:** `testcases/TC_conan_xp1000_and_water_reflections_2026-11-08.md` — L1, L2 (XP base 1000, owner 2026-11-07 21:06 · 2026-11-08 12:21), R0–R2 (the white
  streak on the water, owner 2026-11-07 20:12; «давай включать. пробовать. замерять на нашем демо пролёте» 2026-11-08 12:22), H0–H1 (HUD reduced-max share grey,
  owner 2026-11-07 21:04).
- **Contour:** game `D:\Games\Conan Exiles 3.0.1` with the build, background path (PID 47664, launched 12:24:53); `KrinikConanGameplay` pak rebuilt with
  `XP_ANCHOR = 1000` and deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanGameplay` (verify 113 present, 0 missing); god on, `MakeMeAdmin`; machine lock
  `kumm` taken 12:24 for 90 minutes. Reflection stand: oasis beach, the hero at (−80500, 245900, −20106), a fixed CameraActor at (−80150, 245900, hero + 90 cm),
  pitch −4, yaw 180, time of day 11.0 before each frame, window capture 3840×2160.
- **Runs:**
  - 12:26 `CheatManager:SetLevel(65)` by `pult.sh` → `capture-window.ps1`; 12:27 `SetLevel(100)` → frame + crop.
  - 12:27 live cvars by `KismetSystemLibrary:GetConsoleVariableFloatValue` (15 names).
  - 12:3x frames A (as is) · B `exec r.Lumen.Reflections.ScreenTraces 0` · C `exec r.RayTracing.Enable 1` (read back 1.0 after 15 s) · D C + ScreenTraces 0 ·
    E C + `r.Lumen.HardwareRayTracing.LightingMode 2`.
  - 12:34 `bench-flight.sh krinik-show rt-A1` (background, stand keeper on) · 12:4x `rt-A1b` (stand keeper off) · 12:5x `no-power-throttle.ps1` + `rt-A1c` ·
    then the A-C-A-C batch `rtb-A1 · rtb-C1 · rtb-A2 · rtb-C2` (background, throttle off).
- **Checks:**
  - Hygiene: builder step 6 — 3 × 10 000 rows equal to the generators; `kismet-trace.py` read-back of the rebuilt `W_SmoothHP` — (0.35, 0.35, 0.35, 0.5).
  - Functional run: the live game on the background path — the HUD XP line read on frames; reflection frames read by eye; flight numbers from PresentMon.
  - L1 pass — «(8 062)» at level 65 (= 1000 × √65). L2 pass — «(10 000)» at level 100.
  - R0 pass — Lumen software tracing (RayTracing.Enable 0 with HWRT flags on).
  - R1 pass (mechanism) — B: the oasis water sky-white everywhere (the fallback = the streak); C / D: the shore reflected, no white; E = C by eye.
  - R2 — see «Flights» below.
  - H0 pass — 12:26 frame (old pak): the reduced share magenta on both bars. H1 — owed (pak not installed while the game runs).
- **Flights:** the A-C-A-C batch (background, throttle off, RT read back before each): rtb-A1 47.9 avg / 53.9 median, GPU 13.02, CPU 18.10, 158 hitches,
  worst 224.7 ms · rtb-C1 43.9 / 48.1, GPU 14.05, CPU 20.29, 108, 140.5 · rtb-A2 51.6 / 57.0, GPU 12.40, CPU 17.11, 77, 184.3 · rtb-C2 47.4 / 52.2, GPU 13.67,
  CPU 18.67, 80, 140.8. Ray-traced Lumen costs ≈ 5 FPS (≈ 9 %), +1.2 ms GPU, +1.7 ms CPU; hitches unchanged within noise; the worst frame lower with RT.
  Earlier, invalid:
  - rt-A1 (background, stand keeper on): 23.4 avg / 24.6 median FPS, CPU 40.3 ms, GPU 13.3 ms, 782 hitches — INVALID (background throttled).
  - rt-A1b (background, keeper off): 19.4 / 21.5, CPU 46.1 ms — INVALID: the same throttle, and CONTAMINATED — the first batch, stopped by TaskStop, kept
    running its children (journal entry `rt-C2` appeared between A1b and A1c; A1b recorded only 59 s). A stopped batch's flights are checked by `ps` before the next.
  - rt-A1c (background, `no-power-throttle.ps1`): 41.8 / 46.0, CPU 21.4 ms, GPU 12.3 ms, 184 hitches.
- **Found:** Windows EcoQoS throttles the game on the background path (EXP-0491, tool `no-power-throttle.ps1`).
- **Traces:** scratchpad frames `lv65_small.webp`, `lv100_crop.webp`, `R_A…E.jpg`, `Rsheet_ABCD.webp`, `Rsheet_CE.webp`, `Rzoom.webp`; PresentMon CSVs and
  `bench-journal.jsonl` in `D:\Games\Conan Exiles Mods\_bench\`.
- **Verdict:** partial — XP pass; reflections: mechanism pass, cost pending; HUD grey: built, not seen.
