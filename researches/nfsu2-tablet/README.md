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

## Measurements (median / worst FPS over 20 s of DRIVING — never in a menu: the pause menu stops game logic and reads high)

| Place | Settings | FPS |
|---|---|---|
| garage, main world (4 190 players), 24 cars near | reflections max, DoF on, scale 0.75, fps 60 | 28 / 17 |
| same, 12 cars | same | 31–33 / 20 |
| same, 6 cars | same | 35 / 20 |
| empty own world, 0 cars | reflections max, scale 0.75 | 36 / 28 |
| empty world | road reflections off | 42 / 33 |
| empty world | + car reflections off (= the port's phone preset, DoF off) | 49 / 40 |
| empty world | + light glow off | 47 / 37 (no gain — glow kept on) |
| garage crowd, 12 cars | reflections off, DoF off, scale 0.67 | 32–35 / 19–21; GPU done p50 17 ms; Chrome renderer main thread ~60 % |

Owner's original settings: menus at 120 fps; thermal status rose 2 → 4 (critical) and skin 52 → 58 °C within ~2 minutes in menus/garage.

## Conclusions

1. **The heavy part is car and road reflections** (36 → 49 together); DoF, glow, car LOD, car shadows cost ~0–4 FPS each — classic PC-era advice (glow, AA, resolution) does not transfer to this port on Mali.
2. **The spawn crowd at the garage caps at ~30–35 FPS whatever the graphics** — corrected 2026-11-08 (plan 50, cases C1/C3/C7): with 0 cars drawn the same crowd gives 44 (≈ the empty world), with 8 or 16 cars ~30: the cost is the cars being loaded and removed all the time at the spawn (port issue #79), not their count or detail. Driving the city (World 1, 2–7 cars near) gives 33–40 with the phone preset at 75 % — the earlier "~50 in the wider city" was a guess from standing readings and is withdrawn.
3. **120 FPS is out of reach on this tablet in this port** (empty world, light preset: ~49–60). `fps = 120` only overheats the SoC into throttling; `fps = 60` is the right cap.
4. The port has no separate car detail for the own car vs others: the game's Car detail option sets one global least-LOD for all cars (`runtime/photo.c`, `G_LEAST_LOD_A/B`); only photo mode forces full detail.
5. Memory is tight: 11.4 of 11.5 GB used, 6.3 GB swap in use with many background apps — closing apps before playing removes stutter risk; `ui_textures = uhud` costs memory, not FPS.

## Applied on the tablet (2026-11-08)

- `settings.ini`: `fps = 60`, `fps_counter = on`, `roam_max_cars = 12`, `resolution` removed (render = device default scale 0.75), `other_headlights` default (players), main world (`roam_room` default); kept `ui_textures = uhud`, `hud = wide`, `fov_scale = correct`.
- `registry.txt`: car reflections 0 (+ update 0), road reflections 0, DoF 0, motion blur 0; world detail 3, car detail max, shadows 2, glow, streaks, rain, fog, particles on.
- Revert: copy `owner_backup_2026-11-07/settings.ini` and `registry.txt` back into OPFS `/save/` (or the in-game Options).
