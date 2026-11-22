# Run report — the update 0.9.1-RC3 → 0.9.1-RC4 through the launcher on a test copy (local feed with the real release files)

**Work.** The release ritual's stage D item «the UPDATE from the previous release through the launcher» for 0.9.1-RC4 (KUMM plan 57 phase 6 step 5; HOUSE_RULES
42). The basis: the RC4 manifest (`KUMM/.work/rc4_release/release/manifest.json`), the release notes' update promise (11 changed build files + the launcher,
≈ 47 MB from RC3), the launcher's self-update rule (the highest `launcher-v` number).

**Contour.** The test copy `KUMM/.work/rc1_install/Conan_311` (a copy of the clean Conan Exiles Enhanced 3.1.1 with build 0.9.1-RC3 and launcher 1.1.0
installed, `_kumm_backup/pack_version.txt` = `0.9.1-RC3` before the run); the local feed `ConanExiles/_config/launcher/test/feed.mjs` serving the REAL files
of the RC4 release dir (build 0.9.1-RC4, launcher 1.1.1); the launcher started with the stand environment (`TEMP`/`TMP`, `KRINIK_LAUNCHER_STATE_DIR`,
`KRINIK_LAUNCHER_FRAMES`, `KRINIK_LAUNCHER_SEARCH_ROOTS`, `KRINIK_LAUNCHER_STEAM`, `KUMM_DESKTOP_DIR`, `KRINIK_LAUNCHER_NOACTIVATE=1`). Machine lock `kumm`
23:50:59–00:05.

**Runs.** Run 1, 2026-11-22 23:51:05 → 23:55:06 (the driver stopped by PID at 00:05 — it waited for a success line the run could not print, see Found):
`node KUMM/.work/rc4/realcheck.mjs` (log `KUMM/.work/rc4/logs/realcheck.log`). Run 2, 2026-11-23 00:06–00:07, the installer alone over the installed RC4 with
the stand's desktop folder created: `powershell -NoProfile -ExecutionPolicy Bypass -File <copy>\Krinik_Mod_Pack_0_9_1_RC4\install.ps1 -GameDir <copy>` with
`TEMP`/`TMP` and `KUMM_DESKTOP_DIR` = `KUMM/.work/rc4/desk` (log `KUMM/.work/rc4/logs/install_rerun.log`). The driver now creates `desk` itself (its `mkdirSync`
list); the driver line runs on the next candidate's update.

**Checks.**
- Hygiene: none (no unit or lint step belongs to this run).
- Functional run: the player's path through the launcher's own buttons on the test copy — «Обновить лаунчер» then «Обновить сборку» pressed by `click.ps1`, the
  question box answered «Да»; READ: the launcher log, the feed log, the final frame, `pack_version.txt`.

| # | Case | Expected | Observed | Status |
|---|---|---|---|---|
| U1 | the RC3 launcher reads the feed | sees build 0.9.1-RC4 and launcher 1.1.1 | «лента: сборок 1, новейшая 0.9.1-RC4 (у нас 0.9.1-RC3) … лаунчер 1.1.1 (у нас 1.1.0)» 23:51:47 | pass |
| U2 | the launcher updates itself | 1.1.0 → 1.1.1, restarts | «лаунчер обновлён до 1.1.1» 23:52:11, new PID 34988 started `--after-update` | pass |
| U3 | the update plan | only the changed files download | «файлов 187 · из прежних сборок 176 · скачать 11 (3 ассетов, 39,0 МБ)»; the question box named 39,0 МБ, 11 files, D: free | pass |
| U4 | what is fetched | no volume, only the changed assets | feed log: `manifest.json`, `KrinikConanLauncher.exe`, `5aa3bbd0807692c4-KrinikConanUI.pak`, `small-0df5158767356ba5.zip`, `09a7d930d5ebd396-…-guide.pdf` — 5 requests, 0 volumes | pass |
| U5 | the build assembled and installed over RC3 | 74/74 mods, verify clean, the player's settings kept | «74/74 mods, 146 files · verify 115 present, 0 missing»; «player settings: 0 changed file(s) set aside»; `pack_version.txt` = `0.9.1-RC4` | pass |
| U6 | the launcher after the update | the RC4 main screen, «Играть» | frame `021_installed_ru.png`: «Сборка модов Krinik Mod Pack 0.9.1-RC4», «Лаунчер: 1.1.1», «Играть» | pass |
| U7 | the installer's exit | exit 0 and the desktop shortcut | run 1: exit 1: `install.ps1:38 $s.Save()` → `DirectoryNotFoundException` for `KUMM/.work/rc4/desk/Krinik Conan.lnk` — the stand's desktop folder was never created. Run 2 (00:07, the folder created): exit 0, «74/74 mods, 146 files · verify 115 present, 0 missing», «Desktop shortcut: …\desk\Krinik Conan.lnk», the file exists (1 795 B) | fail (stand) → pass |

**Found.**
1. Stand defect (mine): `realcheck.mjs` sets `KUMM_DESKTOP_DIR` to `.work/rc4/desk` and does not create it (the RC3 driver's folder existed from an earlier run),
   so the shortcut step failed and `install.ps1` returned 1 after a complete deploy. Fix of the driver: `desk` in its `mkdirSync` list.
2. Product robustness (minor by `researches/bug-severity/README.md`): `install.ps1` returns 1 when only the desktop shortcut cannot be saved, after the whole build
   was deployed and verified; the launcher logged «код выхода 1» and showed the installed screen with no word to the player. A shortcut failure is better a
   warning line with exit 0. Not filed yet.
3. Known (#15 / #47): «модов в строках установщика 72 из 74» while the installer reports 74/74.

**Traces.** `KUMM/.work/rc4/logs/realcheck.log` · `KUMM/.work/rc4/tmp/KrinikConanLauncher.log` (lines 25–276) · `KUMM/.work/rc4/feed.log` ·
`KUMM/.work/rc4/frames/021_installed_ru.png` (view `021_installed_ru_view.webp`) · `KUMM/.work/rc1_install/Conan_311/_kumm_backup/pack_version.txt`.

**Verdict.** pass — the update path RC3 → RC4 works end to end on the real release files (U1–U6 pass in run 1); U7 failed in run 1 on my stand's missing
folder and passed in run 2 (exit 0, the shortcut written). Not observed: the update through the launcher from the PUBLISHED GitHub release (the real feed) —
after the draft is lifted.
