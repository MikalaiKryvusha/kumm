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

## Checks

- **Hygiene:** the launcher compiled (csc, no error); `make_manifest.py` self-test 20 / 20 (its own report).
- **Functional run:** the real launcher exe by the player's path on the stand — «Обновить сборку» pressed by BM_CLICK, the question box read and answered,
  the feed's request log read, the game's files and both bundles hashed after the run.

| ID | Status | Observed |
|---|---|---|
| D2 | pass | 7 / 7: the box after «Проверено: 15,6 из 15,6 МБ» named «Обновить сборку до 1.0.1 вместо 1.0.0» and «Скачать нужно 7,1 МБ (файлов: 6)»; «Нет» → log «игрок отказался от обновления после сверки файлов»; the feed asked for `manifest.json` only; the game keeps «mod A 1.0.0»; the launcher open |
| D1 | pass | 19 / 19: 5 requests (manifest, the changed 2 MB pak, two parts of the 5 MB pak, the group), never the unchanged pak or the unchanged launcher exe, none twice; plan «файлов 12 · из прежних сборок 6 · скачать 6 (4 ассетов, 7,1 МБ); прочитано для хешей 0,1 МБ в 2 папках» — the hash cache D2 wrote saved the 15.6 MB re-read; the game's `same.pak`, `change.pak`, `huge.pak` equal the 1.0.1 SHA-256, `a.txt` «mod A 1.0.1», ModB present; `same.pak` of the new bundle nlink 2 (one file with the old bundle's); no `.staging`; the old bundle's four files unchanged; the installer «код выхода 0, модов 2 из 2», the new launcher started with `--old-bundle` |

## Found

none in the code. My stand's first form (2 MiB parts) did not cover the one-asset kind — rebuilt (run 1).

## Traces

`KUMM/.work/delta/stand/tmp/KrinikConanLauncher.log`, `…/tmp/feed_delta.log`, the frames `…/tmp/frames/*.png` (the launcher's frames mode writes PNG; stand
files, not committed), `KUMM/.work/delta/stand.json`.

## Verdict

**partial** — D1 and D2 pass on the stand; owed: D3 a stop and a resume mid-download, D4 a fresh install with no old bundle, D5 a corrupt asset, D6 a release
with both volumes and a manifest, the judge on the launcher diff, and the real build (13.7 GB) on a copy of the game (phase 6 step 5).
