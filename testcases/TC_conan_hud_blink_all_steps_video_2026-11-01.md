# Test cases — Conan: one clip of every food / water blink intensity (krinik_hud_blink)

> **Created:** 2026-11-01 · **Parent:** STATUS "Where to continue", `[OWNER]` 2026-11-01 08:49 «нужно видео, показывающее все интенсивности» ·
> **Status:** cases written 2026-11-01 11:47 +03:00, not run · **Outbound:** the clip — review folder 45 for the owner's eye

**Basis.** `krinik_hud_blink.lua`: below the zone (`ui_blink_food`, default 10 %) the icon blinks with brightness step k / 10, k = ceil(b × 10),
b = 0.25 + 0.75 × d, d = 1 − share / zone — so the live steps are k = 3 … 10 (L = 0.3 … 1.0, EIGHT steps, not ten as STATUS said); at 0 % the game's own
(Hosav) blink takes over. Shares that hit the middle of each step: 9.73 · 8.67 · 7.33 · 6.00 · 4.67 · 3.33 · 2.00 · 0.67 %, then 0 %; control 12 % (no blink).

**Stand.** Any calm place (no enemy within 30 m — killed by the remote if any), god on, daytime, HUD visible, game behind (`launch-bg.ps1`); food and water set
by the remote (`BP_HungerSystem.FoodCurrent / DrinkCurrent = Max × share`) and re-set every second of the step (the game drains them); the clip — `capture-burst.ps1`
of the game window, labels burnt in per step from the step timestamps.

| # | Case | Steps | Expected | Status | Observed |
|---|---|---|---|---|---|
| V1 | Control 12 % | set 12 %, 4 s | icons steady, no «яркость» log line | pass | steady, no line |
| V2 | Each step k = 3 … 10 | set the share of step k, 4 s each | log «NoFood: яркость 0.k», «NoWater: яркость 0.k» in order; the blink visibly deeper step by step | pass | 16 lines in order; deeper red on the sheet |
| V3 | 0 % — the game's own blink | set 0 %, 4 s | no new «яркость» line (state 'bp'); the icon blinks at full | pass | no new line |
| V4 | The clip | encode the frames, labels per step | one mp4 ≥ 25 fps, each step labelled «ступень k · L · запас %» | pass (19.7 fps) | the background window path gives ≈ 20 fps; a blink pulse ≈ 1 s holds ≈ 20 frames — report `2026-11-01_conan-hud-blink-all-steps-video.md` |
