# TC — HUD: hunger, thirst and weight blink early, dim → full, 20 % faster (plan 36 W36)

> **Created:** 2026-10-30 · **Parent:** plan 36 W36; `[OWNER]` «в моде ХУД - мерцать голодом, жаждой и весом нужно на 20% быстрее» · «а начинать тускло
> мерчать нужно на 10% - для голода и жажды, и на 10% от макс веса - для веса.» · «тускло и по мере приближения к 0% - на полную яркость» · ≈14:23
> **Status:** cases written 2026-10-30 14:4x, before the run; run 14:43–14:51 — H1–H10 pass (report testcases/reports/2026-10-30_conan-hud-blink-early.md)
> **Outbound:** the look of the dim blink — the owner's eye

**Goal (Achieve).** Food and water icons start blinking at 10 % (dim) and blink at full strength at 0 %; the weight icon from 90 % of max to 100 %;
the blink is 20 % faster than before (PlaybackSpeed 0.25 → 0.30).

**Stand.** The owner's save copied before the launch; world entry by the remote; god on; values set by the remote on the player's
`BP_HungerSystem` (`FoodCurrent`, `DrinkCurrent` against `FoodMax`, `DrinkMax`) and the weight by items or the stat; the section's log lines and
the remote's reads of the animation state (`IsAnimationPlaying`, `GetAnimationCurrentTime`) are the observation; frames for the eye.
Techniques: boundary values (just above / at the threshold, mid-zone, the limit), state transitions (zone → limit → back), control (above the threshold).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| H1 | Section loads | `UE4SS.log` after world entry | «section krinik_hud_blink: loaded», «HUD: W_SmoothHP_C_…» | pass — load line 14:46:17; «HUD: W_SmoothHP_C …W_NewHealthUI_C_2147458763.WidgetTree…» 14:47:13 (first build took the class TEMPLATE by FindFirstOf — no blink at water 2 %; fixed to hud.W_SmoothHP) |
| H2 | Control above the threshold | food 50 %, water 50 % | no `NoFood` / `NoWater` playing, no section line | pass — food 50 %: NoFood not playing |
| H3 | Food at the threshold | food 9 % | the section line «NoFood: яркость 0.4» (≈0.25 + 0.75 × 0.1), `IsAnimationPlaying(NoFood)` true | pass — food 9 %: «NoFood: яркость 0.4», playing, Hosav flag false |
| H4 | Food near the limit | food 1 % | brightness step 1.0 (or 0.9), playing | pass — food 1 %: «яркость 1.0», playing |
| H5 | Food at 0 — Hosav's own blink | food 0 | Hosav plays `NoFood` (flag `InNoFoodAnimation` true), the section stays out | pass — food 0: flag InNoFoodAnimation true (Hosav’s own blink) |
| H6 | Back above the threshold | food 50 % | the blink stops, the border colour back to white | pass — food 50 %: Hosav’s reverse pass, then not playing, Border_EatImage colour 1,1,1,1 |
| H7 | Water the same | water 9 % → 0 → 50 % | as H3, H5, H6 for `NoWater` | pass — water 9 % playing / flag false; 0 → flag true; 50 % → flag false; water 6 % at world entry → «NoWater: яркость 0.6» |
| H8 | Weight zone | weight ≥ 90 % of max | «OverEncumbered_Weight: яркость …», playing | pass — weight 0.901 → «OverEncumbered_Weight: яркость 0.3»; 1.007 → flag true (Hosav). Note: below the zone (0.689 at entry) the weight animation reports playing at its end (t 1.003, alpha 0) — Hosav’s own idle state, invisible |
| H9 | Speed 0.30 in the pak | the remote reads the playback speed of Hosav's own blink at 0 (`GetAnimationCurrentTime` over 1 s) | the curve advances ≈0.30 s per second | pass — at food 0 the curve advanced 0.611 s over 2.036 s = 0.30 /s (was 0.25) |
| H10 | No crash, no Lua errors; the section's minute summary | the whole run | 0 Lua errors; worst poll ≪ 1 ms | pass — 0 Lua errors; minute summary «опросов 18, всего 4.000 мс» — os.clock steps 1 ms: not a measurement and not a bound; the cost per poll is UNMEASURED (the 1000-calls method, as KrinikConanGraphics G4) |
