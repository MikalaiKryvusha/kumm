# Test run report — the launcher updates an installed 0.9.1-RC1 to the published 0.9.1-RC2

**Created:** 2026-11-21 00:27 +03:00 · **Run by:** the agent (Claude Opus 5.5, the chat of 2026-11-20 22:07) ·
**Version/build:** Krinik Mod Pack 0.9.1-RC1 → 0.9.1-RC2 (GitHub release `v0.9.1-RC2`, published 2026-11-20 23:57); launcher 1.0.0; Conan Exiles Enhanced 3.1.1 (CL-383549)

## 1. Work

The owner's purpose of RC2: an RC1 player gets RC2 through the launcher. Cases `testcases/TC_conan_launcher_update_rc1_to_rc2_2026-11-20.md` (U1–U5).

## 2. Contour

A copy of the clean 3.1.1 in `KUMM/.work/rc1_install/Conan_311`; the RC1 launcher and its seven parts placed in `Conan_311/rc1_launcher`, so the launcher takes the
game it lies in; started by `KUMM/.work/rc2_update/start.ps1` with TEMP, the launcher state, the desktop, the search roots and Steam isolated in
`KUMM/.work/rc2_update`; buttons and the message box by `ConanExiles/_config/launcher/test/click.ps1` (BM_CLICK). The network path is the real GitHub feed and
the real release assets. REAL WORLD: accumulated — a fresh copy with RC1 installed by its own launcher and a player's change in `GameUserSettings.ini`, as an RC1
player has it; data and machine — the owner's PC and its internet line to GitHub; path — the launcher's own buttons and its own confirmation box.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-20 23:19 +03:00 | `powershell -File start.ps1 -Exe …\Conan_311\rc1_launcher\KrinikConanLauncher.exe` | PID 31088; «игра: …\Conan_311 · CL 383549 · Clean»; feed «новейшая 0.9.1-RC1»; screen `found-files` |
| 2 | 2026-11-20 23:20 +03:00 | `node click.mjs 31088 install` | «части выпуска 0.9.1-RC1 лежат рядом с лаунчером — скачивание пропущено»; installer «74/74 mods, 146 files · verify 115 present, 0 missing» 23:21:35; restart PID 12824, screen `installed` |
| 3 | 2026-11-20 23:22 +03:00 | a comment line appended to the copy's `ConanSandbox/Saved/Config/Windows/GameUserSettings.ini` | sha256 07b71a5e… → 240fa387… |
| 4 | 2026-11-20 23:59 +03:00 | `powershell -File start.ps1 -Exe …\Krinik_Mod_Pack_0_9_1_RC1\KrinikConanLauncher.exe` | PID 31108; feed «сборок 3, новейшая 0.9.1-RC2 (у нас 0.9.1-RC1)»; screen `update` |
| 5 | 2026-11-21 00:00 +03:00 | `node click.mjs 31108 update`, then `click.ps1 -Dialog -Press 6` | the box «Скачать сборку 0.9.1-RC2 (12,8 ГБ) и поставить её вместо 0.9.1-RC1? … На диске D: свободно 35,9 ГБ» read and confirmed; «хвост архива проверен» 00:00:54 |
| 6 | 2026-11-21 00:00–00:22 +03:00 | the launcher's download, unpack and install | 7 parts into `Conan_311/Krinik_Mod_Pack_0_9_1_RC2_parts` (≈ 11.6 MB/s); installer «74/74 mods, 146 files · verify 115 present, 0 missing» 00:22:25; restart PID 32440, feed «у нас 0.9.1-RC2» |
| 7 | 2026-11-21 00:25 +03:00 | `grep -c` of the marker in GameUserSettings.ini; `grep -c -a 0.9.1-RC2` / `0.9.1-RC1` in the copy's `ConanSandbox/Mods/KrinikConanUI.pak` | marker 1; «0.9.1-RC2» ×4, «0.9.1-RC1» ×0 |

## 4. Checks

Hygiene: none of its own (the launcher and the installer are the released binaries).
Functional run: the RC1 launcher's install from local parts and its update to RC2 walked by its own buttons and box on the copy, the launcher's log and the
installer's summary READ, the player's settings file and the installed UI pak read after the update.

| Case | Status | Observation |
|---|---|---|
| U1 RC1 installs from local parts | pass | run 2 |
| U2 RC2 is offered | pass | run 4 |
| U3 the update runs | pass | runs 5–6 |
| U4 the game shows RC2 | pass by proxy | run 7: the installed UI pak carries «0.9.1-RC2» and not «0.9.1-RC1»; the main-menu frame of the same kit pak build read «0.9.1-RC2» in the working game (report `2026-11-20_conan-rc2-build.md`, run 6). «Играть» was not pressed on the copy: the owner was at the PC and the game would have come over his screen |
| U5 the player's settings stay | pass | run 7: the marker survived the update |

## 5. Found

- The release ritual's «Latest» line stayed TODO after the publish (it compared the previous build release with this tag) — fixed, pack `4bb6932`.
- The RC1 bundle folder `Krinik_Mod_Pack_0_9_1_RC1` stays in the game folder beside the RC2 one after the update; the launcher offers to delete a previous
  bundle by its own dialog (plan 54 L9) — not seen in this run, the restarted launcher showed no such box in its log. Not a defect yet: noted to look at.

- **The uninstall after the update (run 8, 2026-11-21 00:28–00:32):** the RC2 launcher's «Удалить сборку» → its box «Удалить сборку Krinik и вернуть игру в тот
  вид, в каком она была до установки сборки?» → «Да»; the uninstaller's console removed the mods and UE4SS and stopped on its final `pause`; I closed that console
  by PID instead of a key press (a key needs the console in front of the owner's screen), so its self-delete did not run. `download-check.mjs list` against the
  download's hash list: missing 0, bad size 0, extra 377 files = the two bundle folders `Krinik_Mod_Pack_0_9_1_RC1` and `…_RC2` (13 722 796 657 B and 13 722 825 809 B)
  and `uninstall_krinik_build.cmd` — the game itself is back to clean.
- **The RC1 bundle stays after the update** — 13.7 GB left beside RC2 (the launcher's previous-bundle delete offer did not show).
- **After the uninstall the launcher showed the screen «installed»** (log 00:31:31) where HOUSE_RULES 26 expects «Установить сборку» — the game is clean by the
  hash list; a defect candidate to reproduce and file.

## 6. Traces

`KUMM/.work/rc2_update/tmp/KrinikConanLauncher.log` (both launchers' lines), `KUMM/.work/rc2_update/dialog1.txt` (the confirmation box), the copy
`KUMM/.work/rc1_install/Conan_311`.

## 7. Verdict

pass — U1, U2, U3, U5 by the player's path; U4 by the installed pak's version line (the frame on the copy not taken, for the reason above).
