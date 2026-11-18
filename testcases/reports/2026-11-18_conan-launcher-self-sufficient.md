# Run report — the self-sufficient Conan launcher (plan 57 phases 2–4), stand runs of 2026-11-18

**Work:** the case set `testcases/TC_conan_launcher_self_sufficient_2026-11-18.md` against `plans/57_EPIC_conan_launcher_self_sufficient.md` criteria 1–13;
the code of pack commit `590495e` (and the builds before it, named per run below).

**Contour:** the launcher compiled by `ConanExiles/_config/launcher/test/make_variant.py` into `KUMM/.work/launcher57/build/` (version 1.1.0); stand folders as drives
and a fake Steam (`KRINIK_LAUNCHER_SEARCH_ROOTS`, `KRINIK_LAUNCHER_STEAM`); the fixture build 1.0.1 of `test/stand.mjs` (75 zip volumes, 4.7 MB, built by the real
engine); the local feed `test/feed.mjs` (marker `3.1.1 CL-383549`, `--cut`, `--rate`); every window off-screen (`KRINIK_LAUNCHER_FRAMES`), pressed by BM_CLICK; R1 —
the owner's real drives and Steam, read-only, state and log in a stand folder, the feed a closed port.

**Runs** (times +03:00; commands from `KUMM/.work/launcher57/`):
- 15:42–15:43 `node …/test/self.mjs none|steam … --stand st.json` (r1) — G0 found the crash box (below), G1 pass.
- 15:44 search group on the fixed build (r2): `none steam-old games pf scan unknown around` — all pass.
- 15:45:57–15:49:24 `bash batch1.sh` (r3) — 95 PASS / 10 FAIL (G4 key press, the list before the feed, D2 timing, D4 first-screen, LG2/LG3).
- 15:51:13–15:52:06 `R=…/r4 CASES="many fresh-beside fresh-cut lang" bash batch1.sh` — 57 / 2; 15:52:25–15:52:36 `R=…/r5 CASES="many lang"` — 26 / 0.
- 15:5x–15:56:12 `bash shots.sh` — 6 screens × 96 / 144 / 192 / 288 dpi, RU and EN — 128 / 0; frames read by the agent at 96 and 288 dpi.
- 15:56:21 `bash r1_real.sh` — R1.
- 16:00:53 `R=…/r6 CASES="none games" bash batch1.sh` (placement + screen watcher) — 20 / 1 (the folder dialog on screen, fixed after, not re-run).
- Guards: `node …/test/strings.mjs` red on a planted literal, green on the source; `offscreen.ps1` red on a 1×1 transparent window (`make_stub.py ghost`).

**Checks:**
- Hygiene: compile clean (warnings CS0108/CS0649 fixed); `dash_lint.py --only _config/launcher` 0; portrait lint `kaif-voice-lint check` on the 137 Russian strings
  0 after three sentences rewritten; core `voice-check.mjs --genre message` clean; criterion-9 grep prints nothing; `strings.mjs` no Russian literal outside the table.
- Functional run: the launcher walked by the player's path on the stand (start, read the screen, press the buttons, read the log and the frames); R1 on the real drives.

| Case | Status | Observation |
|---|---|---|
| G0 no game | pass (r2), the press re-cut at 16:0x | screen «notfound» with both sentences; the press opened «Обзор папок» (15:4x); since 16:0x the frames stand does not open it (it showed on the owner's screen) — not re-run |
| G1 / G1b Steam current / old | pass | found in `lib2\steamapps\common\Conan Exiles`; folder, 3.1.1, «1.0.1 для игры 3.1.1», «Нужно скачать: 4,7 МБ»; the SteamID absent from the log |
| G2 / G3 Games / Program Files | pass | found; same screen |
| G4 four copies | pass (r5) | list «без модов / установлена сборка 0.9.0 / установлены другие моды / сборка для этой версии ещё не вышла»; Down + pick → the 0.9.0 copy, screen «update» |
| G5 CL by scan | pass | 3.1.1 |
| G6 unknown CL | pass | «Версия игры: CL-390000», «Сборка для игры CL-390000 ещё не вышла.», «Последняя сборка: 1.0.1 для игры 3.1.1»; no download |
| G7 remembered | pass (r5) | no search on the second start |
| G8 around | pass | no search |
| G9 criterion 9 | pass | grep prints nothing |
| D1 feed download | pass (r3) | download → install, the amount moved between frames (t1…t12), speed / time left / time spent shown, mods 2 of 2, the build's launcher started |
| D2 parts beside | pass (r4) | no file request to the feed; the verify bar not observed (4.7 MB hash in < 250 ms) |
| D3 bundle beside, offline | pass (r3) | «found-files» offline, install, «Играть» |
| D4 cut + resume | pass (r4) | «neterror» with the amount; resume by `range=bytes=` |
| D5 stop + restart | pass (r3) | «paused» before and after the restart; resume by Range |
| D7 offline | pass (r3) | «offline»; the press read the feed again (button since renamed «Проверить ещё раз», not re-run) |
| LG1 / LG1b / LG2 / LG3 | pass (r5) | en-US → English; de-DE → English; the switch re-rendered the window in Russian, `language.txt` = `ru` in the stand state; saved ru wins |
| LG4 frames | pass, by eye at 96 and 288 dpi | 128 checks; seams found and fixed: gold text past its face, dialog paths cut mid-word (fixed after the run, not re-shot) |
| R1 real drives | pass | 5 drives in 1.1 s; 2 copies: the build folder and the clean version in `D:\Instals` (its name not quoted here); the owner's state folder absent before and after |
| C1 stand windows off the owner's screen | fail → fixed, not re-run | 16:00 r6 «none»: the Windows folder dialog on screen; the launcher's own windows off-screen in r6 |
| C12 centred inside the work area | pass (r6, logged place) | `480,210 2880x1620` in `0,0 3840x2040` |
| C13 taskbar button on a normal start | not run | needs a visible window; the code sets `ShowInTaskbar = false` only in frames mode |
| K1 control on `c05aa51` | not run | the old exe is built (`.work/launcher57/old/`) |
| X1 regression plans 54 / 55 | not run | `live.mjs` adapted (search pinned, new feed line) |
| R2 real install on a copy of clean 3.1.1 | not run | phase 4 gate |

**Found:**
1. `GraphicsPath.AddPath` throws on an empty text path — the launcher closed itself in its first seconds (fixed; EXP-0565).
2. A new `Job` showed «Установка» until the first tick; a fast network failure never showed the download (fixed: the job starts in its real stage).
3. The copies list opened before the feed and never refilled (fixed: `FillChooser` on the feed's answer).
4. UI Automation names a plain `Control` by its window text — the switch and the list were nameless (fixed: `Text` from the table).
5. Gold text wider than its face («Продолжить скачивание», the dialog's «Установить сборку») (fixed: per-button spacing, shrink to fit).
6. Paths cut mid-word in the copies list (fixed: «…» + the path's end).
7. «Руководство» lit without a PDF (fixed).
8. The window opened at `CenterScreen` of its small initial size and grew right / down past the screen (the owner 15:55) — fixed by `Place` / `KeepInside`.
9. Stand windows on the owner's screen: the frames window (same cause as 8), the build's own launcher left running by a case, the Windows folder dialog — fixed:
   frames placement, `closeAll` by PID at every case end, the dialog not opened on the frames stand; watched by `offscreen.ps1`.

**Traces:** `KUMM/.work/launcher57/` — `batch1_r3.txt`, `shots_r1.txt`, `r1…r6/<case>/tmp/KrinikConanLauncher.log`, `…/frames/*.png`, `look/*.webp`, `real/` (R1).

**Verdict:** partial — the plan-57 cases pass on intermediate builds; the fixes of 16:00 (placement, the folder dialog on the frames stand, the dialog paths, the
button caption) have no full re-run on the final exe; C13, K1, X1, R2 not run; the language dropdown of the owner's 15:55 word not built.
