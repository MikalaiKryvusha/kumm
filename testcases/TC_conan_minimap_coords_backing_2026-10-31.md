# Test cases — Conan: minimap coordinates inside the ring on a backing (plan 36 W4, bugs/64 item 31)

> **Created:** 2026-10-31 · **Parent:** plan 36 W4 (`[OWNER]` «в миникарте коардинаты нужно будет переместить внутрь круга, сделать им подложку» · 2026-10-27 ≈00:1x)
> **Status:** written 2026-10-31 09:4x before the run; C1–C4 pass 09:48, C5 → release gate; the look waits for the owner (review folder 26)
> **Outbound:** the look → the owner's eye (review folder)

**Stand.** Game in front (`launch-fg.ps1`), oasis save (copy `_save-backup/2026-10-31_0944-before-w4-minimap`), world by `enter-world-remote.sh`, no
enemy near; frame by `capture-window.ps1`, crop of the minimap corner.

| # | Case | Expected | Status | Observation |
|---|---|---|---|---|
| C1 | mock-up by the remote | coordinates inside the ring on a plate, readable | pass | 09:45–09:47: plain dark plate (A) and clock-style plate, font 15 (B) — frames `cmp1/cmp3` |
| C2 | the section on a normal start | log «координаты внутри круга, на плашке часов»; the frame shows B inside the ring | pass | 09:48 after deploy + fresh start: the log line (1.000 ms), frame `after.webp` — «-78471, 245900» inside the ring on the clock plate, font 15 |
| C3 | nothing else moved | the clock, ±, settings, the map picture at the same pixels as before | pass | before/after crops side by side: clock, ±, gear and ring at the same places |
| C4 | cost | one rebuild per minimap creation, ≤ 1 ms, no loop | pass | one log line per creation, 1.000 ms (os.clock step 1 ms); no loop in the code |
| C5 | 4K | the plate and text inside the ring, text ≥ 36 px letter height (rule 17) | skipped | the run was 1080p; left to the plan 35 four-resolution release gate |
