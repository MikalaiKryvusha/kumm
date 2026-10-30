# Research — one «Настройки модов» button and one hub of mod settings in the game's style (epic W24, Conan 3.0.1)

> **Created:** 2026-10-30 · **Parent:** plan 36 W24 (folds W19–W23), the owner's order 2026-10-30 ≈15:00 «с начало это» (the epic first)
> **Status:** rung 1 — local recon and requirements written 15:0x; the industry sweep — `web-sweep.md` merged in §3 (15:1x)
> **Outbound:** forks to the owner → interview; the meta-plan `plans/38_EPIC_conan_mod_settings_hub.md`

## 1. Requirements — the owner's words (verbatim, plan 36 rows W19–W24)

- W24 ≈08:27: «Я бы вообще сделал одну кнопку в инвентаре: "Настройки модов"» · «пусть по ней открывается вверх дроп-даун список, в нём отдельные
  кнопки по разным модам» · «Настройка HUD · Настройка рыбалки · Моды Xevyr · Моды Krinik».
- ≈11:00: «настройки модов Криника можно собирать в одно окно со скролом, а разные моды просто разные подразделы этого одного скролящегося списка
  модов Krinik»; ≈11:01: «аналогично с модами Ксавьера поступим, не табами - а в скролящийся список с разделами по модам».
- W19 ≈08:12: «Окно Hosav мода его - переверстать в стиле окна настроек мода рыбалки, чтобы визуально было в одном стиле, а то у мода Окно Hosav окно
  настроек сделано наплевательски на коленке, не в стиле игры».
- W20 ≈08:16: «вот эти окна тоже переверстить в стиле игры красиво и закрывать по ESC» (Damage Meter, «Группа поблизости», «Настройки миникарты»,
  «Подсветка знаний и добычи»); two mod windows open at once over each other — a defect.
- W23 ≈08:25: sliders of the screen-edge vignette on hunger, thirst, low health in the Krinik window; «Крайнее левое положение ползунков - ВЫКЛ полный».
- W28 (blood): «время настраивается ползунком в модах Krinik».
- The build's frame (MASTER_PLAN): stable, mods not in conflict, no visible frame cost from mods; the 1 ms CPU budget for gameplay frames —
  opening windows is outside it («При открытии - насрать. Лаг допустим.»).

## 2. Local recon — what stands today (read 2026-10-30, sources named)

**Windows are UI modules.** `DT_UIModuleTable` (255 live rows) + mod tables (`UIModuleTable_UIH`, `DT_UIModuleTable_HosavNew`, …); open/close —
`GUIModuleController:ActivateModule(FName, open, …)`; windows are `WindowRoot` subclasses, `TryCloseWindow()` closes one; a new instance per open, find
the live one by `FindAllOf` + `IsOpen()` (game map, «Esc and windows over the hub»). Mod settings modules seen: `HosavUIsettings` (Hosav,
`W_ExampleWidget_User_C`), `ExilesFishingTuning` (fishing panel — the owner's style model), `DN_UI_Settings` (Damage Meter), `PrP_Settings` (Proximity
Party / «Группа поблизости»), `SM_UI_Settings` (Simple Minimap), `LLH_Settings` (Lore & Loot), `AMR_Settings`, `NightTerrorsSettings`, `EAA_*`,
`ModControlPanel`; `XCS_Panel` — the «Моды Xevyr» side panel on the «Снаряжение» tab. Some windows do not open by a bare `ActivateModule` and
`PRMainMenu` crashed the game that way (2026-10-26).

**Esc.** A Modal module closes on Esc only through its own button with `KeyShortcutName` «Escape»; our `KrinikConanUI:PauseGameInMenu` closes mod windows by
`TryCloseWindow` on Esc (0.11.0, 2026-10-30) — the route W20 asks for.

**The hub's bottom bar** — vanilla `WBP_ButtonBar` (`ButtonContainerLeft` / `ButtonContainerRight`). Two mod buttons stand there today: Hosav's
`W_UI_SettingsButton` (its own viewport layer — moved into the bar it STOPS clicking) and Exiles Fishing's `W_EFT_AdminButton` (grafted into
`ButtonContainerRight`; our section re-skins it with the vanilla `WBP_ButtonBase` look and keeps its click — the proven way to put a working button into
the bar with the native hover).

**The game's own settings widgets (3.0.1 containers, `retoc list`, 2026-10-30):** `/Game/UI/Widgets/MainMenu/Settings/` — `W_Settings`, `WBP_Settings_UI`,
`WBP_Setting_Checkbox`, `WBP_Setting_Dropdown`, `WBP_Setting_CustomButton`, `WBP_Setting_EditableText`, `WBP_Settings_Subheader`, `W_Settings_Gameplay|Video|
Audio|Control|Server`; `/Game/UI/Framework/` — `W_EditableLabeledSlider`, `WBP_ResetableEditableLabeledSlider`, `W_FCSlider`, `W_FCComboBoxString`,
`W_DropDownText`, `W_TooltipWidget`, `W_ListMenu` (`/Game/UI/Widgets/Guild/`), `W_FollowerContextMenu` (`/Game/UI/Widgets/Guild/Followers/`), `W_RadialMenu`;
styles `/Game/UI/Styling/Dropdowns/FS_Dropdown_Default`, `Sliders/FS_Slider_*`, `Buttons/FS_Button_Checkbox`. So the game's settings screen is built from
reusable widgets — a hub assembled from THEM looks like the game's own settings by construction.

**Mod settings storage.** Several mods keep settings in their own SaveGame objects (manifest `exportConfig`: `HosavUISave_New.sav`, `SimpleMinimap.sav`,
`ProximityParty.sav`, `DamageMeter.sav`); Hosav — `SaveUISettings_UIH` (`ServerInfo` …), Damage Meter — `DN_SG_SaveSettings` (`RestoreAnchor` …).
Our Krinik mods keep settings in Lua constants today — no in-game settings at all.

**Our tools and lessons that apply.** UMG from Lua: `StaticConstructObject` TextBlock (the FPS counter); `WidgetBlueprintLibrary:Create` of a mod widget
did NOT fire its click handler (2026-10-29); an Overlay built from Lua plus a brush copy in one remote call crashed the game (2026-10-30 00:22); widget
children by the BP variable, not `GetWidgetFromName` after detaching; `FindFirstOf` may return a TEMPLATE (EXP-0385). Native pak edits for other authors'
windows (house rule 8) — `patch-mod-asset.py` (`prop:`, `lit:`, `addprop:` rows), kit for new layout names (EXP-0338).

## 3. Industry sweep — `web-sweep.md` (done 2026-10-30 15:1x, ~60 sources)

Conan has NO shared mod settings hub (each mod brings its own entry; Hosav warns other UI mods can crash its settings). Every hub lineage moved
from code registration to DATA (MCM Helper / Fallout 4 `config.json`, BG3 `MCM_blueprint.json`, Satisfactory SML schema, Palworld schemas). The
closest analogues are Unreal ones: Palworld Native Mod Options and Mod Options Framework reuse the game's own option rows, one ini per mod (atomic
write), change signalled by event (polling banned), apply modes event / restart_mod / game_restart, the mod works without the hub. The ten rules
the industry converged on: registration is data · the hub owns the list, frame and storage · values outside the save by default · one small widget
set drawn in the game's style · when a change applies is declared · an escape hatch for mods that never integrated · only the hub touches the game's
menus · a mod works without the hub · bad values healed, not crashed on · mod list + pages, labels as translation keys. Pain: settings stuck in saves,
menus that fail to register, crashes from touching the game's menu, fights over buttons. Gap noted by the sweep: no hub pairs the native look with
mods that never integrated — for us a row that opens the mod's own window (`ActivateModule`).

A reference the owner gave 2026-10-30 ≈15:14 — BepInEx ConfigurationManager (https://github.com/BepInEx/BepInEx.ConfigurationManager): `[OWNER]` «там с UI не очень хорошо. мне приходилось улучшать» · «но сама идея настроек модов из одного места» · «не призываю копировать … просто тебе для понимания, как в других местах это удобно решают». Taken: the one-place idea and settings declared as data by each mod; not taken: its look.

## 4. Implications for this epic (local half; the industry half is added after the sweep)

1. **The look comes for free from the game's own settings widgets** — a section header (`WBP_Settings_Subheader`), a checkbox row, a dropdown row, a
   resettable slider row. The hub is an assembly of these, not a restyle of each author's window.
2. **Two kinds of entries.** (a) Mods whose settings we can read and write (their SaveGame object or our own Lua): their rows live INSIDE our scrolling
   windows («Моды Krinik», «Моды Xevyr»). (b) Mods whose window we keep (Hosav's HUD settings, the fishing panel): the drop-down opens their window,
   and the window is restyled natively (W19) — or replaced by rows when its save object is understood.
3. **Risk to retire first (a spike):** creating the game's `WBP_Setting_*` widgets from Lua and receiving their change events (the 2026-10-29 case of a
   created mod widget that never fired its handler is the warning). If this fails, the fallback is our own kit widget pak (the KrinikConanUI kit route).
4. **The drop-down** — the upward list: a vanilla list/context menu (`W_ListMenu`, `W_FollowerContextMenu`) or a column of `WBP_ButtonBase`; it replaces
   Hosav's and the fishing buttons in the bar (W24 supersedes W9's two buttons).

## 5. Open forks for the owner (to the interview)

- The final look of a settings row and of the drop-down — taste: a mock-up on our material first (`AGENT_GUIDE.md` → the taste class).
- Hosav's HUD settings — NOT a fork: the owner decided W19 (restyle in the fishing window's look) and W24 (the entry «Настройка HUD»); found by the archaeology search 15:1x.
