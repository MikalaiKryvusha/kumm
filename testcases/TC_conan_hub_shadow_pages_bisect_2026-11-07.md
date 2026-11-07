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
| F1 | our W_Attributes alone | create the 9 pages (`extra-pages-switch.lua`), all HitTestInvisible at opacity 0; then our W_Attributes `SetRenderOpacity(1)` + `SetVisibility(4)` | alive 2 s later; the page seen on a frame | pass (alive, frame `f1.jpg` 06:28) — but the attributes read 0: our instance is not bound to the hero |
| F2 | each of the 9 pages alone | as F1 for every index 1–9, the previous one hidden first | alive after each | **fail → cause found:** the first touch of all refs crashed (06:29:10); one of our pages had been destroyed (stats window, census 06:35:16) — a stale raw pointer |
| G1 | our FeatWindow → our W_Attributes, no switch | F1 stand, our FeatWindow shown; then its opacity 0, W_Attributes opacity 1, next tick visibility 3 / 4 | alive | superseded by V1 (the crash was the stale ref, not the switch) |
| H1 | the same inside the native switch | v4 hook, switches FeatWindow → Attributes ×3 | alive after each | superseded by V1 |
| V1 | v5: pages by name + rebuild of lost ones, 27 native switches | `shadow-pages-v5.lua`, `NextCarouselWindow` ×18 then ×9 with a trace | alive after each; `err` 0 | pass — 27 switches, 0 crashes, 0 errors, `lost` 10 (= every stats visit) all rebuilt; frames `v5_1.jpg` (our Снаряжение: hotbar only — fail of completeness, not of the crash) and `v5_2.jpg` (our Таланты complete, hero data shown) |
