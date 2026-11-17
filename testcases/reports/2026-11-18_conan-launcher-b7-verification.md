# Test run report — the Krinik Conan launcher, epic 55 B7 verification (the judge's four defects, the live button corners)

**Created:** 2026-11-18 00:52 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** launcher 1.0.0, pack `bd7f96c` (final exe SHA-256 `d6e507c2736a…`); control — pack `2f62b52` (`.work/launcher54/before/`)

## 1. Work

Epic 55 phase B, item B7 (`plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md`): the four defects the launcher judge confirmed on 2026-11-17 21:25 and the black
corners under the metal buttons the owner saw on the live window (22:06). Basis — the B7 text of the plan and the cases L6–L9, B1, B4, B7 of
`.work/launcher54/batch57.sh` (header lists them), plus the plan-54/55 regression in the same batch (S1–S3, L4, L5, B2, B5, B6).

## 2. Contour

The launcher stand `ConanExiles/_config/launcher/test/` (a local GitHub-like feed `feed.mjs`, a fake Conan folder with bundles exported by the real engine
`stand.mjs`, stub exes `make_stub.py`); windows shown without focus (`KRINIK_LAUNCHER_NOACTIVATE=1`), buttons pressed by BM_CLICK (`click.ps1`), the
launcher's own log read. The live-window look: the final exe and the 2f62b52 exe started in `.work/live_corners/` (state `installed`, no feed, dry),
captured by PrintWindow at 3840 px.

## 3. Runs

- 2026-11-18 00:43:07–00:47:08 — `bash .work/launcher54/batch57.sh` on the final exe (output `.work/launcher54/batch57_final2.txt`).
- 2026-11-18 00:47–00:50 — `CONTROL=1 bash .work/launcher54/batch57.sh` on the 2f62b52 launcher, only the new cases (`batch57_control.txt`).
- 2026-11-18 00:51 — `powershell -File .work/live_corners/shot.ps1 -State installed -Out …installed.jpg` (final exe) and `shot_before.ps1` (2f62b52);
  six corners cropped ×4 into one sheet.

## 4. Checks

Hygiene: none new (the exe was built in the previous chat by `build-docs.py`).
Functional run: the final launcher driven on live windows through 15 cases, every result read from its window, its message boxes and its log; the control
run read the same way; the live window looked at by eye at ×4.

| Case | Final exe | Control (2f62b52) | Observation |
|---|---|---|---|
| S1–S3 self-update ok / forged digest / garbage exe | pass 9 · 4 · 5 | not run | handshake, digest refusal, «не программа» |
| L4 the new launcher dies before its window | pass 5 | not run | old exe back, box names the reason |
| L5 two unfinished starts | pass 5 | not run | old launcher back |
| L6 the new launcher hangs | pass 7 | pass 7 | a NEW check of behaviour that already worked — it cannot prove the B7 fix, only guards it |
| L7 the player closes the new window at once | pass 11 | **fail 7** (pass 4) | before: the old launcher rolled back over a quick close; now the close counts as «alive», `.old` kept to the 2nd start |
| L8 the revert held half-way (a locked `.old`) | pass 6 | **fail 3** (pass 3) | before: the exe place left EMPTY and `.bad` left; now the new exe is put back |
| L9 the previous-bundle delete guard | pass 12 | **fail 7** (pass 5) | before: offered to delete `MyGame`, `Krinik_…` holding Saved / Content, default «Да»; now refused with a log line, default «Нет» |
| B1 build update, the happy path | pass 15 | **fail 3** (pass 12) | the tail check, the «после распаковки» wording, default «Нет» |
| B4 a broken install, then the retry | pass 8 | **fail 2** (pass 6) | before: the retry downloaded again; now «уже распакован … пропущены» |
| B7 the game started mid-download | pass 15 | **fail 4** (pass 11) | before: 75 → 150 part requests after the game closed; now no part fetched again |
| B6 a release without its last part | pass 6 | not run | refused before any download |
| B2 stop + resume | pass 15 | not run | the resumed part asked by `Range` |
| B5 the window closed mid-update | pass 15 | not run | refused with a box, update finished |
| Total | **138 PASS / 0 FAIL** | 48 PASS / **26 FAIL** | corrected 2026-11-18 01:09 +03:00: the first count (153 / 32) took the summary lines «ALL PASS» and «N FAILED» for checks; these numbers count only the lines that start with PASS or FAIL |
| Live corners (Play TL, Guide TL / TR, «Что нового» TL) | pass | black triangles | sheet `testcases/reports/2026-11-18_conan-launcher-b7/corners_before_after_x4.webp`: top row 2f62b52 — black triangles under four cut corners; bottom row final — the picture shows through. The Play BR corner and the gap between «–» and «×» are dark in BOTH rows: the picture there is dark |

## 5. Found

- The launcher's player strings carry telegraphic dashes — the owner saw «Игра не найдена: сборку — в папку игры» in a stand window at 00:44
  (`PROJECT_HISTORY.md` entry 2026-11-18 00:44). Not a B7 defect; the sweep is `plans/56_conan_build_texts_without_telegraph_dashes.md`.
- L6 does not distinguish the fixed launcher from the old one (see the table) — recorded, not a defect.

## 6. Traces

`.work/launcher54/batch57_final2.txt`, `.work/launcher54/batch57_control.txt` (work files, deleted when epic 55 phase B closes);
`.work/live_corners/installed.jpg`, `installed_before.jpg`; the sheet above (kept in the repository).

## 7. Verdict

**pass** for B7 on the stand: the four defects are fixed and every new check except L6 is proven able to fail; the corners are fixed on the live window.
Open: the independent judge round on the B7 diff (running at the time of this report), REAL WORLD — the launcher on the owner's real build folder is not run
(phase C).

## Addendum 2026-11-18 01:15 +03:00 — after the judge round (R1–R7, C1–C5) and B8

Runs (commands as above; `batch58.sh` = `batch57.sh` + `--half-bundle` (B15′) + `crash` (B16′) + `EXE_OVERRIDE`):

| Run | Exe | Result (lines starting with PASS / FAIL) |
|---|---|---|
| 01:04–01:08 `batch57.sh` → `batch57_r2.txt` | `45443b7a…` (judge fixes, no B8) | 141 / 0 — L6 now asserts «(код -1)», B15′ 3 / 0 |
| 01:09 control: `stand.mjs` + `live.mjs build … --half-bundle` | `d6e507c2…` (B7 exe) | 2 / **1** — the half-unpacked folder is offered as «уже скачана и распакована» there |
| 01:09–01:14 `batch58.sh` → `batch58_r1.txt` | `0d6282b2…` (+ B8) | 148 / 0, B16′ 11 / 0; **S2 printed nothing**: my control's `close_leftovers.ps1` at 01:10 killed the batch's S2 processes (same folder). S2 re-run alone 01:14 — 4 / 0 |
| 01:12 control: `live.mjs crash` | `d6e507c2…` | C1 «remembers» **FAIL**, C3 no box (the driver stopped on the missing box) |

Found: no launcher defect. The S2 gap is a stand-procedure slip (a cleanup run beside a running batch). Verdict for the addendum: **pass** on the stand; judge
round 2 on these changes running; REAL WORLD still phase C.
