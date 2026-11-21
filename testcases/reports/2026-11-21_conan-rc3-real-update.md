# Test run report — the RC2 launcher updates itself to 1.1.0 and the build to 0.9.1-RC3 by the file list, on a copy of the clean game

**Run:** 2026-11-21 18:56–19:05 +03:00 · **Who:** the agent · **Object:** the build 0.9.1-RC3 (pack `6891744`, release dir `KUMM/.work/rc3_release/release`:
7 volumes, 72 per-file assets + `manifest.json`, the launcher 1.1.0) · **Plan:** `plans/57_EPIC_conan_launcher_self_sufficient.md`, phase 6, step 5

## 1. Contour

The copy `KUMM/.work/rc1_install/Conan_311` of the clean Conan Exiles Enhanced 3.1.1 (CL-383549), after the RC1/RC2 checks of 2026-11-20/21 (clean, with the
bug-115 leftover uninstaller and the RC2 bundle folder). The feed is local (`ConanExiles/_config/launcher/test/feed.mjs`): build release 0.9.1-RC3 with
EVERY file of the real release folder, and launcher release 1.1.0 with the real `KrinikConanLauncher.exe`. The launcher's state, TEMP, frames (windows off
the monitors), search roots, Steam and desktop are the stand's (`KUMM/.work/rc3/`). Driver `KUMM/.work/rc3/realcheck.mjs`, its output
`KUMM/.work/rc3/logs/realcheck.out`. Machine lock `kumm`.

## 2. Runs

| # | Moment | What | Outcome |
|---|---|---|---|
| 1 | 18:56–18:57 | RC2's own `install.cmd "<copy>" < nul` (the player's manual path), desktop = the stand's | exit 0 in 56 s · «74/74 mods, 146 files · verify 115 present, 0 missing» · journal written · shortcut on the stand's desktop |
| 2 | 18:59–19:05 | `node KUMM/.work/rc3/realcheck.mjs` | PASS (below) |

## 3. Observed (run 2)

- The RC2 launcher (1.0.0) read the feed: «лента: сборок 1, новейшая 0.9.1-RC3 (у нас 0.9.1-RC2), для этой игры 0.9.1-RC3, лаунчер 1.1.0 (у нас 1.0.0)».
- «Обновить лаунчер» → no question box → «лаунчер обновлён до 1.1.0: …\Krinik_Mod_Pack_0_9_1_RC2\KrinikConanLauncher.exe», the new launcher running.
- «Обновить сборку» → after the check of the previous bundle (2 min 17 s, «прочитано для хешей 12,8 ГБ в 2 папках») the box «Обновить сборку с 0.9.1-RC2 до
  0.9.1-RC3? Лаунчер сверил файлы прежней сборки со списком файлов нового выпуска. Нужно скачать 12,7 ГБ (файлов: 70)…» → «Да».
- Plan «список 0.9.1-RC3: файлов 187 · уже собрано 0 · из прежних сборок 117 (копий 0) · скачать 70 (52 ассетов, 12,7 ГБ)».
- Space «места нужно 16,9 ГБ (скачать 13597714729 Б, переписать 2404621983 Б, копии 0 Б, установка 0 Б, запас 2147483648 Б)» — the 2.4 GB rewrite is the
  pak joined from its two parts (plan 57 step 8); the old formula asked ≈ 29 GB. D: had 26.9 GB free.
- «сборка 0.9.1-RC3 поставлена» 3.4 min after the press: 54 requests, 12 967.8 MB from the feed, NO volume requested; `_kumm_backup\pack_version.txt` reads
  0.9.1-RC3; the new bundle folder exists; D: 13.5 GB free after.
- The new bundle's launcher offered to delete the RC2 bundle folder: «Прежняя сборка — Новая сборка установлена. Папка прежней сборки больше не нужна: …
  Если удалить эту папку, на диске освободится …» → «Нет» (the folder stays for the next check).

## 4. Verdict

**pass** — the player's path RC2 → RC3 through the launcher's self-update and the update by the file list, on the real release files. The download is
12.97 GB because RC2's third-party paks were packed on many threads (the manifest's «changed vs 0.9.1-RC2: 71 files, 13603.4 MB»); from RC3 on the packing
is reproducible. Not checked here: the game launched with RC3 (the play gate waived by the owner 18:16; no mod changed), a first install from zero on the
copy (next), the real GitHub download (after the publication).
