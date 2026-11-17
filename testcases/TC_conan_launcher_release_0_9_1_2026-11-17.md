# Test plan and cases — the Krinik Conan launcher and installer for the release 0.9.1: every update case, the player's settings and saves kept

**Created:** 2026-11-17 · **Under test:** `ConanExiles/_config/launcher/KrinikConanLauncher.cs` + `KrinikConanUpdates.cs` (the launcher), the bundle's `install.ps1`
written by `KUMM/Deploy-ModPack.ps1` `Write-BundleInstaller` and the deploy's journal / restore (the installer and uninstaller) · **Version/build:** launcher 1.0.x,
pack 0.9.1 for game 3.1.1 (CL-383549)
**Test basis:** epic `plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md` criteria 2–7; the owner's words 2026-11-17 20:00 («предусматривал разные кейсы обновления, и себя, и
сборки, и не портил настройки и сейвы игроков»); `researches/conan-launcher-modern-practice/README.md` §1.5 (the industry case list) and §4 (the decisions);
plan 54's cases `testcases/TC_conan_launcher_updates_2026-11-17.md` (S1–S3, B1–B5 — kept, re-run as regression); HOUSE_RULES rules 17, 25, 30.
**Tools:** plan 54's `ConanExiles/_config/launcher/test/` (`feed.mjs`, `stand.mjs`, `live.mjs`, `click.ps1`, `make_variant.py`); new — `settings-table.mjs` (SHA-256 of
every `Saved/Config/Windows/*.ini`, `Saved/SaveGames/*.sav`, `Game_*.db` before / after, the expected outcome per file) [to be written with B1].

## 1. Test plan

**What and why.** The launcher and the installer change the player's game folder; a defect there costs a player his settings, his map markers, his world or a working
game. The plan covers the four ways a player meets an update (the launcher's self-update, the launcher's build update, the player's own `install.cmd` over an older
build, the 0.9.0 player who has no updater) against the four kinds of files in the folder (the build's managed files, seeded settings, the player's data, the world).

**Dimensions (named techniques).** State transitions of the update (idle → download → verify → unpack → uninstall → install → restore settings → new launcher), each
with its interruption; a decision table of settings ownership (player changed? × build changed?) per file class; boundary values of versions (same, older, N+1, N+2,
pre-release, launcher-only, build-only, both); error guessing from the industry list (§1.5); equivalence classes of the environment (online / offline / rate-limited,
enough / too little space, writable / read-only, game running / not).

**Consciously not covered:** a player's game on a network drive (the free-space check is skipped there — known); a player who edits `_kumm_backup` by hand; antivirus
products other than Windows Defender (none installed here); a GitHub outage longer than one start.

**Stands.** (1) The fixture game of plan 54 (`stand.mjs`: a fake Conan folder, bundles of two and three versions cut into volumes, the local feed) — every row.
(2) A fresh copy of the clean 3.1.1 (`HOUSE_RULES.md` rule 25 — robocopy from the clean version into `D:\Games\Conan_311_update_test`, deleted after the run) with the
REAL 0.9.1 bundle and a forged 0.9.2 on the local feed — the rows marked ★. (3) The real feed (GitHub, read-only) — R-rows.

**Exit.** Every row `pass` with its observation; a `fail` → a bug document, the fix, the row re-run; the run report `testcases/reports/<date>_conan-launcher-release-0-9-1.md`.

## 2. Settings ownership — the decision table (B1, research §4 item 1)

| File class | Player changed? | Build changed? | After the update |
|---|---|---|---|
| managed (`ServerSettings.ini`, `Game.ini`, Engine.ini pack sections) | no | yes | the new build's |
| managed | yes | no | the player's |
| managed | yes | yes | the player's file; the build's pack sections merged in; the new file beside as `.krinik-new`; logged |
| seed (`Input.ini`, mod `.sav` settings) | no | yes | the new build's |
| seed | yes | any | the player's (the new beside as `.krinik-new` when the build changed it) |
| strip keys (resolution, fullscreen, frame rate in `GameUserSettings.ini`) | any | — | never shipped; the player's values stay |
| never (`Game_*.db*`, `SimpleMinimap_MarkerData.sav`, `DamageData_*.sav`, other `.sav`) | any | — | byte-identical before / after; never in the journal |

## 3. Cases

Status: `todo` · `pass` · `fail` · `blocked` · `skipped`. Each row is one action; Check names what is read.

### 3.1 Self-update of the launcher

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| L1 | feed has `launcher-v1.0.1`, good asset | «Обновить лаунчер» | new exe in place, running, `.old` kept until its 2nd start | SHA-256 = digest; process list; `.old` after 1st / 2nd start | todo |
| L2 | asset digest wrong | same | old exe kept, message | SHA-256 unchanged; box text | todo |
| L3 | asset is not a program (garbage) | same | rolled back, message | SHA-256 unchanged; process list | todo |
| L4 | asset starts and dies before its window (forced exit code) | same | old launcher back and running, «обновление лаунчера откатилось» | process list; `.bad` present; old exe hash | todo |
| L5 | asset shows its window, then is killed (simulated AV) at the 1st start | same, then start the launcher twice | the 2nd unfinished start with `.old` present reverts | exe hash after the 2nd start | todo |
| L6 | game folder read-only | same | refused before download, message | no `.new`; box text | todo |
| L7 | feed has an OLDER and an EQUAL launcher tag only | start | no plate | snapshot | todo |
| L8 | feed has `launcher-v1.0.2` while 1.0.0 runs (skipped 1.0.1) | update | goes straight to 1.0.2 | exe hash | todo |
| L9 | a second launcher instance is open | update in one | refused or the other closed first, named | box text; process list | todo |
| L10 | a launcher self-updated sits in 0.9.1's folder | start | shows 0.9.1, game 3.1.1, its Steam post, guide, uninstaller name — from `pack\modpack.json` | snapshot text; click targets in the log | todo |

### 3.2 Build update through the launcher

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| B1′ ★ | 0.9.1 installed; the player changed quality, one bind, the minimap zoom, placed 2 markers; feed offers 0.9.2 (two other files with new defaults) | «Обновить сборку» | the decision table §2 holds for every file; world untouched | `settings-table.mjs` before / after vs the expected table | todo |
| B2′ | same, the player changed `ServerSettings.ini` and 0.9.2 changes it too | same | the player's file, `.krinik-new` beside, logged | file hashes; log line | todo |
| B3′ | download stopped at 40 % («Остановить»), launcher closed | next start → update | resumes by Range (206), no re-download of finished parts | feed log: Range headers; part hashes | todo |
| B4′ | the server ignores Range (200 instead of 206) | resume | the part re-downloaded whole, still verified | feed `--no-range` log | todo |
| B5′ | the last part missing from the release | update | refused BEFORE downloading, message names the part | no parts folder; box text | todo |
| B6′ | a part's digest wrong | update | stops at that part, keeps the good ones, message | parts folder; box text | todo |
| B7′ | disk space short (forced free-space value) | update | refused before download with the numbers | box text | todo |
| B8′ | the game runs | update | refused before download; refused again if started during the download, before the uninstall | box text; journal unchanged | todo |
| B9′ | an install console started by the launcher still runs | update | refused, named | box text | todo |
| B10′ | feed offers 0.9.3 while 0.9.1 is installed (skipped 0.9.2) | update | straight to 0.9.3, settings as §2 | `settings-table.mjs` | todo |
| B11′ | feed offers a build AND a launcher release | start | both lines on the plate; launcher first is advised | snapshot | todo |
| B12′ | the launcher killed during the uninstall / install step | next start | says the update did not finish and offers to finish it (install again) | box text; game folder state | todo |
| B13′ | a zip entry with `..` in its path | unpack | refused | message; nothing outside the folder | todo |

### 3.3 Manual paths (no launcher)

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| M1 ★ | 0.9.0 installed on 3.0.1-era files is not possible on 3.1.1 — instead: a 3.1.1 copy with 0.9.1, the player's changes as B1′ | the player runs 0.9.2's `install.cmd` | as B1′ | `settings-table.mjs` | todo |
| M2 ★ | a copy with the 0.9.0 installer's journal and files (0.9.0 bundle from the GitHub release installed on the clean copy), player changes made | 0.9.1's `install.cmd` | 0.9.1 installed, the changes kept by the 0.9.0 hash table | `settings-table.mjs` | todo |
| M3 | the player runs the uninstaller of 0.9.1 | uninstall | vanilla back; markers, `DamageData`, world byte-identical | hashes | todo |
| M4 | fresh clean copy, no build | 0.9.1 `install.cmd` | installed; `GameUserSettings.ini` has no resolution keys from us | file read | todo |

### 3.4 The feed and the network

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| N1 | feed refuses (closed port) | start | window as usual, no plate, log «лента не ответила» | snapshot; log | todo |
| N2 | feed answers 403 / 429 with `x-ratelimit-remaining: 0` | start | no plate, no error box, one request only | feed log count | todo |
| N3 | a pre-release build tag newer than the latest | start | per the owner's channel decision (interview) — today: shown | snapshot | todo |
| N4 | a draft (absent from the anonymous list) | start | not shown | snapshot | todo |
| R1 | the REAL feed, 0.9.1 launcher on the ★ stand | start | no false plate (0.9.0 < 0.9.1) | snapshot; log | todo |

### 3.5 Regression of plan 54

S1–S3, B1–B5, the «Что нового» pair and the four DPI snapshots of `testcases/TC_conan_launcher_updates_2026-11-17.md` — re-run on the changed code; status there.
