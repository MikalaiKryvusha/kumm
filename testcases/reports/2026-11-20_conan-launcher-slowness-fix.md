# Run report — bug 110: the launcher's slow feedback (the picture re-rendered on every screen change) — measured, fixed, budgeted

**Created:** 2026-11-20 12:09 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack `513a21f` + the bug 110 working tree; launcher 1.0.0, build 0.9.1-RC1

## 1. Work

The owner's remark 2026-11-20 11:37 (buttons react and elements show slowly) and his rule 11:44 (HOUSE_RULES 41: work proportional to the change). Basis: bug
110, `researches/efficient-code/EFFICIENT_CODE.md` §1 (the budget: a refresh and a list repaint inside one 60 Hz frame, 16 ms), plan 57's case set
(`testcases/TC_conan_launcher_self_sufficient_2026-11-18.md`) + the new case `perf` (P0–P3).

## 2. Contour

The launcher stand (`ConanExiles/_config/launcher/test/self.mjs`, bundle `KUMM/.work/launcher_r3/st.json`, 288 dpi = the owner's 300 %, the window off-screen —
C1 «no window touched a monitor» in every case). Builds: the pre-fix sources with timers (`KUMM/.work/bug110/make_perf.py` → `bug110/build`), the fixed
sources with timers (`bug110/build_after*`), the product exe of the fix (`make_variant.py` → `KUMM/.work/launcher_r6/build`, timers by
`KRINIK_LAUNCHER_PERF=1`). REAL WORLD: accumulated — not involved (stand drives, stand feed); data and machine — the owner's machine at his scale; path — the
player's fresh install from the feed and the language switch.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-20 11:40 +03:00 | `self.mjs lang <work> bug110/build/KrinikConanLauncher.exe --stand st.json` | PASS; the first timings |
| 2 | 2026-11-20 11:43 +03:00 | `self.mjs fresh-feed … bug110/build/…` + `bash bug110/summary.sh <log>` | PASS; the pre-fix numbers (§4) |
| 3 | 2026-11-20 11:49–11:57 +03:00 | the same two cases on `build_after`, `build_after2`, `build_after3`, `build_after4` (each fix step) | PASS each; numbers in §4 |
| 4 | 2026-11-20 11:59 +03:00 | `python -I -W ignore bug110/frame_diff.py <pre-fix frames> <fixed frames>` (lang, fresh-feed) + `bug110/pair.py` (a side-by-side crop) | 13 pairs compared |
| 5 | 2026-11-20 12:02 +03:00 | `self.mjs perf … launcher_r6/build/…` and `self.mjs perf … bug110/build/…` (the control) | ALL PASS · FAIL P1 P2 P3 |
| 6 | 2026-11-20 12:02–12:09 +03:00 | `EXE=…/launcher_r6/build/… TAG=r6 bash launcher_r3/batch.sh` (25 cases with `perf`) | 347 PASS, 0 FAIL; case `many` printed nothing (EMPTY) |
| 7 | 2026-11-20 12:09 +03:00 | `self.mjs many <work> launcher_r6/build/… --stand st.json` (alone) | 16 PASS, ALL PASS |

## 4. Checks

Hygiene: the C# compiled by `make_variant.py` / `make_perf.py`; `node --check self.mjs`.
Functional run: the launcher exe walked by the player's path on the stand (search, the found game, install from the feed with download ticks, the language
switch), its log's `perf:` lines and its window frames READ.

| Measure (fresh install, 300 %) | Pre-fix | Fixed |
|---|---|---|
| picture renders in the flow | 4 × 269–322 ms | 2: 285 ms at birth, 57–62 ms when the found game's version appears |
| screen refresh after the first | 20–140 ms | 1.5–8.5 ms |
| state-list repaint on a download tick | 14–31 ms | 4–14 ms |
| a screen change in total | ≈ 350 ms | ≈ 30–40 ms (the new screen's list drawn once: 18–34 ms) |

Correction 2026-11-20 14:4x (judge round 5 and the stand's own log): the stand's window sits off-screen and gets no WM_PAINT, so every «state-list repaint»
above is the list drawn into a frame by DrawToBitmap — the same `PaintNow` code, the same cost, but not a repaint on a screen. The numbers stand as the cost of
drawing the list; the claim «the list repaints on every tick» was never observed by this stand. Since the round-5 fix the stand reads the repaint request
(`StatePanel.Invalidate`, case `offline` D7b) and labels the frame's drawing `StatePanel.Print`.

- **P (the budget case), run 5:** fixed — «PASS P1 … 285.6 ms, 61.6 ms», «PASS P2 … 6.5, 7.6, 5.8, 1.8», «PASS P3 … 6.4, 7.7, 5.3, 5, 7.6, 5.3, 5.3, 13.8»;
  pre-fix control — «FAIL P1 … 282.7, 269.1, 309.8, 322.5 ms», «FAIL P2 … 52.3, 52.5, 140.5, 55.8», «FAIL P3 … 16.5 … 19.6, 16.7, 17.1».
- **The look, run 4:** lang 6 / 6 frames equal within antialiasing (max channel diff 2–5 of 255); fresh-feed — equal except the state list where the TEXT
  differs between the two runs (the stand folder's name in the game path; live download numbers), one truncated frame skipped; the side-by-side crop of the
  download screen read by eye: the same fonts, shadows, bar and plates.
- **Not covered:** frames at 96 / 144 / 192 dpi (no visual change is expected — the same drawing code, cached); a hover / press timing by real input (the button
  paint itself is 1–5 ms in every run).

## 5. Found

- the defect itself (bug 110) and its four causes; none new.
- the stand case `many` printed nothing once in run 6 (no check, no launcher log in its folder); alone (run 7) it passed 16 / 16 — the empty run is not
  reproduced after one re-run, its cause not found (a stand flake to watch, not a launcher defect claimed).

## 6. Traces

`KUMM/.work/bug110/` (the timed builds, case folders `case_*`, `after*_*`, `perf_*`, `summary.sh`, `frame_diff.py`, `pair_download.webp`),
`KUMM/.work/launcher_r3/batch_r6.txt` and its `r6_*` folders.

## 7. Verdict

pass — the budget case is green on the fix and red on the pre-fix build; every stand case passes on the fixed exe (347 + `many` 16); the look is unchanged
within antialiasing. The owner's own look at the real launcher is the remaining check of «feels fast».
