# Dungeon Siege II + Broken World — internal map (how it behaves)

> **Created:** 2026-10-25 · **Status:** living reference · sources: GenesisFR DS2TroubleshootingGuide (2026-10-25 read) and our runs

## Display

- Direct3D 9, 32-bit exe. Its own fullscreen on this machine (RTX 5070 Ti, 4K TV) gave a black screen → the owner played windowed.
- dgVoodoo2 (`D3D9.dll` next to the exe) with `[DirectX] VideoCard = geforce_fx_5700_ultra` and `Resolution = h:3840, v:2160` makes
  fullscreen work (run 2026-10-25 19:06) and renders the **3D world at 4K**, while the **UI is drawn at the game's own resolution** and
  stretched: 720p → ×3 (blocky text), 1080p → ×2, 1440p → ×1.5. Does not work windowed (guide).
- Main menu UI has a fixed resolution (guide: borderless Fullscreenizer breaks it).

- Loading is LONG (`[OWNER]` «там долгая загрузка» · 2026-10-25): a black frame 5–25 s after start or after restoring the window is
  not yet a verdict. The 1080p run of 2026-10-25 19:17 was captured black after restore and closed — not judged.
- An exclusive-fullscreen game that loses focus (the owner switches to VS Code) minimises; restored with `ShowWindow`+`SetForegroundWindow`
  it showed black for at least 5 s.

## Input

- In fullscreen the game reads the mouse directly: `SetCursorPos` + `mouse_event` from outside do not move its cursor (2026-10-25).
- Cursor speed = one game pixel per mouse count → it scales with the stretch factor: at 720p on 4K the owner had to set sensitivity
  to minimum (2026-10-25).

- **Camera by middle mouse in the window spins insanely fast** (`[OWNER]` «по скм безумно быстрое вращение камеры» · 2026-10-25, window
  1366×768 + LS). The PCGamingWiki «Dungeon Siege 2 mouse cursor fix» (Genesis, 2.30.0.0 — the exe we run) fixes cursor and camera spin
  **in fullscreen** on Win10 1703+, not windowed. Closed by the owner: `[OWNER]` «похер, забудь» · 2026-10-25 — not pursued (suspect, if it
  ever returns: LS `AdjustCursorSpeed=true`).

## NVIDIA filters (Alt+F3)

- Before 2026-10-25 the owner renamed the exe to `enshrouded.exe` to get into the NVIDIA filters' game list; in the window + LS setup Alt+F3
  minimised the game and the filters did not see it (`[OWNER]` 2026-10-25).
- Driver profile «Dungeon Siege 2» had only `dungeonsiege2.exe`. 2026-10-25 ≈19:43: added `dungeonsiege2_retail.exe` and three Ansel settings =
  1 — `0x1035DB89` NVIDIA Predefined Ansel Usage, `0x1085DA8A` Ansel flags for enabled applications, `0x1075D972` Enable Ansel; read back
  by `_tools/nvidia-drs-reader` (db1). Import file `_tools/nvidia-drs-backup/2026-10-25_ds2-ansel.nip`, backup before it —
  `_tools/nvidia-drs-backup/2026-10-25_before-ds2-ansel/`. Result 19:46: NVIDIA app shows «Запущена игра Dungeon Siege 2», RTX HDR active,
  but «Доступные фильтры (0)» — its own list keeps DS2 closed. Owner: filters «забудь, без» · 2026-10-25 — ReShade / ReallyFreeStyle not pursued.

## Config

- Settings live in one per-user ini (see the external map) — any copy of the game reads and writes the same file; `attempts` grows
  every launch. Back it up before experiments, restore after.
