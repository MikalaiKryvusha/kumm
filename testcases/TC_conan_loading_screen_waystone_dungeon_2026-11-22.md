# Test cases — Conan 0.9.1-RC3: the world does not freeze behind the in-game loading screen on waystone travel and a dungeon entrance; the damage-window stand tool

> **Created:** 2026-11-22 · **Parent:** `bugs/79_conan_pause_freezes_on_ingame_loading_screen.md` (issue #21, label `critical`), cases R21a / R21b of
> `testcases/TC_conan_rc3_critical_retest_2026-11-21.md` (not run there); EXP-0603 (the damage-window tool owed before any damage case)
> **Status:** written 2026-11-22 09:39 +03:00 before the run
> **Outbound:** issue #21 — closed only after R21a and R21b pass by the player's path (HOUSE_RULES 44.3)

**Test basis.** Bug 79: `PauseGameInMenu` (KrinikConanUI) counted `W_IngameLoadingScreen_C` as a full-screen menu, slowed the world to 0.03 and deadlocked the
streaming behind the loading screen. The fix (2026-11-03, `krinik_pause_in_menu.lua` line 595) skips the loading screen. Expected on every path that shows it:
`WorldSettings.TimeDilation` reads 1.0 five seconds after the arrival, the log has no «полноэкранный интерфейс: ОТКРЫТ» for the loading screen, the heroine
stands on the ground. Waystones Enhanced travels by the game's own `TeleportPlayerServer` (`WSE_PlayerComponent`, recon 2026-11-22 —
`games/ConanExiles/mods/WaystonesEnhanced.md`). EXP-0603: a damage window is closed by the game (god back on under half health), never by the agent's reads.

**Dimensions.** Paths that show the loading screen: waystone travel (R21a), a dungeon entrance and its exit (R21b). Already passed (but slowed again 2026-11-22 10:57 and 11:00 — bug 79): the admin teleport
(2026-11-03), death and respawn (2026-11-07, 2026-11-21). The damage-window tool: the time-out close without damage (control, DW0) and the close under half
health by real hits (DW1). Not covered: the map-room teleport (Siptah), multiplayer, a dedicated server.

## Stand

The build `D:\Games\Conan Exiles 3.1.1` (published RC3 bytes + the Locomotion fix + the dev remote), background path (`launch-bg.ps1`), the machine lock `kumm`.
God on by `god-on.sh` except inside DW1's window; `stand-keeper.sh` (600 m, every 20 s) for R21a / R21b, OFF for DW1 (the case needs a live enemy).
Reads by the remote: `TimeDilation` of `WorldSettings`, the heroine's Z and `GetIntStat(1,0)` / `GetIntStat(0,0)`, the KrinikConanUI log lines.
Waystones: `exec MakeMeAdmin` + `exec SpawnItem 7770001 2` (item 7770001, recon 2026-11-22), two placed far apart. Dungeon: the entrance actor found in the live
world, the heroine walked into it.

## Cases

| # | Situation | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| DW0 | the heroine alive at full health, no enemy within 600 m | `damage-window.lua` with `_G.__dw_max_s=5` | «open» line; after 5 s «closed … time out», god ON (`bCanBeDamaged` false) | pass | 09:43:23 «open … hp 236/236, closes under 118 or after 5 s», `bCanBeDamaged` true inside; 09:43:28 «closed: time out hp 230/236 after 4.8 s, god ON, 47 ticks»; `bCanBeDamaged` false after. Before it (09:41) the tool refused at hp 56/236 «heal first»; healed by `CheatManager:SetStat('HealthCurrent', 236.0)` |
| DW0b | the same, after judge round 1 (inputs checked before god goes off, pcall around the open and the tick) | `_G.__dw_max_s=2.5` (a float — the judge's failure scenario); then `_G.__dw_frac=1.5` | the float window opens and closes by time-out with god ON; the bad fraction is refused with god still ON | pass | 09:48:43 «open … after 2.5 s» → 09:48:46 «closed: time out hp 230/236 after 2.6 s, god ON, 25 ticks»; `bCanBeDamaged` true inside, false after; «_G.__dw_frac must be between 0 and 1», `bCanBeDamaged` false |
| DW0c | the same, after judge round 2 (tick 20…1000 ms, a token per window, god for the new pawn after a death) | `_G.__dw_ms=60000`; then a 2 s window | the minute tick refused with god ON; the 2 s window closes by time-out with god ON | pass | «_G.__dw_ms must be 20…1000», `bCanBeDamaged` false; 09:52:38 «open … after 2.0 s» → 09:52:40 «closed: time out hp 236/236 after 2.1 s, god ON, 20 ticks» |
| DW1 | the heroine at full health 3 m from a living camp humanoid, the stand keeper off | `damage-window.lua` with `_G.__dw_frac=0.5` | the enemy hits; «closed … under the floor» with hp between 1 and half of max; god ON; the heroine alive | not run | |
| R21a | two waystones placed far apart, the heroine at one | travel by the waystone's own map to the other | the loading screen passes; 5 s after the arrival `TimeDilation` 1.0; no «ОТКРЫТ» for the loading screen; the heroine on her feet at the other waystone | not run | |
| R21b | the heroine 5 m before a dungeon entrance | the heroine walks into the entrance, then out through its exit | the same as R21a, both ways | **fail** (10:53) | Wine Cellar: the door is closed, walking past does nothing; set into the trigger → teleported into the dungeon; «полноэкранный интерфейс: ОТКРЫТ» → «замедление времени 0.03» at 10:53:35.66, read «tdil 0.03 loading true» at 10:53:37, time back to 1.0 at 10:53:37.71 when the screen closed. The loading screen was taken for a menu for ≈ 2 s — bug 79's class on this path; the throttled search in `loading_screen_up()` misses the first poll. The exit not run. **Retest on the fix: pass** 10:57 (v1) and 11:01 (v2): «tdil 1.00 loading true», no «ОТКРЫТ». The admin teleport still slowed (bug 79, «The fix in progress») |

## Neighbours (HOUSE_RULES 39)

| # | Neighbour of the change | Short case | Status | Seen |
|---|---|---|---|---|
| N1 | the pause in a real menu (the same `PauseGameInMenu` poll) | open the inventory in the world: the time slows to 0.03; close it: 1.0 | not run | |
