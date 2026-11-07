# Research — Underground 2 Revived (nfsu2.xyz) on the owner's tablet: FPS vs graphics

> **Created:** 2026-11-07 · on the owner's word (chat 2026-11-07 23:12: target ≥ 50 FPS, ideally 120, with great graphics; «обязательно выезжать в город, искать, где много движения других игроков»)
> **Parent:** — (side task, not part of the Conan build)
> **Status:** measured and applied 2026-11-08 00:0x; settings on the tablet set (see "Applied"); owner's originals in `owner_backup_2026-11-07/`
> **Outbound:** optional feature request to the port's author (separate car detail for own car vs other players) — the owner's call

## The stand

- Tablet HEADWOLF Titan 1: Dimensity 8300 (MT8792 / mt6897), Mali-G615 MC6, 11.5 GB RAM, Android 16, panel 2560×1600 at 144 Hz (min = peak = 144 set by the owner).
- The game: browser port "Underground 2 Revived", installed as a Chrome WebAPK (`org.chromium.webapk.a387f39597d0f40db_v2`, scope `nfsu2.xyz`), Chrome 156. x86 recompiled to C → WASM, D3D9 on WebGPU. Source: `github.com/th0mk/nfsu2-web`.
- Access: `adb connect <tablet LAN address>:<port>` (wireless debugging, address and port from the owner; the KAST project's notes name the device), then `adb forward tcp:9333 localabstract:chrome_devtools_remote` — CDP into the page: OPFS files (`/save/settings.ini`, `/save/registry.txt`), the `#fps` counter element (`fps_counter = detailed` gives frame ms, tris/frame, roam cars, drive/pause), key input via `Input.dispatchKeyEvent` (the game takes the keyboard). The live game log is in `localStorage['nfsu2.lastgame.save'].log`; `[gpu] 60 s …` lines give GPU done p50/p90 per minute.
- Real taps (`adb shell input tap`) for page buttons that need a user gesture (Play). A `location.reload()` while the game runs is stopped by Chrome's "Reload site?" dialog and freezes CDP — quit through F9 → «Выйти из игры» instead.

## Driving the game from the PC (learned 2026-11-08)

- The port's automation (`NFSU2_INPUT_SCRIPT`, the autotest `autopilot` / `roam call 0x5fae20`) is closed in the production page: `settings.ini` refuses the page's automation variables (`PATH_VARS` in `web/src/app/settings.ts`).
- Keys via CDP `Input.dispatchKeyEvent` work as a held keyboard: a `keyDown` … `keyUp` pair with a sleep between is a held key (`cdp-keys.mjs ArrowUp:8000`); two keys at once = two parallel processes.
- After «Возвращение в город» the car stands with its nose in the garage door of a dead-end alley: reverse (`ArrowDown` + `ArrowLeft` 2.5 s), then forward-right. **R** puts the car back on the nearest road along its direction — the cheapest way back onto a road after a wall.
- Steering is closed-loop by eye: a 480 px frame (`exec-out screencap` → magick crop of the game area) every ~3 s, then the next key hold. Enough for a minute of city driving and an FPS sample on the move.
- The menus are keyboard-driven: pause = Escape; pause carousel → «Настройка» (3× Right) → «Изображение» (Right, Enter) → «Настройка параметров изображения» (4× Down, Enter). The game remembers the cursor position inside menus, so a key path is not reproducible across visits — set the graphics through `registry.txt` before Play instead.

## How the port decides defaults (source, `web/src/app/device.ts`, `phonegraphics.ts`, `settings.ts`)

- The tablet's Chrome reports `userAgentData.mobile = true` → the port treats it as a PHONE: `render = scale:0.75`, fullscreen, 4:3 HUD, `roam_max_cars = 16`, and the registry seeded with the "phone graphics" (car + road reflections, motion blur, DoF, overbright, bleach bypass off). Dev's own PC measurement of that set: draws 1639 → 1118, render passes 30 → 4, GPU −54 %.
- The owner had overridden it: `resolution = 2560x1600` (forces full native render, the 0.75 scale no longer applies), `fps = 120`, `roam_max_cars = 64`, `other_headlights = all`, `ui_textures = uhud`; in game car reflections 3, road reflections 3, DoF on.
- `fps = auto` follows the display (144 Hz → 120). Per remote car the game thread pays ~0.28 ms/frame on a Ryzen 5900X, "several times that" on a laptop (dev comment).

## Measurements

Median / worst FPS over 20 s with the counter in the driving state (`drive 2`, `pause 0`) — never in a menu: the pause menu stops game logic and reads high (EXP-0489). Full case list with moments: `testcases/TC_nfsu2_tablet_fps_2026-11-08.md`. Noise band of a standing sample ≈ ±3 FPS (controls A1, A2). "Empty" = own world, standing at the garage; "crowd" = the main world (~4 200 players) at the garage, where everybody spawns.

| Lever | Values | FPS | Cost |
|---|---|---|---|
| Road reflections (empty, 0.75) | off → max | 51 → 35 | −16, the heaviest option |
| Car reflections (empty, 0.75) | off / level 1 + slow update / max | 51 / 45 / 39–44 | −6 / −10 |
| Both reflections (empty) | max at 0.5 / max at 0.75 | 37 / 36 | reflections cost draw calls, not pixels |
| Render scale (empty, refl off) | 50 % / 75 % / 100 % | 56 / 51 / 46 (frame 17.9 / 19.8 / 21.5 ms) | ~16–17 ms of a frame do not depend on pixels |
| Menus and HUD textures (empty) | Original / Upscaled | 54–56 / 49–51 | −5 |
| Players' cars (crowd, refl off or low) | 0 / 8 / 16 / 32 | 44 / 29–32 / 28–32 / 24–25 | any cars at the spawn −15: loading/removal churn (port issue #79) |
| World (garage, refl off, 16 cars) | main / World 1 (~170 players) | ~30 / 39–40 | |
| Driving the city (World 1, refl off, 0.75) | | 33–40 / 21–23 | driving costs ~10 vs standing |
| Frame cap (empty, 0.5, refl off) | 120 | 51–53, peaks 75–80 | 120 unreachable |
| Display 144 vs 120 Hz (pause menu at 60) | present intervals p50 / p90 | 16.3 / 23.8 vs 16.6 / 23.7 ms | no difference |
| No gain (within noise) | DoF · light glow · car shadows · car LOD · world detail 1 · rain + particles off · crowd off · «Уровень детализации» 3 · field of view · `roam_rate` 10 · other cars' headlights | 0–4 | |

The owner's original settings (`resolution = 2560x1600`, `fps = 120`, reflections max): menus at 120; thermal status rose 2 → 4 (critical) and skin 52 → 58 °C within ~2 minutes in menus and the garage.

## Conclusions

1. **What costs is the number of draw calls, not pixels.** About 16–17 ms of every frame go to translating the game's draws to WebGPU in Chrome's renderer main thread (~60 % busy); a reflection redraws the scene (road reflections −16, car reflections −6…−10); resolution moves only ~5 FPS per step. Same picture on the same SoC in another port (Project Velocity issue #2: Dimensity 8300, ~0.15 ms per draw call).
2. **The spawn crowd costs ~15 FPS whatever the graphics**: with 0 cars drawn the same crowd gives 44 (≈ the empty world), with 8, 16 or 32 cars 24–32 — the cars loaded and removed all the time near the garage (port issue #79), not their detail. A quieter world (World 1–4) gives ~10 more at the same spot.
3. **50+ is reachable standing / in quiet places; on the move in the city the light set gives 33–40.** Driving streams the city and draws the far view.
4. **120 FPS is out of reach** in this port on this tablet; `fps = 120` only heats the SoC into throttling. 60 is the cap; 30 is the port's own advice for a phone that stutters after warming.
5. The port has no separate car detail for the own car vs others: the Car detail option sets one global least-LOD for all cars (`runtime/photo.c`, `G_LEAST_LOD_A/B`); only photo mode forces full detail.
6. Memory is tight (11.4 of 11.5 GB used, 6.3 GB swap with background apps); the upscaled HUD costs ~5 FPS as well as memory.

## Applied on the tablet (2026-11-08)

- `settings.ini`: `fps = 60`, `fps_counter = on`, `roam_max_cars = 12`, `resolution` removed (render = device default scale 0.75), `other_headlights` default (players), main world (`roam_room` default); kept `ui_textures = uhud`, `hud = wide`, `fov_scale = correct`.
- `registry.txt`: car reflections 0 (+ update 0), road reflections 0, DoF 0, motion blur 0; world detail 3, car detail max, shadows 2, glow, streaks, rain, fog, particles on.
- Revert: copy `owner_backup_2026-11-07/settings.ini` and `registry.txt` back into OPFS `/save/` (or the in-game Options).
