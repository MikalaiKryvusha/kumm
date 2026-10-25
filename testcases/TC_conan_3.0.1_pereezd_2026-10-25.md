# Test cases — Conan pack moved to game 3.0.1

> **Created:** 2026-10-25 · **Basis:** `plans/33_conan_pereezd_3.0.1.md`, acceptance criteria 1–5; the owner's order 2026-10-25
> «провестировать, что все моды запускаются» · **Contour:** the owner's install `D:\Games\Conan Exiles 3.0.1` (CL-379176), new game
> (no save carried over — the owner's word), pack `D:\work\ai_sandbox\ConanExiles`, UE4SS 1152.

Dimensions covered: load (menu / world), each layer of the pack (paks · UE4SS · our Lua mods · our level table · file mods), the deploy
self-check. Not covered on purpose: the gameplay of the 38 foreign mods (mount ≠ works — a later run or the owner's play), graphics on the
4K TV (owner's eye), the multiplayer path.

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| D1 | Deploy self-check | `.\Deploy-ModPack.ps1 -Deploy -PackDir <pack>` | `verify N present, 0 missing`, exit 0 | pass | 2026-10-25 ≈09:19: 49/49 mods, 160 files, verify 66 present 0 missing |
| M1 | No pak rejected | launch → main menu; grep game log | no `too old`, no `Failed to mount` | pass | game log read 09:20:45: neither string present |
| M2 | All paks mounted | same log | `Mounting mod pak file` count = 43 = lines of `modlist.txt` | pass | 43 × `Mounting mod pak`; `[ConanModPackStatus] СБОРКА: моды 43/43 (эталон 43 модов)` 09:20:45 |
| U1 | UE4SS up | `ue4ss/UE4SS.log` | `Using engine version: 5.8`, `FName Alignment: 0x4`, `Event loop start` | pass (partial) | `Using engine version: 5.8` 09:20:01, `Event loop start` 09:20:21; the `FName Alignment` line was not grepped |
| U2 | Our four Lua mods start | UE4SS log | start line of ConanCameraControl, ConanModPackStatus, KrinikOblivionLocomotion, KrinikPauseGameInMenu | pass | all four `загружен`; Jump, UpdateMaxMovementSpeed, ActivateModule hooks `встал` |
| S1 | Intro movies skipped | launch | no splash videos before the menu (No-Intro-Splash) | pass | menu at 09:20:54 with no splash; screenshot c02 — main menu, «Revision #379,176», Offline modal hidden |
| W1 | New game enters the world | Single player → new character → world | `LoadMap(/Game/Maps/ConanSandbox/ConanSandbox)`, screenshot with HUD, process alive 60 s after | pass | slot 1, «Упадок», male hero; `LoadMap(ConanSandbox)` 09:26:05 (6 s), hero 09:28:29; frame c18 09:29 — world, HUD, quest «Выживший» in Russian |
| W2 | Pack status line | in world | `[ConanModPackStatus] СБОРКА: моды 43/43` | pass | 43/43 at 09:20:45 and at 09:24:02 (menu; the count does not wait for the world) |
| L1 | Our level table | in world, level 1 | HUD XP scale end = generator row 1 of `_config/xp-table.py` | pass | HUD «XP 25 / 500 (475)», level 1; generator `--levels 10000 --p 0.5 --anchor 500` row 1 = `0,500` (vanilla would be 175) |
| P1 | Pause in menu | Tab in world | pause mod logs time dilation 0.03 | pass | inventory opened: `меню открыто: замедление времени 0.03 → лежит 0.0300` 09:29:01 |
| C1 | Camera behind the back | in world | camera mod logs the rewritten target offset | pass | `ЦЕЛЬ ПРИТЯЖЕНИЯ переписана на X=-100.0 Y=0.0 Z=65.0` 09:28:31; frame c18 — camera straight behind |
| R1 | Locomotion law | hero spawned | `по закону бег` line, MaxWalkSpeed = 450 + 3·Agility | pass | `Проворство 0 → бег 450 (x1.0000), спринт по закону 773, взлёт 420`, `MaxWalkSpeed 450.0` |
| F1 | Foreign mods visible in play | frame c17/c18 | their UI present | pass | Hosav HUD, The Damage Meter, Simple Minimap, Exiles Fishing 4.7.0 admin panel, Xevyr's Mods tab — on screen; their gameplay not walked |
| X1 | Clean exit | `_config\close-game.ps1` | process gone, UE4SS.dll free | pass | «closed cleanly in 4,7 s (UE4SS.dll free)» 09:29:3x |
