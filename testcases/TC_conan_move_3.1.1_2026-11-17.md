# Test cases — the Krinik Conan build on game 3.1.1 (hotfix, CL-383549): start, mods, world

**Created:** 2026-11-17 · **Under test:** the pack deployed into `D:\Games\Conan Exiles 3.1.1` (a copy of the clean version, `HOUSE_RULES.md` rule 25) · **Version/build:**
pack 0.9.0+ (`f372307`), game `++exiles+release-CL-383549`
**Test basis:** epic `plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md` criterion 1 and phase A; the 3.1.0 move's criteria (`plans/53_conan_move_3.1.0.md` 1–6).

## Stand

Place — the owner's world from 3.1.0 (`Game_1.db`, stashed 2026-11-17 19:58 and copied in); the game launched on the background path (`launch-bg.ps1`, rule 16) under the
machine lock; no real input (rule 30); the world entered by the remote (`enter-world-remote.sh`); stand keeper not needed — only logs and the remote are read.

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| P1 | first start, no `-WithEngineIni` | launch | UE4SS starts on the new exe | `ue4ss/UE4SS.log`: «Event loop start», every Krinik mod's start line | pass — 20:26 UE4SS v3.0.1 on CL-383549: «Using engine version: 5.8», «Event loop start» 20:27:02; Krinik mods log (Music, ModPackManager, Archery, UI, Locomotion, Camera) |
| P2 | same | main menu | every pak mounted | `ConanSandbox.log`: «mounted successfully» count = `modlist.txt` lines (66) | pass — 20:28 mounted successfully 66 = modlist 66 |
| P3 | same | read the log | 0 «too old», missing imports = the 3.1.0 baseline (0) | grep counts | pass — 20:28 too old 0, missing import 0 |
| P4 | the game wrote its own Engine.ini | compare `[Core.System] Paths=` with the pack's | equal (90 / 90 in 3.1.0) or `swap-core-paths.py` | diff count | pass — 20:29 the game's own 90 `Paths=` = the pack Engine.ini's 90 (diff 0) |
| P5 | `-Deploy -WithEngineIni` + `deploy-config.py`, second start | enter the world | the world loads; «СБОРКА: моды 66/66» | the remote's status line; a frame | pass — 20:33 `enter-world-remote.sh` «мир загружен (14 с)»; UE4SS.log «СБОРКА: моды 66/66 (эталон 66 модов)»; frame `KUMM/.work/move311/world_311.jpg` looked at: the oasis, our HUD, minimap, Russian prompts, hotbar of bows, FPS 66 |
| P6 | in the world | `patch-rollback.py` on the installed mods | the list of vanilla assets the hotfix changed under mods' whole copies, each read | its output | blocked — the tool compares the OLD and NEW pak lists; 3.1.0's files were overwritten in place by the owner's 3.1.1 download (18:56–19:39) and its cached list `ConanExiles/_scratch/paklist-<clean folder>.json` was deleted in the 20:00 cleanup (EXP lesson). The kit is still 383024 (no 3.1.1 kit). Mitigation: 0 «too old», 0 missing imports, P5 / P7 in game |
| P7 | in the world | the hub opens by the remote, every page shows values | no Lua error in UE4SS.log | log grep `[Lua] error` / `stack traceback` | pass — 20:4x tabs 0 / 2 / 3 opened by `hubswitch/open-tab.lua`, frames `hub_tab0/2/3.jpg` looked at — inventory, doll, crafting; attributes with points; effects and the stats column with values; `stack traceback` total 1 = the startup line of Archery's arrow-swap hook (the class found before its function; the hook is installed later by `NotifyOnNewObject` — «перехват UpdateDisplayUI поставлен» ×2) |

Seen on the way, not 3.1.1-specific: the remote's `SetCarouselIndex` leaves the tab underline under «Снаряжение» (not the player's click path); the «Параметры» stats
column cuts its longest lines at the right edge («Бонус к запасу сил от характеристик: 8», «Постепенное восстановление запаса с…») — compare with bug 64's list.

Found on the way (20:30): `Deploy-ModPack.ps1 -Deploy` started 300 ms after `Stop-Process` while the game was still alive wrote 73 / 75 mods (UE4SS's `dwmapi.dll` and the
music player exe locked) — the deploy does not refuse a running game in its target; after `Wait-Process` the redeploy was 75 / 75. → epic 55 B4 (the installer's own
interlock).
