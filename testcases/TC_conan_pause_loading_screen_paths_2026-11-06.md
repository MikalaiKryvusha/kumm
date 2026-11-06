# Test cases — Conan: the world does not freeze on the in-game loading screen (bug 79, the open paths)

> **Created:** 2026-11-06 · **Parent:** `bugs/79_conan_pause_freezes_on_ingame_loading_screen.md` (fixed 2026-11-03 on the teleport stand: `PauseGameInMenu`
> skips `W_IngameLoadingScreen_C`); the owner's evening-comfort list (chat 2026-11-06 18:05, item 2)
> **Status:** 🔧 written 2026-11-06 19:44 +03:00, not run
> **Outbound:** —

**Test basis.** Bug 79: a loading screen counted as a full-screen menu slowed the world to 0.03 and deadlocked streaming. Expected now: on every path that shows
the loading screen, `WorldSettings.TimeDilation` reads 1.0 five seconds after the screen appears, and the hero stands on the ground at the destination.

**Dimensions.** The paths that show `W_IngameLoadingScreen_C`: death and respawn, a dungeon entrance, Waystones Enhanced travel; the teleport stand (control,
passed 2026-11-03). Not covered: the map-room teleport (needs the Siptah map), multiplayer.

## Stand

Game with the build, background path, god mode OFF only for D1 (the death case); the save's spot. Reads by the remote: `TimeDilation`, the hero's Z, the log lines
`[KrinikConanUI:PauseGameInMenu] полноэкранный интерфейс: ОТКРЫТ/закрыт`.

## Cases

| # | Situation | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| D1 | the hero alive in the world | the remote kills the hero (`KillCharacter` on the hero) and presses respawn (the game's own respawn widget call) | the loading screen passes; 5 s after it `TimeDilation` 1.0; no «ОТКРЫТ» for the loading screen in the log | not run | |
| D2 | the hero next to a dungeon entrance (the Dregs / a cave from the game map) | the hero walks / is teleported into the entrance volume | the same as D1 | not run | |
| D3 | two discovered waystones (Waystones Enhanced) | travel by the waystone's own use | the same as D1 | not run | |
