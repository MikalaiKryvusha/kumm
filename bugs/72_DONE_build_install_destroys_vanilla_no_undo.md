# Bug 72 — the build's install overwrote game files without copies; uninstall could not return the vanilla game

**Status:** ✅ DONE [2026-10-31 16:03 +03:00] (engine; the live-game run is the open tail below) · **Severity:** S1 (the owner's game data and trust) · **Version/build:** KUMM `Deploy-ModPack.ps1` before 2026-10-31
**When/context:** 2026-10-31 15:50–15:53, the owner, on «нужна будет чистая версия?»: `[OWNER]` «получается, наша установка разрушительная?» ·
«просто не понимаю, зачем тебе чистая версия. Такое тебе может быть нужно только, если наша сборка устанавливается разрушительно» · «без возможности
отката без проблем на ваниль. Так?» · «возможно наш лаучер должен инсталировать сборку так на чистую верси., чтобы делать бекапы того, что нужно
откатывать при удалении сборки» · «то есть, инсталятор должен устанавливать унисталер сборки с возможностью отката на ваниль» · «или чтобы прямо из
лаунчера можно было это сделать по кнопке удаления сборки».
**Fixing:** this session — done.

## Symptom (read from the code, 2026-10-31 15:51)
1. `kind: files` mods overwrote game files in place (No-Intro-Splash: the intro `.bk2` movies) — no copy; `-Remove` then DELETED them.
2. The build's game settings (`Saved/Config/Windows/*.ini`) and mod settings (`Saved/SaveGames/*.sav`), installed by the «Game config» step, overwrote the
   player's own — no copy (only `Engine.ini` through `-WithEngineIni` got a `.bak` beside it).
3. `modlist.txt` was rewritten — the player's own paks fell out of the load order.
4. `-Remove` deleted only the `install` step targets and looked for paks under Palworld's `Pal\Content\Paks\~mods`: Conan paks were never removed.
The agent kept asking for a clean copy of the game to test on — the symptom of the defect, as the owner pointed out.

## Fix (engine)
- **Undo journal** `<game>\_kumm-backup\journal.txt`: before EVERY write under the game folder `Save-Original` records `replaced <rel>` (+ a copy in
  `_kumm-backup\files\<rel>`), `created <rel>` or `dir <rel>`; the first record of a path wins, so re-deploys (updates) keep the pre-build original.
  Hooked into: paks, `modlist.txt`, `install` steps (`Copy-Tree -Target`), `steam_emu`, `PalModSettings.ini`, `Engine.ini` inside the game.
  Files OUTSIDE the game folder (Palworld's `%LOCALAPPDATA%` Engine.ini, `userConfig`) keep their old `.bak` — conscious boundary.
- **`-Restore -GameDir <game>`** — reads ONLY the journal (no manifest, no pack folder): deletes what the build created, returns every copy, removes the new
  folders that became empty, then deletes `_kumm-backup`; any failure keeps the copies, exit 1. `-Remove` (no `-Only`) with a journal = the same restore.
- **Uninstaller** in the game root, name and Russian text from the pack (`manifest.uninstall.cmd` / `.template`, `{BACKUP}`; the engine file has no BOM,
  PowerShell 5.1 would misread Cyrillic literals in it) — calls the engine copy in `_kumm-backup\` with `-Restore`, deletes itself at the end.
  Conan: «Удалить сборку Krinik.cmd» (`ConanExiles/_config/uninstall/uninstall.cmd`); the launcher's «Удалить сборку» runs the same file.

## Guard
`node tools/fixture-pack.mjs`, block «откат» — 7 checks: journal + uninstaller written; the template's Cyrillic intact; the deploy really replaced a
vanilla movie and Engine.ini (precondition); a second deploy keeps ONE record per path and the vanilla copy; **the player's path — `cmd /c Uninstall.cmd`
— returns the game folder byte-for-byte** (the player's own pak in modlist, the movie, Engine.ini, an EMPTY vanilla folder kept, no copies, no uninstaller);
control: `-Restore` with no journal → exit 1; `-Remove` with a journal → the same tree.
- THREAT: a build install that cannot be undone on the player's machine.
- PROVED-AGAINST: before the Engine.ini fix the run went red (3 checks: the `$target`/`$Target` case clash nulled the parameter); the old engine has no journal at all.
- GAP: the live Conan folder (83 GB, real paks, the owner's settings) not yet run through deploy → uninstall.
- ON-REAL-PATH: NOT YET.

## TWINS
searched `Copy-Item … -Force` and `WriteAllText`/`Set-Content` into `$Target.Path` in `Deploy-ModPack.ps1` — 7 write sites, all journaled above; Export writes
into its own output folder (not a game) — out of scope.

## Decisions made without the owner
- `[AI]` The backup folder name `_kumm-backup` (engine-wide, not per pack).
- `[AI]` While the build is installed the player's own paks stay out of `modlist.txt` (the manifest owns the load order, as before); the uninstall returns them.
- `[AI]` The uninstaller is not journaled — it deletes itself after a successful restore.

## Links
Cases and report — `testcases/TC_build_install_undo_journal_2026-10-31.md`, `testcases/reports/2026-10-31_build-install-undo-journal.md`; idea 22 (launcher).
