# Bug 108 — Esc does not close other mods' settings windows over the hub (EAA, fishing, Hosav and seven more)

> **GitHub issue:** [#41](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/41) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔴 OPEN — known regression of 0.9.1 by decision (bug 85): the Lua Esc key bind that closed them was the crash class
**Severity:** S3 by impact (a window closes by its own close button; no crash, no lost data) — kept as a document because a native fix per mod is real work
**Version/build:** Conan Exiles 3.1.1 build, KrinikConanUI 0.9.1 · **When/context:** 2026-11-18 19:40 — the owner: «еще баг на будущее по модам EAA: их окно ESC не закрывает. А должен закрывать.» · «Это про эту же историю, что ты сейчас делаешь»
**Fixing:** after the 0.9.1 release (not a release blocker — the owner's own word «на будущее»; critical = HOUSE_RULES 38)

## Symptom

A mod's settings window opened over the inventory hub (from the «Настройки модов» list): a press of Esc does nothing — the window stays, the hub stays.

## Repro

`ConanExiles/_config/post-key.ps1 -Key Escape` (a key posted into the game's window) after `ActivateModule(<module>, true)` over the open hub — run of
2026-11-18 19:4x (report `testcases/reports/2026-11-18_conan-keybinds-recon.md`): swallowed by `AMR_Settings`, `LLH_Settings`, `PrP_Settings`, `DN_UI_Settings`,
`EmberlightMasterConfig`, `EAA_Armorsettings`, `PIFC_Settings`, `ExilesFishingTuning`, `HosavUIsettings` (and our `KrinikModSettings` — fixed by its own kit event,
bug 85); `LBPRWidgetID` — Esc closes the HUB and leaves the LBPR window open. Close by themselves: `SM_UI_Settings`, `NightTerrorsSettings`.

## Root cause / what was tried

The windows have no FLX button with `KeyShortcutName` Escape (the vanilla popups' way) and swallow the key before the module controller's escape stack.
From Lua: a UE4SS key bind works but is the crash class of bug 85 (removed 2026-11-18); a Lua-made FLX button with the Escape shortcut inside the window never
presses (run 20:22, owner = GameInstance and owner = the window).

## Recon 2026-11-22 15:38–15:50 (RC4 scope; cases E0 of `testcases/TC_conan_rc4_scope_2026-11-22.md`)

How Esc reaches a window, read live by the remote (the hub and `EAA_Armorsettings` open):
1. Every active module has a node in `GUIModuleController.m_EscapeStack` (`EscapeStackNode`, `SignalActivated` bound to its `GUIModule:SlotESCPressed`). A posted Esc
   reaches the stack: the vanilla `InventorySettingsPopup` on top closes and the hub stays; with only the hub, the hub closes. With EAA on top nothing happens —
   EAA's node is there (`CloseOnESC` true, Category 3, the same flags as the vanilla popup), its window simply does not close.
2. The difference is in the window blueprint: `SM_UI_Settings_C` (closes by itself) has the input action event `InpActEvt_Escape_K2Node_InputActionEvent_0` — it listens
   for the game's «Escape» input action in its own input component; EAA (`BP_EAA_Armorscaling_C`, parent `WindowRoot` directly) has no such event. The vanilla popup's
   root is the native `InventorySettingsBase`.
3. EAA's close button is a plain UMG `Button` (`Button_Close`, no FLX `KeyShortcutName`); its click handler is `BndEvt__Button_81_K2Node_ComponentBoundEvent_63_
   OnButtonClickedEvent__DelegateSignature` (the original variable name stayed in the event name) — called directly by the remote it closes EAA and leaves the hub
   (15:47). A click handler of `OnButtonClickedEvent` takes no parameters, the signature of `FOnInputAction`.
4. Dead ends (do not repeat): UE4SS hooks on `/Script/UMG.UserWidget:OnPreviewKeyDown` and `/Script/ConanSandbox.GUIModule:SlotESCPressed` never fired (posted Esc
   in the background, a real Esc in front); the blueprint input events of the player controller and the hero whose names speak of escape / menu / any key do not fire
   while a mod window is on top. The game crashed at 15:48:25 (`EXCEPTION_ACCESS_VIOLATION reading 0xffffffffffffffff` inside UE4SS, 10 s after EAA opened, no remote
   command running); I first took it for one of these probe hooks, which was wrong: a fresh game with no probe crashed the same way, at the same UE4SS
   addresses, 9 s after EAA opened over the hub (15:51:26) — a crash of its own, filed separately.
5. **Correction 2026-11-22 19:31 (bug 118, proven):** the crashes that «met» the E0b bind attempts were CAUSED by them. `root:ListenForInputAction(FName("Escape"),
   0, true, { Object = root, FunctionName = FName(<handler>) })` from Lua crashes UE4SS natively 1.5 s after the call (`EXCEPTION_ACCESS_VIOLATION reading
   0xffffffffffffffff`, `pcall` does not catch it), reproduced twice, one run with KrinikConanCamera off. **E0b is a dead end:** a delegate parameter passed as a
   Lua table does not work in this UE4SS build. The Esc of mod windows stays with the native pak fix below.
7. **Recon 2026-11-22 20:44 — no Lua-hookable Esc event exists** (functions read live from the native classes): `WindowRoot` — Open, Close, IsOpen,
   EnableInput / DisableInput, SetNeedMouseInput, SetBlockMoveInput, the pop-up window calls, Send…Notifications, SignalOpened / SignalClosing delegates (no
   escape / back event); `GUIModule` — Toggle, SlotESCPressed, SlotActionShortcutPressed / Released, Activate, Enable, GetWindowRoot (the slots are native,
   a UE4SS hook on SlotESCPressed never fired — point 4); `EscapeStackNode` — the delegates SignalActivated and SignalActivatedBP only (binding to them from
   Lua needs a table delegate — the crash of point 5). With EAA focused the key does not even reach the stack (the hub does not close either): the focused
   window swallows Esc. So the close must be wired INSIDE each window's blueprint (a kit / pak patch per mod window — the plan below), not from Lua.
8. **Inventory 2026-11-22 20:51 (plan 61 step 1):** of the 13 windows of the list, Esc closes 3 (ours, Simple Minimap, Night Terrors); LBPR keeps its window
   and the hub behind it closes; 9 ignore Esc (fishing, AMR, LLH, Proximity Party, Damage Meter, Emberlight, EAA, Hosav, PIFC) — table in
   `plans/61_conan_esc_over_mod_windows.md`.
9. Candidate fix (native, the window's own close): when a mod window opens, `root:ListenForInputAction(FName("Escape"), IE_Pressed, true, {Object = root,
   FunctionName = <its close-button click handler>})` — the engine's own input-action binding, the same mechanism as `SM_UI_Settings`; Lua only sets it once per
   window birth, the key press itself runs in the engine. Delegate values as Lua tables `{Object, FunctionName}` — Re-UE4SS docs, DelegateProperty.

## Fix plan

Native, per mod (HOUSE_RULES rule 8): in each mod's window blueprint add (or bind) a cancel `WBP_ButtonBase` with `KeyShortcutName` Escape that closes its module
— by a kit/pak patch script next to the pak, re-applied after a mod update, the mod marked KRINIK MODIFIED; LBPR — find what closes the hub first.

## Decisions made without the owner

- `[AI]` 2026-11-18 20:3x: the Esc of these windows is dropped in 0.9.1 rather than kept on a key bind (crash > convenience; said to the owner in chat).

## Links

Bug 85 · `games/ConanExiles/mods/KrinikConanUI.md` «Clicks and Esc without key binds».
