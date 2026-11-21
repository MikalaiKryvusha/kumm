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

## Found

In the code — the launcher judge's round 1, all checked against the code and fixed (run 6). My stand's first form (2 MiB parts) did not cover the one-asset
kind — rebuilt (run 1); my driver appended the feed log across D2 and D1 — fixed (run 6).

## Traces

`KUMM/.work/delta/stand/tmp/KrinikConanLauncher.log`, `…/tmp/feed_delta.log`, the frames `…/tmp/frames/*.png` (the launcher's frames mode writes PNG; stand
files, not committed), `KUMM/.work/delta/stand.json`.

## Verdict

**partial** — D1, D2, D6 pass on the stand; owed: D3 a stop and a resume mid-download, D4 a first install with a manifest release (must take the volumes),
D5 a corrupt asset, the launcher judge's round 2 (running), and the real build (13.7 GB) on a copy of the game (phase 6 step 5).
