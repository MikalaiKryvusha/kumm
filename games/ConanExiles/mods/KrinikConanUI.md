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
| `Local/W_KrinikModSettings` | Widget Blueprint, parent the native `WindowRoot` (as the Damage Meter, Hosav and fishing settings windows). Tree: `CanvasPanel_0` → `SB_KrinikWindow` (centred) → `OV_KrinikFrame` (`Img_KrinikBackground` `T_UI_GeneralWindow_Background`, `Img_KrinikBorder` `T_UI_GeneralWindow_Border` Box) → `VB_KrinikContent`: `Hdr_KrinikTitle` (`WBP_Settings_Subheader`, Label «Моды Krinik'а · Настройки»), `Chk_KrinikFps` (`WBP_Setting_Checkbox`), `Sp_KrinikFill`, `B_KrinikClose` (`WBP_ButtonBase`, label «Закрыть», `KeyShortcutName` Escape — the glyph only, no click handler) | skeleton 900 × 420 (phase 0); since the look pass of 2026-10-31 22:0x — width 1240, height by the tallest live page, Noto Sans (see «The look pass» below) |
| `Local/DT_KrinikUIModule` | module table, row struct `UIModuleTableRow`, ONE row `KrinikModSettings` = the fishing settings row (`Category Modal`, `FullscreenGUIAction None`, `CloseOnESC`, `CloseOnEndPlay`, `ShowInPlayingState`; `bHiddenDuringVanityMode` FALSE since 2026-10-31 22:0x, as the vanilla inventory settings popup) with `WidgetClass` → `W_KrinikModSettings_C` | `ZOrder` 101 (over the fishing panel's 100) |

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
| `krinik_hud_outline` | Hosav HUD text bold ×1.1 with a 1-pt outline; F1 under the folded damage meter; temperature colour | `NotifyOnNewObject(W_NewHealthUI_C)` + 500 ms and a 5 s second pass; `BPEnergyReceiver_C:EnergyReceived` | 51 TextBlocks; white in the norm (−20 … 20), smoothly white → red from 20 to 30 and white → blue from −20 to −30, full colour beyond (20 steps, the owner 2026-11-01 10:10 / 10:47; was ≥ 20 red / ≤ −20 green); only LIVE fields (`WidgetTree_<n>.` in the full name — the class templates were coloured instead until 2026-11-01) |
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
section rewritten for mockup 5: ONE table `PAGES` (labels, «i», hints, ranges — the kit places widgets only), `LIVE` (a mod's page shows
only when its values apply), a LMB key bind that returns on one boolean while the window is closed, a 50 ms chain for the «i» hover and the name
marquee only while the window is open. Kit tree by `kit-krinik-modsettings.py` (phase 2 block): `HB_KrinikHead`, `HB_KrinikBody` (`SC_KrinikMods` →
`Brd_KrinikMod_<page>` → `SC_KrinikModName_<page>` → `Txt_KrinikModName_<page>`; `WS_KrinikPages` → `VB_KrinikPage_<page>` → `HB_KrinikRow_<id>`:
`Txt_KrinikLbl_<id>`, `Brd_KrinikInfo_<id>`, `Txt_KrinikHint_<id>`, `SB_KrinikCtl_<id>` → `Sl_Krinik_<id>` / `Chk_Krinik_<id>` (FPS — the phase-0
`Chk_KrinikFps`)), `HB_KrinikFoot` (`B_KrinikReset`, `B_KrinikSave`, `B_KrinikSaveClose`), `Brd_KrinikTip` (canvas, collapsed). Kit trap paid: a
brush's `image_size` is a `DeprecateSlateVector2D` — Python's `Vector2D` does not convert; thin rules are Images inside a SizeBox.
**Seen in game 21:01** (report `testcases/reports/2026-10-31_conan-hub-phase2-first-batch.md`, pack `75ef09f`): the window by mockup 5 opens over the inventory,
fill 4 ms; native setters take ALL their parameters — `SetIsToggledOn(NewIsToggledOn, ShouldBroadcast, IsInstantTransition)`, `SetValue(RealValue,
IsInitializing)`; a game settings row keeps its own label box `SizeBoxSettingName` (350 wide) that squeezes the control — collapsed at fill; whole-number
sliders get `MinFractionalDigits = MaxFractionalDigits = 0`; the slider box is set to 340 at fill (420 cut the longest row). FLX buttons read
`IsHovered() = true` only while the game has focus. Open: the Simple Minimap (`SM_Minimap`, ZOrder 99) was once drawn over our window (ZOrder 101).

**The look pass (2026-10-31 22:0x, the owner's five remarks 21:41 — «огромный», «кривые кнопки инфо», «большие расстояния», «странный жирный шрифт»,
«некрасивый поп-ап»; seams and cases `testcases/TC_conan_hub_look_2026-10-31.md`).** Found by live probes on the open window:
- **Font.** The kit's `WBP_Setting_Checkbox.TextSettingName` carries the ENGINE's `/Engine/EngineFonts/Roboto` face `Bold` (the game styles its own rows at
  run time) — every text copied from it was Roboto Bold. The heading `WBP_Settings_Subheader` is `Cardo-SC-Bold` (small capitals: «Krinik» drew as
  «Kʀɪɴɪᴋ»). The game's serifs `Cardo-*` and `CrimsonPro-*` have NO Cyrillic: Russian letters fall back to a sans beside serif Latin (frames t1/t2).
  The game's own Russian text is a sans; ours now: `/Game/Fonts/NotoSans` (faces `Normal`, `Italic`, `Bold`, `BoldItalic`) — labels 19, hints 15, title
  26 Bold in capitals. Other fonts loaded in the world: `KelsonSans` (`Normal`, `Light`, `Bold`), `Alte_Haas_Grotesk_*`, `OpenSans` (a mod's).
- **Colours are LINEAR in UMG:** `LinearColor 0.06` renders as sRGB ≈ 69 (the «dark» plate was grey-brown), `0.55` ≈ 194 (the «grey» hints near white).
  Text `(0.69, 0.67, 0.62)` ≈ `#d9d6cf`, grey `(0.25, 0.24, 0.22)` ≈ `#8a8680`, plate `(0.012, 0.011, 0.009)` opaque with an old-gold rim `(0.55, 0.40, 0.16)`.
- **Vanity camera hides the window.** With `bHiddenDuringVanityMode` true (copied from the fishing row) the window went `Hidden` ≈ 2–3 min after the last input
  (21:58:24, together with Hosav's «Настройки интерфейса» button); `FindFirstOf('GUIModuleController'):EnableVanityCameraMode(false)` brought it back. The
  vanilla `InventorySettingsPopup` row has it false — ours too since this pass. A window opened while hidden is NOT filled by the section («module
  opened, but no visible …») — close and reopen it.
- **UE4SS hands Lua an empty `FGeometry`** (`GetCachedGeometry` / `GetTickSpaceGeometry` / `GetPaintSpaceGeometry` → size 0×0): a widget's screen place
  cannot be read. The «i» plate is placed at the cursor instead: `WidgetLayoutLibrary:GetMousePositionOnViewport(win)` returns canvas units (at 4K the
  viewport scale is 2.094, the canvas 1834 × 1031). `ForceLayoutPrepass()` + `GetDesiredSize()` DO work from Lua.
- **Sizes.** Width 1240 (the widest row — «Сколько лежит кровь на земле» + hint, 487 units of text — with the list 290), list 290 with a 258 name box (= the section's `NAME_BOX`; every name but «KrinikConanModPackManager» whole), slider control 290 × 48, row gap 1; the
  height is set at fill to the tallest LIVE page (a page switch never resizes the window). The «i» is a square text box (`MinDesiredWidth` 26.3 = the line
  height of Noto Sans 14) inside a `HALF_HEIGHT_RADIUS` rounded box — a circle.

**The fidelity pass (2026-11-01, `[OWNER]` «из этого кадра явно видно, что макет красивый, а реализация в игре - нет» · 04:40; cases
`testcases/TC_conan_hub_mockup_fidelity_2026-11-01.md` P1–P11, F1–F10).** Every number of the kit is mockup 5's CSS ×2 × (1240 / 1315), every colour its
sRGB → linear (`u()` and `lin()` in `kit-krinik-modsettings.py`):
- **Font — the GAME's PT Serif** `/Game/UI/Fonts/PT_Serif/PTSerif-Regular_Font` (cooked in `pakchunk1110` of 3.0.1, `retoc list`): a serif WITH Cyrillic, as the
  mockup's Cambria. The 10-31 probe listed only fonts loaded in the world and missed it. Regular only — «bold» = the same face + a 1-unit outline in the
  text colour. **Trap:** importing a TTF in the kit is impossible — the font factory asserts `CurrentApplication.IsValid()` (no SlateApplication in
  `UnrealEditor-Cmd`, with or without `-NullRHI`).
- **Panel** — a flat brush `#1e1f21` at .94 and a 2-unit rim `rgba(200,196,186,.38)` (`ROUNDED_BOX`, `FIXED_RADIUS` 0), not the game's window texture.
- **Own controls** (the game's rows stay in the tree COLLAPSED — GUID trap): `Sld_Krinik_<id>` (a UMG `Slider`, style: track 2 units `#6d6a64`, thumb
  `#e8e4da`, `MouseUsesStep`) + `Txt_KrinikVal_<id>` (plain text with the unit, the watch rewrites it on a change); a checkbox `Brd_KrinikChk_<id>` +
  `Img_KrinikChkOn_<id>` — its state lives in the Lua table `checks`, a click on the box toggles it; flat buttons `Brd_KrinikBtn_<Close|Reset|Save|SaveClose>`
  (+ `Txt_KrinikBtn_*`), ×1.6 brush under the cursor; the title in three parts `Txt_KrinikTitle` / `…Dot` / `…Sub`; the selected mod — the dark box, the
  light bar `Img_KrinikModBar_<key>`, the name `#f2eee5`; the plate — light rim, square, the title in capitals (`KismetTextLibrary:TextToUpper`).
- `[TESTED: 2026-11-01 · P1–P11, F1–F10 in the live game, real mouse · testcases/reports/2026-11-01_conan-hub-mockup-fidelity.md]`; review folder `41_hub_kak_maket`.

**The owner's three remarks of 2026-11-01 08:42–08:43, closed 09:2x (cases `testcases/TC_conan_hub_no_dimming_2026-11-01.md`, report
`testcases/reports/2026-11-01_conan-hub-height-info-dimming.md`):**
- **«Dimming» — none of ours.** Over the inventory the window shows the inventory around it exactly as the fishing window does (frames D1/D2); in the world the
  brightness outside the window is the same before and after opening (149/147, 98/96, 114/113). The dark of folder 41 was the game's night behind a window
  opened by the remote in the world. The player's door — a button in the inventory — is plan 38 phase 1.
- **Taller:** `MIN_HEIGHT` = mockup 5's panel (448 of 540 css px) × the kit scale = 845 units; the height = max(the tallest live page, 845) — the window stands
  between the inventory's tab row and its button bar.
- **The «i»:** the game's Noto Sans `Bold`, upright, no outline (kit `text(…, sans_bold=True)`), in the same thin circle — variant 5 of eight shown live on one
  frame (`[OWNER]` «(i) - 5» · 09:13; review folder `42_hub_knopka_i_i_vysota`). Live font swap by the remote: `TextBlock:SetFont({FontObject=…,
  TypefaceFontName=FName('Bold'), Size=…, OutlineSettings={OutlineSize=0,…}})` works; a Border's brush is hidden by `br=b.Background; br.DrawAs=0; b:SetBrush(br)`
  (SetBrushColor alpha 0 left the rim).
- **The «i» column (09:33 → 09:42):** a row is «(i) label hint … control» — `Brd_KrinikInfo_<id>` is the row's FIRST child (padding right u(8)), the hint
  carries its own left padding u(6). The kit's Python has no `ShiftChild`: a row in the old order is emptied by `clear_children()` and re-filled in script
  order before the save (no orphan → no GUID trap). Seen on all five pages (case C1).

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
