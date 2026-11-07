# Run report — Conan: the hub pause through death and respawn (bug 79)

## Work

The pause section of KrinikConanUI on the death → respawn path; basis — bug 79 «Player risk — to check»; cases D1–D2 of
`testcases/TC_conan_pause_loading_screen_respawn_2026-11-07.md`.

## Contour

Conan Exiles 3.0.1 build, pack `374b90d` (KrinikConanUI with the hub controller section), background game (`launch-bg.ps1`), world by `enter-world-remote.sh`,
the machine lock taken.

## Runs

- 2026-11-07 07:41:35 — `bash pult.sh "exec suicide"`; 07:41:4x–07:43 — `bash pult.sh "lua return tostring(FindFirstOf('WorldSettings').TimeDilation)"` ×2,
  `capture-window.ps1`, `UE4SS.log` read (`PauseGameInMenu` lines).

## Checks

Hygiene: none.
Functional run: the real game (background), the hero killed by the console, the game's own respawn; READ: the pause section's log lines, the world time,
  one frame.
- D1 pass — the respawn selection opened (07:41:40), time 1.0, no «полноэкранный интерфейс: ОТКРЫТ».
- D2 pass — the respawn by itself 8 s later, «взведено: герой в мире» 07:41:50, time 1.0 twice, the hero standing at the desert spawn on the frame.

## Found

none — the death and respawn path does not freeze the world. The in-game loading screen did not show on this path (no bedroll — a respawn near).

## Traces

`UE4SS.log` lines 07:41:13–07:41:50 (`[KrinikConanUI:PauseGameInMenu]`); frame `d1b.jpg` in the session scratchpad (working file).

## Verdict

pass — for death and respawn without a bedroll; waystone travel and a dungeon entrance stay to run (bug 79).
