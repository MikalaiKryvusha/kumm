# Bug 115 — after the uninstall the launcher still says the build is installed when the player closed the uninstaller window by its X

> **GitHub issue:** [#46](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/46) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔧 fix built 2026-11-21, the stand case is the check (below)
**Severity:** S2 — a dead end by HOUSE_RULES 38: the launcher offers «Играть» and «Удалить сборку» for a clean game and never «Установить сборку» again
**Version/build:** launcher 1.0.0 of builds 0.9.1-RC1 and 0.9.1-RC2, Conan Exiles Enhanced 3.1.1 · **When/context:** 2026-11-21 00:31, the uninstall check after
the update RC1 → RC2 on the test copy (report `testcases/reports/2026-11-21_conan-launcher-update-rc1-rc2.md`, run 8)
**Fixing:** this session

## Symptom

The RC2 launcher's «Удалить сборку» → «Да»: the uninstaller's console removed the mods and UE4SS and stopped on its last `pause`. The console was closed without
a key press. The game was clean by the download's hash list (missing 0, bad 0), yet the launcher showed the screen `installed` (log 00:31:31): «Играть» and
«Удалить сборку», no «Установить сборку».

## Cause

1. The uninstaller `uninstall_krinik_build.cmd` (template `ConanExiles/_config/uninstall/uninstall.cmd`) deletes itself on its LAST line, after `pause`:
   `pause` · `(goto) 2>nul & del "%~f0"`. A player who closes the console by its X at «Нажмите любую клавишу…» (the usual way to close a finished console)
   leaves the uninstaller in the game root.
2. The launcher decided «the build is installed» by that file alone — `Games.Describe`: `if (File.Exists(Path.Combine(dir, uninstallCmd))) c.Kind = CopyKind.Krinik;`.
3. A successful `-Restore` removes the backup folder `_kumm_backup` with its journal (`Deploy-ModPack.ps1`, `Invoke-Restore`); a failed one keeps both. So the
   journal is the true sign of an installed build; the uninstaller without it is a leftover.

## Fix

- `KrinikConanGames.cs` `Describe`: the build is installed only when the uninstaller AND the journal `_kumm_backup\journal.txt` exist (`Games.JournalOf`).
- `KrinikConanLauncher.cs`, the uninstall window's `Exited`: the uninstaller left without its journal is our leftover — the launcher deletes it and logs it.
- `KrinikConanUpdates.cs` `BuildUpdate.Installed`: the same rule as `Describe` (judge round 4, finding 1) — the update path had still taken a leftover for an
  installed build (the file-list path with no old build, the space check without the mods).
- Found on the way (judge round 4, finding 4): the uninstaller template checked `if errorlevel 1`, and PowerShell on a missing `-File` exits with
  −196608 — with its restore engine gone the uninstaller printed «Готово» and deleted itself on a still-modded game. Now `if %errorlevel% neq 0` in
  `ConanExiles/_config/uninstall/uninstall.cmd` and in the default body of `KUMM/Deploy-ModPack.ps1`; check `KUMM/.work/uninst/errorlevel.mjs`: red on the
  old template (exit 0, «Готово», file gone), green on the new (exit 1, file kept).

## Check (stand case U-X, `live.mjs uninstall --x-close`)

The stand build 1.0.0 installed; «Удалить сборку» → «Да»; the stand waits until the uninstall finished (no `_kumm_backup`, the uninstaller at its `pause`),
then kills the console by PID, as the X closes it. Expected: the log line «окно удаления сборки закрыто», the screen is not `installed` and offers
«Установить сборку»; no uninstaller left in the game root. Control: the same case with the launcher built before the fix shows `installed` (red).
Case U-X2 (`live.mjs delta --leftover`): the leftover lies in the clean game before the launcher starts — no `installed` screen, a manifest-only release
refused as a first install (this is what `BuildUpdate.Installed` decides), the leftover untouched.
