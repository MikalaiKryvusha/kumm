# Test cases — the launcher updates the build by the release's file list and downloads only what changed

> **Created:** 2026-11-21 · on the owner's words 2026-11-21 00:28–00:30 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-21 00:28)
> **Parent:** `plans/57_EPIC_conan_launcher_self_sufficient.md` phase 6, criteria 3–5 · `researches/conan-launcher-delta-update/README.md` §5 «Launcher steps»
> **Status:** cases written 2026-11-21 11:12 +03:00 before the run
> **Outbound:** —

## Test basis

- Plan 57 phase 6, criterion 3: with a bundle of release N beside the game and release N+1 differing in K files, «Обновить сборку» downloads only the assets
  of those K files (and the small-files group when a small file changed), the confirmation names the real download, the new bundle equals the manifest.
- Criterion 4: the old bundle stays untouched until the installer reports success.
- The code: `ConanExiles/_config/launcher/KrinikConanDelta.cs` (Parse, MakePlan, Assemble), `KrinikConanUpdates.cs` (`BuildUpdate.Prepare` · `ByManifest` ·
  `RunByManifest`), `KrinikConanLauncher.cs` (`UpdateBuild` · the `confirm` of `RunJob` · `Finished` on `DECLINED`).

## Dimensions

- File kinds in the release (stand `stand.mjs --delta`, parts of 4 MiB): an unchanged 3 MB pak and the unchanged 5.5 MB launcher exe (both must come from
  the old bundle by a hardlink), a changed 2 MB pak (one asset), a changed 5 MB pak (two parts), changed and new small files (the group zip).
- The player's answer to the confirmation: yes (D1) · no (D2).
- Not covered in this run (owed): a stop and a resume mid-download (D3), a fresh install with no old bundle (D4), a corrupt asset (D5), a release with both
  volumes and a manifest (D6), the real build size (13.7 GB, phase 6 step 5).

## Stand

`node ConanExiles/_config/launcher/test/stand.mjs KUMM/.work/delta/stand --launcher KUMM/.work/delta/bin/KrinikConanLauncher.exe --delta`: a fake 3.1.1 game, build
1.0.0 installed from `Krinik_Mod_Pack_1_0_0` inside it, the 1.0.1 export cut by `make_manifest.py --part-size 2097152` into `assets/`; the local feed serves
`assets/` as the assets of `v1.0.1` (no volumes). The launcher runs in the frames mode (no window on a monitor), its state, TEMP and desktop inside the stand.

## Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| D1 | `node test/live.mjs delta <stand JSON>`: «Обновить сборку» → the box → «Да» | the box names 1.0.1 and «Скачать нужно»; the feed is asked for the manifest, the changed pak's asset, the three parts of the 5 MB pak and the group, never the unchanged pak's asset, no asset twice; the plan takes files from the old bundle; the game's paks and texts are the 1.0.1 files; the new bundle's unchanged pak has nlink ≥ 2; no `.staging` left; the old bundle's files unchanged | pass | 11:13:27–11:13:33, run after D2 on the same stand: the box «Обновить сборку до 1.0.1 вместо 1.0.0? … Скачать нужно 7,1 МБ (файлов: 6)…»; the feed asked for `manifest.json`, `a6233e42…-change.pak`, `cefc1988…-huge.pak.p1`, `.p2`, `small-5a70835d….zip` — 5 requests, not `same.pak` and not the launcher exe; plan «файлов 12 · из прежних сборок 6 · скачать 6 (4 ассетов, 7,1 МБ); прочитано для хешей 0,1 МБ» (the hash cache written by D2 — 15.6 MB then); the game's three paks and texts are the 1.0.1 files; `same.pak` nlink 2; no `.staging`; the old bundle's four files unchanged; the new launcher started with `--old-bundle` |
| D6 | added 2026-11-21 11:32, before its run: `live.mjs delta <stand B JSON> --bad-list` — the release carries the volumes and a manifest with no root | the log names the broken list and «обновление идёт частями архива»; build 1.0.1 installed from the volumes | pass | 11:34: «список файлов выпуска не прочитан: manifest: a bad root «»», then the volume path; ModA/a.txt «mod A 1.0.1» |
| D2 | the same with `--decline`: «Нет» | the log says the player declined after the check; only `manifest.json` was downloaded; the game keeps 1.0.0; the launcher stays open | pass | 11:13:09: the box named 1.0.1 and «Скачать нужно 7,1 МБ (файлов: 6)» after «Проверено: 15,6 из 15,6 МБ»; log «игрок отказался от обновления после сверки файлов»; the feed asked only for `manifest.json`; ModA/a.txt «mod A 1.0.0»; the launcher alive |
