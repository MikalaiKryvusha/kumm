# Run report — the launcher's feedback window («Отзыв») opens without re-drawing its plaque and labels

## 1. Work

Bug 110, the owner's look of 2026-11-22 15:06 (issue #43): the launcher is fast except the window that explains feedback. Basis: HOUSE_RULES 41 and
`researches/efficient-code/EFFICIENT_CODE.md` (an interaction finishes inside one 60 Hz frame, 16 ms, at the owner's 300 %). Case set: the stand case
`perf-report` of `ConanExiles/_config/launcher/test/self.mjs` (FB, FB1–FB3), plus a pixel comparison of its frames before and after.

## 2. Contour

The launcher 1.1.0 sources of the pack (`_config/launcher/`), compiled into `KUMM/.work/fb_window/build` (timers only) and `build_after` (timers + cached
faces) by `test/make_variant.py`; the frames stand of `self.mjs` (288 dpi, the window off the monitors, no feed → the found game on the «offline» screen).

## 3. Runs

| # | Moment | Command | Result |
|---|---|---|---|
| 1 | 2026-11-22 15:27 +03:00 | `node _config/launcher/test/self.mjs perf-report …/fb_window/run_before …/fb_window/build/KrinikConanLauncher.exe` | 4 FAILED (FB3 76.7 / 76.0 / 83.0 ms; two checks of the case itself wrong — the screen name, the frame regex) |
| 2 | 2026-11-22 15:32 +03:00 | the same on `build_after` (`run_after`) | 1 FAILED — the case's screen check only |
| 3 | 2026-11-22 15:33 +03:00 | the same, the case's screen check fixed (`run_after2`) | ALL PASS |
| 4 | 2026-11-22 15:34 +03:00 | `python -X utf8 -` (Pillow) — frames 003–009 of run 1 against run 3 | the plaque area differs by at most 1 of 255 |

## 4. Checks

Hygiene: `node --check self.mjs`; the C# compiled by `make_variant.py` with no error.
Functional run: the launcher under test pressed «Отзыв» six times by `click.ps1` (BM_CLICK, no real input) on the stand; its own timers and frames READ.

| Case | Expected | Seen | Status |
|---|---|---|---|
| FB | every press reaches the plaque and writes its frame | 6 of 6 (`отзыв: табличка открыта / закрыта · окно 2880x1620`) | pass |
| FB1 | every toggle after the first ≤ 16 ms | 1.1, 2.0, 1.2, 2.1, 1.4 ms (the first 22.9 ms) | pass |
| FB2 | no whole-picture render on any press | 0 renders on all six | pass |
| FB3 | a later open draws the plaque and labels ≤ 16 ms | 14.0, 10.9 ms (before: 76.0, 83.0 ms) | pass |
| look | the plaque before and after the same to the eye | max luminance difference 1 / 255 over 32 324 pixels; frames `run_before` vs `run_after2` | pass |

## 5. Found

- The defect: 8 paints of the plaque's metal and 6 glyph-path renders per open (transparent labels paint their parent's background) — fixed.
- Not fixed: the first open after a start still costs ≈ 100 ms (handles of the plaque's windows and the first faces) — named in bug 110.

## 6. Traces

`KUMM/.work/fb_window/run_before/perf-report/` and `run_after2/perf-report/` (`tmp/KrinikConanLauncher.log`, `frames/*.png`) — deleted after this report;
bug 110 «The feedback window — measured and fixed».

## 7. Verdict

pass on the stand. The owner's real launcher (his screen, a real mouse) is not checked by me: his look decides issue #43.
