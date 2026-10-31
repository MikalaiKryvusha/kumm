# Research — how Conan 3.0.1 mods register their own UI module windows
> **Created:** 2026-10-31 · **Parent:** plan 38 phase 0 (the click-dead Lua route → a kit window) · **Status:** recon done · **Outbound:** the route decision in plan 38

Read 2026-10-31 18:3x–19:10 from the 3.0.1 containers (`retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter <x> _paksview-3.0.1`), dumped by
`uaj tojson|exports` and `kismet-trace.py`; the kit binaries by a string scan; the game log `ConanSandbox/Saved/Logs/ConanSandbox.log` of the
13:51 launch. No game, no editor. Scratch: `D:\Temp\claude\d--work-ai-sandbox-KUMM\9c35b034-a131-4447-9b34-2afe486c283c\scratchpad\modui-recon\`
(dumps, `*.rows.txt`), scripts beside it in `…\scratchpad\modui-scripts\` (`dtrows.py` table rows, `rowcmp.py` rows side by side, `bpinfo.py` class,
imports and widget tree, `strs.py` strings of a binary). [seen] = read from an asset, binary or log this session; [inferred] = reasoned, not observed.

## 1. How a mod's module table reaches the game's registry

**A `ModController` blueprint merges it at mod mount, by `MergeDataTables(DT_UIModuleTable, <mod table>)` inside its `ModDataTableOperations`
override.** No row patch of the vanilla asset, no ini, no `modinfo.json` field.

- The native side: plugin `DreamworldMods` (`F:\CEUE5Devkit\UE4\Plugins\DreamworldMods`, `UnrealEditor-DreamworldMods.dll`): class `AModController`
  («Inherit from this class to have your own ModController. It provides a few new functions; MergeDataTables, RemoveDataTableRows and ClearDataTable»),
  event `ModDataTableOperations` («Used to perform DataTable modification operations»), `MergeDataTables(MergeIntoDataTable, ToBeAddedDataTable)`
  («Merge a datatable into another datatable which has the same row struct»), `MergeDataTablesWithControlTable` (+ `FDataTableMergeControlRow`),
  `RemoveDataTableRows`, `ClearDataTable`; a `PersistenceComponent` («makes sure the ModController actor gets saved and loaded»);
  `UModManager::AddActiveModControllerClass`, `IsValidModClass`, `AllowedModClassPath`. [seen]
- Discovery is by the mod's asset registry: the log shows `LogModManager: Loading asset registry state for mod '<Mod>'` for every mod, then
  `AddActiveModControllerClass: <class path>` for each `ModController` subclass found (69 mod classes in the 13:51 log; `PreLoad/` subfolder controllers
  are registered earlier, at frame 0), then `LogModController: … MergeDataTables - Found existing table entry for …DT_UIModuleTable… overwriting` lines.
  All of it at frame 211 — the main menu, before any world. `KrinikConanUI`'s registry is loaded too, but it has no controller today. [seen]
- **Hosav** — `/Game/Mods/UIMod_Hosav/ModController_UI_Hosav` (`ModController_UI_Hosav_C` super `ModController`), registered in the log.
  `ModDataTableOperations` (bytecode, 31 bytes): one `FinalCall MergeDataTables(DT_UIModuleTable, UIModuleTable_UIH)`. `UIModuleTable_UIH` (30 rows:
  `HosavUIsettings`, `HosavHUD`, `ColorPicker_*`, `HosavHUD_EnemyHealthbar`, `HosavSettingsButton` …) is the live one. `DT_UIModuleTable_HosavNew`
  (4 rows incl. `HosavMinimap`) is imported by NO controller — a dead leftover; its `HosavUISettings` only looks like a twin. [seen]
- **Damage Meter (Xevyr)** — `/Game/Mods/DamageNumber/BP_MC_DamageMeter` (super `ModController`), registered in the log. `ModDataTableOperations`:
  `MergeDataTables(DT_UIModuleTable, DN_DT_UIModule)` · `(CustomConsoleCommandsDataTable, DN_DT_ConsoleCommands)` · `(DT_UIModuleTable,
  Xev_DT_MI_UiModule)` · `(DT_UIModuleTable, XCS_DT_UIModule)` · `(XCS_DT_QuickPanelAPI, DN_DT_SettingsAPI)`. The shared Xevyr tables
  (`/Game/ModsShared/Xevyr_Shared/…`) are merged by every Xevyr mod — hence the repeated `XCS_Panel … overwriting` log lines. [seen]
- **Exiles Fishing** — `JaarFishing_ModController`: `MergeDataTables(DT_UIModuleTable, DT_Fishing_UIModule)` first, then nine item/recipe/feat/journey
  tables. [seen]
- Vanilla `DT_UIModuleTable` has 116 rows; the live table 255 — 139 rows come from mod tables (30 assets named `*UIModule*` sit in the mod containers,
  list in the scratch dump `uimod/`; not every one is merged — Hosav's twin is not). The merge is per field (EXP-0340). [seen]

## 2. A row: `UIModuleTableRow`

Every module table has `RowStruct = UIModuleTableRow` (native, `/Script/ConanSandbox`). Fields and the values of the settings windows [seen]:

| Field | `DN_UI_Settings` (Damage Meter) | `HosavUIsettings` | `ExilesFishingTuning` | vanilla `InventorySettingsPopup` |
|---|---|---|---|---|
| `WidgetClass` (SoftObjectProperty → class) | `/Game/Mods/DamageNumber/UI/DN_UI_SettingsWindow.DN_UI_SettingsWindow_C` | `W_ExampleWidget_User_C` | `W_EFT_Panel_C` | `W_InventorySettings_C` |
| `Category` (`EGUIModuleCategory`) | `Popup` | `Modal` | `Modal` | `Modal` |
| `FullscreenGUIAction` | `Hide` | `None` | `None` | `Close` |
| `ZOrder` | 70 | 41 | 100 | 40 |
| `CloseOnESC` | False | True | True | True |
| `CloseOnEndPlay` | False | False | True | True |
| `MustBeBasePlayerChar` | True | True | False | True |
| `NonBlockingLoad` | False | True | False | True |
| `bHiddenDuringVanityMode` | True | True | True | False |
| `ShowInPlayingState` | True | True | True | True |
| `ShowWhenDead` | False | False | False | True |
| `ShowSelect` / `ShowBack` (gamepad hints) | True / True | True / True | False / False | False / False |

The same in all four: `ToggleActionName None`, `BlocksToggleActions False`, `ToggleActionSound` empty, `CloseOnShortcutRelease False`,
`PreloadOnStartup False`, `IsPersistent False`, `bHiddenDuringEmotes False`, `bForceHideShortcutBar False`, `HiddenByPopups False`, `ForceHideModules []`,
`AutoshownInStates []`, `ShowIn{Startup,MainMenu,LoadingScreen,CharacterCreation}State False`, `ShowQuickMove False`, `OtherHotkeys []`,
`DisableShortcutWhenPlayerInputBlocked False`, `TieToBasePlayerCharInput False`. HUD rows differ by `Category HUD` + `AutoshownInStates [Playing]`
(`DN_UI_DmgWidget`). The soft class is loaded only on activation — that is why the fishing panel's classes appear after `ActivateModule` (game map). [inferred]

## 3. The window class and its minimal structure

- All three mod settings windows derive DIRECTLY from native `WindowRoot` (`/Script/ConanSandbox.WindowRoot`; the class export's super):
  `DN_UI_SettingsWindow_C`, `W_ExampleWidget_User_C`, `W_EFT_Panel_C`. The vanilla popup `W_InventorySettings_C` derives from native
  `InventorySettingsBase` (a WindowRoot subclass; it also imports `RootWidget`). [seen]
- Native `UWindowRoot` API (kit `UnrealEditor-ConanSandbox.dll`, `UI/Toolkit/WindowRoot.h`): `Open`, `Close(bool)`, `IsOpen`, `IsCloseAllowed`,
  `Enable/DisableClosing`, `Set/GetNeedMouseInput`, `Set/GetBlockMoveInput`, `Set/GetZOrder`, `OpenPopUpWindow(Modal)(BP)`, `GetGUIModule`,
  `NativeOnMouseButtonDown/Up`; `UGUIModuleController::ActivateModule(FName, bool, bool) → UWindowRoot*`; `UButtonBarWidgetBase::GetCloseButton` +
  `HandleCloseButtonClicked` (the vanilla bottom bar closes its window natively). [seen]
- **The mods' windows use plain UMG `Button`s with BP-graph handlers**, not FLX buttons, and no `KeyShortcutName`: Damage Meter `SaveButton`,
  `CancelButton`, `Btn_Defaults` (`BndEvt__…OnButtonClickedEvent` functions; closes by `GetWindowRoot` + `WindowRoot.Close`); Hosav `Button_Close`,
  `Button_Save` (Collapsed), `ActivateModule` import; fishing `Btn_Close` … (`CustomEvent_0…30` bound at `Construct`; `ClosePanel` =
  `GetGUIModuleController` → `ActivateModule('ExilesFishingTuning', False, False)`). Their tree is a `CanvasPanel` root → `Border` frame → rows;
  the fishing panel draws the game's `T_UI_GeneralWindow_Background` / `T_UI_GeneralWindow_Border`. [seen]
- The vanilla modal popup (the model for Esc): `W_InventorySettings` — `BackgroundBlur`, `PopupBackgroundImage`, `BannerBottom`, title `GeneralText_71`
  (`Container_Settings`), `PanelContent` (VerticalBox), `NavAnchor` (`W_TooltipOverlay_C`), buttons `WBP_ButtonBase_C`: `B_Close` **`KeyShortcutName
  Escape`**, `B_Apply` `GUINavInvoke`, `Setting_ShareContentsButton` `InventoryShortcut1`; their clicks are bound by the native base. [seen]
- So a kit window that is a WindowRoot subclass with its buttons in its OWN `WidgetTree` is exactly what the three mods ship; plain UMG Buttons there
  click (the fishing panel clicks live). [seen for the mods; for ours — inferred]

## 4. Our kit route — what is possible without C++

- (a) **A Widget Blueprint with parent `WindowRoot`** — yes: the three mods were cooked from the same kit generation (Hosav `devkitRevisionNumber`
  1002 = ours) with exactly that parent; the kit loads the `ConanSandbox` module, so the class is selectable. [seen for mods; inferred for Python:
  `unreal.WidgetBlueprintFactory` with `parent_class = unreal.WindowRoot`]
- (b) **A module table** — a DataTable with row struct `UIModuleTableRow` and one row; kit Python: `unreal.DataTableFactory` (+ `struct`) and
  `unreal.DataTableFunctionLibrary.fill_data_table_from_json_string|csv_string` (the latter used by exileforge, web-recon §4). [inferred]
- (c) **Registration** — a Blueprint with parent `ModController` whose `ModDataTableOperations` override calls `MergeDataTables(DT_UIModuleTable,
  DT_KrinikUIModule)`. This is a BP GRAPH (one node). Stock UE Python cannot create K2 nodes [inferred] → author it once in the kit GUI and save;
  later rebuilds stay headless (the asset already holds the graph). Fallback without a graph: Lua calls `MergeDataTables` on any live/default
  `ModController` object at startup — untested (when `GUIModuleController` reads the table is unknown). [inferred]
- **Asset paths:** new mod assets live in the kit at `Content/Mods/KrinikConanUI/Local/<X>` and cook to `/Game/Mods/KrinikConanUI/<X>`
  (`kit-buildmod.py file_to_package`; the built container holds `/Game/Mods/KrinikConanUI/T_KrinikFeedback` etc.) — inside the mod's own path, which
  `AModController::IsValidModClass` / `AllowedModClassPath` expects (exileforge's `LogModController: Invalid class` is the failure sign). [seen paths;
  inferred rule]
- **Smallest set:** three assets in `Local/` — `MC_KrinikConanUI` (ModController), `DT_KrinikUIModule` (1 row `KrinikModSettings`),
  `W_KrinikModSettings` (WindowRoot) — and three `FilesToCook=Mods/KrinikConanUI/Local/<name>.uasset` lines in `Local/CookInfo.ini` (+ the copy in
  `_unpacked/KrinikConanUI/kit/CookInfo.ini`). `modinfo.json`: nothing new (Hosav's has no table/controller field; `bRequiresLoadOnStartup` stays
  false — Hosav false too). `AssetRegistry.bin` is already written by `kit-buildmod.py` step 2 and is what discovery reads. [seen]

## 5. Recommended route for «Моды Krinik»

1. Kit Python script (new, beside `kit-conanui-edit.py`): create `Local/W_KrinikModSettings` (parent `WindowRoot`), build its tree by `unreal.new_object`
   + `add_child_*` (the method of `kit-conanui-edit.py` for `Btn_KrinikFeedback`): Canvas → frame (`T_UI_GeneralWindow_Border`/`_Background`, as the
   fishing panel) → title `GeneralText` → `ScrollBox` with sections (`WBP_Settings_Subheader`) and rows of the GAME's settings widgets
   (`WBP_Setting_Checkbox`, `WBP_ResetableEditableLabeledSlider`, `WBP_Setting_Dropdown`) → a vanilla `WBP_ButtonBar` at the bottom (its close
   button closes natively, Esc glyph included).
2. Same script: `Local/DT_KrinikUIModule`, row `KrinikModSettings` = the fishing row's values (`Category Modal`, `FullscreenGUIAction None`,
   `CloseOnESC True`, `CloseOnEndPlay True`, `ShowInPlayingState True`, `ZOrder` ≥ 100 so it sits over the hub) with `WidgetClass` →
   `/Game/Mods/KrinikConanUI/W_KrinikModSettings.W_KrinikModSettings_C`.
3. Kit GUI, once: `Local/MC_KrinikConanUI` (parent `ModController`), override `ModDataTableOperations` → `Merge Data Tables(DT_UIModuleTable,
   DT_KrinikUIModule)`; save. (If the window needs plain Buttons, the same session binds each `OnClicked` → an empty BP function
   `KrinikAction(Name)` that Lua hooks.)
4. `CookInfo.ini` + three lines; `kit-buildmod.py KrinikConanUI <out>`; check the pak by `mod-overrides.py` and `retoc to-legacy --filter
   /Mods/KrinikConanUI/` (`MSYS_NO_PATHCONV=1`) — the three packages must be there.
5. Acceptance in the log of the next launch: `AddActiveModControllerClass: /Game/Mods/KrinikConanUI/MC_KrinikConanUI.MC_KrinikConanUI_C`; live:
   `DT_UIModuleTable:ForEachRow` shows `KrinikModSettings`; `ActivateModule(FName('KrinikModSettings'), true, false)` opens the window over the hub.
6. Lua (`KrinikConanUI` section): open it from the drop-down; `NotifyOnNewObject` of the window class → fill values; change events by hooks on the
   vanilla rows' own handlers (`SettingsCheckboxWidgetBase:HandleCheckboxToggled`, the slider's `BndEvt__S_Value…OnFloatValueChanged` — the hook points
   of `vanilla-settings-widgets.md`); Esc — the existing `TryCloseWindow` path (0.11.0) or the bar.

**Verified 2026-10-31 19:2x–19:37** (`testcases/reports/2026-10-31_conan-hub-kit-window.md`) [seen]: step 3 is NOT needed — Lua's `MergeDataTables` on the
native `ModController` class default object (`/Script/DreamworldMods.Default__ModController`) merges our table at the main menu (117 → 118 rows; the mods'
controllers merge only at world load, 256 rows after); steps 1, 2, 4 done by `ConanExiles/_config/devkit/kit-krinik-modsettings.py` (the root panel comes
from `UMGEditorProjectSettings.DefaultRootWidget`; the row's `SettingName` cannot be set on a template — Lua writes the label); step 5's acceptance is
`ActivateModule` returning our window; the decisive risk below is retired — a real click on the kit-placed `WBP_Setting_Checkbox` fires
`HandleCheckboxToggled` and flips the state. The row's `CloseOnESC` does not close a mod Modal window (the pause section's Esc map does).

## 6. Risks

- The one BP graph (ModController override) cannot be scripted headless [inferred]; a kit GUI session is needed once — the machine lock applies.
- The vanilla settings rows inside our tree are kit-placed (outer = our `WidgetTree`), unlike the dead Lua-created ones; that their handlers then fire is
  the decisive unproven step — first test of the route. [inferred]
- `WBP_ButtonBar` close natively closes its window — by the native names only, not watched. [inferred]
- A ModController is a saved actor (`PersistenceComponent`): removing the mod later leaves a «Failed to load class … mod will be broken» warning, as
  `MrS_Level1000` does in today's log. [seen for MrS; inferred for us]
- Merge order: rows merge per field; a row name must be unique (`KrinikModSettings`) — the Xevyr `XCS_Panel` lines show how a shared name is
  overwritten by each merger. [seen]
- Server/coop: `ModDataTableOperations` timing on a dedicated server vs the client is not studied (single-player only here). [inferred]
