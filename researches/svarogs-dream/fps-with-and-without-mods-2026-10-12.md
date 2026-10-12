# Research — Svarog's Dream: FPS with our mods, without them, and with no mods at all (2026-10-12)

> **Created:** 2026-10-12 · **Parent:** `[OWNER]` «А ПОЧЕМУ fps такой низкий?» · «давай померим с модами и без» · «что кушает и сколько
> процессорного времени и главного потока» · 2026-10-12 · **Status:** measured 22:13–22:24; accepted by the owner — `[OWNER]` «хорошо,
> спасибо. Запиши в знания. Значит, мод уважительны к процессоры» · 2026-10-12 · **Outbound:** —

## Result

| Run | FPS | Frame median | CPU busy / frame | GPU busy / frame | p99 frame | Low 1 % |
|---|---|---|---|---|---|---|
| A — all mods (day) | 45.2 | 21.4 ms | 21.3 ms | 10.6 ms | 27.9 ms | 16.5 FPS |
| B — our mods removed; BepInEx, XUnity, ConfigurationManager, pult kept (day) | 46.5 | 21.4 ms | 21.3 ms | 8.6 ms | 24.5 ms | 14.5 FPS |
| C — clean game, BepInEx off (night) | 48.3 | 21.2 ms | 21.1 ms | 8.7 ms | 24.4 ms | 38.4 FPS |

- **The main thread is the game itself:** 21.1 ms per frame with no mods at all — the ceiling is ≈47 FPS at this place, whatever we do on
  the GPU. GPU busy 8.7–10.6 ms of 21 — it idles half the frame.
- **Our mods cost ≈0.2 ms of CPU** (A vs B, inside the noise) **and ≈2 ms of GPU** (haze and grass shaders, water reflection of land, far
  draw distance: 2.5 M triangles vs 1.5 M, batches 1196 vs 648 in `perf`). The owner's verdict: the mods respect the CPU.
- **Worst frames are worse with mods:** p99 27.9 vs 24.4 ms; low 1 % 16.5 vs 38.4 FPS. Not explained yet — C ran at night (torch light
  only, less on screen), A and B by day, so part of it is the scene. Next: same daylight for C, and the hitch log of A (`event: spike`).
- **Where the main thread goes** — the profile of 2026-10-10 (development player, `main-thread-profile-2026-10-10.md`): waiting for small
  worker jobs 3–5 ms, transform-changed dispatch 2.3–2.8 ms, grass 1.5 ms (our 500 m), NavMesh 1.2 ms, world canvases 1.3 ms, terrain 0.8 ms,
  renderer bounds 0.75 ms, all scripts of game and mods 1.5–3 ms. The release player gives no per-subsystem markers (`perf`: n/a).

## Method (repeatable)

- Place: the owner's save at the pond near Bor, 4K, OBS streaming throughout (the owner's: «ты наш ОБС не убивай плиз»).
- Instrument: `PresentMon-2.5.1-x64.exe --process_name "Svarog's Dream.exe" --output_file <csv> --timed 30 --no_console_stats
  --stop_existing_session --session_name kumm-pm` (it did not exit by itself after `--timed` — stopped by its own process), summary
  `python -I SvarogsDream/tools/pm_summary.py <csv…>`; inside the game `h.sh "perf 25"` as a cross-check (A: 45.8 FPS, B: 47.4).
- B: the four mod folders `BepInEx/plugins/Krinik{Camera,Color}Rework`, `KrinikFixes`, `KrinikModMenu` and `scripts/KrinikUIRework.*`
  moved to `BepInEx/_krinik_off/` (BepInEx does not scan it), `KrinikDevHarness` kept to drive `run-game.sh`.
- C: no file touched — `$env:DOORSTOP_DISABLE='TRUE'` before `Start-Process` (doorstop `ignore_disable_switch = false`); proof — the
  BepInEx log not rewritten; «Continue» clicked by `mouse.ps1` from a desktop capture (`shot-hdr.ps1` + `hdr2webp.py`).
- **Save trap:** quitting the game WITHOUT our UI mod writes the bag in the game's own size — the save shrank 1 335 953 → 1 331 303 bytes
  (InventoryX2 keeps the extra slots). After the runs the save was restored to the copy taken with mods
  (`_backups/svarog-saves-2026-10-12_2215-owner-quit`, `save-check.sh` 10 same). Never quit with our mods removed onto a save you keep.

Raw data: `SvarogsDream/_harness/fps_ab/{A_mods_on,B_ours_off,C_vanilla}.csv`. Test case — `testcases/TC_svarog_hero_card_2026-10-12.md`, C38.
