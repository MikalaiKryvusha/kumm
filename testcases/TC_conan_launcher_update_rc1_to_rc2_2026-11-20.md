# Test cases — the launcher updates an installed 0.9.1-RC1 to 0.9.1-RC2 by the player's path

> **Created:** 2026-11-20 · **Parent:** STATUS «Where to continue», item 0 (the owner's purpose of RC2: the update RC1 → RC2 through the launcher)
> **Status:** run 2026-11-20 23:19 – 2026-11-21 00:25, report testcases/reports/2026-11-21_conan-launcher-update-rc1-rc2.md; cases written 2026-11-20 23:19 +03:00, before the run
> **Outbound:** the run report `testcases/reports/2026-11-21_conan-launcher-update-rc1-rc2.md`

**Basis.** The launcher 1.0.0 (plan 57, plan 54 case B): it reads the GitHub feed, shows a newer build for the found game, and «Обновить сборку» downloads and
installs it, keeping the player's settings and saves. The guide, «Лаунчер 1.0.0»: «Когда выходит новая версия сборки или самого лаунчера, она появляется в окне
лаунчера, и поставить её можно одной кнопкой … Настройки и сохранения игрока после обновления сборки остаются на месте».

**Stand.** A fresh copy of the clean 3.1.1 in `KUMM/.work/rc1_install/Conan_311`; the RC1 launcher and the seven RC1 parts in `Conan_311/rc1_launcher`
(the launcher finds the game it lies in — `Around()`); started by `KUMM/.work/rc2_update/start.ps1` with TEMP, state, desktop, search roots and Steam isolated;
buttons pressed by `ConanExiles/_config/launcher/test/click.ps1` (BM_CLICK, no real input). Dimensions covered: the install from local parts (no download), the
feed before and after the RC2 publication, the update download, the result in the game's main menu, the player's settings across the update. Not covered:
a second game copy on the disks, an interrupted update download (plan 54 B-cases cover it on the stand).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| U1 | RC1 installs from local parts | start the RC1 launcher in `rc1_launcher`; press «Установить сборку» | no download; «74/74 mods», verify 0 missing; the screen «installed», version 0.9.1-RC1 | pass 23:21 |
| U2 | RC2 is offered | after the RC2 release is published, start the installed launcher | the window names the newer build 0.9.1-RC2 and shows «Обновить сборку» | pass 23:59 |
| U3 | the update runs | press «Обновить сборку» | 7 RC2 parts downloaded with progress, checked, installed; the screen «installed», version 0.9.1-RC2 | pass 00:22 |
| U4 | the game shows RC2 | «Играть»; the main-menu frame | «0.9.1-RC2» under the KRINIK MOD PACK logo | pass by proxy 00:25 (the installed pak) |
| U5 | the player's settings stay | a marker value written into the copy's `GameUserSettings.ini` after U1; read after U3 | the marker is still there | pass 00:25 |
