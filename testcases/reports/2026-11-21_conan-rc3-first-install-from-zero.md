# Test run report — the first install from zero of the PUBLISHED 0.9.1-RC3 by its file list (case P1)

**Created:** 2026-11-21 22:02 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** 0.9.1-RC3 (GitHub release `v0.9.1-RC3`, Latest), its launcher asset
`KrinikConanLauncher.exe` 1.1.0, sha256 `d49c710b53b77f83…` (equal to the release's `SHA256SUMS.txt`)

## 1. Work

The first install of the build into a clean game by the player's path, from the published release, by the release's file list (no archive volumes) —
the item STATUS named «FIRST in the next chat» (the owner 2026-11-21 21:28). Case set — `testcases/TC_conan_launcher_delta_update_2026-11-21.md`, case P1
(written before the run).

## 2. Contour

The copy `KUMM/.work/rc1_install/Conan_311` of the clean Conan Exiles Enhanced 3.1.1 (CL-383549): RC3 uninstalled 21:22 by the previous chat, no
`_kumm_backup`, no `ConanSandbox/Mods`, the RC3 bundle folder removed 21:35 (`rm-tree.mjs`, 13.72 GB); the RC2 bundle folder emptied but held open by a
foreign process (EBUSY, no files left in it). The launcher downloaded by `gh release download v0.9.1-RC3 --pattern KrinikConanLauncher.exe` into the new
folder `Conan_311/Krinik_Launcher/`. The REAL GitHub feed (no `KRINIK_LAUNCHER_FEED`); the stand's own TEMP, state, desktop, search roots and Steam under
`KUMM/.work/rc3_fresh/` (EXP-0594); frames mode (no window on the owner's screen). Machine lock `kumm` taken 21:36 for 90 min. D: free 76.8 GB before the press.

## 3. Runs

1. 2026-11-21 21:38:07 – 2026-11-21 21:59:24 — `node KUMM/.work/rc3_fresh/fresh_install_github.mjs` (output `KUMM/.work/rc3_fresh/fresh.out`, launcher log
   `KUMM/.work/rc3_fresh/tmp/KrinikConanLauncher.log`).
2. 2026-11-21 ≈22:00 — `node KUMM/.work/rc3_fresh/mods_unseen.mjs <bundle>/pack/modpack.json <launcher log>` (the 72-of-74 counter, see Found).

## 4. Checks

Hygiene: `node --check` of the driver; the launcher asset's SHA-256 against `SHA256SUMS.txt` (equal).

Functional run: walked by the player's path on the copy, the launcher's log, box and final frame READ.
- Feed: «лента: сборок 4, новейшая 0.9.1-RC3 (у нас 0.9.1-RC3), для этой игры 0.9.1-RC3, лаунчер 1.1.0 (у нас 1.1.0)».
- First screen `found-nofiles`: «Папка игры: …\Conan_311 · Версия игры: 3.1.1 · Сборка: 0.9.1-RC3 для игры 3.1.1 · Файлы сборки: лаунчер скачает с GitHub ·
  Нужно скачать: лаунчер посчитает, когда сверит файлы» — pass.
- The box, 2 s after «Установить сборку»: «Установить сборку 0.9.1-RC3? Лаунчер сверил папку игры со списком файлов сборки. Нужно скачать 12,8 ГБ
  (файлов: 186). На диске D: свободно 76,8 ГБ. Игру на время установки закройте.» → «Да» — pass.
- Plan: «файлов 187 · уже собрано 0 · из прежних сборок 1 (копий 0) · скачать 186 (71 ассетов, 12,8 ГБ)» (the one file is the downloaded launcher exe);
  space «места нужно 29,8 ГБ». Download 11.0–11.2 MB/s; «скачано 12,8 ГБ»; volumes named in the log: 0 — pass.
- The installer: «74/74 mods, 146 files | verify 115 present, 0 missing», exit code 0; «сборка 0.9.1-RC3 поставлена» 21.2 min after the press;
  `_kumm_backup\pack_version.txt` = 0.9.1-RC3; D: free 46.3 GB after — pass.
- The bundle's own launcher started by itself (pid 38400) on `экран: installed`; its frame `001_installed_ru.png` looked at: «Сборка модов Krinik Mod Pack
  0.9.1-RC3», «Лаунчер: 1.1.0», «Играть» gold, «Руководство», «Отзыв», «Удалить сборку» — pass.
- The desktop shortcut `Krinik Conan.lnk` written into the stand's desktop — pass.
- Both launchers killed by PID at the end (no `KrinikConanLauncher.exe` left).

REAL WORLD: accumulated — a copy that held RC1, RC2 and RC3 before (all uninstalled), an empty RC2 bundle folder still present; data and machine — this
machine, the real GitHub release, feed and CDN; path — the launcher asset downloaded from the release and its own buttons. Verified on the real world for the
feed, the download and the install; the owner's own game folder and launcher state were not used (by design: a test copy).

## 5. Found

- S3 — the install stage's mod counter ends at «72 из 74» while all 74 are installed: PowerShell 5.1 writes the installer's redirected output in the console
  code page, the em dash of «MSCasaDesFlores — Weapons & Armors» and «MSCasaDesFlores — Nails Station» arrives as «-», and the launcher matches the names
  verbatim. EXP-0602; the fix rides with the next launcher change.

## 6. Traces

`KUMM/.work/rc3_fresh/fresh.out` (kept); the launcher log removed 23:34 after the issue of Found was filed (#47, its lines quoted there and above); the 600 frames (`KUMM/.work/rc3_fresh/frames/`, 5.2 GB) removed
after the final frame was looked at (HOUSE_RULES 15) — the key lines are quoted above.

## 7. Verdict

pass — a player who downloads the launcher from the published 0.9.1-RC3 and presses «Установить сборку» gets the build installed from GitHub by the file
list in ≈ 21 minutes, with the size named before the download and «Играть» after it. One cosmetic defect (the 72-of-74 counter).
