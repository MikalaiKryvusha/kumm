# Test cases — 0.9.1-RC3 retested on the PUBLISHED GitHub release (issues #45, #46)

> **Created:** 2026-11-21 · **Basis:** HOUSE_RULES 44.4 (the retest is the agent's own play by the player's path, on the published release, before an issue
> closes) · plan 57 phase 6 criteria 6–7 · `bugs/115_DONE_conan_launcher_installed_after_uninstall_window_closed.md`
> **Contour:** the copy `KUMM/.work/rc1_install/Conan_311` of the clean Conan Exiles Enhanced 3.1.1 (CL-383549); the REAL GitHub feed
> (`api.github.com/repos/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/releases`, no `KRINIK_LAUNCHER_FEED`); the launcher's state, TEMP, desktop,
> search roots and Steam are the stand's (`KUMM/.work/rc3/`, EXP-0594); machine lock `kumm`.
> **Dimensions covered:** the feed (real, published) · the launcher self-update (1.0.0 → 1.1.0 from `launcher-v1.1.0`) · the build update by the file list
> (RC2 → RC3, a skipped-nothing path) · the uninstall window closed by its X. **Not covered here:** a first install from zero (STATUS next step), a player
> who skipped two releases (RC1 → RC3), a slow or broken network (stand cases D5–D8 cover them on the local feed).

| # | Case | Steps (the player's path) | Expected | Status | Observed |
|---|---|---|---|---|---|
| P0 | The copy holds RC2 with the player's launcher 1.0.0 | uninstall RC3 by its `uninstall_krinik_build.cmd`; remove the RC3 bundle folder; RC2's `install.cmd "<copy>" < nul`; the RC2 bundle's `KrinikConanLauncher.exe` = the asset of GitHub release v0.9.1-RC2 | `_kumm_backup\pack_version.txt` reads 0.9.1-RC2; the exe's SHA-256 = the v0.9.1-RC2 asset digest | pass | see the run report testcases/reports/2026-11-21_conan-rc3-published-retest.md |
| P1 | The RC2 launcher reads the real feed | start the RC2 launcher 1.0.0 | the log line «лента:» names the newest build 0.9.1-RC3 for this game and launcher 1.1.0 (ours 1.0.0); the plate «Вышел лаунчер 1.1.0» | pass | see the run report testcases/reports/2026-11-21_conan-rc3-published-retest.md |
| P2 | Self-update from the published launcher release | press «Обновить лаунчер» | the new launcher 1.1.0 runs from the same folder; the log says «лаунчер обновлён до 1.1.0» | pass | see the run report testcases/reports/2026-11-21_conan-rc3-published-retest.md |
| P3 | The update RC2 → RC3 from GitHub by the file list (#45) | press «Обновить сборку» → «Да» | the box names the size to download; «сборка 0.9.1-RC3 поставлена»; no volume `.zip.NNN` downloaded; `pack_version.txt` reads 0.9.1-RC3 | pass | see the run report testcases/reports/2026-11-21_conan-rc3-published-retest.md |
| P4 | The uninstall window closed by its X (#46) | in the updated launcher press «Удалить сборку» → «Да»; when the console waits at its last line, close it (kill by PID = the X) | the log says «окно удаления сборки закрыто»; the screen becomes `found-files` with «Установить сборку»; the leftover uninstaller is gone | pass | see the run report testcases/reports/2026-11-21_conan-rc3-published-retest.md |

**Neighbours (HOUSE_RULES 39):** P3 also reads the offer to delete the previous bundle folder (answered «Нет»); P4 reads the game folder restored (no `_kumm_backup`).
