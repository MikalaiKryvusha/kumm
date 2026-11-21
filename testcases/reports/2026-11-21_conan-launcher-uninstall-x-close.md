# Test run report — the launcher after an uninstall whose console the player closed by its X (bug 115, issue #46)

> **Run:** 2026-11-21 16:44 +03:00 · **Who:** the agent · **Object:** the Conan launcher 1.0.0 (build 0.9.1 line), the fixture stand of
> `ConanExiles/_config/launcher/test/stand.mjs` (the real engine `Deploy-ModPack.ps1`, the real uninstaller template `_config/uninstall/uninstall.cmd`)
> **Bug:** `bugs/115_conan_launcher_installed_after_uninstall_window_closed.md`

## 1. What was checked

Case U-X: the stand build 1.0.0 installed by its own `install.cmd`; the launcher of the bundle started (feed off, the stand's state, TEMP and desktop);
«Удалить сборку» → «Да»; the driver waits until the restore finished (no `_kumm_backup`, no `Mods/ModA/a.txt`) and the console sits on its last `pause` with
the uninstaller file still in the game root, then kills the console by PID — the player's X. Expected: the launcher logs «окно удаления сборки закрыто» and
its screen becomes `found-files` (the gold button «Установить сборку», the bundle beside the launcher), not `installed`.

Driver: `KUMM/.work/uninst/ux.mjs <stand JSON> [<exe>]` (temporary; moves into `test/live.mjs` as the mode `uninstall`). Stands `KUMM/.work/uninst/before`
(built with the launcher of 12:25, `KUMM/.work/delta/r4/bin`, no fix) and `KUMM/.work/uninst/after` (the fixed `KrinikConanGames.cs`, `KUMM/.work/uninst/bin`).

## 2. Runs

| # | Launcher | Screens in the log | Verdict |
|---|---|---|---|
| 1 | before the fix | `installed` → `removing` → `installed` | FAIL (the defect reproduced: 5 checks pass, the screen check fails) |
| 2 | with the fix | `installed` → `removing` → `found-files` («Сборка: 1.0.0 для игры 3.1.1 · Файлы сборки: уже лежат рядом с лаунчером») | PASS, 6 / 6 |

Both runs: the uninstall box «Удалить сборку Krinik и вернуть игру в тот вид, в каком она была до установки сборки?…»; the console alive at its pause with
`uninstall_krinik_build.cmd` present; after the kill the file stays in the game root (the launcher's cleanup of the leftover is the second half of the fix, owed).

## 3. Verdict

**pass** for the screen after the X (the fix in `Games.Describe`). Owed: the leftover uninstaller removed by the launcher on the uninstall window's exit
(`KrinikConanLauncher.cs`), the case moved into `live.mjs`, the judge on both.
