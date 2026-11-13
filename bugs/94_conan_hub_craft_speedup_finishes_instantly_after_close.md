# Bug 94 — Conan: items started in the hub finish INSTANTLY when the hub closes (KrinikConanUI · krinik_pause_in_menu craft speed-up)

**Status:** 🔴 OPEN — filed 2026-11-13 09:47, recon of the crafting queue next · **Severity:** S2 (a mechanic of ours breaks the game's economy in the owner's play) ·
**Version/build:** Conan Exiles 3.0.1 build, `KrinikConanUI/ue4ss/Scripts/krinik_pause_in_menu.lua` 0.17.0 · **When/context:** the owner's message 2026-11-13 09:46
(tossed mid-task, during the bow-sprint run) · **Fixing:** this session, right after case S1b of bug 93

## Goal vector

Maintain: crafting in the hero's own queue takes the game's real time both while a full-screen menu is open (the owner's design: the world slowed, crafting at
its normal speed) and after the menu closes — no item finishes faster than its normal duration. Acceptance: an item with a normal duration T started in the
open hub, the hub closed at 0.3·T real seconds → the item finishes at ≈ T real seconds (± 10 %), never at once; the same for a stack and for a queue of items.

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 09:46 «ещё баг есть с изголовлением вещей. Ты их изготовление ускоряешь в ХАБЕ. Я закрываю хаб - и они МГНОВЕННО изготавляются. Видимо,
твоё ускорение распространяется за пределы открытого хаба».

## How the speed-up works now (code read 2026-11-13)

`krinik_pause_in_menu.lua` `poll()` (:563–:584): a full-screen menu open → `SetGlobalTimeDilation(0.03)` (world slowed) and `hero_craft_multiplier(0.03)` →
`BasePlayerChar_C.CraftingQueue.CraftTimeMultiplier = 0.03`; closed → dilation 1.0 and the multiplier 1.0. The measured fact in the code's comment (:288–:291,
2026-10-31): the multiplier scales an item's DURATION and is read at the item's START — changing it mid-item changes nothing.

## Root cause — first hypothesis (from the code and that measured fact; REFUTED by the measurements below as an explanation of «all at once»)

An item that starts while the menu is open gets the duration 0.03·T in GAME time; under the 0.03 dilation that is T in real time — right. When the menu closes
the dilation returns to 1.0 but the started item keeps its 0.03·T game-time duration, so its remainder runs out about 33 times faster in real time: «instantly».
The multiplier restored to 1.0 helps only items that START after the close.

## Measurements 2026-11-13 (remote only, `ConanExiles/_config/craft-close-test.sh`, the owner's new test save)

- **The hypothesis above is REFUTED as stated.** Enqueue vs start: hub closed, `CraftTimeMultiplier = 33.3`, 3 × recipe 14000 queued in one remote chunk, the
  multiplier set back to 1.0 in the same chunk → all 3 done within 1.5 s: the multiplier is read when an item STARTS (on the next tick), not when it is queued.
  So after the close only the item in progress keeps the hub's factor; the queued rest starts at 1.0.
- On this save the hero's crafting is near-instant without the hub: 20 × twine 14174 (`TimeToCraft` 0.5) in ≤ 1.1 s, 10 × recipe 14000 (`TimeToCraft` 10, result
  53000 lands on the SHORTCUT BAR) in ≤ 1.5 s, with world dilation 1.0, `CraftTimeMultiplier` 1.0, `m_ArtisanTimeToCraftModifier` 1.0, no craft line in
  `ServerSettings.ini` — cause unknown (open). The 2026-10-31 run measured a bandage at ≈ a minute with the multiplier 1.0 in the open inventory.
- In the open hub 10 × 14000 were done in < 4 s and 30 × 14000 before the first count (≈ 1.3 s).
- Open question to the owner (chat 10:07, asked again 11:02): where he crafted (the hero's inventory or a station) and which item.
- **The owner's answer** — `[OWNER]` 2026-11-13 11:03 «вот тут изготавливал, на вкладке Снаряжение» with a frame: the hero's own crafting column «Создание предметов»
  on the «Снаряжение» tab, buttons «Сделать» (R), «Сделать много» (Space), «Сделать 10» (F), «Очистить очередь» (X), the queue row «Очередь создания».
- **Hypothesis 2 (to test next):** «Сделать 10» / «Сделать много» put ONE queue entry for many pieces; the multiplier read once at that entry's start applies to the
  whole batch, so the batch's rest finishes almost at once after the close. The agent's runs queued N separate entries (`CraftItems` × N), each reading the
  multiplier at its own start — why the burst did not show. Test by the owner's path: the hub open → a real F («Сделать 10») on a recipe of a few seconds → close
  after one piece → count the rest (`craft-close-test.sh` with the queue step replaced by the real key); then the fix (the batch rescaled on close, or the speed-up
  applied per piece).

## Fix plan

1. Recon (remote, no real input): the `CraftingQueue` fields that hold the current item's duration / progress / start time; whether they are writable.
2. Fix at the cause (HOUSE_RULES rule 24): the time an item started under the menu's multiplier is brought back to the normal scale at the moment the menu
   closes — or the speed-up is reworked so the queue's duration never depends on the menu state at the item's start.
3. Cases (new TC): an item started in the hub and finished after the close; a stack; a queue of two items; the switch «Крафт в меню без замедления» off.

## Decisions made without the owner

- none yet

## Links

`testcases/reports/2026-10-31_conan-craft-speed-in-inventory.md` (the original speed-up run) · `ConanExiles/_config/craft-measure.sh` (hero crafting by the remote) ·
plan 38 stage 2 (the hub switch `ui_craft`).
