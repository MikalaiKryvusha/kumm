# Mod notes — ModControlPanel (Workshop 3722388367)

> **Created:** 2026-11-01 · **Parent:** bug 64 item 47 (the filter reads English «All»); facts from the manifest entry (`ConanExiles/modpack.json`) and the game map
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** One settings window («Панель управления») for the mods that support it. It gives nothing by itself — it is the HOST other mods' settings live
in; it is in the build for LBPR, whose settings do not open without it (the owner's choice 2026-09-09). Load order: BEFORE LBPR (the host first).

## How the player uses it

- Shift+End (can be switched off in its options) or the console command `DataCmd ModControlPanel`; UI module `ModControlPanel` (game map, «Esc and windows over the hub»).
- A filter drop-down at the top right of the panel (case U3, frame 2026-10-31 12:20): its value read English «All» — bug 64 item 47.

## Assets and functions

| Asset | What | Our use |
|---|---|---|
| `ModControlPanel/MDC_MCP` | the mod controller: `SelectedCat` (string, default «All»), `UpdateSaveData` copies `BlurStrength`, `Cats`, `DefaultSelectedCat`, `EnableInput` into the save | default «All» → «Все» |
| `UI/W_CP` | the panel window: `ComboBoxString_748` — the category filter at the top right; functions `MakeCats`, `IsCatagoryEmpty`, `BuildWidgets(_Sorted)`, `AddWidget`, the combo's `OnSelectionChanged`; FOUR string constants «All» in the bytecode | `lit:All` + the combo's own `DefaultOptions` / `SelectedOption` |
| `UI/Settings/W_MCP_SettingsWidget` | the panel's settings page; TWO constants «All» | `lit:All` |
| `Settings/MCP_SaveData_v1`, `_v2` | the mod's SaveGame classes: `DefaultSelectedCat` (string, default «All»), `Cats`, `BlurStrength`, `Version` | default «All» → «Все» |
| other assets | `W_MCP_DropDownText`, `W_MCP_WidgetList`, `W_MCP_CatEntry`, `DAC_ControlPanel` — no «All» (raw `.uexp` scan) | — |

**How to look inside.** `patch-mod-asset.py extract ModControlPanel <Asset> <work>` → `<work>/<Asset>.json`. **Trap:** UAssetAPI 1.1.0 leaves several 5.8 functions of
`W_CP` as `RawExport` (`AddWidget`, `BuildWidgets`, `OnClick`, the combo's `OnSelectionChanged` …) — the JSON shows NO code there; count `0x1F "<text>" 0x00` in
the raw `.uexp` before calling a widget code-less (2026-11-01: the first «code-less combo» reading was wrong). Asset list: `repak unpack` the outer pak →
`retoc-5.8 list --path <…>-Windows.utoc`.

## Our edits (KRINIK MODIFIED, 2026-11-01)

1. «All» → «Все» everywhere at once (bug 64 item 47): `ModControlPanel__W_CP.tsv` (`lit:` + properties), `__W_MCP_SettingsWidget.tsv`, `__MDC_MCP.tsv`,
   `__MCP_SaveData_v1.tsv`, `__MCP_SaveData_v2.tsv` in `_config/localization/asset-strings/`; the build line — the manifest's `krinikModified`; pak in
   `_krinik-modified/3722388367`, original in `_patch-originals/ModControlPanel.pak`. Seen live 12:37 (report `2026-11-01_conan-dropdowns-all-topleft-ru.md`).

## Open

- A player whose old MCP save holds «All» sees a category that no longer matches until he picks «Все» once (not seen live — no such save here).
- The panel reads «Нет доступных виджетов» in this build (2026-10-31 and 2026-11-01). **Why (read 2026-11-03 22:4x):** LBPR v1.0.5 (Enhanced,
  Workshop 3755091710) does not plug into this panel at all — not one package of its pak names `ModControlPanel`, `DAC_ControlPanel`, `W_CP` or `MDC_MCP`
  (a name scan of its `.uheader` files in `Conan Exiles Mods/_text-extract-3.0.1/3755091710/x/`); it carries its OWN settings window `UI/W_LBPRMenu` (tabs
  Building · Placeables · Thralls · About) in its own UI module row `LBPRWidgetID` (`Framework/UIModule_PATCH`, Category Popup) and a console command
  `LBPRConfig` (`ConsoleCommand_PATCH`, `RequireAdmin`). The modinfo line «Please use ModControlPanel as required to access the LBPR settings» is stale.
  Live: `GUIModuleController:ActivateModule(FName('LBPRWidgetID'), true, false)` creates the live `W_LBPRMenu_C` and the module reads active (the window
  itself not seen on a background frame — a Popup needs the game in front; not looked at yet). So this panel is empty in the build; whether to drop it and
  open LBPR's window from «Настройки модов» is the owner's choice (STATUS).
