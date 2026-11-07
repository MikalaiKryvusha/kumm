# Test cases — Conan: the hub pause on the in-game loading screen, death and respawn (bug 79)

**Created:** 2026-11-07 · **Under test:** KrinikConanUI section `krinik_pause_in_menu` (the world slowed while a full-screen menu is open) · **Version/build:**
Conan 3.0.1 build, pack `374b90d`
**Test basis:** bug 79 «Player risk — to check»: any path that shows `W_IngameLoadingScreen_C` in the world may freeze the world at 0.03; the fix of
2026-11-03 13:11 was seen on the teleport stand only.

## 1. Goal vector

Avoid: after death the respawn (death screen → respawn point → the loading screen → the world) never leaves the world slowed: time 1.0 once the hero stands
in the world again.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHEN the hero dies and respawns, the world time shall return to 1.0 | `GetGlobalTimeDilation` 1.0 within 5 s after the hero is back; the log has no «ОТКРЫТ» without its «закрыт» |

## 3. Stand

Background game (`launch-bg.ps1`), world by `enter-world-remote.sh`; death by the remote's console (`exec` of a suicide command — to find); the respawn
chosen by the remote on the death screen (its button event — to find by `dump`).

## 4. Cases

| # | Case | Steps | Expected | Status · observation |
|---|---|---|---|---|
| D1 | death screen | kill the hero by the remote; frame; the pause section's lines | the death screen; time — whatever the game does on death (record it) | pass (07:41:40): `pult.sh "exec suicide"` kills the hero; module «RespawnPointSelection: открыт»; time 1.0; no «полноэкранный интерфейс: ОТКРЫТ» |
| D2 | respawn | choose a respawn point by the remote; 5 s after the hero is back — time, frame, log | time 1.0; the hero stands; «полноэкранный интерфейс: закрыт» if it was «ОТКРЫТ» | pass (07:41:48–07:43): the respawn went by itself (no bedroll; the selection closed 8 s after death), «взведено: герой в мире» 07:41:50, time 1.0 read twice, frame `d1b.jpg` — the naked hero at the desert spawn, HUD, the world moving. The in-game loading screen did not show on this path |
