# Bug 110 — the Conan launcher reacts slowly: every screen change re-rendered the whole window picture (≈ 300 ms at 300 %)

> **GitHub issue:** [#43](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/43) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔧 fix pending verification (built and measured on the stand 2026-11-20; the owner's eye on the real launcher is the check)
**Severity:** S2 (a slowdown — critical by HOUSE_RULES 38; the owner's time: the third recurrence of the same class)
**Version/build:** launcher 1.0.0 of build 0.9.1-RC1 (pack `513a21f`) · **When/context:** 2026-11-20 11:37, the owner using the RC1 launcher
**Fixing:** this session

## Symptom

`[OWNER]` 2026-11-20 11:37: «есть замечание по лаунчеру -  в нём как-то медленно нажимаются кромки и показываются элементы-  это особенность фронтенд движка
на котором он собран?» («кромки» = «кнопки»). Then 11:43–11:44: the same class in Svarog and in the Conan mods; «ты делаешь какие-то O(N) полные циклы
всегда - это КРАЙНЕ КРАЙНЕ ПЛОХАЯ ПРАКТИКА!!!!!» (chronicle entry 2026-11-20 11:37–11:46).

## Repro (deterministic)

1. `python -I -X utf8 KUMM/.work/bug110/make_perf.py <out>` — a copy of the launcher sources with timers around every paint, refresh and the picture's layers.
2. `node _config/launcher/test/self.mjs fresh-feed <work> <out>/KrinikConanLauncher.exe --stand <st.json>` (the stand's 288 dpi = the owner's 300 %).
3. `bash KUMM/.work/bug110/summary.sh <work>/fresh-feed/tmp/KrinikConanLauncher.log`.
Since the fix the product carries its own timers: `KRINIK_LAUNCHER_PERF=1` → `perf:` lines; stand case `perf` judges the budget.

## Forensics (the pre-fix build, fresh install from the feed, 300 %)

| What | Count | Each |
|---|---|---|
| `MetalWindow.Render` (the whole picture) | 4 | 269–322 ms — wallpaper 157 ms, lettering 56 ms, shade 37 ms, frame 16 ms, logos 12 ms |
| `Launcher.Refresh` (one screen update) | 5 | 20–140 ms |
| `StatePanel.OnPaint` (the state list) | 14 | 14–33 ms, on every progress tick |

## Root cause

Work proportional to what EXISTS, not to what changed (KUMM `researches/efficient-code/EFFICIENT_CODE.md` §0), in four places:
1. `MetalWindow.Relayout()` ended with an unconditional `InvalidateCache()` — every call (a screen change, a state-list change, a language change, the update
   plate) threw the picture away and repainted the whole window; the picture held both the never-changing wallpaper / shade / logos / frame and the texts.
2. Every `Relayout()` rebuilt every text block (title, versions, links) as glyph paths, and `LayoutVersions` scanned every pixel of both logos (`SolidBox`,
   `LockBits` + a double loop) although the logos never change.
3. `StatePanel.OnPaint` rebuilt the glyph paths and the CPU box-blur shadows (three passes over every pixel) of ALL its lines on every repaint — a progress
   tick changes two or three lines.
4. `Lettering.Advance` created and destroyed a GDI+ `Font` on every width measurement (hundreds per update).
WinForms itself is not the cause: its controls repaint in a few ms; GDI+ draws on the CPU, and at 300 % every pixel costs nine times the 100 % price.

## Fix

1. The picture is cached under a key of its inputs (size, scale, header texts, links, the launcher version plate) and re-rendered only when the key changes;
   it is two layers — the base (wallpaper, shade, logos, frame; size only) and the texts on a copy of it.
2. Text blocks are rebuilt only when their own key changes (`headKey`, `linksKey`); `SolidBox` is computed once per image.
3. The state list keeps each finished line (glyphs + shadow) as a small bitmap keyed by text, font, colour, place, size; a tick redraws only the changed lines.
4. Fonts are created once per (family, size, style); widths are remembered (a bounded table).
5. `KRINIK_LAUNCHER_PERF=1` writes the timers to the launcher's log; stand case `perf` (`self.mjs`): P1 the picture rendered ≤ 2 times in the fresh flow,
   P2 every refresh after the first ≤ 16 ms, P3 every state-list repaint of the download after its first ≤ 16 ms.

After (same flow, 300 %): picture renders 2 (285 ms at birth, 62 ms when the found game's version appears), refreshes 1.8–7.6 ms, list ticks 5–14 ms; a screen
change ≈ 30–40 ms instead of ≈ 350 ms. Frames: the pixel diff of 13 stand frames before / after — identical within antialiasing (max channel difference 2–5)
except the lines whose TEXT differs between the two runs (the stand folder's name, the live download numbers); a side-by-side look at the download screen.

## The owner's look (2026-11-22 15:07 +03:00, issue #43)

`[OWNER]` 2026-11-22 15:06 «лаунчер стал быстрым, кроме окна, в котором поясняется инструкция про отзыв, в остальном стал быстрым». The fix holds on his
real launcher everywhere except the window that explains how to send feedback — that window still opens or reacts slowly. **Owed:** measure that window
on the stand (open, first frame, a press) at 300 %, find what it rebuilds (EFFICIENT_CODE §1), fix, retest; issue #43 stays open until then.

## The feedback window — measured and fixed (2026-11-22 15:2x–15:34, the owner's look of 15:06)

Stand case `perf-report` (`_config/launcher/test/self.mjs`, the stand's 288 dpi = the owner's 300 %): «Отзыв» pressed six times on the found-game screen, the
timers `Feedback.Toggle`, `ReportPlaque.Background`, `OutlinedLabel.OnPaint`, `MetalWindow.Render` read per press. The window does not grow when the plaque opens
(2880 × 1620 both ways) — no whole-picture render.

| Press | Before (timers only) | After (cached faces) |
|---|---|---|
| 1st open | toggle 23.5 ms · plaque ×8 22.6 ms · labels ×6 54.1 ms | toggle 22.9 ms · plaque ×8 20.9 ms · labels ×6 54.2 ms |
| later opens | plaque ×8 23.2 / 25.0 ms · labels ×6 52.8 / 58.0 ms (76.0 / 83.0 ms per open) | plaque ×8 11.8 / 8.8 ms · labels ×6 2.2 / 2.1 ms (14.0 / 10.9 ms) |
| closes | toggle 1.1–1.3 ms, nothing drawn | toggle 1.1–1.4 ms, nothing drawn |

Cause: the plaque's labels are transparent, so WinForms paints the plaque's metal under EACH label (8 plaque paints per open), and every label rebuilt its glyph
path and stroked it with a wide pen on every paint. Fix: `ReportPlaque` keeps its metal as one bitmap keyed by size and scale and copies only the asked part;
`OutlinedLabel` keeps its finished face keyed by text, font, colour, size and DPI; `Metal.Blit` copies 1:1 in pixels. The look: the frames before / after differ on the
plaque by at most 1 of 255 in luminance (rounding); the only larger difference is the stand folder's name in the state text. The first open after a start still
costs ≈ 100 ms (the windows of the plaque are created and the faces drawn once) — not cached ahead. Report `testcases/reports/2026-11-22_conan-launcher-feedback-window.md`.

## Decisions made without the owner

- `[AI]` The budget numbers: 16 ms (one 60 Hz frame) for a refresh and a list repaint; the first paint of a new screen's list (18–34 ms, all lines new) is
  not held to it. The owner's word overrides.
- `[AI]` The frame is drawn under the texts now (base layer); the texts never reach the window's edge, the frames show no difference.
- `[AI]` The «О проекте» plate (the owner 11:38) is a separate item of plan 57, not this bug.

## Links

`researches/efficient-code/EFFICIENT_CODE.md` · HOUSE_RULES rule 41 · KAIF issue #200 (`bugs/KAIF/33_*`) · plan 57 «The owner's remarks of 2026-11-20» ·
run report `testcases/reports/2026-11-20_conan-launcher-slowness-fix.md`
