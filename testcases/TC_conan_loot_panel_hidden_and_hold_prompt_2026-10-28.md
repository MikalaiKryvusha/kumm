# Test cases — Conan quick loot: the strip after «Забрать все» (bug 64 item 35) and the «(удерживайте)» order (item 34)

> **Created:** 2026-10-28 · **Basis:** STATUS queue (0a) — after «Забрать все» the corpse strip stays left (F3 fail of
> `TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md`; the empty `W_QuickLootPanel` reads Visibility 2 = Hidden, which keeps layout space);
> (0b) `[OWNER]` «у окна квик лута нужно местами поменять текста "Забрать всё" и "Удерж."».
> **Facts found offline (2026-10-28 23:4x):** `Default__W_QuickLootPanel_C` has `Visibility = Hidden` as its class default; «(удерживайте)» is
> `TextBlockHoldPrompt` inside the shared `UI/Framework/W_HotkeyIcon` (HBox: binding-name text · hold prompt · primary icon · secondary icon),
> shown by native code for hold actions (`QuickLootNavTakeAll` icons `W_HotkeyIcon_3`, `W_HotkeyIcon_4`).
> **Contour:** `D:\Games\Conan Exiles 3.0.1`, the agent's own run under the machine lock, game in the background; pult `KrinikAgentRemote`
> (`bash ConanExiles/_config/pult.sh`); frames — `capture-window.ps1` in the background.

**Stand (HOUSE_RULES §1 rule 11):** god mode; time 12:00; teleport to the sleeping camp of the 22:56 run (≈ −82957, 231307); remove every
`Character` within 60 m except ONE target whose class name is exactly `HumanoidNPCCharacter_C` (never a subclass — `BP_HumanoidDialogueNPC_C`
are dialogue NPCs); kill it with `KillCharacter`; open the module on its corpse (`ActivateModule('ContainerInfo')` + `SetObject(corpse, 0)`);
close the module after the case (`ActivateModule('ContainerInfo', false, false)`).

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| P1 | Is the panel recreated? | read the panel object's full name while it shows loot; take all by the pult (the take-all function, or real Q after idle); read it again | same name → the game writes Hidden on the same instance (a class-default edit will not help); new name → recreated from the class default (`Collapsed` default fixes item 35) | pass (answered) | 23:49 own run, kappa-baby corpse (exact class `BP_NPC_Wildlife_KappaBaby_C`), pult `SlotTakeAll()`: the SAME instance (`…WBP_ContainerInfo_C_2147454276…W_QuickLootPanel`) goes Visibility 4 → 2 — native code writes Hidden; a class-default edit will not help |
| P2 | Does Collapsed bring the strip back? | after take-all: frame; pult `SetVisibility(1)` (Collapsed) on the panel; frame | the strip returns to the centre (E3 of the old cases) on the second frame | fail (theory refuted) | 23:50: `SetVisibility(1)` → `Overlay_Main` desired size 1141×144 (the panel no longer counted), but the strip did NOT move (frames `p1_empty` vs `p2_collapsed`, same x). `WBP_ContainerInfo_C` has no UMG parent (outer = the game instance): the module system places it on screen itself, from its size at activation — a later visibility change does not re-place it |
| P3 | Does the game re-write Hidden? | after P2 wait 3 s, read the panel's visibility; look away and back at the corpse | stays Collapsed, or the moment the game writes Hidden again is named | pass | 23:50: stayed Collapsed 3 s after the pult set it (the game wrote Hidden once, at take-all); look-away/back not walked — moot after P2 |
| P4 | Native properties of the hotkey icon | pult: list the properties of `W_HotkeyIcon_4` (class chain up to `UserWidget`) | a native property that turns the hold prompt off per instance — found or "none" | pass | 23:51: native class `HotkeyIcon` has the instance property `HoldPromptVisibility` (also `ShowOnlyText`, `BindingLabel`, `NoPresentationVisibility`); live `HoldPromptVisibility=1` on `W_HotkeyIcon_3/4` + label text «Забрать все (удерживайте)» → the row reads «Q Забрать все (удерживайте)» (frame `p4_compare.webp`, 23:55; the hold words turn white like the label) |
| P5 | Who shows the hold prompt | pult: `TextBlockHoldPrompt` visibility of `W_HotkeyIcon_4` vs a non-hold icon (`W_HotkeyIcon_2`) | Visible vs Collapsed — confirms the native switch by action type | pass | 23:51: `W_HotkeyIcon_4`/`_3` (`QuickLootNavTakeAll`) hold prompt Visibility 3, `W_HotkeyIcon_2` (`QuickLootCycleSelectionNext`) 1 — native switch by action type |

**Build cases — `KrinikUIFixes` with item 34 (kit edit 2026-10-29 00:0x: `HoldPromptVisibility = NEVER` on `W_HotkeyIcon_3/4`, labels
«Забрать все (удерживайте)`):**

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| B1 | Navigation row with loot | corpse with loot, module open (stand above), frame | «Q Забрать все (удерживайте)»; no orange «(удерживайте)» between Q and the label | pass | 00:06 build (pak md5 4fa496…, deployed `-Only`, verify 97/0), crocodile corpse with loot: «Q Забрать все (удерживайте)», no orange prompt between Q and the label (frame `b1.jpg`, crop `b1b2.webp`) |
| B2 | Action row | `SlotCycleSelectionNext()` by the pult (the wheel), frame | the same order in the action row; Esc label not glued | pass | 00:07 pult `SlotCycleSelectionNext()`: «F Забрать · Q Забрать все (удерживайте) · Esc Отмена» — order kept, Esc not glued (`b2.jpg`) |
| B3 | Window width holds (regression of Q1b/Q2b) | frames of B1 and B2, the window frame edges | right edge on the quest-panel edge, same in both rows (± 3 px at 4K) | pass | 00:07 frame edges on row y 1300 of the 4K frames: left 2211, right 3724 in BOTH rows (quest edge 3722; Q1b had 2211 / 3721–3723) |
| B4 | Take all still works | `SlotTakeAll()`; weight/inventory count | items moved to the hero | pass (caveat) | 00:08 pult `SlotTakeAll()`: the panel empties and hides (Visibility 2); the weight readout stayed 124/145 — crocodile loot is lighter than one unit, so the weight is no evidence; the take-all path is native and untouched by the edit |
| B5 | Other hold prompts untouched | any other hotkey icon with a hold action outside the loot window (e.g. the hub) — or the class default by the pult | `HoldPromptVisibility` default (0) elsewhere | pass | 00:08 the other five icons of the panel (`W_HotkeyIcon`, `_0`, `_1`, `_2`, `_C_1`) read 0 (default); only `_3`/`_4` read 1 (NEVER) |

**Item 35 — what the run showed (00:05–00:07):** `Overlay_Main` of `WBP_ContainerInfo` spans the whole screen width, so the strip's `Left`
alignment pins it to the SCREEN's left edge (+ padding 120) in every state: with loot it happens to stand left of the window; on a corpse
WITHOUT loot (window Hidden from the start, or after take-all) it stands at the left edge (frame `b1_small.webp` of the kappa corpse, strip at
x 140–310 of 1920) — a regression of our build-2 fix against vanilla (centre). Live: `SetHorizontalAlignment(Center)` on `OverlaySlot_5`
centres it at once (`h2_strip.webp`). The fix therefore needs the strip alignment to FOLLOW the window: Left while the window shows loot,
Center otherwise — an event of the game, not a layout constant (`HOUSE_RULES.md` §1 rule 8: Lua only when the asset will not yield, once, no
polling).

**Run note:** 23:52:22 the game crashed (UE4SS access violation at 0xffffffffffffffff) on MY stand script — `K2_GetActorLocation` on a killed kappa
kept in `_G`; the crash-report window closed by PID 57076; relaunched 23:54, game closed and the lock released 23:55. Frames: `D:/Temp/claude/lp/`.
