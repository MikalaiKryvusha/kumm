# Bug 94 — Conan: items started in the hub finish INSTANTLY when the hub closes (KrinikConanUI · krinik_pause_in_menu craft speed-up)

**Status:** 🔧 fix pending the owner's play — reproduced by his path and fixed 11:11 (`rescale_queue`, cases C2f, C5 pass; report
`testcases/reports/2026-11-14_conan-craft-hub-close-rescale.md`) · **Severity:** S2 (a mechanic of ours breaks the game's economy in the owner's play) ·
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

## Recon on 3.1.0 — 2026-11-14 01:2x (remote, background, the owner's world)

- The hero's queue is `/Script/ConanSandbox.CraftingQueue` (an `ItemInventory`): 59 functions, among them `CraftItems`, `IsRunning`, `IsStarted`,
  `MulticastStartStop`, `SignalItemStartedCrafting`, `SignalItemCrafted`; NO function or property that reads or writes the current item's progress or
  start time; its numbers: `CraftTimeMultiplier` 1.0, `CraftResultMultiplier` 1.0, `MaterialUseMultiplier` 1.0, `m_ArtisanTimeToCraftModifier` 1.0,
  `ItemList` (the queued items). Probe `ConanExiles/_config/craft-queue-recon.lua` (read-only).
- `CraftItems` × 2 of recipe 14000 (`TimeToCraft` 10) with the hub CLOSED: right after the calls the queue's `ItemList` held 0 items — crafting is
  instant on this world on 3.1.0 too, so the hub's multiplier cannot be judged on it (probe `_config/craft-item-recon.lua`). `ServerSettings.ini` has no
  craft-time line (`ItemConvertionMultiplier=1`, `CraftingCostMultiplier=1`).
- The same remote path (`CraftItems`) timed a bandage at ≈ a minute on 2026-10-31 (the older save) — the instant crafting came with the owner's NEW test save
  of 2026-11-13; the mod notes name no craft-time edit (grep of `games/ConanExiles/mods/*.md`, 01:5x). So compare the two worlds first: the hero's perks / feats
  (`BP_PerkSystemComponent`), the world's settings rows in `Game_0.db`, an admin or a cheat flag left by a stand.
- Our stand tools send no craft cheat (grep of `ConanExiles/_config/*.{sh,lua,ps1,txt}` for instant / free craft, 02:0x). Hypothesis to read first: an admin
  flag of the owner's new save (the admin panel's cheats) — dump the boolean properties of `BasePlayerChar_C` and `FunCombat_PlayerController_C` whose names hold
  `Craft`, `Cheat`, `Free` or `Admin` (the `craft-queue-recon.lua` walk on those two classes), compare with a fresh new game.
- **Read 2026-11-14 02:14 (`_config/craft-cheat-flags.lua`, the owner's world, remote):** no admin or cheat flag on the hero or his controller —
  `m_IsAdmin=false`, `IsDemiGod=false`, `m_bCanBypassBpXpFromCheats=false`, `FreezeAllItems=false`, no craft-time property at all. The admin-flag hypothesis is
  REFUTED for these two classes; still open: the world's own settings (the game state / `Game_0.db` rows), the recipe 14000 itself on 3.1.0, a fresh new game.
- NEXT: find why the hero crafts instantly on this world (a world setting, a perk, a mod: list the hero's perks / feats and the mods that touch
  `RecipesTable` or the crafting component) — or test on a fresh new game; only then the hub case of hypothesis 2 by the player's path («Сделать 10»).

## Correction 2026-11-14 10:20 +03:00 — the «refuted» above is NOT evidence

The first hypothesis was «refuted» by remote `CraftItems` runs — and the same remote path crafts INSTANTLY on this world even with `CraftTimeMultiplier` 33.3
(3 × recipe 14000 done in 1.5 s), so it could neither confirm nor refute anything about item durations. The owner's own words describe the opposite of
«instant without the hub»: in the open hub the items were crafting at a visible pace, and only the CLOSE made them finish at once — exactly the first
hypothesis (an item started under multiplier 0.03 keeps a 0.03 · T game-time duration; after the close the world runs 33 × faster in real time). Also read
2026-11-14 10:0x: not creative mode (`IsOwnerInCreativeMode` false), no craft field on the PlayerState, CheatManager, GameState, GameMode; the world files
`Game_0` / `Game_1` carry no craft setting (`dw_settings` 8 rows each, no buffs, no craft property). NEXT: the player's path — the hub's crafting column,
the game's own «Сделать» / «Сделать 10» handlers (a direct call or a real key), the hub closed after one piece, the rest counted; and the remote path's
instant crafting explained separately (what the UI's handler passes that the bare `CraftItems` call does not).

## The player-path stand (2026-11-14 10:4x, live, the owner's world; probes in `KUMM/.work/arrows/`)

- The hub's crafting column is the native `CraftingManagerGUI` (`W_CraftingManagerGUI_C`): the buttons' handlers `SlotCraftButton` («Сделать», R),
  `SlotCraftAllButton` («Сделать много», Space), `SlotCraftTenButton` («Сделать 10», F), selection `m_CurrentlySelectedRecipe` (a `RecipeItem`, `TemplateID`),
  the queue `m_CraftingQueue`. The queue itself has ONE entry point, `CraftingQueue:CraftItems(Recipe)` — no count; «10» / «много» are the GUI's own loops.
- A recipe is selected by a REAL click on its icon (`mouse-seq.ps1`, the first click after bringing the game forward may only focus — click twice, then read
  `m_CurrentlySelectedRecipe` by the remote before pressing a key). R crafted one twine 14174 in the open hub at a normal pace (count 5 → 4).
- **The hub closes by `CraftingGUI_C:TryCloseWindow()`** (dilation and the multiplier back to 1.0 at once); real Esc sent by `mouse-seq` did not close it
  (dilation stayed 0.03), `ActivateModule(Inventory, false)` neither (EXP-0520).
- Counting made items: `ItemInventory:GetNumberOfItemsByTemplate(id)` on `BackpackInventory` / `ShortcutBarInventory` (`bow-count.lua`, it also gives the bow's
  ingredients: 10012, 12001, 14174 × 7 per bow). `CraftingQueue.ItemList:GetArrayNum()` is NOT the queue's length (it read 1 with an empty queue on screen).
- NEXT (when the PC is free — owner-presence refused at 10:4x): the bow 51401 selected (checked), F → 3 bows in the hub, 2 s, `TryCloseWindow`, count the bows
  every ~0.5 s: all three within a second of the close = the bug reproduced by the player's path.

## REPRODUCED by the player's path — 2026-11-14 10:56 +03:00 (TC `testcases/TC_conan_craft_hub_close_2026-11-14.md` C2)

Bows 51401 (ingredients for 10 given by the stand), the bow selected by a real click and «Сделать 10» by a real F in the same input sequence: in the open hub
the first bow took ≈ 2.5 s (a normal pace — the multiplier 0.03 compensates the world's 0.03); the hub closed by `TryCloseWindow`; within ≈ 2 s the other NINE bows
were done (≈ 22 s expected). So every item of the batch — not only the one in progress — carries the hub's 0.03 factor past the close: the duration is fixed
before the item's own start (at the batch's enqueue, or the batch is one entry). The 2026-11-13 «read at the item's start» measurement came from the
confounded remote path (section «Correction») and does not hold for the GUI's batch.

**The «instant without the hub» mystery — closed 11:18:** `CraftingQueue:CraftItems(RecipeManager:GetItemByTemplateID(51401, 0))` called by the remote crafts INSTANTLY
in any state — even in the open hub (3 calls → backpack 35 → 38 at once, the queue empty). It is a property of that call path (no queue entry is made), not of
the owner's world; the GUI's batch («Сделать 10») makes real entries and runs at the recipe's time. The world comparison `Game_0` / `Game_1` is not needed.

## The queue's own data and the fix — 2026-11-14 11:04 +03:00

- The queue's entries are `RecipeItem`s in `CraftingQueue.ItemList` (empty slots — null refs). «Сделать 10» → slot 1 the bow in progress + slot 2 a stack
  (int stat 1 = 9). Float stats (`GameItem.HasFloatStat / GetFloatStat / SetFloatStat(statID, Value, Replicate)`): **16 — the duration in game seconds** (the game
  reads it every tick: set just above the elapsed, the bow finished in ≈ 1.5 s; it is kept for the whole batch — the next bow inherited an edited 16), **9 — the
  elapsed game seconds** of the item in progress (a written value sticks), **17 — the recipe's base duration** (3.0 s for the bow); 256+ ids mirror them.
- Levers ruled out: the hero's `CustomTimeDilation` 33.3 with the multiplier 1.0 — the bow crept at the world's 0.03 (the queue runs on world time, not the
  hero's tick); there is no progress API on the queue.
- **Fix** (`krinik_pause_in_menu.lua` `hero_craft_multiplier`): on every change of the multiplier (a menu opens or closes) every entry's stats 16 and 9 are
  multiplied by new / old before the new multiplier is set — the share done is kept, so a batch started in the hub goes on at the normal pace after the close,
  and an item started before the hub goes on at its real-time pace inside it. Cases C2-fixed and C5 (an item queued before the hub) of the TC; judge round pending.

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
