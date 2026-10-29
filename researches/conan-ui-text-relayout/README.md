# Research — Conan UI: text laid out once, then jumps (class A of bug 64 item 17)

> **Created:** 2026-10-29 · on the owner's word: `[OWNER]` «поп-апы при ховеве тоже мерцают. Открываются в одну строку, а затем становятся в две» ·
> «этот какой-то один блять общий класс проблем!» · «прыгающее это все» · 2026-10-29 18:0x
> **Parent:** bug 64 item 17 (class A), item 46
> **Status:** recon done 2026-10-29 18:41 (inventory below); step 1 done 2026-10-29 21:2x — the tooltip cause PROVEN (vanilla 405 px one-line box with
> two-line text → 274×165 next frame, 3 of 3; `AutoWrapText` False by the remote → 405×107 from the first frame, 3 of 3; cases T1–T3 of
> `testcases/TC_conan_item_tooltip_first_frame_wrap_2026-10-29.md`); step 2 done 2026-10-29 21:3x — `KrinikUIFixes` 1.2.0 (kit: `Text_Content.AutoWrapText` off), case T4 pass 3 of 3, the owner's eye 21:38 «поп-апы описания предметов не дёргаются». Same minute: «и модов иконки сразу отображаются» (class B fix of 18:37 accepted) · «книзу кнопки прыгают» (the bottom bar — next) · «я вижу, что ты в првильном направлении»
> **Outbound:** —

## The class

A UI element shows one layout in its first frame and another a few frames later. One member is confirmed, two are hypotheses:

| Element | What the owner sees | Cause | Evidence |
|---|---|---|---|
| Item hover tooltip (`UI/Inventory/W_ItemIconTooltipView` → `Text_Content`) | «Грубая повязка» opens in one line, then two | `AutoWrapText` True (`WrapTextAt` 800): auto-wrap takes its width from the PREVIOUS frame's layout, so the first frame has no wrap width — the known UMG behaviour | asset properties (`uaj tojson`), the owner's frame |
| «Хар-ки» perk descriptions (`UI/Inventory/Attributes/W_AttributeInfoEntry_PerkView`, bug 64 item 46) | «Берсерк» and «Кровожадный берсерк» overlap | the widget is in the auto-wrap list below; our Russian texts are longer than English — rows sized for one line get two. The row (`W_AtrributeInfoEntry`) stacks the primary and branched perk views with −2 paddings and holds the link icon at Top/Bottom 82 — layout in the game map (2026-10-29) | the agent's frame 18:36; cause NOT verified |
| Hub bottom bar (`WBP_ButtonBar` + `WBP_ButtonBase`) | buttons laid out wider for 3–6 frames, then shrink | NOT auto-wrap (`TxtLabel` has none). The hub re-creates the bar on every tab; `W_HotkeyIcon_C` are born ≈170 ms after the buttons (probe 2026-10-29 17:55:28) — hypothesis: the width changes when the key glyph arrives | birth probe; to verify by frames |

**Bottom bar jump — cause measured 2026-10-29 21:4x** (`testcases/TC_conan_hub_bottom_bar_width_jump_2026-10-29.md` B0–B2). Strip frames (`hover-watch.ps1 -PultCmd`, t.MaxFPS 60): on the first frame of a new tab «Закрыть» and «Показать контент из DLC» are ≈ 90 px (of 1920) wider, the gap between label and key larger; the next frame they shrink; «Разблокировать F» only shifts; the control (no switch) — no change. Per-frame probe (`barprobe.lua`, chain of one-shot game-thread calls): new bar buttons on their first laid-out frame — `HotkeyIcon` 128.0 wide (`SizeBoxPrimaryIcon` desired 128, `ImagePrimary` 128 = the glyph texture's own size), button 372.6 / 543.3; next frame `HotkeyIcon` 42.7, button 287.3 / 458.0 — +85.3 units = +178 px at 4K = the jump. The glyph sits in `ScaleBoxPrimaryIcon`, and a ScaleBox, like auto-wrap, scales by the PREVIOUS frame's geometry: a new widget has none, so the first frame shows the unscaled 128. `TextBlockBindingName` stays Collapsed throughout (the text-name hypothesis is refuted). `SizeBoxPrimaryIcon.WidthOverride` reads 32 but the settled width is 42.7 — the override is not active for these glyphs (to read in `W_HotkeyIcon`'s bytecode). Live read of the three contexts (21:5x): Q/E — `SizeBoxPrimaryIcon` width AND height override 48×48, ScaleBox Stretch 2 (ScaleToFit); journey — 24×24, Stretch 2; bottom-bar button — width override OFF, height override 32, Stretch 4 (ScaleToFitY), brush 128×96 → settled 32 × 128/96 = 42.7 (F: 96×96 → 32). Only the width-free context jumps. `W_HotkeyIcon` has NO blueprint functions — the class `HotkeyIcon` is native and sets size and stretch at run time, so an asset edit would be overwritten; its UFunctions: `SetInputActionName`, `SetIconSize`, `SetGamepadKey`, `SetShowOnlyGamepadIcon`, `SlotKeyBindingsChanged`, `SetFont`, `SetFontColor`. Next: a Lua fix in `KrinikUIFixes` (HOUSE_RULES §1.8 — the asset will not yield): a post-hook on `SetInputActionName` / `SetIconSize` (event, no polling) that, when the height override is on and the width override off, sets `WidthOverride` = height × brush width / brush height and turns it on — first check by the remote whether the brush is already set at that call; A-B cost measure; B3 on three tab pairs. Earlier candidate: a fixed size for the glyph box from the first frame (SizeBox height + width by the glyph's aspect, set where `W_HotkeyIcon` assigns the texture) — native, in `KrinikUIFixes`; one class for every hotkey glyph in the game.

## Inventory — widgets with `AutoWrapText` in their name table (2026-10-29, `retoc-5.8 to-legacy --filter "W_"` over `_paksview-3.0.1`, `grep -l AutoWrapText`)

Vanilla, 47 of 290 `W_` widgets under `/Game/UI/` (the `WBP_` prefix not swept yet):
`UI/Framework/W_SorceryRadial`, `W_TooltipWidget` · `UI/HUD/CharacterTransfer/W_CharacterCopy`, `W_CharacterUpload` · `UI/HUD/FloatingNames/W_CastingInfo`,
`W_FloatingName_Debug`, `W_NpcDebugWindow` · `UI/HUD/W_AdvancedGraphicsMode`, `W_InputBox`, `W_LoginQueue`, `W_StartLocationSelector`, `W_SubtitleEntryView` ·
`UI/Inventory/Attributes/W_AttributeInfoEntry_PerkView` · `UI/Inventory/W_BarkeeperListElement`, `W_BarkeeperTradePanel`, `W_CraftingManagerGUI`,
`W_CraftingStationInventoryView`, `W_DyeingStationInventoryView`, `W_GolemAttributeView`, `W_InventoryItemInfoPanel`, `W_ItemIconTooltipView`,
`W_SorceryStationInventoryView` · `UI/Widgets/Building/W_BuildingGhostText`, `W_ConstructionIngredient`, `W_Sign_3DText_Engraved` ·
`UI/Widgets/CharacterCreation/SubWidgets/W_CharacterImport`, `W_Physique`, `W_Race`, `W_Religion` · `UI/Widgets/CharacterStats/W_CharacterStatsBuffListEntry` ·
`UI/Widgets/Journey/W_ExilesJourneyInfoPanel`, `W_NewJourneyInfoPanel`, `W_NewJourneyReward`, `W_NewJourneyTracker` · `UI/Widgets/Log/W_PropertyDestructionLogEntry` ·
`UI/Widgets/MainMenu/Credits/W_CreditsEntry`, `Settings/W_NudityOption`, `W_PasswordDialog`, `W_PatchNotesEntryView`, `W_ServerInfo` · `UI/Widgets/Modals/W_RenameInput`,
`W_RequestHelpDialog`, `W_TimedMessageBox`, `W_WritableNote` · `UI/Widgets/Mods/W_ModDetailView` · `UI/Widgets/RadialMenus/W_CommandsRadialMenu`, `W_MainRadialMenu`.

Mods, 19: `EraOfTrials/UI/Religion/Core/EoT_W_ReligionUI` · `IdeaPoet_EditAppearance/Widgets/IdeaPoet_EdAp_W_UI_MainControls` · `JaarFishing/Tuning/W_EFT_Panel`,
`W_EFT_Tooltip` · `ModControlPanel/UI/W_MCP_DropDownText`, `W_MCP_YesNo` (and the same framework copied into No_Building_Placement_Restrictions,
PackRat_Helper, PvEPlusAmbush) · `No_Building_Placement_Restrictions/UI/Options/W_LBPR_Tab_About`, `UI/W_LBPRMenu` · `Simple_Minimap/UI/CustomMarker/SM_W_MarkerSearchEntry` ·
`ModsShared/AccessorySystem/UI/AccessorySlots/W_acs_AccessorySlot`, `Framework/W_acs_InventoryButton` · `ModsShared/Simple_Minimap/W_TooltipWidget_Copy` ·
`ModsShared/SudoExile/Common/UI/…/EA_W_Confirmation_Dialog`, `EA_W_Item_Lookup_Modal`, `EA_W_Recipe_Lookup_Modal`.

A name in the table means the widget has at least one text with the property set; it does not say the text is long enough to wrap.

## Plan (next session)

1. **Proof on the tooltip first** (one widget, the owner's own example): a frame pair of the hover — real mouse over an item, the game in front only
   for the shot (`wait-input-idle.ps1`, `mouse-seq.ps1`); `PrintWindow` does not capture hover tooltips, so the shot is a desktop capture. Then the
   same with `Text_Content.AutoWrapText` false set by the remote on the tooltip's birth (`NotifyOnNewObject`) — the control case.
2. **The fix by form:** in the kit mod `KrinikUIFixes` (`_config/devkit/kit-uifixes-edit.py`, the route that already overrides
   `WBP_ContainerInfo`): `AutoWrapText` false + a fixed `WrapTextAt` measured for the widget's box, for the widgets the player meets in the hub and HUD
   (tooltip, item info panel, perk view, crafting views, journey tracker); main-menu, debug and character-creation widgets — no.
3. **Mods' widgets** — the same property through `patch-mod-asset.py` (`prop:` rows) where the asset yields.
4. **The bottom bar** — frames of a tab return around the `W_HotkeyIcon` birth; if the glyph is the cause, the fix is a fixed width of the key slot.
5. Acceptance — per widget a frame pair (first frame / settled) with the same layout; the owner's eye on the tooltip and the bar.
