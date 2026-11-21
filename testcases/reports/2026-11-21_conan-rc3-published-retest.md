# Test run report — 0.9.1-RC3 retested on the PUBLISHED GitHub release (issues #45, #46)

**Created:** 2026-11-21 21:24 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** 0.9.1-RC3 (GitHub release `v0.9.1-RC3`, 83 assets),
launcher 1.1.0 (`launcher-v1.1.0`, `KrinikConanLauncher.exe` sha256 `d49c710b…`), the player's launcher 1.0.0 (asset of `v0.9.1-RC2`, sha256 `ab4856b6…`)

## 1. Work

The retest the issues wait for (HOUSE_RULES 44.4): the update by the file list (#45) and the uninstall window closed by its X (#46), on the published
release, by the player's path. Case set — `testcases/TC_conan_rc3_published_retest_2026-11-21.md` (P0–P4).

## 2. Contour

The copy `KUMM/.work/rc1_install/Conan_311` of the clean Conan Exiles Enhanced 3.1.1 (CL-383549); the REAL GitHub feed (no `KRINIK_LAUNCHER_FEED`) for
P1–P3; the stand's own state, TEMP, desktop, search roots and Steam (`KUMM/.work/rc3/`, EXP-0594); P4 by `live.mjs uninstall` (its isolated environment,
feed off — the uninstall does not use the feed). Machine lock `kumm` 20:37–21:22.

## 3. Runs

1. 2026-11-21 20:38 – 2026-11-21 20:56 — P0: RC3 uninstalled by its own `uninstall_krinik_build.cmd` (2 s, «returned 10 file(s), deleted 137»), the RC3 bundle folder removed
   (`rm-tree.mjs`, 13.72 GB), RC2 installed by the FULL path of its `install.cmd` from Git Bash (22 s, «74/74 mods, 146 files · verify 115 present, 0
   missing»), the RC2 bundle's launcher replaced by the v0.9.1-RC2 asset (`gh release download`, digest equal). The first P0 attempt (20:38) ran nvm's
   `install.cmd` instead — bugs/116.
2. 20:57–21:22 — P1–P3: `node KUMM/.work/rc3/realcheck_github.mjs` (output `KUMM/.work/rc3/logs/realcheck_github.out`, launcher log
   `KUMM/.work/rc3/tmp_gh/KrinikConanLauncher.log`).
3. 21:22 — P4: `node ConanExiles/_config/launcher/test/live.mjs uninstall KUMM/.work/rc3/stand_published.json` (the launcher of the RC3 bundle that came
   from GitHub in run 2).

## 4. Checks

Hygiene: none apart from the drivers' own checks.

Functional run: walked on the copy by the player's path, the launcher's log and boxes READ.
- P0 pass — `_kumm_backup\pack_version.txt` = 0.9.1-RC2; the launcher exe = the v0.9.1-RC2 asset (sha256 `ab4856b6…` both).
- P1 pass — «лента: сборок 4, новейшая 0.9.1-RC3 (у нас 0.9.1-RC2), для этой игры 0.9.1-RC3, лаунчер 1.1.0 (у нас 1.0.0)».
- P2 pass — «лаунчер обновлён до 1.1.0: …\Krinik_Mod_Pack_0_9_1_RC2\KrinikConanLauncher.exe» 22 s after the press (no question box, as in the run of 18:59).
- P3 pass — the box «Обновить сборку с 0.9.1-RC2 до 0.9.1-RC3? … Нужно скачать 12,7 ГБ (файлов: 70) … На диске D: свободно 51,3 ГБ» → «Да»; plan
  «файлов 187 · из прежних сборок 117 · скачать 70 (52 ассетов, 12,7 ГБ)»; space 16.9 GB; «скачано 12,7 ГБ, взято из прежних сборок 117 файлов»;
  «сборка 0.9.1-RC3 поставлена» 21.0 min after the press (GitHub, 8–11 MB/s); volumes named in the log: 0; `pack_version.txt` = 0.9.1-RC3; the offer to
  delete the RC2 bundle folder shown, answered «Нет».
- P4 pass — 7 / 7: installed → removing → found-files («Установить сборку»); the console at its last pause killed by PID (the player's X); «оставшийся
  деинсталлятор убран»; the owner's `%LOCALAPPDATA%\KrinikConanLauncher` untouched.

REAL WORLD: accumulated — a copy that held RC1, RC2 and RC3 in turn, the RC2 launcher already self-updated once (replaced by the original asset);
data and machine — this machine, the real GitHub release and feed; path — the launcher's buttons, the player's own. Verified on the real world for
the feed, the downloads and the uninstall; the owner's own game folder and launcher state were not used (by design: a test copy).

## 5. Found

None in the build or the launcher. The incident of P0's first attempt — bugs/116 (the agent's own command, not the product).

## 6. Traces

`KUMM/.work/rc3/logs/realcheck_github.out` (kept); the launcher logs (`KUMM/.work/rc3/tmp_gh/`, `KUMM/.work/rc1_install/tmp/`) and the 594 frames
(`KUMM/.work/rc3/frames_gh/`, 5.5 GB) were removed after the run (HOUSE_RULES 15) — their key lines are quoted in Checks above; the issues: github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/45 and /46 —
closed 21:23 with the observations above.

## 7. Verdict

pass — the update RC2 → RC3 by the file list from the published release, the launcher's self-update from `launcher-v1.1.0`, and the uninstall window
closed by its X all work by the player's path. Issues #45 and #46 closed. Not covered here: a first install from zero by the file list (STATUS next).
