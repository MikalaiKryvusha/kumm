# Dungeon Siege II + Broken World — external map (where things live)

> **Created:** 2026-10-25 · first work on the game (rule: two maps per game, `AGENT_GUIDE.md` → Notes from the human)
> **Status:** living reference · recon — `researches/dungeon-siege-2-modern-display/README.md`

| What | Where | Notes |
|---|---|---|
| Owner's working install | `D:\Games\Dungeon Siege II` | BW 2.30, Russian (MikleWorks). Launched by `ЗАПУСК.bat` / desktop shortcut: `enshrouded.exe nointro=true fullscreen=false` (window 1366×768) + Lossless Scaling (Anime4K ×1.5). DO NOT add DLLs here. |
| `enshrouded.exe` | same folder | = `DungeonSiege2_retail.exe` of the mouse-cursor fix, renamed (SHA1 91FA3B345D59…); `DungeonSiege2.exe` beside it is the plain one |
| exe revision | `DungeonSiege2.exe`, 23 408 640 bytes | not the 8 212 480-byte v2.3 exe that DS2 Remastered (Nexus #183) patches — #183 refuses it; #183 also excludes Broken World (README) |
| Portable kit | `D:\Games\Dungeon Siege II\_PORTABLE\` | `README.txt`, `restore.ps1` (`-DryRun`), `reg\`, `saves\`, `fixes\` (cursor fix, rus+FOV, Language.dll, wined3d-staging); `ВОССТАНОВИТЬ.bat`, `СОХРАНИТЬ_СЕЙВЫ.bat` in the root |
| dgVoodoo experiment copy | `D:\Games\Dungeon Siege II (dgVoodoo)` | copy without `_PORTABLE`; + `D3D9.dll` (dgVoodoo2 2.87.5 MS\x86), `dgVoodoo.conf`, `dgVoodooCpl.exe` |
| Config (shared by EVERY copy) | `%USERPROFILE%\Documents\My Games\Dungeon Siege 2 Broken World\DungeonSiege2BrokenWorld.ini` | `width`, `height`, `bpp`, `x`, `y`, `attempts` (counter, bumps per launch), `sp_active_party = Krinik`. Plain DS2: `…\My Games\Dungeon Siege 2\DungeonSiege2.ini` |
| Saves | `…\My Games\Dungeon Siege 2 Broken World\` and `…\My Games\Dungeon Siege 2\` | hero Krinik |
| Registry | keys exported in `_PORTABLE\reg\` | install path, product key, Broken World, EULA, DPI flag for `enshrouded.exe` |

Command line: ini keys are accepted as `key=value` arguments (`nointro=true fullscreen=false` in the owner's shortcut; `width=` /
`height=` / `fullscreen=true` used by the dgVoodoo copy on 2026-10-25 — honoured: the copy opened 1280×720 fullscreen).
