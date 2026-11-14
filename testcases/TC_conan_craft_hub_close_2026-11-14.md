# TC — Conan: items crafted in the hub keep their normal time after the hub closes (bug 94)

> **Created:** 2026-11-14 · **Parent:** `bugs/94_conan_hub_craft_speedup_finishes_instantly_after_close.md` · **Status:** written 10:54, C1 run, C2 waits for a free PC ·
> **Outbound:** — (the owner's own play is the final check)

**Test basis:** `[OWNER]` 2026-11-13 09:46 «Ты их изготовление ускоряешь в ХАБЕ. Я закрываю хаб - и они МГНОВЕННО изготавляются» · 11:03 — on the «Снаряжение»
tab, the column «Создание предметов», buttons «Сделать» (R), «Сделать много» (Space), «Сделать 10» (F). The mechanism (bug 94): while a full-screen menu is
open `krinik_pause_in_menu` sets the world dilation 0.03 and the hero queue's `CraftTimeMultiplier` 0.03; an item's duration is fixed at its start.
**Stand:** the 3.1.0 game, the owner's world `Game_1`, machine lock «kumm»; the hub by `.work/arrows/open-tab.lua` (tab 0), closed by `CraftingGUI_C:TryCloseWindow()`;
a recipe selected by a REAL click (`mouse-seq.ps1`, twice; checked by `.work/arrows/craft-watch.lua` → `selected=<TemplateID>`), the craft key real (R / Space / F);
ingredients by `.work/arrows/bow-count.lua` (`give=N` bows), bows counted by `GetNumberOfItemsByTemplate(51401)` in the backpack and on the shortcut bar.
Real input only when `owner-idle.ps1` says FREE — and > 10 s after my own clicks (the hook cannot tell them apart).
**Dimensions covered:** one item (R) vs a batch (F «Сделать 10», Space «Сделать много») · the close mid-batch vs after it · control: the speed-up off
(`CRAFT_SPEEDUP = false` / the hub switch «Крафт в меню без замедления»). Not covered: crafting stations (the owner crafted in his own column).

| # | Case | Expected | Status | Observed |
|---|---|---|---|---|
| C1 | one short item by R in the open hub | crafted at a normal pace, the recipe count drops by one | **pass** | 10:4x twine 14174 by real R: craftable 5 → 4, a twine in the backpack, the queue empty on the frame |
| C2 | «Сделать 10» (F) on bows, the hub closed after ~2 s | the bows keep coming at their normal pace after the close (never all at once) — the owner's defect if all land within ~1 s | **fail — the defect REPRODUCED by the player's path** | 10:56 (os.clock stamps): click on the bow + real F in ONE `mouse-seq` sequence (an F sent alone did not reach the game); in the hub bow 1 took ≈ 2.5 s (bar 1 → 2 at t 506.4); `TryCloseWindow` at t 508.40; t 509.41 — bar 6, backpack 4 (+8); t 510.42 — backpack 5: the other NINE bows within ≈ 2 s of the close (≈ 9 × 2.5 s = 22 s expected). The whole batch kept the hub's 0.03 factor, not only the bow in progress. Earlier: F with ingredients for 3 — «Сделать 10» is disabled below 10 |
| C2f | after the fix (`rescale_queue`): C2 again | after the close the bows come one by one at ≈ 3 s (the bow's base duration, stat 17 = 3.0) | **pass** | 11:05 the hub closed at t 161.86; bows at t 163.4, 165.9, 169.0, 172.0, 175.1, 178.6 — one per ≈ 3 s; UE4SS «крафт героя: очередь переведена 0.03 → 1.0, записей 2» |
| C3 | «Сделать много» (Space) on bows, close after ~2 s | as C2 | not run | the same GUI batch path as F (one entry in progress + one stack) — covered by C2f's mechanism; left for the owner's play |
| C4 | control: the speed-up off, C2 again | in the hub the bows come 33 × slower in real time; after the close — the normal pace | not run | the defect's control is C2 itself (before the fix, the same steps: nine bows in ≈ 2 s) |
| E1 | the final version (judge round 3: the Esc menu keeps the multiplier): a batch, the hub closed, then the Esc menu, then out | after the close ≈ 3 s a bow; in the Esc menu the batch stands (a pause, no rescale); after it ≈ 3 s again | **pass** | 11:27 (game PID 7820): closed at t 159.94 → bows t 161.5, 162.5, 165.5; the Esc menu by `ActivateModule(FName('IngameMenu'))` t 167.06–176.19 (dilation 0.0001, multiplier stays 1.0) — no bow; out → t 177.7, 181.3; UE4SS «очередь переведена 0.03 → 1.0, записей 2, сбоев 0», no line for the Esc menu. A first try of this version with a separate scale variable FAILED (the hub taken for the Esc menu after a remote Esc cycle — bug 100 — left the batch at 0.0001, all ten at once) → the variable removed, the live multiplier is the one scale |
| C5 | a batch running when the hub REOPENS (1.0 → 0.03) | inside the hub the bows keep ≈ 3 s real time (without the rescale they would crawl ≈ 100 s each) | **pass** | 11:11 batch by real F, closed at t 512.89 (bows 26 → 27 at ≈ 3 s), reopened at t 518.46 (dilation 0.03): bows at t 519.5, 522.1, 525.1, 528.2 — ≈ 3 s each inside the hub; UE4SS: «0.03 → 1.0», «1.0 → 0.03», «0.03 → 1.0», each «записей 2» |
