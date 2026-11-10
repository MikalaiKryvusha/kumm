# TC — Conan «Хар-ки»: the attribute bar pages by `Page` (plan 49 B2, step 1)

> **Created:** 2026-11-10 · **Parent:** `plans/49_conan_endless_attributes.md` (route A, step 1) · **Status:** ✅ 4/4 pass, run 03:00–03:03 (frames in the session
> scratchpad, judged by eye and by a pixel diff; the hero's Agility was 39 already — the cases ran on the rows that read 25 and 39)

Stand: the working game with `KrinikConanUI.pak` built 2026-11-10 02:59 (W_Attribute: member `Page`, `UpdateView` bar = `(FullValue − Page × 20) / 20`); background launch,
world by the remote; the hero's Agility set to 25 by the remote (`ServerGiveAttribute`, cap 10000 since plan 49 step DONE 2026-11-08); «Хар-ки» opened by the remote
(`ActivateModule(FName('Attributes'))`); frames of the game window (`capture-window.ps1 -Width 3840`). No real input.

| Case | Action | Expected | Status | Observed |
|---|---|---|---|---|
| P1 | the rows at 25 (Выдержка) and 39 (Проворство), `Page` 0 (default), `UpdateView(n, n, 0)` | the bar full (as vanilla past 20) | pass | both bars full; «25», «39» |
| P2 | the same rows, `Page` 1 | 25 → the bar at 25 % (5 of 20); 39 → 95 % | pass | Выдержка filled exactly to the first pip (5), Проворство to 95 % with the end gap |
| P3 | every row back to `Page` 0 | the bars as in P1 | pass | mean abs diff of the bar area P1 vs P3 = 0.45 (the animated backdrop's noise) |
| P4 | the rows not touched in P2 (Сила 18, Живучесть 28, Авторитет 0, Мастерство 0) | unchanged — the vanilla look | pass | P2 frame: 18 at 90 %, 28 full, 0 empty — as P1 |

Found on the way: every attribute row exists TWICE among the live `W_Attribute_C` (12 rows for 6 attributes, both answered `UpdateView`) — likely the hub's
duplicated pages of bug 84; the paging must address the shown instance when the arrows come (step 2).
