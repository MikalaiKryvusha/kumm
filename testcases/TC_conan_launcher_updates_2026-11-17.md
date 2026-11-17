# Test cases — the Krinik Conan launcher: «Что нового», the update plate, self-update, build update

**Created:** 2026-11-17 · **Under test:** `ConanExiles/_config/launcher/KrinikConanLauncher.cs` + `KrinikConanUpdates.cs`, built by
`python -I -X utf8 _config/release/build-docs.py --no-pdf` · **Version/build:** launcher 1.0.0, pack 0.9.0
**Test basis:** the owner's task of 2026-11-17 14:40 (verbatim in `plans/54_conan_launcher_updates.md` header); the plan's acceptance criteria 1–9;
HOUSE_RULES rule 17 (every resolution), rule 25 (install / uninstall tests off the owner's game), rule 30 (no real input while he is at the PC).
**Tools:** `ConanExiles/_config/launcher/test/` — `feed.mjs` (a local GitHub-like feed: 302 to the file, Range, `--slow`, `--forge`, `--refuse`),
`snap.sh` (one snapshot against the feed), `live.mjs` (buttons pressed on a live window, no focus taken), `click.ps1` (BM_CLICK by caption; message boxes by
Win32), `stand.mjs` (a fake Conan folder with build 1.0.0 installed by the real engine, build 1.0.1 cut into zip volumes), `make_variant.py` (the launcher
compiled with another launcher version).

## 1. Goal vector

Achieve: the launcher tells the player what changed in the build and in the game, shows a newer build or launcher, and updates either by one button —
the launcher alone (a few MB), the build in one checked download.

## 2. Requirements under test

| # | Requirement (EARS) | Fit criterion |
|---|---|---|
| R1 | WHEN «Что нового» under the build is pressed, the launcher shall open the newest build release page of the feed | the log line «открыл бы <url>» (dry mode) names that page |
| R2 | WHEN «Что нового» under the game is pressed, the launcher shall open the Steam announcement of the game version | log line = `launcher.gameNotes` of the manifest |
| R3 | WHEN the feed has a build release newer than the bundle, the launcher shall show the plate with «Обновить сборку» | snapshot shows it; with an equal tag — no plate |
| R4 | WHEN the feed has a launcher release newer than its own version, the launcher shall show the plate with «Обновить лаунчер» | snapshot |
| R5 | IF the feed does not answer, THEN the launcher shall open as usual with no plate and no error box | snapshot + log «лента не ответила» |
| R6 | WHEN «Обновить лаунчер» is pressed, the launcher shall replace its exe by the verified asset and start it | exe SHA-256 = asset digest; `.old` gone; new process alive |
| R7 | IF the asset's SHA-256 differs from the digest, THEN the launcher shall keep its exe and say so | exe SHA-256 unchanged; the box text read |
| R8 | WHEN «Обновить сборку» is confirmed, the launcher shall download, verify, unpack, uninstall the old build, install the new, start the new launcher | the fixture game's files after; parts folder gone |
| R9 | The new buttons and the plate shall be laid out at 96 / 144 / 192 / 288 dpi | snapshots looked at |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered (risk named) |
|---|---|---|
| feed answer | real GitHub (TLS 1.2) · test feed newer build · newer launcher · both · equal · refused · draft / prerelease higher (ignored) | a GitHub rate-limit answer (403) — handled as «not answered», same code path as refused |
| asset | good digest · forged digest | an asset without digest — refused by code, not run |
| download | whole · resumed by Range after a stop (build parts), Range kept across the 302 | a server ignoring Range (200) — code rewrites the file, not run |
| archive | small zip in 70 volumes of 64 KB · Zip64: 4.7 GB in 1.9 GB volumes, an entry at offset 5 037 746 555 read byte for byte | the real 13 GB release — waits for the next real release |
| build state | installed 1.0.0 → 1.0.1 | not installed before the update — the uninstall step is skipped by code, not run |
| layout | four DPIs, plate alone, plate + «Отзыв» | a second monitor with another scale (WM_DPICHANGED) — no such monitor |

## 4. Cases

| # | Case | Machinery and what it reads | Expected | Status | Observed |
|---|---|---|---|---|---|
| F1 | real feed | the exe with `KRINIK_LAUNCHER_SNAPSHOT`, TEMP → `.work`; the log | log «лента: сборка 0.9.0 (у нас 0.9.0), лаунчер — (у нас 1.0.0)»; no plate | pass | 15:02 real api.github.com over TLS 1.2: that line; snapshot — no plate |
| F2 | newer build | test feed `--build 1.0.1`; snapshot | plate «Вышла новая версия сборки: 1.0.1» + «Обновить сборку» | pass | 15:04 as expected; the draft v99.0.0 ignored |
| F3 | newer launcher | test feed `--launcher 1.0.1`; snapshot | plate «Вышла новая версия лаунчера: 1.0.1» + «Обновить лаунчер» | pass | 15:04 as expected; the prerelease launcher-v99.0.0 ignored |
| F4 | both | test feed both; snapshot | two lines, two buttons | pass | 15:04 snapshot `f4_both` |
| F5 | equal | test feed `--build 0.9.0 --launcher 1.0.0` | no plate | pass | 15:04 log «сборка 0.9.0 (у нас 0.9.0), лаунчер 1.0.0 (у нас 1.0.0)»; no plate |
| F6 | refused | test feed `--refuse` | no plate; log «лента не ответила» | pass | 15:05 log «лента не ответила: … (503)»; the window as usual, no box |
| N1 | build notes | live window (no activation), BM_CLICK on the right «Что нового», dry mode; the log | «открыл бы <feed page of v1.0.1>» | pass | 15:08 «открыл бы http://127.0.0.1:…/page/v1.0.1» |
| N2 | game notes | BM_CLICK on the left «Что нового» | «открыл бы https://store.steampowered.com/news/app/440900/view/1846018067929785» | pass | 15:08 that line |
| N3 | build notes offline | refused feed, the right «Что нового» | «открыл бы …/releases/latest» | pass | 15:08 «открыл бы https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/releases/latest» |
| W1 | Steam page | headless Chrome on the gameNotes URL, rendered page | the post «October Hotfix 3.0.1» | partial | the gid is the Steam API item «October Hotfix 3.0.1»; the page is filled by script that headless Chrome did not complete (three tries: plain, 20 s, a normal user agent — the hub stays blank). The rendered post NOT seen |
| W2 | GitHub latest | the redirect of `…/releases/latest` | `/releases/tag/v0.9.0` | pass | 15:13 `curl -I` → Location `…/releases/tag/v0.9.0` |
| L1 | layout | snapshots 96 / 144 / 192 / 288 dpi, plate with both lines; one with «Отзыв» open | readable, nothing overlaps | pass | 15:05 all four looked at; with «Отзыв» the window grows to 760 logical px, nothing overlaps. Found on the way: Georgia's old-style digits read «1.o.1» — the plate lines moved to Cambria (like the versions); the two «Что нового» stood at different heights — now one row |
| S1 | self-update good | scratch folder, launcher 1.0.0; feed `--launcher 1.0.1 --exe <1.0.1 build>`; BM_CLICK «Обновить лаунчер» | exe hash = 1.0.1 build; `.old` gone; a 1.0.1 process alive | pass | 15:09 SHA-256 35edaa… → 6ec865… (= the asset), a new pid from the same path, `.old` removed, log «лаунчер обновлён до 1.0.1» + «удалён прежний лаунчер» |
| S2 | self-update forged | feed `--forge`; BM_CLICK; the box read | exe hash unchanged; box «Скачанный лаунчер не совпал…» | pass | 15:11 that box; exe 35edaa… unchanged; no `.new` / `.old` |
| B1 | build update | `stand.mjs`; feed `--build 1.0.1 --parts`; launcher from `game/Krinik_fixture_1_0_0`; «Обновить сборку»; box Yes | ModA = «mod A 1.0.1», ModB present, uninstaller present, parts folder gone, new launcher alive | pass | 15:11 70 parts of 64 KB; all of it; the stand shortcut back; the old launcher closed |
| B2 | stop and resume | B1 with «Остановить» mid-download, then «Обновить сборку» again | the feed log shows `range=bytes=N-`; the update completes | pass | 15:12 box «Обновление остановлено…»; the second confirm «Уже скачано 0,2 МБ, докачка продолжится»; feed log `range=bytes=32768-` on the 302 and on the file; completed |
| B3 | Zip64 | `stand.mjs --big`; as B1 | the three 1.6 GB files; the entry past 4 GB byte for byte | pass | 15:17 4.7 GB in 3 volumes, done in 43 s: c1–c3 1 677 721 600 B each; `z_tail.txt` (offset 5 037 746 555 by `7z l -slt`) equal to its unique text. The first B3 (15:14, zeros only) proved less — EXP-0549 |

### Added after judge round 1 (2026-11-17 15:27) — and the whole set re-run 15:32–15:35 on the fixed build (`.work/launcher54/batch.sh`): 74 checks pass, 0 fail

| # | Case | Machinery and what it reads | Expected | Status | Observed |
|---|---|---|---|---|---|
| S3 | self-update, the new exe does not start | feed `--exe <300 KB of random bytes>` with its true digest; `live.mjs self … --garbage` | the swap is rolled back; the box says so; the old exe and window stay | pass | 15:32 box «Новый лаунчер 1.0.1 не запустился (Указанный исполняемый файл не является действительным приложением…). Прежний лаунчер вернулся на место.»; exe hash = the old one; no `.new` / `.old`; the old window alive |
| B4 | the new build installs only partly | `stand.mjs --broken` (1.0.1 checks a file it does not ship: deploy exit 1, the uninstaller still written); `live.mjs build … --broken` | not reported as success; the parts kept; the old window open | pass | 15:34 box «Сборка 1.0.1 встала не полностью (код 1). Запустите install.cmd в …»; parts folder present; no «поставлена» in the log |
| B5 | the player closes the window mid-download | `live.mjs build … --close` (WM_CLOSE posted while parts arrive, feed `--slow`) | the window refuses with a box; the update completes | pass | 15:33 box «Идёт обновление. Дождитесь его конца или нажмите «Остановить», пока скачиваются части.»; the window alive; then the full B1 set of checks passed |

## 5. Run report

`testcases/reports/2026-11-17_conan-launcher-updates.md`
