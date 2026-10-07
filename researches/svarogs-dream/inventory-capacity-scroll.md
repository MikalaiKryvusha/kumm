# Recon — Svarog's Dream: inventory capacity ×2 with a scroll bar (ideas/07 p. 31)

> **Created:** 2026-10-07 · **Parent:** ideas/07 p. 31 (`[OWNER]` «расширить инвентарь по числу ячеек в 2 раза. добавить
> ему срокл бар справа, чтобы ячейки скролить можно было») · **Status:** recon done — read from decompiled code only
> (ilspycmd of `Assembly-CSharp.dll` and `Assembly-CSharp-firstpass.dll`, game v7.2.0), nothing run in the game ·
> **Outbound:** save-safety question and the plan to the owner

Sources. `ACS` = the Assembly-CSharp decompile in the session scratchpad (`scratchpad/acs/`); `FP` = the firstpass
decompile (`scratchpad/fp/`); `SD` = the mod repo `D:\work\ai_sandbox\SvarogsDream`. Every `file:line` below was read.
Anything not read is marked **inferred**. Facts about Unity UGUI itself (not in the game code) are marked **Unity**.

## TL;DR

- **Capacity lives in one place:** the length of the `InventorySlot[]` array `InventoryObject.Container.Slots` on the
  player's inventory ScriptableObject. No constant, no max, no "capacity" field. The code default is 24
  (`ACS/Inventory.cs:7`); the asset overrides it (50 per the UI, **inferred**: one slot GameObject per array entry).
- **Bags do not add capacity.** Bag1/Bag2 are two separate `InventoryObject`s with their own windows.
- **The save stores the whole array**, so its length is in the file (BinaryFormatter). **Growing** 50→100 is safe: the
  loader pads a shorter saved array. **Removing the mod** after slots 51–100 were used **silently drops those items** on
  the next load, and the next save makes the loss permanent. Mitigation: sorting packs items to the front, so "sort,
  then remove the mod" is safe while you hold ≤ 50 stacks.
- **UI:** `DynamicInterface` instantiates one slot per array entry and places it by hand with `localPosition`
  (no LayoutGroup). That suits a ScrollRect: move the slots into a Content rect under a RectMask2D viewport inside
  `InventoryScreen`, size Content to `rows × Y_SPACE`, and leave `InventoryScreen` itself where it is.
- **Main traps:** resize **before** `UserInterface.Initialize` runs, or the new slots get no `parent` and sorting
  **deletes their items**. The mouse wheel is swallowed by each slot's `EventTrigger`, so it must be forwarded.
  Never `SetActive(false)` a slot, because `OnSlotUpdate` would throw. Patch `Purse.cs`, which walks direct children.

## 1. Where the number of cells comes from

**The array is the capacity.**
- `InventoryObject : ScriptableObject` (`ACS/InventoryObject.cs:5-6`) holds `public Inventory Container = new Inventory();`
  (`:20`) and `GetSlots => Container.Slots` (`:22`).
- `Inventory` is `[Serializable]` with `public InventorySlot[] Slots = new InventorySlot[24];` (`ACS/Inventory.cs:7`).
  Unity serialization of the `.asset` overrides the initializer. The live size is the asset's array length (50,
  **inferred**, see §2).
- `EmptySlotCount` (`ACS/InventoryObject.cs:24-38`) and `GetEmptySlot()` (`:396-406`) count or scan `GetSlots.Length`.
  Neither has a constant.
- "Full" means **no empty slot**. `AddItem` (`:122-155`) returns `false` when `EmptySlotCount <= 0`, unless the item is
  stackable and a stack already exists (`:125-137`).
- I found no `MaxSlots`, `capacity`, `limit` or hard-coded 50 anywhere. A grep for numeric indices on the player
  inventory finds only equipment indices in `StaticInterface` (`ACS/GameUI/StaticInterface.cs:85-156`), and those
  belong to the equipment SO, not the bag.

**Whose array.** The player inventory is `PlayerEquipment.inventory` (`ACS/PlayerEquipment.cs:8`). All game code
reaches it as `WorldState.Instance.playerEquipment.inventory`. The only `DynamicInterface` referenced in code is
`StorageManager.playerInventory` (`ACS/StorageManager.cs:46`). Every other window is a `StaticInterface`
(`ACS/GameUI/*Interface.cs` class lines; `StorageManager.cs:40-50,72-78`).

**Bags are separate containers, not extra capacity.**
- `BagsManager.bag1Inventroy` / `bag2Inventroy` are separate `InventoryObject`s (`ACS/GameUI/BagsManager.cs:62,64`),
  saved separately (`ACS/GameSave/SaveFile.cs:300,302,534-535`) and loaded separately
  (`ACS/LoadSaveGameManager.cs:357-358`).
- An equipped bag swaps the stats panel for a bag panel (`BagsManager.cs:207-262`). It does not touch the main array.
- Bags join in only for routing: pickup can go to a bag first (`AddItemToSelectedInvantory`, `BagsManager.cs:134-161`,
  behind the `isItemsBag` / `isIngredientsBag` settings), weight is summed across all of them with bag modifiers
  (`:482-490`), and "move all to bag" exists (`:556-566`).
- **The real carrying limit is weight**, not cells: `HoldingTooMuch` triggers against `GetMaxWeightCarry()`
  (`ACS/GameUI/UserInterface.cs:203-219`). Doubling the cells does not double what the hero can carry without being
  overloaded. Weight stays the governor.

## 2. How `DynamicInterface` creates and positions slots

`ACS/GameUI/DynamicInterface.cs` (61 lines, read in full):
- Serialized layout fields: `inventoryPrefab`, `X_START`, `Y_START`, `X_SPACE_BETWEEN_ITEM`, `NUMBER_OF_COLUMN`,
  `Y_SPACE_BETWEEN_ITEMS` (`:9-19`). They are public ints set in the scene. **Values not read**: get them at runtime.
- `CreateSlots()` (`:21-55`) loops `i < inventory.GetSlots.Length` (`:24`) and makes **one slot per array entry**.
  It instantiates the prefab under `base.transform` (`:26`), sets `RectTransform.localPosition = GetPosition(i)`
  (`:27`), wires six `EventTrigger` entries (PointerEnter/Exit, BeginDrag/EndDrag/Drag, PointerClick, `:28-51`), and
  links `GetSlots[i].slotDisplay = obj` and `slotsOnInterface.Add(obj, GetSlots[i])` (`:52-53`).
- `GetPosition(i)` = `(X_START + X_SPACE·(i % COLS), Y_START − Y_SPACE·(i / COLS), 0)` (`:57-60`). This is **manual
  placement with no GridLayoutGroup**. Slot 51+ lands naturally in rows 6–10 below today's grid, so the formula needs
  no change for 100.
- It runs from `UserInterface.Awake → Initialize()` (`ACS/GameUI/UserInterface.cs:40-47`). After `CreateSlots`,
  `Initialize` sets `GetSlots[i].parent = this` and hooks `onAfterUpdated += OnSlotUpdate` for every entry (`:49-54`),
  paints all slots (`:55-58`), hooks interface-level PointerEnter/Exit (`:60-67`), and disables itself if
  `isDisableOnAwake` (`:68-71`). The player `DynamicInterface` is initialized **only from Awake**. No other
  `Initialize()` call targets it (grep; the other callers are cooking, storage, trade and loot UIs).

Live geometry from the mod's own UI dump (`SD/_harness/dump.txt`, active objects only, `[xMin,yMin w×h]` in screen
px, format at `SD/src/KrinikDevHarness/Plugin.cs:876-884`):
- `InventoryScreen [2535,521 1039x478]`, `Img(-) ray=True`, `<DynamicInterface> <EventTrigger>` (`dump.txt:1`).
- Children: `SortingEnabler` (the Sort button, `[2514,408 166x64]`, **below** the grid, `dump.txt:2`), then exactly
  **50** `Slot Prefab(Clone)` at `scale=0,58`, each 107×107 px on screen, 10 columns (x 2527…3461), 5 rows
  (y 901…486). Each has `Button`, `EventTrigger`, `SlotMouseClickHandler`, a child `Image` (icon) and a `Text (TMP)`
  (count).
- So the grid box (x 2527–3568, y 486–1008) roughly matches `InventoryScreen`'s rect. The rect can serve as the
  visible window. There is **no free space on the right** for a scrollbar (grid right edge 3568 vs rect right edge
  3574): see §5.

## 3. Save / load — is the size stored, and what happens on growth or removal

**Storage format.** `SaveFile` is `[Serializable]` (`ACS/GameSave/SaveFile.cs:7`) and holds `public Inventory
inventoryContainer` (`:198`), assigned straight from the live SO (`:462`: `saveFile.inventoryContainer =
WorldState.Instance.playerEquipment.inventory.Container`). The writer is `SaveGame.Serializer = new
SaveGameBinarySerializer()` (`ACS/LoadSaveGameManager.cs:79`), which is `new BinaryFormatter().Serialize(stream, obj)`
(`FP/Plugins.SaveGame.Serializers/SaveGameBinarySerializer.cs:15`). The **whole `InventorySlot[]`, length included,
goes into the file**. Non-serialized: `parent`, `slotDisplay`, the two callbacks (`ACS/InventorySlot.cs:12-22`).
Serialized per slot: `AllowedItems`, `slotType`, `item`, `amount`, `quality`, `isTradedItem`.

**Load path.**
1. `GameHealthCleanup()` runs first (`LoadSaveGameManager.cs:269`, body `:578-584`). It calls `inventory.Clear()`,
   which resets every slot of the **live** array to an empty `Item` (`ACS/Inventory.cs:9-17`), then `RefreshItems()`.
   No item bleed between saves within one session.
2. `inventory.PopulateItemsAfterGameLoad(loadedSaveFile.inventoryContainer)` (`LoadSaveGameManager.cs:282`). The method
   (`ACS/InventoryObject.cs:735-755`):
   - if **live length > saved length** (`:742`), it `Array.Resize`s the *loaded* array up to the live length and fills
     the tail with the live (just cleared) slots (`:744-749`);
   - then it copies `j < GetSlots.Length` (the **live** length) from the saved array into the live slots via
     `UpdateSlot` (`:751-754`).
   - It **never changes the live array length.** The live SO size is set by code or asset, not by the save.

**Scenarios.**

| Scenario | What the code does | Result |
|---|---|---|
| Old 50-slot save, mod gives 100 live slots | `:742-749` pads the loaded array to 100 with empty slots | **Safe.** Items in 1–50, empty 51–100 |
| 100-slot save, mod present (100 live) | straight copy of 100 | Safe, **if the live array is already 100 before line 282 runs** (see Risk T1-b) |
| 100-slot save, **mod removed** (50 live) | no resize; loop copies `j < 50` only (`:751`) | Items in saved slots 51–100 are **silently ignored**. Nothing is logged and nothing is dropped. The next save (`SaveFile.cs:462`) writes 50 slots, so **the loss becomes permanent** |
| Same, but the player never saves after loading | the file on disk still has 100 slots | Recoverable by reinstalling the mod and reloading that file |

- Backups exist but rotate: `backup-{name}-{0..2}` are written at most every 1200 s (`LoadSaveGameManager.cs:62-77,137`).
  They hold the 100-slot data only until they rotate.
- **Built-in mitigation:** every sort mode (`BagsManager.SortItems`, `ACS/GameUI/BagsManager.cs:602-652`) reads all
  stacks, `RemoveItem()`s every slot, and re-adds them in order with `AddItemById` (e.g. `SortByWeight :654-676`). That
  **packs items into slots 1…k from the front**. So "press Sort, then remove the mod" loses nothing while the stacks
  fit in 50.

## 4. Other code that assumes the inventory size

Size-agnostic: everything loops `GetSlots.Length` or calls `AddItem` / `GetEmptySlot`.
- Pickup and rewards: `AddOrDropItem` (`ACS/InventoryObject.cs:94-106`) drops on the ground when full.
  `ForceAddItem` / `ForceAddItemWithQuality` (`:58-92`) **evict slot 0** to the ground when full (unchanged, just rarer).
  The routing through bags is in `BagsManager.cs:134-161`.
- Two-handed swap checks use `inventory.GetEmptySlot() == null` (`InventoryObject.cs:675,686,698,709`). `UnequipItem`
  uses `GetEmptySlot` (`:720-732`).
- Sorting (`BagsManager.cs:602-930`), move to/from bags (`:544-566`), weight (`InventoryObject.cs:191-259`), gold value,
  find/count/remove helpers (`:167-406`), auto-eat (`ACS/AutoEatFoodManager.cs:16-29`), "store all" into a chest
  (`ACS/GameUI/StaticInterface.cs:344-363`), "sell all from bag" (`ACS/GameUI/StaticTradeInterface.cs:140-147`).
- Chests, traders, loot, the Abyss and crafting stations are **`StaticInterface`s with a fixed `GameObject[] slots`**
  (`StaticInterface.cs:13`). `CreateSlots` indexes `slots[i]` for `i < inventory.GetSlots.Length` (`:46-48`). They
  show **their own** containers, swapped in at open time (`ACS/StorageManager.cs:313-378,4199-4200,4771-4772`). They
  **do not** use `DynamicInterface` and are untouched by this mod.
- During trade or storage the player's grid is the same `InventoryScreen`: `OpenTrade` / `OpenStorage` →
  `OpenCloseBag()` (`ACS/InventoryEnabler.cs:55-61,175-181,247-256`). The scroll works there too.
- Drop logic is keyed by **name**: `UtilMethods.GetInterfaceType` maps `"InventoryScreen"` → `Inventory`
  (`ACS/UtilMethods.cs:315`). **Do not rename `InventoryScreen`.**

**One real size coupling: the death corpse** (`ACS/UnderworldManager.cs`).
- On a character's death the inventory is flattened into `SimplifiedItem[Container.Slots.Length]`
  (`GetSimplifiedInventory :608-633`, used at `:550`). Length follows the live size, so that part is fine; the
  persisted array is `PlayerLootBody.inventoryIds` (`ACS/PlayerLootBody.cs:11`), saved via `SaveFile.cs:260,508`.
- When the body spawns, the items go into `Instantiate(tempInventory)` with `AddItemById` (`:748-758`). Then the gold,
  food, backup weapons, bags, rings and potions are added to the **same** container (`:789-840`).
- `AddItem` returns `false` when the clone is full (`InventoryObject.cs:125-137`), and that return value is ignored, so
  **overflow is lost silently**. The corpse window is a `StaticInterface` (`playerLootBodyUI`, `StorageManager.cs:44,
  340-341`), with a fixed `slots` array sized to `tempInventory` (**inferred**).
- `tempInventory`'s length is in the asset (**not read**). With 100 bag slots, a death can now lose items that a
  50-slot bag could never have held.

## 5. Safest way to double capacity and add the scroll bar

### 5a. Capacity (data)

**Where to hook.** Use a **Harmony prefix on `DynamicInterface.CreateSlots`** (`DynamicInterface.cs:21`), filtered to
`__instance.gameObject.name == "InventoryScreen"`. Don't filter by type, because the bag screens' types are not
confirmed. Inside the prefix call `EnsureCapacity(__instance.inventory, Target)`:
- if `Container.Slots.Length < Target`, `Array.Resize` the array and fill each new entry with `new InventorySlot()`;
- copy `AllowedItems` / `slotType` from slot 0, so the new slots behave exactly like the old ones
  (`ACS/InventorySlot.cs:49-52`: the ctor gives `Id = -1`; `ACS/Item.cs:12-16`).

The prefix runs before `CreateSlots`'s loop and before `Initialize` sets `parent` and hooks the callbacks
(`UserInterface.cs:47-58`). So the game itself builds 100 slot objects, sets `parent` on all 100 and wires all 100.
**No UI code needs duplicating.**

**Second guard.** Add a prefix on `InventoryObject.PopulateItemsAfterGameLoad` (`InventoryObject.cs:735`) for the
player SO:
- if `newContainer.Slots.Length > GetSlots.Length`, the save has more slots than live. Log it loudly, and either grow
  (only if the UI is not built yet) or keep the overflow aside.
- This closes the order-of-init question (Risk T1-b). If the slot GameObjects already exist, never grow the array
  without also building the matching slot GameObjects (Risk T1-a).

**Shrink policy.** Never shrink. If config `Capacity` is lowered, keep `max(config, occupied-tail)`.

**Optional uninstall helper.** A hotkey or button "pack for uninstall" runs the game's own sort, then reports how many
stacks still sit beyond slot 50.

The SO is an in-memory asset. A runtime resize lasts the whole session, through main menu → load (**inferred**: Unity
keeps a loaded SO instance alive while referenced, and nothing in the code re-reads it).

### 5b. Scroll (UI)

Keep `InventoryScreen` where it is. Its `transform.parent.parent` is the drag-ghost parent
(`CreateTempItem`, `UserInterface.cs:465`), and its name drives drop routing (`UtilMethods.cs:315`). Build *inside* it:

```
InventoryScreen (DynamicInterface, EventTrigger, Image ray=True)   ← untouched, stays the "interface"
├─ SortingEnabler                                                  ← untouched, outside the scroll
└─ KrinikScroll (RectTransform = grid box; ScrollRect: vertical only, Clamped, no inertia)
   ├─ Viewport (RectTransform, RectMask2D)
   │  └─ Content (RectTransform, pivot top; height = ceil(N/COLS)·Y_SPACE + margin)
   │     └─ Slot Prefab(Clone) × 100  ← reparented with worldPositionStays = true
   └─ Scrollbar (vertical, right edge) → ScrollRect.verticalScrollbar
```

1. Build it in a **postfix on `DynamicInterface.CreateSlots`**, after the 100 slots exist. Reparent every child whose
   name starts with `Slot Prefab` into `Content`.
   - Positions came from `localPosition` relative to `InventoryScreen` (`DynamicInterface.cs:27,59`), so
     `worldPositionStays` keeps the visible 5 rows exactly in place.
   - `slotsOnInterface` is a dictionary keyed by GameObject (`UserInterface.cs:28`), so reparenting changes nothing
     there.
2. **Content height** comes from the component's own fields: `rows = ceil(GetSlots.Length / NUMBER_OF_COLUMN)`,
   `height = rows × Y_SPACE_BETWEEN_ITEMS`. Viewport height = 5 rows, so exactly the old window shows.
   `scrollSensitivity` = one row per wheel notch.
3. **Scrollbar room.** The grid fills the rect almost to the right edge (§2). Options for the owner:
   - put the bar just outside the right edge, over the frame of the equipment panel;
   - or shrink slot scale 0.58 → about 0.55 and tighten `X_SPACE`.
   This is a taste call. Show variants as frames.
4. **Mouse wheel forwarding (required).** Every slot has an `EventTrigger` (`DynamicInterface.cs:28-51` via `AddEvent`,
   `UserInterface.cs:273-287`). **Unity:** `EventTrigger` implements `IScrollHandler`, so the wheel over a slot is
   consumed there and never bubbles to the ScrollRect. Add an `EventTriggerType.Scroll` entry to each slot that calls
   `scrollRect.OnScroll((PointerEventData)e)`. The same applies to `InventoryScreen`'s own `EventTrigger` if anything
   above the ScrollRect would see the wheel. The wheel over the gaps hits Content/Viewport and bubbles to the
   ScrollRect normally.
5. **Drag of items is unaffected.** The slot's `EventTrigger` takes BeginDrag/Drag/EndDrag first (**Unity**: the first
   handler in the hierarchy wins), so dragging an item never scrolls the list. Dragging an empty gap does scroll it,
   which is harmless.
   - Nice to have: while `PlayerController.isDraggingItem` (`UserInterface.cs:454`), auto-scroll when the pointer sits
     in a band at the top or bottom of the viewport, so an item can be dropped into a hidden row.
6. **Update the mod's own code.** `Purse.SlotsBottom` (`SD/src/KrinikUIRework/Purse.cs:214-226`) walks the **direct
   children** of `InventoryScreen` (`:219-220`) and takes the lowest slot. After reparenting it finds none. Without
   the mask it would find row 10. Point it at the viewport's bottom edge instead.
   - Harness and testcase paths `…/InventoryScreen/Slot Prefab(Clone)#N` (PROJECT_HISTORY note) become
     `…/InventoryScreen/KrinikScroll/Viewport/Content/Slot Prefab(Clone)#N`.

## Risks (tiered)

**T1 — data loss or corruption (must be designed out)**
- **T1-a. Slots without `parent` lose items on sort.** If the array grows *after* `Initialize` (e.g. only in
  `PopulateItemsAfterGameLoad`), the new slots have `parent == null`.
  - Then `GetItemObject()` returns `null` (`ACS/InventorySlot.cs:32-37`).
  - Every sort collects only slots with `GetItemObject() != null`, then calls `RemoveItem()` on **all** slots
    (`BagsManager.cs:659-671`).
  - Result: **the items in those slots are deleted.** They are also invisible and skipped by auto-eat and selling.
  - Design rule: grow only in the `CreateSlots` prefix, or replicate `parent` + `onAfterUpdated` + slot GameObject for
    every new slot.
- **T1-b. Init order vs load.** If the save already has 100 slots but the live array is still 50 when
  `LoadSaveGameManager.cs:282` runs, slots 51–100 are dropped (§3).
  - Whether `InventoryScreen`'s `Awake` always precedes the load is **inferred, not proven**. The mod's notes say the
    inventory canvas is always active (`SD/src/KrinikUIRework/Hud.cs:245-247`).
  - The `PopulateItemsAfterGameLoad` guard prefix (§5a) makes this observable and safe.
- **T1-c. Mod removal after using slots 51–100**: silent permanent loss on the first save (§3). Mitigation: sort to
  pack, tell the owner in the mod's readme, optional "pack for uninstall" helper.
- **T1-d. Death corpse overflow.** `tempInventory` has a fixed asset size, and `AddItemById` overflow is ignored
  (`UnderworldManager.cs:748-758,789-840`). With more than its capacity in stacks, the dead character's corpse loses
  the remainder.
  - Fixing it means growing `tempInventory` **and** giving `playerLootBodyUI` more slot GameObjects. Its
    `StaticInterface.CreateSlots` would otherwise index past `slots[]` (`StaticInterface.cs:46-48`) and throw.
  - Or spill the overflow into the corpse's bag containers or onto the ground. Phase 2; first measure `tempInventory`'s
    length.

**T2 — breaks interaction (visible, fixable)**
- **Wheel swallowed** by the slots' `EventTrigger`s, so scrolling dies over the cells (§5b.4).
- **Never `SetActive(false)` a slot** (e.g. for manual paging). `OnSlotUpdate` calls
  `slot.slotDisplay.GetComponentInChildren<TextMeshProUGUI>()` (`UserInterface.cs:239,249`). **Unity:** with the
  default `includeInactive=false` that returns `null` on an inactive object, which means an NRE on every update of a
  hidden slot. Clip with RectMask2D instead.
- **Masked slots must not take hover.** **Unity:** `RectMask2D` filters raycasts outside its rect, so a hidden row
  cannot be hovered or dropped on. With the stencil `Mask` this holds too, but it costs a draw call per mask and TMP
  sub-meshes need care. Use RectMask2D.
- **Drop-to-ground.** `OnDragEnd` treats `MouseData.interfaceMouseIsOver == null` as Drop and throws the item on the
  ground (`UserInterface.cs:479,484-524`). `interfaceMouseIsOver` is set by PointerEnter/Exit on `InventoryScreen`
  itself (`:60-67,295-303`).
  - The scrollbar and viewport must be **descendants of `InventoryScreen`**. **Unity:** enter/exit is sent to the
    hovered object's ancestors, so `InventoryScreen` stays "entered". A bar placed outside it, e.g. on the equipment
    panel, makes "release over the scrollbar" throw the item on the ground.
  - If the bar has to sit visually outside the grid, still parent it under `InventoryScreen`.
- **`slotHoveredOver` lookups** `interfaceMouseIsOver.slotsOnInterface[slotHoveredOver]` (`UserInterface.cs:526-528`
  and five `Static*Interface` copies, e.g. `StaticTradeInterface.cs:69-71`). **Unity:** the input module re-raycasts
  every frame, so content moving under a still pointer updates hover. No new failure mode, but test a drop right after
  a wheel scroll.

**T3 — cosmetic or side effects**
- **Camera zoom on the wheel.** `CameraFollow.Update` zooms on `Mouse ScrollWheel` whenever
  `IsScrollZoomEnabled()` (`ACS/CameraFollow.cs:49-50`), which checks only `infoPanelEnabler` and the intro state
  (`ACS/UIHelpManager.cs:366-373`), not the inventory. **Inferred:** scrolling the bag would also zoom the camera.
  Postfix `IsScrollZoomEnabled` → `false` while the pointer is over the inventory.
- **Drag ghost order.** It is unchanged as long as `InventoryScreen` is not reparented (`UserInterface.cs:465`).
- **Tooltip** follows the mouse (`ACS/GameUI/ItemToolTip.cs:412-434`), so it is unaffected by scrolling.
- **More cells ≠ more carry.** Weight still caps (`UserInterface.cs:203-219`), which fits the owner's "nothing caps"
  vibe only halfway. Raising carry weight is a separate knob.
- **Harness paths, testcases and `Purse.cs`** change (§5b.6).

## Unknowns

1. **Live `Container.Slots.Length` of the player SO.** It is 50 per the dump (50 active slot clones, `dump.txt`).
   `SD/src/KrinikUIRework/Hud.cs:258` claims "InventoryScreen, 102 слота". That is unverified, perhaps a `findall`
   that also counted the Bag1/Bag2 screens' slot prefabs. Measure in-game:
   `WorldState.Instance.playerEquipment.inventory.GetSlots.Length` plus a child count of `InventoryScreen`, including
   inactive children.
2. **The values of `X_START`, `Y_START`, `X_SPACE_BETWEEN_ITEM`, `Y_SPACE_BETWEEN_ITEMS`, `NUMBER_OF_COLUMN`** and the
   slot prefab's anchors and pivot. They are scene data, not read. Read them at runtime before sizing Content.
3. **Does `InventoryScreen.Awake` always run before `LoadSaveGameManager` line 282 on every load path** (title → load,
   death → load, New Game+ `:158-167`)? It decides whether the T1-b guard is a fallback or a necessity.
4. **`UnderworldManager.tempInventory` length** and the corpse window's `slots[]` count (T1-d).
5. **The types of `Bag1Screen` / `Bag2Screen`** (Dynamic or Static). That is why the patch filters by object name, not
   by type.
6. **Whether the wheel really zooms the camera while the inventory is open** (T3). Check in game.
7. **Scrollbar placement and look** (inside the grid with smaller cells vs over the frame). This is the owner's taste.
   Bring frames of both.

## Recommended implementation (for the plan)

1. **Measure first** (harness, game closed right after): `GetSlots.Length`, the five layout fields, the
   `tempInventory` length, the bag screens' types, and the `InventoryScreen` child count including inactive children.
2. **Capacity:** a Harmony prefix on `DynamicInterface.CreateSlots` (only `InventoryScreen`). It grows
   `Container.Slots` to the config `Capacity` (default 100, never shrinks) with new `InventorySlot`s cloned from slot
   0's `AllowedItems` / `slotType`.
3. **Load guard:** a prefix on `InventoryObject.PopulateItemsAfterGameLoad` for the player SO. If the saved length is
   greater than the live length, log it and never truncate silently.
4. **Scroll:** a postfix on `CreateSlots` builds `KrinikScroll/Viewport(RectMask2D)/Content` under `InventoryScreen`,
   reparents the slot clones with `worldPositionStays`, sizes Content from `rows × Y_SPACE`, adds a vertical Scrollbar
   inside `InventoryScreen`'s subtree, and leaves `SortingEnabler` outside.
5. **Wheel:** add a `Scroll` entry on every slot's `EventTrigger` that forwards to `ScrollRect.OnScroll`. Suppress the
   camera zoom while the pointer is over the inventory. Optionally auto-scroll at the edges during an item drag.
6. **Fix the mod's dependants:** `Purse.SlotsBottom` uses the viewport bottom; update harness and testcase slot paths.
7. **Save safety:** document "Sort before removing the mod". Optionally add a "pack for uninstall" action that sorts and
   reports stacks still past slot 50. Corpse overflow (T1-d) is phase 2 after measurement.
8. **Verify by observation:** a 50-slot save loads into 100. Fill past 50, save, reload: the items survive. Sort keeps
   the count. Drag across the hidden boundary works. Drop on the scrollbar does not hit the ground. The wheel scrolls
   over the cells. Frames of the window go to the owner.
