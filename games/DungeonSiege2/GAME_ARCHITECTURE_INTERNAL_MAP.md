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

## Config

- Settings live in one per-user ini (see the external map) — any copy of the game reads and writes the same file; `attempts` grows
  every launch. Back it up before experiments, restore after.
