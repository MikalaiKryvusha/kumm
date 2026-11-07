# Test run report — Inventory Compactor tooltips in the game's look; hunger/thirst gauges after eating in the slowed hub

**Created:** 2026-11-07 12:26 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** KrinikConanUI `krinik_ui_fixes` 1.7.0, `krinik_pause_in_menu` 0.17.0 (pack `2856384`)

## 1. Work

The owner's words of 2026-11-07: 10:58 «эти поп-апы тоже перевести в вид как у игры» (his frame of «Выберите стопку и нажмите, чтобы отделить нужное количество»);
10:59 «при съедании или выпивании чего-то в инвентаре, из-за замедления мира - проценты голода и жажды увеличиваются или медленно или с задержкой» · 11:00 «нужно
исправить по аналогии, как исправляли по крафту». Cases: T1 — a real hover over each of the two buttons shows the game's dark tooltip; E1 — eating in the hub,
the gauge shows the new value within ≈ 1 s.

## 2. Contour

The live game, the oasis save, the hub open (world time 0.03 by our pause section), real cursor hover (`hover-watch.ps1`, the game brought forward and the owner's
window restored). REAL WORLD: accumulated — the owner's save; data and machine — his game folder; path — the real cursor (T1); the item's own `OnUseItem` (E1, the
remote — the player's «use» without a click).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-07 12:20 +03:00 | remote: `SetToolTip(W_TooltipWidget)` on the two buttons, `hover-watch.ps1 -At 0.258/0.19 …` | dark game tooltip seen (live A) |
| 2 | 2026-11-07 12:3x +03:00 | `eat-probe.lua`, `gauge-lag-probe.lua` (before the fix) | food +7 at once; the gauge polled ≈ 10.5 s after the change, then a slow animation |
| 3 | 2026-11-07 12:25 +03:00 | deploy, fresh start; log lines; `hover-watch.ps1 -At 0.277/0.19 …` | T1 pass — «Нажмите, чтобы собрать…» in the dark game tooltip |
| 4 | 2026-11-07 12:25 +03:00 | `_G.__gl_food=true; … gauge-lag-probe.lua` | E1 pass — polled 7.22 at the use sample, shown 7.22 at +1.1 s; log «значки … опрошены сразу» |

## 4. Checks

- Hygiene: none (Lua sections, no unit tests).
- Functional run: the real game — hover frames READ by eye; the gauge's polled / shown values and the hunger system's food READ per sample; `UE4SS.log` READ.

## 5. Found

- Inventory Compactor's buttons carried a plain ToolTipText (Slate's grey box); the game's tooltip is `W_TooltipWidget_C` — set per button at the widget's birth.
- The stat itself rises at once on eating; the gauges lagged: a poll timer and a 0.1 s animation, both in game time (× 33 in the hub).

## 6. Traces

`UE4SS.log` lines «Inventory Compactor: game tooltips on 2 buttons», «еда/питьё в хабе: значки … опрошены сразу»; frames `hov2/`, `hov3/` in the session scratchpad.

## 7. Verdict

pass — T1 (both buttons' tooltip by a real hover: Split before the code, Compact after) and E1 (eating by the item's own use). Drinking was not walked separately
(the same hooks: AddDrink / IncreaseDrink; the thirst gauge updated in the same samples of run 2).
