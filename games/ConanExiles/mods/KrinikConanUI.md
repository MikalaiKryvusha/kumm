# Mod notes — KrinikConanUI (ours: the build's interface)

> **Created:** 2026-10-30 · **Parent:** plan 36 W31 (the merge), the mod-notes lock (KAIF #186)
> **Status:** living notes — the ONE place for this mod's internals; the knowledge-hook refuses work on the mod until this file is read in the session
> **Outbound:** —

**What it is.** Two halves of one mod. The kit pak `Mods/KrinikConanUI.pak` overrides five vanilla widgets; the Lua folder
`ue4ss/Mods/KrinikConanUI` runs sections. Until 2026-10-30: KrinikUIFixes (pak + Lua), KrinikFpsCounter, KrinikHudOutline, KrinikPauseGameInMenu.

## Where things are

- Source: `ConanExiles/_unpacked/KrinikConanUI/` — `KrinikConanUI.pak` (built, git-ignored), `kit/` (copies of `modinfo.json`, `Local/CookInfo.ini`),
  `ue4ss/Scripts/main.lua` (loader) + one file per section.
- Kit: `F:\CEUE5Devkit\UE4\Content\Mods\KrinikConanUI` (`active.txt` — one active mod per kit). Rebuild: `UnrealEditor-Cmd … -run=PythonScript
  -Script=_config/devkit/kit-conanui-edit.py -EnablePlugins=PythonScriptPlugin -ModDevKit` (≈2.5 min) → `python -I -X utf8 _config/devkit/kit-buildmod.py
  KrinikConanUI <out>` (≈2.5 min) → copy into `_unpacked/KrinikConanUI`. Deploy: `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanUI`.
- Load order: before `KrinikConanGameplay` (that one stays last).

## Kit pak — vanilla widget overrides (`kit-conanui-edit.py`, report `kit-conanui-edit.json`)

| Widget | Edit | Why |
|---|---|---|
| `WBP_ContainerInfo` | `OverlaySlot_5` (corpse strip) padding L/R 120 (vanilla 20), Center; `OverlaySlot_3` (quick-loot window) Center, L 500 | the strip and the loot window in one overlay; the Lua section moves the strip Left while the window shows (bugs/64 items 32, 34, 35) |
| `W_QuickLootPanel` | grid padding 35, tips 20, «Забрать все» gap 20; take-all icons `HoldPromptVisibility` NEVER; labels «Забрать все (удерж.)» (2026-10-30, the owner 08:32) | one width on the quest edge; the tooltip rows sit in `WidgetSwitcherTooltips` (state 0 «Перейти · Q…» / state 1 «F Забрать · Q… · Esc Отмена», tree: `_config/devkit/kit-probe-quickloot.json`) — a switcher measures only the shown state, so a row wider than the grid resized the window (W10a); with «(удерж.)» both fit |
| `W_ItemIconTooltipView` | `Text_Content.AutoWrapText` false | the hover tooltip keeps one layout (bugs/64 item 17) |
| `W_AttributeInfoEntry_PerkView` | `PerkDescription` padding top/bottom 10 | perk descriptions ran into each other (bugs/64 item 46) |
| `W_ActionTutorial` (2026-10-30) | `Icon` and `PostText` slots VAlign Bottom, `Icon` padding bottom 1 (vanilla: all Center, `PreText` justify Right kept) | the corpse prompt on two lines (plan 36 W6) with the vanilla-override row «…ресурсы\nили нажмите {0}…»: line 2 «или нажмите [E], чтобы забрать предметы»; shared by EVERY action prompt — pad 1 keeps one-line prompts within 1 px at 4K (plate-edge measure: 1.92 px per unit; control C1 2026-10-30 19:41) |

**Kit trap (2026-10-30):** the kit cooks only the assets listed in `Local/CookInfo.ini` (`FilesToCook=` lines, copy in `kit/CookInfo.ini`). A newly
edited vanilla widget without its line is saved into the mod's Content and silently left out of the pak — check the built pak by
`python -I -X utf8 _config/mod-overrides.py <out.tsv> <pak>` (one `override` row per widget).

Live check of the pak: the remote reads `…WBP_ContainerInfo_C:WidgetTree.Overlay_Main.OverlaySlot_5` padding = 120.

## Lua sections (`ue4ss/Scripts/`, loaded by `main.lua` with `pcall(require)`, log prefix `[KrinikConanUI:<section>]`)

| Section | What | Hooks / events | Numbers |
|---|---|---|---|
| `krinik_ui_fixes` | corpse strip Left while the quick-loot window shows; button key glyph width capped at birth | post-hooks `WBP_ContainerInfo_C:SetObject`, `HandleInventoryChanged`, `HandleLootContainerInventoryChanged`, `QuickLootPanel:SlotItemAddedOrRemoved`; `NotifyOnNewObject(/Script/UMG.SizeBox)` inside `WBP_ButtonBase` | `MaxDesiredWidth` 42.67 on `SizeBoxPrimaryIcon`; recheck 50 ms |
| `krinik_fps_counter` | frames per second, top right over the minimap | `NotifyOnNewObject(W_NewHealthUI_C)` + 500 ms; loop 250 ms (`GetFrameCount` / real time) | font 16, outline 2, pos (−5, 5) |
| `krinik_hud_outline` | Hosav HUD text bold ×1.1 with a 1-pt outline; F1 under the folded damage meter; temperature colour | `NotifyOnNewObject(W_NewHealthUI_C)` + 500 ms and a 5 s second pass; `BPEnergyReceiver_C:EnergyReceived` | 51 TextBlocks; heat > 20 red with hysteresis |
| `krinik_pause_in_menu` | the world slows while a menu is open: inventory/hub 0.03 (×33 slower), Esc menu ≈0.0001; Esc closes mod windows; fishing tooltips laid out once; 0.14.0 (2026-10-30): the fishing difficulty captions on one line « Легко | Спокойно | Строже | Ваниль » (W18a) | `GUIModuleController:ActivateModule`, `CarouselWindow:Next/Prev/SetCarouselIndex`, `IsFullscreenGUIActive` poll 250 ms, Esc key bind | live 2026-10-30: inventory open 0.0300, closed 1.0 |
| `krinik_hud_blink` (W36, 2026-10-30) | food/water blink from 10 % (dim) to 0 % (full), weight from 90 % of max to 100 % | `NotifyOnNewObject(W_NewHealthUI_C)` → `FindFirstOf(W_SmoothHP_C)` once; poll 250 ms; `PlayAnimationTimeRange(NoFood/NoWater/OverEncumbered_Weight, 0, half × L, 0, PingPong, 0.30 × L, true)` | L = 0.25 … 1.0 in 10 steps; Hosav's own blink at the limit (see `UIMod_Hosav.md`) |

## Version

2026-10-30: `modinfo.json` version **3.0.1** (kit source, `kit/modinfo.json`, the built pak by `_config/devkit/set-pak-version.py`) — `[OWNER]` «все моды
Krinik... получают версию 3.0.1» · 2026-10-28 (chronicle). The pause-menu mod list (Simple Modlist) reads it — see `SimpleModlist.md`.

## Tests and runs

- `testcases/TC_conan_krinik_conan_ui_merge_2026-10-30.md` (U1–U8 pass), report `testcases/reports/2026-10-30_conan-krinik-conan-ui-merge.md`.
- Older cases of the parts: `TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md`, `TC_conan_loot_panel_hidden_and_hold_prompt_2026-10-28.md`.

## Open

- The FPS counter cannot be switched off alone since the merge (it had its own `enabled.txt`).
- The HUD blink section: tested 2026-10-30 (H1–H10, `testcases/reports/2026-10-30_conan-hud-blink-early.md`); the dim start 0.25 waits for the owner's eye;
  its cost per poll is unmeasured (os.clock 1 ms step). Trap paid there: `FindFirstOf(<widget class>)` returns the TEMPLATE in another widget's tree —
  take the live child from the event's HUD (`hud.W_SmoothHP`).
