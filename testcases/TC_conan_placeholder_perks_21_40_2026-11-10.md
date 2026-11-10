# TC — placeholder perks 21–40 on Живучесть: our DT_KrinikPerks merged into the game's PerksTable, the pips per page, the right column

> **Created:** 2026-11-10 · **Parent:** `plans/49_conan_endless_attributes.md` (B2 step 2, the owner's order 2026-11-10 10:28, verbatim in the plan)
> **Status:** cases written 2026-11-10 11:3x +03:00 · **Outbound:** the verdict → plan 49; frames → the owner (the right column scrolling — his eye)

## Test basis

The owner 2026-11-10 10:28 (plan 49): on 21–40 no stock pips; in one attribute placeholders for 21…40 appear; the right list takes them, shows them and scrolls.
Build: KrinikConanUI with `Local/DT_KrinikPerks` (`_config/devkit/kit-krinik-perks.py`: rows `Krinik_Vitality_25/30/35/40`, `TargetIntStat` AttributeHealth, texts
«Перк NN-го уровня (заглушка)» / «Место для будущего перка сборки. Пока перк ничего не даёт.») and the Lua merge `MERGES[2]` of `krinik_mod_settings`.

## Stand

The build with the new pak; the hero with Живучесть ≥ 28 (page 2 exists) and Проворство 39; «Хар-ки» opened by the remote (`ActivateModule(FName('Attributes'))`)
or by real keys; frames by `capture-window.ps1 -Width 3840`.

## Cases

| # | Action | Expected | Status | Seen |
|---|---|---|---|---|
| P1 | the main menu | UE4SS.log: «perks merge (main menu): call ok; rows 48 -> 52; Krinik_Vitality_25 present false -> true» | pass | 11:40:17 the line exactly, 9 ms (pack pak 11:38, launch-bg PID 6420) |
| P2 | «Хар-ки», Живучесть on page 1 (1–20) | the stock pips at 5 / 10 / 15 / 20 only; nothing drawn past the bar's right end (a req-25 pip placed by the C++ at 25/20 × 858 would stand there) | **fail** | 11:42 4K frame `p2_attrs.jpg`: four extra pips past the bar's end, ON the right column (x ≈ 1273 / 1413 / 1553 / 1693 of 2000, y 477). `attr-pips-probe.lua` (`_G.__pip_row='A_Vitality'`): the canvas holds 14 `W_AttributePerkPip_C`, slot X = req × 43.75 (875 per 20 at this window), Y 0/32 for a branch, 16 single; ours at X 1093.8 / 1312.5 / 1531.2 / 1750; the last four (req 5–20, Y 16) — the corruption pips. Every pip reads `AttributePointsRequired`. → step 3 (pips per page) is required before the placeholders ship |
| P2b | the same after the fix (`krinik_attr_pips`, the pak with the canvas shown past page 0) | as P2 | **pass** | 12:09 first open (frame `q1c.jpg`) and 12:1x again: nothing past the bar's end — only the corruption diamond |
| P3 | Живучесть on page 2 (21–40) | pips at 25 / 30 / 35 / 40 at the quarter marks of the bar; no stock pip | **pass** (3rd build) | build 1 (hook on `W_Attribute_C:UpdateView`): X right, stock pips Visible again — the game's `UpdatePipIcons` runs after it; build 2 (hook on the native `AttributeEntry:UpdatePipIcons`): collapsed at the hook, Visible again one second later — the one-callback native hook was a PRE-hook, the game's pass ran after it (corrected 12:3x by a two-callback trace; the post callback since); a far SLOT X shrank the whole page to a speck (canvas measures children, frame `q4c.jpg`); build 3 — render translation off-screen: frame `q5c.jpg` 12:2x and `res_*` 12:2x: «21–40», bar 5/20, four pips at the quarters, no stock pip. Both live `W_Attributes` instances set to page 2 by the remote (the remote path stacks two — bug 84) |
| P4 | Проворство (no placeholders) on page 2 | no pips at all | **pass** | 12:2x frame `p4c.jpg`: «21–40», bar 6/20, no pip |
| P5 | Живучесть selected, the right column | the four placeholders listed after the stock perks with their names and text | partial | 11:44 frame `p5_col.jpg` (`W_AttributeInfo_C:SetAttributeInfo(<visible A_Vitality>)` by the remote): «Перк 25-го уровня (заглушка) — Место для будущего перка сборки…» stands after «Последний бой», cut by the column's bottom edge; 30 / 35 / 40 below the edge — the column TAKES them, does not show them (P6) |
| P6 | the right column longer than its box | a scroll (bar or wheel) reaches the last placeholder; nothing cut | pass (remote scroll) | 12:2x pak with `SB_KrinikPerkScroll` (`kit-attribute-info-scroll.py`): a thin bar shows on Живучесть and Сила; `PerkInfoBox:GetParent()` = `SB_KrinikPerkScroll`, `ScrollToEnd()` (offset of end 471) → frame `q6c.jpg`: «Перк 25 / 30 / 35 / 40-го уровня (заглушка)» all whole, 25 lit (the hero has Живучесть 25 — the game counts it as owned; no effect). A REAL wheel over the column — not run yet (needs the game in front) |
| P7 | the hero's stats with Живучесть 28 vs before the merge | unchanged (a placeholder has no effect): health max the same | not run | by construction: effects ask `HasPerk(<vanilla row>)` (game map, perks); no blueprint knows `Krinik_*` |
| C1 | control: the pak without `DT_KrinikPerks` (the merge logs «our table … not found») | no placeholder anywhere | pass (as P2 of the first run: the column without the scroll and the pips placed by the C++ — the control of steps 3–4) | 11:42–11:44 frames `p2_attrs.jpg`, `p5_col.jpg` |
| R | 1080p / 2K / 720p (`exec r.SetRes …f` by the remote), Живучесть on page 2 | the same layout as 4K | **pass** | 12:2x `res_1920x1080.jpg`, `res_2560x1440.jpg`, `res_1280x720.jpg`: arrows under, numbers over, the four pips at the quarters, the column's bar; the numbers keep the proportion of the owner-accepted 4K look |

| P6b | a REAL wheel over the right column (the player path, the game in front, owner-idle FREE) | the column scrolls | **pass** | 12:3x `mouse-seq` move 0.83/0.62 + wheel −3: frame `clk/f8.jpg` — «Жажда жизни» scrolled out, «Перк 25-го уровня (заглушка)» in view, the bar's thumb moved |

Dimensions: page 1 / page 2; an attribute with / without placeholders; the column fits / overflows; with / without the merge. Not covered: 1080p / 2K / 720p (after the look).
