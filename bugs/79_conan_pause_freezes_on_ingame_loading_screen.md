# Bug 79 — the hub pause takes the in-game loading screen for a menu and freezes the world

> **Created:** 2026-11-03 12:53 +03:00 · **Parent:** plan 43 item 20 (the Nexus screenshot stand) · **Status:** 🟡 fixed 2026-11-03 13:11 on the teleport stand (time 1.00 through it, landed in 4 s); waystone and respawn cases still to run
> **Outbound:** —

## What is seen

After `exec TeleportPlayer -253750 18150 3000` (admin teleport on the screenshot stand) the hero hangs in the air at z 3000; the world time stays at
0.03 and the hero falls 22 cm in 6 s. Closing and reopening the hub or the fishing panel does not bring the time back.

## Evidence (UE4SS.log of the owner's working game, 2026-11-03)

- 12:51:18.85 `[KrinikConanUI:PauseGameInMenu] полноэкранный интерфейс: ОТКРЫТ` → `меню открыто: замедление времени 0.03 → лежит 0.0300` — at the teleport.
- The only full-screen candidate in the viewport at 12:53: `W_IngameLoadingScreen_C` (visibility 4), next to the HUD-level holders
  (`WBP_QueuedNotificationWindow_C`, `W_SubtitleRenderer_C`, `EoT_FIFO_Holder_C`).
- `WorldSettings.TimeDilation = 1.0` set by the remote → within 8 s the loading screen left the viewport, the mod logged `полноэкранный интерфейс: закрыт`
  · `меню закрыто: замедление времени 1.0`, and the hero landed (z 1187).

## Cause (hypothesis, one observation)

`PauseGameInMenu` counts `W_IngameLoadingScreen_C` as an open full-screen menu and slows the world to 0.03; the loading screen waits for streaming /
the teleport to finish, which the slowed world does not finish — a deadlock until something resets the time.

## Player risk — to check

Any game path that shows `W_IngameLoadingScreen_C` in the world may freeze the same way: Waystones Enhanced travel, the map-room teleport, respawn after
death, entering / leaving a dungeon. Cases: TC to write — (1) waystone travel, (2) death and respawn at a bedroll, (3) a dungeon entrance; each — the
log lines above, `TimeDilation` read 5 s after.

## Fix plan

`PauseGameInMenu`: exclude `W_IngameLoadingScreen_C` (and any loading-screen class) from the full-screen check; rebuild KrinikConanUI's Lua (no pak);
cases (1)–(3) plus the teleport stand. Needs the owner's word on timing — the fix changes the 0.9.0 archive (new archive, new uploads).

## Respawn case (2026-11-07 07:41, background game, pack `374b90d`)

Death by `pult.sh "exec suicide"` → the respawn selection → the respawn by itself 8 s later (no bedroll) → «взведено: герой в мире» — no «полноэкранный интерфейс: ОТКРЫТ»,
world time 1.0 read twice, the hero standing on the frame. Case D1–D2 pass (`testcases/TC_conan_pause_loading_screen_respawn_2026-11-07.md`); the in-game
loading screen did not show on this path. Still to run: waystone travel and a dungeon entrance.
