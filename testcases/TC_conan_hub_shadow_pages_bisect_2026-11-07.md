# Test cases — Conan hub controller: the shadow-pages crash bisect, steps (f)–(h)

**Created:** 2026-11-07 · **Under test:** our own page instances shown in place of the game's hub pages (plan 48, `hubswitch/shadow-pages-v4.lua`) ·
**Version/build:** Conan 3.0.1 build, pack `8779e5d`, the prototype by a remote `dofile` (NOT in the build)
**Test basis:** plan 48 «Shadow-pages prototype — crashes and the bisect»: v4 survives switch 1 (our FeatWindow shown) and crashes on switch 2 (our FeatWindow
hidden, our W_Attributes shown); the owner's design — our controller shows its own built pages in one frame (`[OWNER]` 2026-11-06 23:48, verbatim in plan 48).

## 1. Goal vector

Avoid: the game must not crash when our controller shows any of its 9 page instances. Find the ONE ingredient of v4 switch 2 that crashes, one step at a time,
with an alive-check after each (EXP-0474), so the controller is built on operations proven safe.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHEN our W_Attributes instance is shown alone (no switch), the game shall stay alive | `pult.sh "lua return 'a'"` exit 0 two seconds later |
| R2 | WHEN our FeatWindow is hidden and our W_Attributes shown (opacity + next-tick visibility) without a native switch, the game shall stay alive | same |
| R3 | WHEN the same runs inside the native switch FeatWindow → Attributes, the game shall stay alive | same, 3 switches |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered (risk named) |
|---|---|---|
| page shown | W_Attributes (the v4 crash page); then each of the 9 classes alone | pages of other mods' modules — not hub tabs |
| path | no switch · remote `NextCarouselWindow` | a real mouse click (`ButtonPressed`) — after the controller holds, plan 48 step 5 |
| game state | a clean background game, hub opened by `ActivateModule(CharacterInventory)` | a game where the pages were opened natively first — bisect 2 already covered it |

## 4. Stand

Background game (`launch-bg.ps1`), world entered by `enter-world-remote.sh`, 25 s after entry, the hub opened by the remote
(`GUIModuleController:ActivateModule(FName('CharacterInventory'), true, false)`); no enemies matter (the hub is open, the world paused by our pause section).
Every remote step through `P … || break` (`pult.sh` exit 4 = dead game, HOUSE_RULES 29).

## 5. Cases

| # | Case | Steps | Expected | Status · observation |
|---|---|---|---|---|
| F1 | our W_Attributes alone | create the 9 pages (`extra-pages-switch.lua`), all HitTestInvisible at opacity 0; then our W_Attributes `SetRenderOpacity(1)` + `SetVisibility(4)` | alive 2 s later; the page seen on a frame | pass (alive, frame `f1.jpg` 06:28; the attributes 0 with 77 points unspent are the save's real values — the game's page shows the same, `att_game.jpg` 06:5x) |
| F2 | each of the 9 pages alone | as F1 for every index 1–9, the previous one hidden first | alive after each | **fail → cause found:** the first touch of all refs crashed (06:29:10); one of our pages had been destroyed (stats window, census 06:35:16) — a stale raw pointer |
| G1 | our FeatWindow → our W_Attributes, no switch | F1 stand, our FeatWindow shown; then its opacity 0, W_Attributes opacity 1, next tick visibility 3 / 4 | alive | superseded by V1 (the crash was the stale ref, not the switch) |
| H1 | the same inside the native switch | v4 hook, switches FeatWindow → Attributes ×3 | alive after each | superseded by V1 |
| V7 | v7 mixed: ours for 7 tabs, the game's held until quiet for Снаряжение / Параметры | `shadow-pages-v7.lua`; `SetCarouselIndex` 1…8, then 0, 4, 0, 8, 3; a frame 1.5 s after each | alive; every frame shows the selected tab's page COMPLETE (ours: data of the hero; far tabs as the game draws them); `err` 0; holds end (no timeouts) | pass (07:03–07:05): 13 switches, 0 crashes, `err` 0, `lost` 0; holds 4 (Параметры 2 ticks, Снаряжение ≤ 4), timeouts 0; the 13 frames (sheet `v7_sheet.jpg`) each show exactly the selected tab's page, complete, no overlay — Снаряжение the game's with the mods' embeds («Настройки модов»), Спутники / Базар as the offline game draws them. Not yet seen: the frames BETWEEN click and switch (needs a 144 fps recording — the game in front) |
| T7 | per tick: exactly one page drawn through every switch (v7) | `tick-visibility-probe.lua` after v7; `SetCarouselIndex` 0,1,2,3,4,0,3,7,0,8,1 | 1 page per tick, 0 ticks with none or two | partial (07:08): 9 of 11 pass; Пар → Снар 4 ticks with no page, Снар → Пар 3 ticks — game page to game page |
| T8 | v8 afterimage closes the game → game gap | v8 + probe; 3,0,3,0,1,3,4,3,0,2,3,2 | the gap gone | fail (07:10): the gap stays and the second «Параметры» visit empties the hub — our second stats window is not tolerated; v8 dropped |
| L9 | v9: the hub closes on any tab → no page of ours over the world; reopens complete | `shadow-pages-v9.lua`; close by `ActivateModule(<tab module>, false)` on Снаряжение, Таланты, Карта; reopen by `ActivateModule(CharacterInventory, true)` | after close: the world only; after reopen: the right page complete; `err` 0 | pass (07:17–07:21) — 3 closes / 3 reopens, frames `v9_sheet.jpg`, `v9_sheet2.jpg`; the player's Esc/Tab not run (front only) |
| S1 | the section loads with the build | deploy `-Only KrinikConanUI`, background game, world entry | `UE4SS.log`: «section krinik_hub_controller: loaded», «HubController] взведён» | pass (07:35:13 both lines) |
| S2 | the section drives the hub on all 9 tabs | hub open by the remote; `SetCarouselIndex` 1…8, 0, 4, 0, 8, 3; per-tick probe; frames | as V7 / T7; `_G.__krinik_hub_ctl.errors` 0 | pass (07:36–07:37): the probe — exactly one page per tick on all 13 transitions (Хар → Пар held 2, Базар → Снар 4, Пут → Снар 4); errors 0 by the close line (the remote cannot read another mod's Lua state — EXP-0438); no direct Снар ↔ Пар click in this sequence |
| S3 | lazy pages + the minimap row on our «Карта» | after S2: `builds` 7, `helper` 1; frame of «Карта» — the bottom bar with «Новый маркер» / «Свои маркеры» | as stated | pass: «построено страниц 7 (худшая 53.0 мс)», «строка миникарты 1»; frame of our «Карта» with «Новый маркер» / «Свои маркеры» (`sec_sheet.jpg`) |
| S4 | close / reopen | close by the tab's module, reopen; the log line «хаб закрыт: …» | the world without our page after close; complete page after reopen; one log line per close | partial: close from «Параметры» (07:37:49) — the world only, one line «хаб закрыт: переключений 14, удержаний 5 (худшее 10 тиков, срывов 0), … потеряно 0, … обработчики: худший 91.0 мс, всего 655.0 мс, ошибок 0»; reopen not run in this game (v9 proved it as a prototype) |
| S5 | the section is idle while the hub is closed; the opening is found by a scan | pack `692460f`; open → 1,2,3,7,0 → close → open → 2,8,4,1 → close by `FeatWindow,false`; the probe | the reopened tab shows at once; one page per tick; the world only after each close; 0 errors | pass (07:46–07:48): probe runs 1–12 one page per tick, closes 2 (the world, no page of ours), «ошибок 0» ×2, handler worst 92 ms (a lazy page build, in the hub) |
| V1 | v5: pages by name + rebuild of lost ones, 27 native switches | `shadow-pages-v5.lua`, `NextCarouselWindow` ×18 then ×9 with a trace | alive after each; `err` 0 | pass — 27 switches, 0 crashes, 0 errors, `lost` 10 (= every stats visit) all rebuilt; frames `v5_1.jpg` (our Снаряжение: hotbar only — fail of completeness, not of the crash) and `v5_2.jpg` (our Таланты complete, hero data shown) |
