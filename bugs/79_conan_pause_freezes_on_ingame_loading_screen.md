# Bug 79 — the hub pause takes the in-game loading screen for a menu and freezes the world

> **GitHub issue:** [#21](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/21) — the public tracker of this defect (HOUSE_RULES 44)

> **Created:** 2026-11-03 12:53 +03:00 · **Parent:** plan 43 item 20 (the Nexus screenshot stand) · **Status:** 🔴 2026-11-22: the dungeon path reproduced and fixed (pack 3b5e1e6, review owed), the admin teleport slows ≈ 3 s again (10:57, 11:00) — see «The fix in progress»; was 🟡 fixed 2026-11-03 13:11 on the teleport stand (time 1.00 through it, landed in 4 s); respawn case passed 2026-11-07 07:41 (no freeze); waystone and dungeon cases still to run
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

## Dungeon case R21b (2026-11-22 10:53, the 0.9.1-RC3 build, background game) — REPRODUCED, the fix does not catch this path

The Wine Cellar entrance (`BP_WineCellar_TriggerTeleport_From_Dungeon_Entrance` @ −186230 107319 −9746; its door is closed — walking past it does nothing,
so the heroine was set into the trigger volume by `K2_SetActorLocation`) teleported her into the dungeon (207135 −318855). The log:
`10:53:35.66 [KrinikConanUI:PauseGameInMenu] полноэкранный интерфейс: ОТКРЫТ` → `меню открыто: замедление времени 0.03` (+ `CraftTimeMultiplier = 0.03`);
the remote read at 10:53:37 «tdil 0.03 loading true» (`W_IngameLoadingScreen_C` in the viewport); `10:53:37.71 взведено … полноэкранный интерфейс: закрыт` →
time 1.0. The world ran at 0.03 for ≈ 2 s behind the in-game loading screen; this time the load finished and the time came back — on a longer streaming the
deadlock of 2026-11-03 is the expected outcome. **Cause (reading `krinik_pause_in_menu.lua` lines 551–595):** `loading_screen_up()` searches for the
widget only once in `SEARCH_EVERY` polls when nothing is cached; on the first poll with the full-screen GUI on, the wait counter makes it return false, and
the pause applies at once. **Fix owed:** search at once on the poll where the full-screen GUI turns on (no throttle on the first look), then the case again.
Frames: `KUMM/.work/fp_v2/wc_trigger.jpg`. Case R21b of `testcases/TC_conan_loading_screen_waystone_dungeon_2026-11-22.md`.

## The fix in progress (2026-11-22 10:5x–11:01, `krinik_pause_in_menu.lua`, pack commit with `review: owed`)

1. v1 (10:55): the search counter reset on the edge «full-screen GUI opened». Run 10:57: the dungeon entrance PASS (time 1.00 behind the loading screen,
   no «ОТКРЫТ»); the admin teleport (`exec TeleportPlayer`) still «ОТКРЫТ → 0.03» for ≈ 3 s (10:57:06 → 10:57:08.9).
2. v2 (10:59): the first 8 polls after the opening search every poll, the pause applies from the 2nd poll (placed AFTER the arming, so the world-load guard of
   13.09 holds). Run 11:01: the dungeon entrance PASS again; the admin teleport STILL «ОТКРЫТ → 0.03» (11:00:58) — so on that path the loading widget is
   not found within 2 s at all (another class or not in the viewport yet): **owed — read which widget is in the viewport during the admin teleport's load**.
   The neighbour «the inventory pause» not proven (`ActivateModule(FName('Inventory'))` by the remote did not open it — the module name is to check); the pause
   path itself still engages (the teleport's wrong 0.03 shows it). A log spam remains: «взведено …» every poll while a loading screen shows.
3. Owed before DONE: the judge round on the diff, the admin-teleport path, the inventory neighbour, the waystone case R21a.

## The admin-teleport cause found (2026-11-22 13:17 +03:00, probe R21c, the RC3 build with pack 3b5e1e6, background game)

`KUMM/.work/tmp/tp_widget_probe.lua` sent `TeleportPlayer -186230 107319 -9500` (out of the Wine Cellar) and sampled every 100 ms
(`KUMM/.work/tmp/tp_widget_probe.txt`): at +175 ms `IsFullscreenGUIActive` true and `W_IngameLoadingScreen_C` already IN the viewport — but TWO live
instances exist (`ld=1/2`: the one of the previous load, still valid, not in the viewport, and the new one). +321…510 ms `tdil 0.0300`; at +495 ms the old
instance is gone (`ld=1/1`) and at +615 ms the time is back to 1.0. **Cause:** `loading_screen_up()` caches the FIRST live instance and re-searches only when
it dies — when that is the stale instance of an earlier load, `IsInViewport()` answers false while the real loading screen shows, and the pause applies until
the stale one is collected. **Fix owed:** a cached instance that is not in the viewport is not proof — look for ANY live instance in the viewport (2 objects)
while the full-screen flag is on; then R21c / R21d again. (The probe's duplicate sample lines are the probe's own double schedule, not the game.)

## Respawn case (2026-11-07 07:41, background game, pack `374b90d`)

Death by `pult.sh "exec suicide"` → the respawn selection → the respawn by itself 8 s later (no bedroll) → «взведено: герой в мире» — no «полноэкранный интерфейс: ОТКРЫТ»,
world time 1.0 read twice, the hero standing on the frame. Case D1–D2 pass (`testcases/TC_conan_pause_loading_screen_respawn_2026-11-07.md`); the in-game
loading screen did not show on this path. Still to run: waystone travel and a dungeon entrance.
