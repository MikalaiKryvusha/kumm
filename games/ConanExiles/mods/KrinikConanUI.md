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
  -Script=_config/devkit/kit-conanui-edit.py -EnablePlugins=PythonScriptPlugin -ModDevKit` (≈2.5 min; the hub window and table — the same with
  `kit-krinik-modsettings.py -NullRHI`, ≈1.5 min, twice) → `python -I -X utf8 _config/devkit/kit-buildmod.py
  KrinikConanUI <out>` (≈2.5 min) → copy into `_unpacked/KrinikConanUI`. Deploy: `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanUI`.
- Load order: before `KrinikConanGameplay` (that one stays last).

## Kit pak — vanilla widget overrides (`kit-conanui-edit.py`, report `kit-conanui-edit.json`)

| Widget | Edit | Why |
|---|---|---|
| `WBP_ContainerInfo` | `OverlaySlot_5` (corpse strip) padding L/R 120 (vanilla 20), Center; `OverlaySlot_3` (quick-loot window) Center, L 500; `Border_Underlay` brush side margins 0.40 + padding L/R 140 (both the Border's own and the slot's; vanilla 0 / 12), see below | the strip and the loot window in one overlay; the Lua section moves the strip Left while the window shows (bugs/64 items 32, 34, 35) |
| `W_QuickLootPanel` | grid padding 35, tips 20, «Забрать все» gap 20; take-all icons `HoldPromptVisibility` NEVER; labels «Забрать все (удерж.)» (2026-10-30, the owner 08:32) | one width on the quest edge; the tooltip rows sit in `WidgetSwitcherTooltips` (state 0 «Перейти · Q…» / state 1 «F Забрать · Q… · Esc Отмена», tree: `_config/devkit/kit-probe-quickloot.json`) — a switcher measures only the shown state, so a row wider than the grid resized the window (W10a); with «(удерж.)» both fit |
| `W_ItemIconTooltipView` | `Text_Content.AutoWrapText` false | the hover tooltip keeps one layout (bugs/64 item 17) |
| `W_AttributeInfoEntry_PerkView` | `PerkDescription` padding top/bottom 10 | perk descriptions ran into each other (bugs/64 item 46) |
| `W_MainMenu_MainMenu`, `W_IngameMenu` (2026-10-30, plan 36 W26) | our logo `SB_KrinikLogo/Img_KrinikLogo` (texture `Local/T_KrinikModpackLogo`, `import-logo-texture.py`) right of the game's logo in the main menu (421×159), left of it in the Esc menu (capped 400×152 — Simple Modlist's panel); `T_KrinikGameVersion` «3.0.1» and `T_KrinikPackVersion` «1.0.0» 18 pt on one line under both | the owner 22:39–22:51; geometry derives from the game's `Image_Logo` (MENUS block of `kit-conanui-edit.py`) |
| `W_MainMenu_MainMenu` backdrop (2026-10-31, bug 71) | placeholders `BinkMediaPlayer` `/Game/Movies/TitleScreen_<X>` and `BinkMediaTexture` `/Game/Movies/MediaTextures/TitleScreen_<X>_Tex` (6 each, saved in the kit's `Mods/KrinikConanUI/Content/Movies/`, NOT in CookInfo); the widget's `BackgroundMovies` / `BackgroundMovieTextures` set to them in vanilla order (`MENU_MOVIES`); main-menu logo smaller and further right: height share 0.92 → 0.78, gap 0.12 → 0.40 (427×162 at L 507) | the kit has no `/Game/Movies` — the override saved both arrays empty and the menu backdrop drew white («все белое», the owner 00:10); `[OWNER]` «наш логотим сделй меньше и правее» · 00:11. Before any new vanilla override: `kit-missing-refs.py` |
| `T_UI_ConanExiles_Enhanced_Logo` (2026-10-31, W26) | the GAME's logo texture overridden: 1024×512, NO mips, from the owner's 3× upscale (ultramix) with a clean bold ® redrawn top right (`_config/branding/make-game-logo.py`; master `conan-exiles-enhanced-logo-3x.webp`); imported by `import-logo-texture.py` with `KIT_TEX_DIR=/Game/UI/Textures/Logos` (Git Bash: `MSYS_NO_PATHCONV=1`) → kit `Mods/KrinikConanUI/Content/UI/Textures/Logos/` | the vanilla texture's mip chain blurred it in the menu (`[OWNER]` «почему оригинальное логи в меню такое мутное?» · 01:01); seen crisp in the main menu 2026-10-31 01:15 |
| `W_ActionTutorial` (2026-10-30) | `Icon` and `PostText` slots VAlign Bottom, `Icon` padding bottom 1 (vanilla: all Center, `PreText` justify Right kept) | the corpse prompt on two lines (plan 36 W6) with the vanilla-override row «…ресурсы\nили нажмите {0}…»: line 2 «или нажмите [E], чтобы забрать предметы»; shared by EVERY action prompt — pad 1 keeps one-line prompts within 1 px at 4K (plate-edge measure: 1.92 px per unit; control C1 2026-10-30 19:41) |

**The corpse strip's dark backing (probe `_config/devkit/kit-probe-underlay.py`, 2026-10-30 22:0x).** `Border_Underlay` (UBorder, brush colour alpha 0.8)
draws `MI_UI_InteractionBlossomFade` (parent `MI_UI_LevelUpBlossomFade`; `ProgressPercent` 1, `TransitionColor` (0.375, 0, 0, 0.5)) with the texture
`T_UI_InteractionUnderlay` 687×185: a SOFT horizontal gradient — alpha half of its peak only between 16 % and 81 % of the width, ≥ 90 % only between 40 % and
60 %; the scratched white lines are texture rows 3–5 and 179–181. Vanilla brush: `DrawAs=Box`, `ImageSize=(356,168)`, `Margin=(0, 0.3, 0, 0.3)` — no
side margins, so the whole gradient stretches over the strip's width and the line ends always sit in the fade, whatever the content padding
(padding 70 put them on ≈ 37 % darkness). Python does not show `ImageSize` X/Y — read the brush through `export_text()`.
**Our edit (2026-10-30 22:2x, KUMM report `2026-10-30_conan-corpse-strip-backing.md`):** brush side margins 0.40 — the fade keeps ≈ 142 units per side,
the dark middle follows the text; padding L/R 140 — the line ends on 88–98 % of the centre darkness. **Trap:** `UBorder` applies its OWN `Padding`
(vanilla 12/12/12/8), not the Content slot's field — a kit edit sets BOTH (`set_editor_property` bypasses the setter that keeps them in step).
Live tweak for a look: `<Content VerticalBox>.Slot:SetPadding({Left=…,Top=12.0,Right=…,Bottom=8.0})` by the remote. Stand: `_config/strip-open.sh <tag> [class]`
opens the strip by code (`MAXD_M=2000 … BP_PL_Crafting_CampFire_C` — a non-corpse strip in the oasis save, no chest within reach there).

## Kit pak — our own assets: the «Моды Krinik'а» settings hub (plan 38, skeleton 2026-10-31)

Built by `_config/devkit/kit-krinik-modsettings.py` (headless, `-NullRHI`; run it TWICE before a build — GUID trap; report `kit-krinik-modsettings.json`),
both listed in `Local/CookInfo.ini` (cook to `/Game/Mods/KrinikConanUI/<X>`):

| Asset | What | Numbers |
|---|---|---|
| `Local/W_KrinikModSettings` | Widget Blueprint, parent the native `WindowRoot` (as the Damage Meter, Hosav and fishing settings windows). Tree: `CanvasPanel_0` → `SB_KrinikWindow` (centred) → `OV_KrinikFrame` (`Img_KrinikBackground` `T_UI_GeneralWindow_Background`, `Img_KrinikBorder` `T_UI_GeneralWindow_Border` Box) → `VB_KrinikContent`: `Hdr_KrinikTitle` (`WBP_Settings_Subheader`, Label «Моды Krinik'а · Настройки»), `Chk_KrinikFps` (`WBP_Setting_Checkbox`), `Sp_KrinikFill`, `B_KrinikClose` (`WBP_ButtonBase`, label «Закрыть», `KeyShortcutName` Escape — the glyph only, no click handler) | 900 × 420 units, content padding 48 / 29; skeleton look |
| `Local/DT_KrinikUIModule` | module table, row struct `UIModuleTableRow`, ONE row `KrinikModSettings` = the fishing settings row (`Category Modal`, `FullscreenGUIAction None`, `CloseOnESC`, `CloseOnEndPlay`, `ShowInPlayingState`, `bHiddenDuringVanityMode`) with `WidgetClass` → `W_KrinikModSettings_C` | `ZOrder` 101 (over the fishing panel's 100) |

**How it reaches the game.** No ModController blueprint: the Lua section `krinik_mod_settings` calls `MergeDataTables(DT_UIModuleTable, DT_KrinikUIModule)` on the
native `ModController` class default object (`/Script/DreamworldMods.Default__ModController`) once, 500 ms after the main menu's birth — log `merge (main
menu): call ok; rows 117 -> 118` (11 ms). The mods' own controllers merge later, at world load (3 896 lines), and our row survives them: 256 rows in the world.
**Opening:** `FindFirstOf('GUIModuleController'):ActivateModule(FName('KrinikModSettings'), true, false)` (the remote today; phase 1 — the «Настройки модов»
drop-down). **Esc:** the row's `CloseOnESC` does NOT close a mod Modal window — the pause section's Esc map (`MOD_WINDOWS`) carries our module and closes it by
`TryCloseWindow`, the hub stays. **Proven 2026-10-31** (KUMM `testcases/reports/2026-10-31_conan-hub-kit-window.md`): a REAL mouse click on `Chk_KrinikFps`
fires the row's own `HandleCheckboxToggled` and flips `GetIsToggledOn` both ways — kit-placed game rows inside our window are live.

**Kit Python traps (2026-10-31).** (1) A new Widget Blueprint has NO root: Python reaches neither `WidgetTree.RootWidget` nor the factory's root class; set
`DefaultRootWidget = unreal.CanvasPanel` on `unreal.get_default_object(unreal.load_class(None, '/Script/UMGEditor.UMGEditorProjectSettings'))` before
`create_asset` (session only; the class is not wrapped as `unreal.UMGEditorProjectSettings`). (2) A settings row's `SettingName` is instance-only («cannot be edited
on templates») and `DisplayLabel` protected — the label is written by Lua into the live row's `TextSettingName` at activation. (3) UE4SS `LoadAsset` needs the
full object path `Pkg.Obj`; the package path returns nil.

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
| `krinik_pause_in_menu` | the world slows while a menu is open: inventory/hub 0.03 (×33 slower), Esc menu ≈0.0001; Esc closes mod windows; fishing tooltips laid out once; 0.14.0 (2026-10-30): the fishing difficulty captions on one line « Легко | Спокойно | Строже | Ваниль » (W18a) | `GUIModuleController:ActivateModule`, `CarouselWindow:Next/Prev/SetCarouselIndex`, `IsFullscreenGUIActive` poll 250 ms, Esc key bind | live 2026-10-30: inventory open 0.0300, closed 1.0; **hero craft at real speed ON since 2026-10-31** (`CRAFT_SPEEDUP = true`): the hero `CraftingQueue.CraftTimeMultiplier` = the dilation — it scales the DURATION and is read at an item START (report `2026-10-31_conan-craft-speed-in-inventory.md`) |
| `krinik_hud_blink` (W36, 2026-10-30) | food/water blink from 10 % (dim) to 0 % (full), weight from 90 % of max to 100 % | `NotifyOnNewObject(W_NewHealthUI_C)` → `FindFirstOf(W_SmoothHP_C)` once; poll 250 ms; `PlayAnimationTimeRange(NoFood/NoWater/OverEncumbered_Weight, 0, half × L, 0, PingPong, 0.30 × L, true)` | L = 0.25 … 1.0 in 10 steps; Hosav's own blink at the limit (see `UIMod_Hosav.md`) |

| `krinik_feedback` (W37, 2026-10-31) | the «ОТЗЫВ» plate (`Btn_KrinikFeedback` — a kit Button 195×40 under «1.0.0» in both menus, style normal `T_KrinikFeedback` / hovered+pressed `…Hover`; the first `Img_KrinikFeedback` stays COLLAPSED — GUID trap); a click runs `feedback/collect_report.ps1 -GameDir … -Feedback` by `start`: zip on the desktop, the game minimized, Explorer, an address box on top, then `mailto:` | menus remembered by `NotifyOnNewObject` (templates dropped) + `ExecuteInGameThreadWithDelay` 500 ms; `RegisterKeyBind(LEFT_MOUSE_BUTTON)` → `ExecuteInGameThread` → `IsVisible` + `IsHovered` (UserWidget mouse-event hooks never fire — EXP-0399) | debounce 5 s; the collector starts by `io.popen` (pipe closed 3 s later): a menu click costs 3–4 ms (was 63 with `os.execute`, 2026-10-31 07:46 / 07:53); a gameplay LMB check 0.009 ms (1000 checks by the remote, 07:54). The collector's address box is a Win32 `MessageBoxW` with `MB_TOPMOST` (a hidden TopMost WinForms owner did not keep it on top — it slid under VS Code, 07:47). Seen working in BOTH menus 2026-10-31 (report `2026-10-31_conan-feedback-esc-menu.md`); the plate sits `FEEDBACK_BELOW_VERSION` 44 under the version line (34 until the owner's «10 пикселей», 07:47). **Since 2026-10-31 11:15** the collector minimizes the game AT the click, shows a topmost DPI-aware waiting window «Собираем журналы игры для отзыва…» until the zip is ready (13–14 s; 22 s before, with the game full-screen and nothing on screen — the owner's 11:06 word), and a second collector exits at once (mutex `Local\KrinikConanFeedback`); trap: `start "" /min` makes the first shown window of the process minimized — restore it after `Show()` (report `2026-10-31_conan-feedback-minimize-first.md`) |

| `krinik_shout_fade` (W29, 2026-10-31) | enemy shouts (game subtitles) appear in place, fade in 0.2 s and out 0.2 s through a MIRROR line: the game line is born with `RenderOpacity` 0 and stays invisible; our own `SizeBox_KrinikShoutMirror` (built once per renderer by `StaticConstructObject` in its WidgetTree, added to `Overlay_0` with the container slot copied, width 1000) holds our own `W_SubtitleEntryView_C` (`WidgetBlueprintLibrary:Create`) that gets the line text (`FText(TextView:GetText():ToString())` — `GeneralText` still resolves the gender pattern) | `NotifyOnNewObject(SubtitleEntryView)`; `RegisterHook(W_SubtitleEntryView_C:SetTextActive)` set on the first born line; a 50 ms watch of the game line only while it lives (no removal event); opacity steps 15 ms only while fading | FADE_S 0.20, WATCH_MS 50; seen ≈ 10 frames in and out at one place (cases S6, S10; review folder 25) |

| `krinik_mod_settings` (plan 38, 2026-10-31) | the «Моды Krinik'а» settings hub skeleton: merges `DT_KrinikUIModule` into `DT_UIModuleTable` once; writes the row labels («Счётчик кадров в углу экрана») into our window's live rows when our module opens; logs toggles of settings checkboxes inside our window | `NotifyOnNewObject(W_MainMenu_MainMenu_C)` + 500 ms → `ModController` CDO `MergeDataTables`; post-hook `GUIModuleController:ActivateModule` (our row only) + 100 ms → `FindAllOf(W_KrinikModSettings_C)`; pre/post hooks `SettingsCheckboxWidgetBase:HandleCheckboxToggled` (our window only) | merge 11 ms once per start; no timer, no poll. The checkbox drives nothing yet — the FPS counter switch is phase 2 |

The pause section's Esc map (`krinik_pause_in_menu`, `MOD_WINDOWS`) carries `KrinikModSettings` → `W_KrinikModSettings_C` since 2026-10-31 (case K8b).

**The settings store (plan 38 phase 2, 20:37, `[NOT-TESTED]` in game).** `ue4ss/Scripts/krinik_settings.lua` — a module, not a section (required by the
sections): file `<game>\ConanSandbox\Saved\KrinikSettings.lua` (`return { ["key"] = value, … }`, sorted; only what the player changed — a default deletes
its key), read once at load, written only by the hub's «Сохранить»; `S.get(key, default)`, `S.on_change(fn(changed))`. Desk test (no game):
`lua _config/tests/test_krinik_settings.lua` from the pack root. Keys read by the sections: `ui_fps` (bool, `krinik_fps_counter` — the counter's switch,
Collapsed and not recounted when off; also at every HUD birth), `ui_blink_food` / `ui_blink_weight` (shares, `krinik_hud_blink`, read every poll),
`ui_menu_slow` (× slower, dilation = 1 / value, `krinik_pause_in_menu`, every poll), `ui_craft` (bool, the craft multiplier = 1.0 when off). The hub
section rewritten for mockup 5: ONE table `PAGES` (labels, «i», hints, ranges — the kit places widgets only), `LIVE = { ui = true }` (a mod's page shows
only when its values apply), a LMB key bind that returns on one boolean while the window is closed, a 50 ms chain for the «i» hover and the name
marquee only while the window is open. Kit tree by `kit-krinik-modsettings.py` (phase 2 block): `HB_KrinikHead`, `HB_KrinikBody` (`SC_KrinikMods` →
`Brd_KrinikMod_<page>` → `SC_KrinikModName_<page>` → `Txt_KrinikModName_<page>`; `WS_KrinikPages` → `VB_KrinikPage_<page>` → `HB_KrinikRow_<id>`:
`Txt_KrinikLbl_<id>`, `Brd_KrinikInfo_<id>`, `Txt_KrinikHint_<id>`, `SB_KrinikCtl_<id>` → `Sl_Krinik_<id>` / `Chk_Krinik_<id>` (FPS — the phase-0
`Chk_KrinikFps`)), `HB_KrinikFoot` (`B_KrinikReset`, `B_KrinikSave`, `B_KrinikSaveClose`), `Brd_KrinikTip` (canvas, collapsed). Kit trap paid: a
brush's `image_size` is a `DeprecateSlateVector2D` — Python's `Vector2D` does not convert; thin rules are Images inside a SizeBox.

**Mirror pair:** `ue4ss/feedback/collect_report.ps1` is a COPY of the pack's `_config/player-report/collect_report.ps1` (the Lua mod needs it inside the game
folder). Check: `cmp _config/player-report/collect_report.ps1 _unpacked/KrinikConanUI/ue4ss/feedback/collect_report.ps1` — edit the source, copy again.

## Version

`modinfo.json` version = the BUILD version **1.0.0** since 2026-10-31 15:5x (kit source, `kit/modinfo.json`, the built pak by `_config/devkit/set-pak-version.py`) —
`[OWNER]` «в сбоке моды Krinik ставим по версии сборки 1.0.0» · 2026-10-31 15:39, superseding 3.0.1 of 2026-10-28. The pause-menu mod list (Simple Modlist)
reads it — see `SimpleModlist.md`; seen «v1.0.0» 15:51 (report `testcases/reports/2026-10-31_conan-krinik-versions-1.0.0.md`).

## Tests and runs

- `testcases/TC_conan_krinik_conan_ui_merge_2026-10-30.md` (U1–U8 pass), report `testcases/reports/2026-10-30_conan-krinik-conan-ui-merge.md`.
- The settings hub skeleton: `testcases/TC_conan_hub_kit_window_2026-10-31.md` (K1–K9, K2b, K8b pass), report `testcases/reports/2026-10-31_conan-hub-kit-window.md`.
- Older cases of the parts: `TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md`, `TC_conan_loot_panel_hidden_and_hold_prompt_2026-10-28.md`.

## Open

- The FPS counter cannot be switched off alone since the merge (it had its own `enabled.txt`) — its row in the hub exists (skeleton), the store and the switch are plan 38 phase 2.
- The hub's «Закрыть» button does nothing on a click (a bare `WBP_ButtonBase`; the vanilla popups bind theirs natively) — Esc works through the pause section.
- The HUD blink section: tested 2026-10-30 (H1–H10, `testcases/reports/2026-10-30_conan-hud-blink-early.md`); the dim start 0.25 waits for the owner's eye;
  its cost per poll is unmeasured (os.clock 1 ms step). Trap paid there: `FindFirstOf(<widget class>)` returns the TEMPLATE in another widget's tree —
  take the live child from the event's HUD (`hud.W_SmoothHP`).
