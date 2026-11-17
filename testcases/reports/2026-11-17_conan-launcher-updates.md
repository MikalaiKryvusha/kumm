# Test run report — the Krinik Conan launcher: «Что нового», the update plate, self-update, build update

**Created:** 2026-11-17 15:24 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles, `_config/launcher/KrinikConanLauncher.cs` +
`KrinikConanUpdates.cs` (plan 54), built by `python -I -X utf8 _config/release/build-docs.py --no-pdf` (launcher 1.0.0, pack 0.9.0); the self-update's 1.0.1
by `_config/launcher/test/make_variant.py`.

## 1. Work

The owner's task of 2026-11-17 14:40 (verbatim in `plans/54_conan_launcher_updates.md`): «Что нового» under the build version (the newest GitHub release) and
under the game version (Steam); a plate when a newer build is out, with «Обновить сборку»; the launcher updates itself separately («Обновить лаунчер»).
Basis — the plan's acceptance criteria 1–9; the case set — `testcases/TC_conan_launcher_updates_2026-11-17.md` (17 cases).

## 2. Contour

The agent's stand on the owner's machine: copies of the built exe in `KUMM/.work/launcher54/`; a local GitHub-like feed (`test/feed.mjs`: the same JSON fields as
api.github.com, a 302 before every file, Range); for the build update a fake Conan folder with build 1.0.0 installed by the real engine
(`Deploy-ModPack.ps1 -Export` + its `install.cmd`, the real uninstaller template), build 1.0.1 cut by 7-Zip into zip volumes like a release. One case (F1) against
the real api.github.com. Windows 11, desktop 300 %, VS Code elevated; the owner away (`owner-idle.ps1` FREE 1 400–2 400 s before each live run).
REAL WORLD: accumulated — not run on the owner's game or his installed launcher (`D:\Games\Conan Exiles 3.0.1\KrinikConanLauncher.exe` untouched: no release
of 1.0.1 exists to update to); data and machine — his machine, his GitHub repo read once; path — the player's buttons pressed by BM_CLICK on a live window.
**Not verified there: the real 13 GB release download — waits for the next real release (the first launcher release needs the owner's word).**

## 3. Runs

| # | Moment | Command | Outcome |
|---|---|---|---|
| 1 | 2026-11-17 15:02 +03:00 | `KRINIK_LAUNCHER_SNAPSHOT=<f1>\f1_real.png;192 <f1>\KrinikConanLauncher.exe` (TEMP → `.work`) | the real feed read; snapshot |
| 2 | 15:04–15:05 | `bash _config/launcher/test/snap.sh <dir> <case> <dpi> [report] -- <feed args>` × 9 (F2–F6, L1 96 / 144 / 288, «Отзыв» open) | 9 snapshots + logs |
| 3 | 15:08 | `node _config/launcher/test/live.mjs notes <dir>` · `… offline <dir>` | N1–N3 |
| 4 | 15:09 · 15:11 | `node _config/launcher/test/live.mjs self <s1> <v101 exe>` · `… self <s2> <v101 exe> --forge` | S1, S2 |
| 5 | 15:11 | `node _config/launcher/test/stand.mjs <b1> --launcher <exe>` → `node … live.mjs build <b1.json>` | B1 |
| 6 | 15:12 | `stand.mjs <b2>` → `live.mjs build <b2.json> --stop` | B2 |
| 7 | 15:16–15:17 | `stand.mjs <b3> --big` → `live.mjs build <b3.json> --big` (after a first B3 at 15:14 with zeros only) | B3 |
| 8 | 15:13 | `curl -sI …/releases/latest`; headless Chrome on the Steam URL (×3) | W2, W1 |
| 9 | 2026-11-17 15:32–15:35 +03:00 | `bash KUMM/.work/launcher54/batch.sh` — after judge round 1's fixes: every case above again on the new build + S3 (`--garbage`), B4 (`stand.mjs --broken`), B5 (`--close`) | 74 checks pass, 0 fail; the B3 stand deleted |

## 4. Checks

Hygiene: the C# compiled with each change (build-docs «лаунчер: … 4352 КБ»); `node --check` of the test tools.
Functional run: the launcher exe run as the player runs it, its window read by eye at four DPIs; its buttons pressed on a live window (BM_CLICK, no focus
taken), its message boxes read; its log read; the stand's game folder, desktop and processes read after each update.

| Case | Status | Observed |
|---|---|---|
| F1 real feed | pass | log «лента: сборка 0.9.0 (у нас 0.9.0), лаунчер — (у нас 1.0.0)» — TLS 1.2 to api.github.com works; no plate |
| F2–F5 the plate | pass | newer build / launcher / both — the plate with the right lines and buttons; equal — none; draft v99 and prerelease launcher-v99 ignored |
| F6 refused | pass | «лента не ответила: … (503)»; the window as usual |
| N1–N3 «Что нового» | pass | build → the feed's v1.0.1 page; game → `store.steampowered.com/news/app/440900/view/1846018067929785`; offline build → `…/releases/latest` |
| W1 Steam page | partial | the gid is the Steam API's «October Hotfix 3.0.1»; the page renders by script that headless Chrome did not finish — the post NOT seen |
| W2 GitHub latest | pass | → `/releases/tag/v0.9.0` |
| L1 layout | pass | four DPIs + «Отзыв» open: nothing overlaps; two defects of my own fixed on the way (below) |
| S1 self-update | pass | exe SHA-256 = the asset's; a new process from the same path; `.old` removed by it |
| S2 forged digest | pass | box «Скачанный лаунчер не совпал…»; exe unchanged |
| B1 build update | pass | 70 parts verified, unpacked, old build uninstalled by its own uninstaller, new installed by its own install.cmd, parts deleted, shortcut back, new launcher up, old closed |
| B2 stop / resume | pass | stop box; the second confirm «Уже скачано 0,2 МБ»; `range=bytes=32768-` on the 302 and on the file; completed |
| B3 Zip64 | pass | 4.7 GB in 43 s; the entry at offset 5 037 746 555 (`7z l -slt`) read byte for byte |

## 5. Found

1. The two «Что нового» stood at different heights (each under its version line) — fixed: one row under the lower line (snapshot 15:02 → 15:04).
2. Georgia's old-style digits made «1.0.1» read «1.o.1» on the plate — fixed: Cambria, like the versions under the logos.
3. The confirm box said «на диске D:: …» — fixed: «На диске D: свободно …».
4. Test-tool defects (not the launcher's): WinForms `Name` does not reach UI Automation (buttons are found by caption); a message box sits under the owner window
   in the UIA tree with no text (read by Win32 instead); the feed read 2 GB parts whole before listening and the launcher asked a closed port (streamed now,
   and the runner waits for `/ready`); the first Zip64 data (zeros) could not fail (a unique tail file past 4 GB now). Lessons EXP-0548, EXP-0549.
5. **Judge round 1 (a fresh helper on the diff, 15:27):** a free-space formula that refused its own retry and missed the install copy; a partial install
   reported as success (install.cmd loses the exit code — probe 15:29, PowerShell 3 → cmd 0; now install.ps1 is run directly); closing the window killed
   the update at any step; no rollback when the new exe does not start; `.old` deleted before the new launcher showed its window; a stale column after a
   failed update; a cleanup error turning success into failure; narrow catches that could crash the process; archive names «.» / «..» accepted — all
   fixed, run 9 re-checks them (S3, B4, B5 new).

## 6. Traces

Snapshots and logs in `KUMM/.work/launcher54/` (`f1/`, `f/` — `f2_build.webp`, `f4_both.webp`, `l1_both_{96,144,288}.webp`, `l1_report_192.webp`, `f6_refused.webp`;
`tmp/KrinikConanLauncher.log`, `tmp/feed_*.log`); the stand JSONs `b1.json`, `b2.json`; `b3_run.txt`. The heavy B3 stand deleted after the run.

## 7. Verdict

pass — 19 of 20 cases (S3, B4, B5 added after judge round 1); W1 partial (the Steam page's rendered post not seen by a headless browser). The real 13 GB
release path waits for a real release.
