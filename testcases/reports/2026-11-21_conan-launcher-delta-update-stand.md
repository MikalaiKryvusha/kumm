# Run report — the launcher updates the build by the release's file list (stand)

> **Created:** 2026-11-21 · on the owner's words 2026-11-21 00:28–00:30 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-21 00:28)
> **Parent:** `testcases/TC_conan_launcher_delta_update_2026-11-21.md` · `plans/57_EPIC_conan_launcher_self_sufficient.md` phase 6 step 3–4
> **Status:** written 2026-11-21 11:14 +03:00
> **Outbound:** —

## Work

The launcher's update by the per-file manifest (`ConanExiles/_config/launcher/KrinikConanDelta.cs` + `BuildUpdate.RunByManifest` + the confirmation after
the check), against criteria 3 and 4 of plan 57 phase 6 — cases D1, D2.

## Contour

The launcher built from the working tree by `python -I -X utf8 _config/launcher/test/make_variant.py KUMM/.work/delta/bin 1.0.0` (csc of VS 2022, .NET 4.8);
the stand `KUMM/.work/delta/stand` by `node _config/launcher/test/stand.mjs … --delta` (a fake 3.1.1 game; build 1.0.0 exported by the real engine
`Deploy-ModPack.ps1 -Export` and installed by its own `install.cmd`; build 1.0.1 exported the same way and cut by `make_manifest.py --part-size 4194304`);
the local feed `test/feed.mjs --build 1.0.1 --assets <assets>` (GitHub's shape: 302 to the file, Range). The launcher in the frames mode (no window on a
monitor), its state, TEMP and desktop inside the stand; the owner's `%LOCALAPPDATA%\KrinikConanLauncher` checked untouched by the driver.

## Runs

1. 2026-11-21 11:12:30 +03:00 — the first stand with 2 MiB parts: every file became parts (the 2 MB pak is exactly one part), so the one-asset kind was not
   covered — the stand rebuilt with 4 MiB parts (removed file by file by `rm-tree.mjs`).
2. 2026-11-21 ≈11:12:5x +03:00 — `node stand.mjs D:/work/ai_sandbox/KUMM/.work/delta/stand --launcher D:/work/ai_sandbox/KUMM/.work/delta/bin/KrinikConanLauncher.exe --delta`
   → exit 0, assets: `800ccab0…-same.pak`, `a6233e42…-change.pak`, `cefc1988…-huge.pak.p1/.p2`, `f511cfe0…-KrinikConanLauncher.exe.p1/.p2`, `small-5a70835d….zip`, `manifest.json`.
3. 2026-11-21 11:13:09 +03:00 — D2: `node live.mjs delta KUMM/.work/delta/stand.json --decline`.
4. 2026-11-21 11:13:27–11:13:33 +03:00 — D1: `node live.mjs delta KUMM/.work/delta/stand.json` on the same stand.
5. 2026-11-21 11:16:27–11:16:41 +03:00 — after the clean read of the new strings (5 findings, all applied: «Обновить сборку с {3} до {0}?», «Нужно скачать {1}»,
   no «его» in `u.delta.missing`, `u.delta.root` names what the folder does not fit, `u.delta.bad` names the checksum): the exe rebuilt, the stand rebuilt,
   D2 7 / 7 and D1 19 / 19 again; the box read «Обновить сборку с 1.0.0 до 1.0.1? … Нужно скачать 7,1 МБ (файлов: 6). Остальные файлы лаунчер возьмёт из прежней
   сборки.»; `kaif-voice-lint check --genre message` over the six strings — 0 findings.

6. 2026-11-21 11:33:18–11:34:55 +03:00 — after the launcher judge's round 1 (2 defects, 8 risks, 1 cosmetic; fixed: the path only for an INSTALLED build with no
   started volume download — the first install keeps its stop screen; the manifest downloaded afresh; the archive unpack deletes a file before writing it (a
   hardlink would carry the write into the old bundle); `Cache.Get` refreshes the file's size and time; the hashes saved on a stop and the seeds' hashes put
   into the staging cache; renames and deletes retried; a half bundle of the same version is a seed and goes only after the assembly; stale `.staging` of
   other versions are seeds and are removed after success; a file is hashed only while its size has an unfound hash, the running launcher's bundle first; a
   verified asset placed by hardlink is not read again; copies of seeds on another volume counted in the space; a broken manifest falls back to the volume
   parts; `u.delta.path` for a manifest path): `bash KUMM/.work/delta/run_r2.sh` on two fresh stands (the 1.0.1 exe now differs from 1.0.0, as in a real
   release; the stand also cuts volumes) — D2, D1 (the first form counted D2's manifest download in D1's feed log: the driver now empties the log per case),
   D6 (`--bad-list`: the volumes plus a manifest with no root).

7. 2026-11-21 11:50:43–11:51:20 +03:00 — after the launcher judge's round 2 (1 defect, 5 risks, 4 cosmetic; fixed: the fallback asks the archive question and
   checks the volume path's space; the scan keys by the file's refreshed size; a `.staging` is not an installed build): `bash KUMM/.work/delta/run_r2.sh` — D2, D1,
   D6 all pass; D6 answered «Скачать сборку 1.0.1 (15,6 МБ) и поставить её вместо 1.0.0? Архив скачается в папку игры…» before the volumes. Pack `2137cae`.

8. 2026-11-21 12:20–12:24 +03:00 — after the round-2 owed items were built (the fallback on an asset failing after the plan, the hardlink probe and the
   copies with their space and progress, the bundle outside the game folder as a seed, the manifest's two tries, the tidy exits, the freed size in the
   delete offer): `bash KUMM/.work/delta/run_r3.sh`, one fresh stand per case (`KUMM/.work/delta/r3`). The launcher passed every check of D1, D2, D3, D5a,
   D5b, D6, D7, D8; three driver expectations failed, not the launcher: D3 counted the manifest's download on each start as a repeat (it is asked afresh
   by design), D4b pressed an install button the screen rightly did not offer (the window names the reason on the plate), D8 waited for the feed line
   «для этой игры 1.0.1», which a launcher outside the game folder logs before the game is chosen. The driver fixed; the log line no longer prints
   «копий 0, 0,1 МБ» (`Ui.Size` floors at 0.1 MB).
9. 2026-11-21 12:24–12:27 +03:00 — `RUN_DIR=KUMM/.work/delta/r4 bash KUMM/.work/delta/run_r3.sh` on the final code: D2, D1, D6, D3, D4, D5a, D5b, D7, D8 —
   ALL PASS (verdict PASS).
10. 2026-11-21 16:51–16:57 +03:00 — after the judge's round 3 fixes, bug 115 and the new cases: `bash KUMM/.work/delta/run_r5.sh` (log
   `KUMM/.work/delta/r5_run.log`, one fresh stand per case in `KUMM/.work/delta/r5`): D2, D1, D6, D3, D4, D5a, D5b, D7, D8, **D5c**, **D9**, **U-X** — ALL PASS
   (verdict PASS). D5c: «путь по списку файлов негоден, обновление идёт частями архива: В выпуске 1.0.1 файл a6233e42216c7fdf-change.pak отличается от записи…»,
   the box «Лаунчер не смог обновить только изменившиеся файлы. Скачать всю сборку 1.0.1 (15,6 МБ)…», the asset never requested — but the two launcher-exe parts
   were downloaded before the loop reached it (the pre-check runs per asset inside the download loop; owed: compare every digest before the first download).
   D9: «лента: сборок 2, новейшая 1.0.2 (у нас 1.0.0)», the box «Обновить сборку с 1.0.0 до 1.0.2?», 7 requests — `manifest.json`, `huge.pak` p1 + p2,
   `change.pak`, the launcher exe parts, the group — nothing of release 1.0.1, not `same.pak`; the game holds the 1.0.2 files. U-X: screens
   `installed → removing → found-files`, «оставшийся деинсталлятор убран».
11. 2026-11-21 17:12–17:17 +03:00 — after the judge's round 4 fixes (`BuildUpdate.Installed` with the journal, every asset checked before the question,
   the staging removed after «Да» with its own bytes counted free, the no-links switch at every link point, U-X2): `bash KUMM/.work/delta/run_r6.sh`
   (log `KUMM/.work/delta/r6_run.log`): D2, D1, D6, D4, D5a, D5b, D7, D8, D9, **U-X2**, U-X — PASS; two red lines, both read against the launcher's log
   before any change (EXP-0597):
   - D3 «0 of 2097152 B» after the kill: the asset order follows the asset names (hash first), the rebuilt launcher exe's hash moved it last, and a
     2 MiB asset came first — its half (1 MiB) sat whole in the launcher's 1 MiB FileStream buffer at the kill. The product loses at most that buffer and
     resumes from the bytes on disk; the stand fixed (`feed.mjs --slow` pauses before the last 64 KiB). Rerun alone (`KUMM/.work/delta/r6d3`): PASS —
     «1048576 of 2097152 B», «12.6 MB → 11.6 MB», `range=bytes=1048576-`.
   - D5c: the box «Обновление уже идёт в другом окне лаунчера» — my D3 rerun ran at the same time in another stand, and the launcher's one-update guard
     rightly refused. Rerun alone (`KUMM/.work/delta/r6d5c`): PASS — no box before the fallback, only `manifest.json` requested, «Лаунчер не смог обновить
     сборку по изменившимся файлам. Скачать всю сборку 1.0.1 (15,6 МБ)…».
   Control: U-X2 on the launcher of run 10 (`KUMM/.work/delta/r6c`) — FAIL «D4b a manifest-only release is refused» (screen `found-nofiles`): the round-4
   finding 1 reproduced; green on the fix (screen `release-bad`). The uninstaller template's missing-engine case `KUMM/.work/uninst/errorlevel.mjs`: red on
   the old template (exit 0, «Готово», the file gone), green on the new (exit 1, the file kept).
12. 2026-11-21 17:24–17:29 +03:00 — the first install by the file list (plan 57 phase 6 step 6, answer C; D4 rewritten, U-X2 now installs too): D4, U-X2,
   D2, D1 alone in `KUMM/.work/delta/r8` (17:24 — D4b «8 requests for 7 assets», «из прежних сборок 0», journal and uninstaller written; D4a only
   `manifest.json`), then the whole set `RUN_DIR=KUMM/.work/delta/r9 bash KUMM/.work/delta/run_r6.sh` (log `KUMM/.work/delta/r9_run.log`): D2, D1, D6, D3,
   D4, D5a, D5b, D7, D8, D5c, D9, U-X2, U-X — ALL PASS (verdict PASS).
13. 2026-11-21 17:3x +03:00 — after the judge's round 5 (the first install named «Нужно скачать: 0,1 МБ» and asked nothing; a stopped first install went
   back to the start screen silently): the screen row «Нужно скачать: лаунчер посчитает, когда сверит файлы», the question `box.delta.install` with the real
   size after the check (none when nothing downloads), the stop box `u.stopped.install`, the fallback question `box.install.ask.whole`, the log line «по
   списку файлов: первая установка / обновление поставленной сборки» (U-X2 asserts it and a new uninstaller). `KUMM/.work/delta/r10`: D4, U-X2, D2, D1,
   D5c PASS; the whole set `KUMM/.work/delta/r11` (log `r11_run.log`): 13 of 13 PASS; the strings after their clean read: D4, U-X2 PASS
   (`KUMM/.work/delta/r12`) — «Установить сборку 1.0.1? Лаунчер сверил папку игры со списком файлов сборки. Нужно скачать 15,6 МБ (файлов: 12).».
   Not covered by a case yet: a STOP of a first install by the file list (the box `u.stopped.install`) and a first install that falls back to the volumes
   (`box.install.ask.whole`).

## Checks

- **Hygiene:** the launcher compiled (csc, no error); `make_manifest.py` self-test 20 / 20 (its own report).
- **Functional run:** the real launcher exe by the player's path on the stand — «Обновить сборку» pressed by BM_CLICK, the question box read and answered,
  the feed's request log read, the game's files and both bundles hashed after the run.

| ID | Status | Observed |
|---|---|---|
| D2 | pass | 7 / 7: the box after «Проверено: 15,6 из 15,6 МБ» named «Обновить сборку до 1.0.1 вместо 1.0.0» and «Скачать нужно 7,1 МБ (файлов: 6)»; «Нет» → log «игрок отказался от обновления после сверки файлов»; the feed asked for `manifest.json` only; the game keeps «mod A 1.0.0»; the launcher open |
| D1 | pass | 19 / 19: 5 requests (manifest, the changed 2 MB pak, two parts of the 5 MB pak, the group), never the unchanged pak or the unchanged launcher exe, none twice; plan «файлов 12 · из прежних сборок 6 · скачать 6 (4 ассетов, 7,1 МБ); прочитано для хешей 0,1 МБ в 2 папках» — the hash cache D2 wrote saved the 15.6 MB re-read; the game's `same.pak`, `change.pak`, `huge.pak` equal the 1.0.1 SHA-256, `a.txt` «mod A 1.0.1», ModB present; `same.pak` of the new bundle nlink 2 (one file with the old bundle's); no `.staging`; the old bundle's four files unchanged; the installer «код выхода 0, модов 2 из 2», the new launcher started with `--old-bundle` |

| D2 (run 6) | pass | 9 / 9: + no other box after «Нет», no update error in the log |
| D1 (run 6) | pass | the box «Нужно скачать 12,6 МБ (файлов: 7)» (the 1.0.1 exe changed now: 2 parts); 7 requests, none twice; the unchanged pak of the new bundle IS the old bundle's file (one file id 7599824372987001) |
| D6 (run 6) | pass | log «список файлов выпуска не прочитан: manifest: a bad root «»» then «обновление идёт частями архива»; build 1.0.1 installed from the volumes, ModA/a.txt «mod A 1.0.1» |

| D1′ (run 9) | pass | the new launcher's offer «…Удалить её? На диске освободится 12,4 МБ. Файлы, которые новая сборка взяла из прежней, останутся в новой сборке.»; the old bundle's files with one name sum to 12.44 MB; default «Нет» |
| D2 (run 9) | pass | + no `<bundle>.staging` left after «Нет» |
| D3 (run 9) | pass | killed by PID with 1 048 576 of 4 194 304 B of the first asset in `.staging\.dl`; old bundle and game unchanged; the second box 12,6 → 11,6 МБ; second plan «уже собрано 5»; `range=bytes=1048576-` for the half asset; no other asset twice, the manifest once per start; 1.0.1 installed, the old bundle unchanged |
| D4 (run 9) | pass | D4b: screen `release-bad` «В выпуске 1.0.1 нет полного архива сборки…», no file requested; D4a: «Установить сборку» → 251 volume parts, no `manifest.json` request, ModA 1.0.1 and ModB in the game |
| D5a (run 9) | pass | the flipped asset requested twice; «выпуск не сошёлся со своим списком файлов, обновление идёт частями архива»; the box «Скачать сборку 1.0.1 (15,6 МБ)… Обновить только изменившиеся файлы не получилось.» → 1.0.1 from the volumes; no `.staging`; old bundle unchanged |
| D5b (run 9) | pass | the box «Файл a6233e42…-change.pak дважды скачался с ошибкой. Проверьте сеть и нажмите «Обновить сборку» ещё раз.»; the game keeps 1.0.0; the launcher open |
| D6 (run 9) | pass | + the archive question carries «Обновить только изменившиеся файлы не получилось»; no `.staging` left |
| D7 (run 9) | pass | plan «из прежних сборок 5 (копий 5, 3,1 МБ)»; the unchanged pak of the new bundle has another file id and the 1.0.1 bytes; the offer names 15,6 МБ (the whole old bundle) with no shared-files line |
| D8 (run 9) | pass | the launcher in `<stand>\elsewhere\Krinik_Mod_Pack_1_0_0` found the game by the search roots; plan «из прежних сборок 5»; the unchanged pak not downloaded and IS the outside bundle's file (one file id) |

## Found

In the code — the launcher judge's round 1, all checked against the code and fixed (run 6). My stand's first form (2 MiB parts) did not cover the one-asset
kind — rebuilt (run 1); my driver appended the feed log across D2 and D1 — fixed (run 6).

## Traces

`KUMM/.work/delta/stand/tmp/KrinikConanLauncher.log`, `…/tmp/feed_delta.log`, the frames `…/tmp/frames/*.png` (the launcher's frames mode writes PNG; stand
files, not committed), `KUMM/.work/delta/stand.json`.

## Verdict

**partial** — D1–D8 pass on the stand (run 9, the final code of this round); owed: the launcher judge's round 3, a real FAT32 / exFAT volume (D7 used the
stand switch), and the real build (13.7 GB) on a copy of the game (phase 6 step 5, after the owner's answer in interview #042).
