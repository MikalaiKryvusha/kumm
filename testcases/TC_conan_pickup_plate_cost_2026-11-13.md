# TC — Conan: the «E Взять» plate's check cost by parts (bug 99) + the judge rounds 3–4 fixes (bug 96)

> **Created:** 2026-11-13 · **Parent:** `bugs/99_conan_pickup_plate_check_cost.md`, `bugs/96_conan_no_take_prompt_over_bush.md` · **Status:** written 17:0x, run next · **Outbound:** —

**Test basis:** `HOUSE_RULES.md` rule 7 and `MASTER_PLAN.md` acceptance 3 (our Lua ≤ 1 ms in the worst gameplay frame); the owner's log 16:06–16:46 — 0.63 ms a check, worst 31 ms.
**Stand:** the owner's save (agent's to use, rule 6), the place he played in (the world entry point), third person, background path; the section's minute summary in
`UE4SS.log` (`grep -a "PickupPrompt\].*части"`); no input during the reading minutes (the hero stands).
**Stand raised 2026-11-13 17:07–17:11:** KrinikConanUI deployed with the part timers; `launch-bg.ps1 -GameArgs '-continuesession'` stopped in the main menu (as the script
header warns) → `enter-world-remote.sh` (world in 26 s); the plate built 17:11:02; the neighbour session KCCP holds its builds until the series ends (rule 6c).

| # | Case | Expected | Status | Observed |
|---|---|---|---|---|
| C1 | the summary line after the world entry | one line a minute, «за 60 с: …», with the parts and the list size; no «за 0 шагов» lines in the menu | pass | 17:12:02 «за 60 с: шагов 60 … части: подсказки 2 мс (в списке 0), цель-актор 6 мс, растения 11 мс»; no zero lines in the menu 17:08–17:11 |
| C2 | two idle minutes at the entry point, plate dark | the parts named: which of «подсказки / цель-актор / растения» holds the time; the list size | pass | 0.60 ms a check: foliage 0.18, actor 0.10, prompts 0.03, the rest 0.28; other sections show the same 2–3 ms worst readings — not the plate's own |
| C3 | the hero pawn check (the IsA fix) | the plate still works at a stone (`stone-stand.lua`): «проверок с плашкой» > 0 while aimed | pass | 17:15 minute: 443 steps, 430 with the plate lit, 0 errors (the hero is not rejected); lit: 342 ms a minute = 0.77 ms a check at 10 a second |
| C4 | control: after the fix of the costly part | average ≤ 0.1 ms a check, no worst step ≥ 2 ms over 10 minutes | not run | |
