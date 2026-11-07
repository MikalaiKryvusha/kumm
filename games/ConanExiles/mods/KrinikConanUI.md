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
| `W_AttributeInfoEntry_PerkView` | `PerkDescription` padding top/bottom `PERK_TEXT_PAD` **14** (`[OWNER]` 2026-11-06 09:17 «ставь 14 и не еби голову»; 10 until 2026-11-03, 22 built that morning) | perk descriptions ran into each other in vanilla (bugs/64 item 46). **The column does not scroll** (a real wheel, 2026-11-06): at 22 the last perk of «Сила» lost two lines; at 14 «Сокрушительные удары» stays whole ≈ 20 px above the edge — the longest column of the six attributes (live paddings, review folder 64) |
| `W_EnemyHealthbar` (2026-11-06, bugs/64 item 12a) | `Container_Skull` slot padding top `ENEMY_SKULL_GAP` 4 | the skull icon touched the enemy's bar (`[OWNER]` 2026-11-03 23:29); ≈ 8 px of air at 4K (case E1) |
| `W_DialogueNPCInfo`, `W_PlaceableInfo`, `W_SimpleInfo`, `W_ThrallInfo`, `W_DBNORevive` (2026-11-06, bug 83) | `Container` border render scale `STRIP_SCALE` 0.70, brush alpha `STRIP_BACKING_ALPHA` 0.6 (vanilla 0.6 already) | every interaction prompt like the corpse strip (`[OWNER]` 2026-11-03 23:30 «все виджеты интеракици - влево, меньше, прозрачнее фон»); the shift is the Lua half's |
| `W_MainMenu_MainMenu`, `W_IngameMenu` (2026-10-30, plan 36 W26) | our logo `SB_KrinikLogo/Img_KrinikLogo` (texture `Local/T_KrinikModpackLogo`, `import-logo-texture.py`) right of the game's logo in the main menu (421×159), left of it in the Esc menu (capped 400×152 — Simple Modlist's panel); `T_KrinikGameVersion` «3.0.1» and `T_KrinikPackVersion` «1.0.0» 18 pt on one line under both | the owner 22:39–22:51; geometry derives from the game's `Image_Logo` (MENUS block of `kit-conanui-edit.py`) |
| `W_MainMenu_MainMenu` backdrop (2026-10-31, bug 71) | placeholders `BinkMediaPlayer` `/Game/Movies/TitleScreen_<X>` and `BinkMediaTexture` `/Game/Movies/MediaTextures/TitleScreen_<X>_Tex` (6 each, saved in the kit's `Mods/KrinikConanUI/Content/Movies/`, NOT in CookInfo); the widget's `BackgroundMovies` / `BackgroundMovieTextures` set to them in vanilla order (`MENU_MOVIES`); main-menu logo smaller and further right: height share 0.92 → 0.78, gap 0.12 → 0.40 (427×162 at L 507) | the kit has no `/Game/Movies` — the override saved both arrays empty and the menu backdrop drew white («все белое», the owner 00:10); `[OWNER]` «наш логотим сделй меньше и правее» · 00:11. Before any new vanilla override: `kit-missing-refs.py` |
| `T_KrinikModpackLogo` tone (2026-11-01 21:0x, `[OWNER]` 20:46–20:51 «лого KRINIK MOD PACK белесое какое-то» · «темное внутри CONAN и внутри KRINIK различается») | the texture is now made by `_config/branding/make-pack-logo.py <out> 1.3` from the owner's untouched `krinik-modpack-logo.webp`: the dark fill (luminance < 70) matched per channel to the game logo's dark fill, blended out to the owner's colour by 110 (gold rims kept); import `KIT_LOGO_TGA=<out>\T_KrinikModpackLogo.tga` + `import-logo-texture.py` (`-NullRHI -unattended`), then `kit-buildmod.py KrinikConanUI` | both logos are equal widgets (tint 1, opacity 1, SRGB, `TC_EDITOR_ICON`) and the game lifts both darks alike (≈ 11 → 20): the difference was the picture. Measured in game: KRINIK dark fill 6 / 12 / 19 / 30 vs CONAN 5 / 11 / 19 / 31 (before 11 / 17 / 25 / 38) |
| `T_UI_ConanExiles_Enhanced_Logo` (2026-10-31, W26) | the GAME's logo texture overridden: 1024×512, NO mips, from the owner's 3× upscale (ultramix) with a clean bold ® redrawn top right (`_config/branding/make-game-logo.py`; master `conan-exiles-enhanced-logo-3x.webp`); imported by `import-logo-texture.py` with `KIT_TEX_DIR=/Game/UI/Textures/Logos` (Git Bash: `MSYS_NO_PATHCONV=1`) → kit `Mods/KrinikConanUI/Content/UI/Textures/Logos/` | the vanilla texture's mip chain blurred it in the menu (`[OWNER]` «почему оригинальное логи в меню такое мутное?» · 01:01); seen crisp in the main menu 2026-10-31 01:15 |
| `T_BuffIconEncumberance_T1` (2026-11-03, `[OWNER]` 20:14 «под иконкой перегруза тень слишком сильная, не такая, как под жаждой и голодом» · «Сделать однотипно легко всем иконкам худа») | the GAME's weight buff icon overridden at its own path `/Game/UI/Textures/Icons/Buffs` (kit `Mods/KrinikConanUI/Content/UI/Textures/Icons/Buffs/`, a CookInfo line): 256 × 256, a white body with a thin dark outline (`_config/branding/make-weight-icon.py <vanilla tga> <out tga> [preview]`, `OUTLINE_PX` 5), no shadow; imported by `import-logo-texture.py` with `KIT_TEX_DIR=/Game/UI/Textures/Icons/Buffs KIT_TEX_NAME=T_BuffIconEncumberance_T1` (`-ModDevKit -NullRHI`); source of the vanilla: `kit-export-textures.py` | Hosav's HUD draws food and water with his own 128 px icons (a thin outline) but the weight with this vanilla 64 px buff icon — a white body in a soft black shadow ≈ 14 px wide, stacked TWICE (`Image_Weight` + `Image_Weight_Blinking`), so the shadow doubled while the weight blinked. The same texture is the game's own encumbrance buff icon elsewhere — it changes there too. Seen 2026-11-03 22:45 (the texture live 256 × 256; the three icons on 4K frames — one outline style, no halo; report `2026-11-03_conan-hud-weight-icon-and-mcp.md`) |
| `W_Carousel` (2026-11-06, bugs/64 items 15/17) | `AnimBackgroundFadeOut` made instant: the same two `MaskOffset` keys 0 → 1, the second at tick 1 (`CAROUSEL_END_TICKS`), the playback range to tick 2 (`CAROUSEL_RANGE_TICKS` — the range end is exclusive) | the vanilla 0.5 s mask slide was the hub's «dark wave» (`[OWNER]` 2026-11-06 21:00 «Страницы должны переключаться четко и мгновенно»); the game's own logic of where the backing shows is kept. Build 1 (range end ON the key) left the backing on «Снаряжение» — the see-through hub lost (`[OWNER]` 21:30 «мне не нравится»); build 2 — range +1 tick |
| `InventoryGridSlotView` (2026-11-07, `GRIDSLOT_*`) | `AnimSelect` (the cell's `SelectIndicator` RenderOpacity 0 → 1, vanilla 0.3 s) made instant: the same two keys one tick apart, the range one tick (as `W_Carousel`); `AnimMouseOver` (a 6 % scale-up on hover, 0.1 s) kept | `[OWNER]` 2026-11-07 10:57 «рамка выбора … убираем анимации, делаем её переключения с предмета на предмет мгновенными» · «не нужно её прятать даже на короткий момент»: the 0.3 s reverse fade of the walk's last cell WAS bug 75's jump; with it instant the rim moves in one frame and stays through an F take (R1, R2, report `2026-11-07_conan-quick-loot-rim-instant.md`); `krinik_loot_rim` off since. Probe `kit-probe-gridslot.py`; no mod ships the widget; 0 refs missing in the kit |
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
| `krinik_ui_fixes` | **since 1.6.0 (2026-11-07) the hub's «Снаряжение» does not «dance» on item select** (`[OWNER]` 10:52 «Не должен плясать интерфейс на одном и том же экране при выборе разных предметов»): `CraftingGUI_C`'s three columns sit in a `ScaleBox` (ScaleToFit) whose content height = the tallest column, the left one, which followed the selected item's description (1080.8 / 1079.0) — the whole middle scaled 2–3 px at 4K; at the window's birth (`NotifyOnNewObject(CraftingGUI_C)` + one tick) `SizeBox_2` gets `HeightOverride` 1082 and `SizeBox_0` `MaxDesiredHeight` 1082 (D1 fail → D2 pass, whole-screen diff, report `2026-11-07_conan-locomotion-hub-dance-pickup.md`); since 1.5.0 (2026-11-06, bug 83) the five other interaction prompts (talk, building, simple object, thrall, downed ally — `/Game/UI/HUD/FloatingNames/W_*Info`, `W_DBNORevive`) get the strip's shift / scale / backing on their `Container` from the same hub rows (`NotifyOnNewObject` per class + one tick; re-applied on a hub save; log «info prompt born: … placed»; cases I1–I4, report `2026-11-06_conan-interaction-prompts-perks-enemy-bar.md`; stand `_config/info-open.lua`); corpse strip Left while the quick-loot window shows; button key glyph width capped at birth; since 1.4.0 (2026-11-03, bug 81) the journey tracker `WBP_JourneyTracker_C` drawn at render opacity 0 while the window shows (its text showed through the grid), back to 1 by a 250 ms watch that runs only while it is hidden (the window closes with no event) | post-hooks `WBP_ContainerInfo_C:SetObject`, `HandleInventoryChanged`, `HandleLootContainerInventoryChanged`, `QuickLootPanel:SlotItemAddedOrRemoved`; `NotifyOnNewObject(/Script/UMG.SizeBox)` inside `WBP_ButtonBase` | `MaxDesiredWidth` 42.67 on `SizeBoxPrimaryIcon`; recheck 50 ms |
| `krinik_fps_counter` | frames per second, top right over the minimap | `NotifyOnNewObject(W_NewHealthUI_C)` + 500 ms; loop 250 ms (`GetFrameCount` / real time) | font 16, outline 2, pos (−5, 5) |
| `krinik_hud_outline` | Hosav HUD text bold ×1.1 with a 1-pt outline; F1 under the folded damage meter; temperature colour | `NotifyOnNewObject(W_NewHealthUI_C)` + 500 ms and a 5 s second pass; `BPEnergyReceiver_C:EnergyReceived` | 51 TextBlocks; **since 2026-11-01 13:2x the colour follows the GAME's own debuff stage** `BP_AC_Buff_Heat_Stage1…4` / `BP_AC_Buff_Cold_Stage1…4` (`/Game/Systems/Buffs/TemperatureBuffs/`, the overheat icon by the hotbar): no stage — white, stage 1 — 70 % to red/blue, stage 4 — full, mixed in sRGB (`[OWNER]` 13:15 «ванильный индикатор перегрева висит … твой мод худа цифру держит белой»; the energy thresholds ±20/±30 of Hosav left 33 °C with Heat_Stage2 near white). Classes cached; a full stage check only when the energy step changes or the debuff component dies (walking 165 hero components costs 1.7 ms — never); only LIVE fields (`WidgetTree_<n>.` in the full name — the class templates were coloured instead until 2026-11-01) |
| `krinik_pause_in_menu` | the world slows while a menu is open: inventory/hub 0.03 (×33 slower), Esc menu ≈0.0001; Esc closes mod windows (and, since 0.16.0, the open window of the «Настройки модов» list); 0.16.0 (2026-11-01): Hosav's «Настройки интерфейса» is COLLAPSED on every inventory / «Снаряжение» open (retry chain ≤ 4 × 250 ms — Hosav builds it after the event), the fishing button is no longer grafted (`Graft` not called; the 0.8.0–0.12.0 layout code removed); fishing tooltips laid out once; 0.14.0 (2026-10-30): the fishing difficulty captions on one line « Легко | Спокойно | Строже | Ваниль » (W18a) | `GUIModuleController:ActivateModule`, `CarouselWindow:Next/Prev/SetCarouselIndex`, `IsFullscreenGUIActive` poll 250 ms, Esc key bind | live 2026-10-30: inventory open 0.0300, closed 1.0; **hero craft at real speed ON since 2026-10-31** (`CRAFT_SPEEDUP = true`): the hero `CraftingQueue.CraftTimeMultiplier` = the dilation — it scales the DURATION and is read at an item START (report `2026-10-31_conan-craft-speed-in-inventory.md`) |
| `krinik_pause_in_menu` 0.17.0 — eating in the hub (2026-11-07) | after `BP_HungerSystem` AddFood / AddDrink / IncreaseFood / IncreaseDrink / SetFoodCurrent / SetDrinkCurrent (post-hooks, set at the hero's birth), only while the world is slowed: the visible `WBP_HungerGauge_C` / `WBP_ThirstGauge_C` get `Duration` = 0.1 × dilation and `PollCurrentValue()` (`[OWNER]` 10:59–11:00 «по аналогии, как исправляли по крафту») | the stat rises at once on eating; the gauges polled by a game-time timer (≈ 10 s in the hub) and animated 0.1 game-s (3.3 s); after: shown within 1 s (E1, report `2026-11-07_conan-compactor-tooltips-and-eating-gauges.md`) |
| `krinik_ui_fixes` 1.7.0 — Inventory Compactor tooltips (2026-11-07) | `btn_Split` / `btn_Compact` of `IC_UI_CompactButton2_C` get `SetToolTip(W_TooltipWidget_C)` with their own text at the widget's birth (`[OWNER]` 10:58 «в вид как у игры») | `NotifyOnNewObject(IC_UI_CompactButton2_C)` + one tick | T1: the dark game tooltip by a real hover; notes `InventoryCompactor.md` |
| `krinik_pause_in_menu` — late mod icons on «Параметры» (2026-11-07) | the Era of Trials magic-school icons on the stats window: on the hero portrait's birth while «Снаряжение» is NOT the active tab, `inject_eot_stats` sets the EoT component's shared event locals (`K2Node_CustomEvent_module` = `GetModule('CharacterStatsWindow')`, `_isActive` true) and calls its resume point 1060 (its own Delay silenced in the pak) | `NotifyOnNewObject(W_UICharacterDisplay_C)` (the same watch as «Снаряжение») | log «портрет героя в окне характеристик — значки EoT: вставлены (N мс)», 4–8 ms; one set per visit; icons on the 0.3 s frame (were 0.3–1.5 s late). `EraOfTrials.md` — the four Delays |
| `krinik_hud_blink` (W36, 2026-10-30; rewritten 2026-11-01) | food/water from 10 %: a barely visible pink pulse that saturates to red toward 0 % (`[OWNER]` 2026-11-01 11:54 «на 10% должно быть в едва заметный нежный розовый, и чем ближе к 0%, тем насыщеннее красный»); weight from 90 % of max — the red image's alpha the same way | `NotifyOnNewObject(W_NewHealthUI_C)` → the live `hud.W_SmoothHP`; poll 250 ms (shares → peak); OUR colour tween every 33 ms only while an icon is in the zone: `Border_EatImage` / `Border_WaterImage:SetContentColorAndOpacity` (G = B = (1 − peak × pulse)^2.2), `Image_Weight_Blinking:SetColorAndOpacity` alpha = peak × pulse; pulse (1 − cos) / 2, period 1 / 0.30 s; the native animation of that icon is STOPPED while we drive it | peak 0.15 at the threshold → 1.0 at the limit; **since 2026-11-03 also at 0 % / ≥ max — our pulse with peak 1, Hosav's animation stopped: every icon on ONE phase** (`[OWNER]` 19:41 «мерцают крассным в рассинхрон» · «чтобы слушались одну шину»; the native animations started when each icon hit its limit — out of phase; report `2026-11-03_conan-hud-blink-one-bus.md`). Why not the animation: `PlayAnimationTimeRange` ignores its end from Lua (EXP-0422; until 11:5x every share blinked full red). Seen: while food sits at exactly 0 %, the game's blink also overrides the weight image (Hosav); one colour table per icon (GC spikes) |

| `krinik_feedback` (W37, 2026-10-31) | the «ОТЗЫВ» plate (`Btn_KrinikFeedback` — a kit Button 195×40 under «1.0.0» in both menus, style normal `T_KrinikFeedback` / hovered+pressed `…Hover`; the first `Img_KrinikFeedback` stays COLLAPSED — GUID trap); a click runs `feedback/collect_report.ps1 -GameDir … -Feedback` by `start`: zip on the desktop, the game minimized, Explorer, an address box on top, then `mailto:` | menus remembered by `NotifyOnNewObject` (templates dropped) + `ExecuteInGameThreadWithDelay` 500 ms; `RegisterKeyBind(LEFT_MOUSE_BUTTON)` → `ExecuteInGameThread` → `IsVisible` + `IsHovered` (UserWidget mouse-event hooks never fire — EXP-0399) | debounce 5 s; the collector starts by `io.popen` (pipe closed 3 s later): a menu click costs 3–4 ms (was 63 with `os.execute`, 2026-10-31 07:46 / 07:53); a gameplay LMB check 0.009 ms (1000 checks by the remote, 07:54). The collector's address box is a Win32 `MessageBoxW` with `MB_TOPMOST` (a hidden TopMost WinForms owner did not keep it on top — it slid under VS Code, 07:47). Seen working in BOTH menus 2026-10-31 (report `2026-10-31_conan-feedback-esc-menu.md`); the plate sits `FEEDBACK_BELOW_VERSION` 44 under the version line (34 until the owner's «10 пикселей», 07:47). **Since 2026-10-31 11:15** the collector minimizes the game AT the click, shows a topmost DPI-aware waiting window «Собираем журналы игры для отзыва…» until the zip is ready (13–14 s; 22 s before, with the game full-screen and nothing on screen — the owner's 11:06 word), and a second collector exits at once (mutex `Local\KrinikConanFeedback`); trap: `start "" /min` makes the first shown window of the process minimized — restore it after `Show()` (report `2026-10-31_conan-feedback-minimize-first.md`) |

| `krinik_shout_fade` (W29, 2026-10-31) | enemy shouts (game subtitles) appear in place, fade in 0.2 s and out 0.2 s through a MIRROR line: the game line is born with `RenderOpacity` 0 and stays invisible; our own `SizeBox_KrinikShoutMirror` (built once per renderer by `StaticConstructObject` in its WidgetTree, added to `Overlay_0` with the container slot copied, width 1000) holds our own `W_SubtitleEntryView_C` (`WidgetBlueprintLibrary:Create`) that gets the line text (`FText(TextView:GetText():ToString())` — `GeneralText` still resolves the gender pattern) | `NotifyOnNewObject(SubtitleEntryView)`; `RegisterHook(W_SubtitleEntryView_C:SetTextActive)` set on the first born line; a 50 ms watch of the game line only while it lives (no removal event); opacity steps 15 ms only while fading | FADE_S 0.20, WATCH_MS 50; seen ≈ 10 frames in and out at one place (cases S6, S10; review folder 25). **Hold (2026-11-01):** the hub row `ui_shout_hold` (1–10 s, step 0.5, default 1 = the game's own timing) is a MINIMUM time on screen — when the game line dies earlier, `hide_later` waits the rest; a new shout replaces the text in place and the old timer does nothing; log «фраза снята через X с» per line (report `2026-11-01_conan-shout-hold-slider.md`, review folder 44) |

| `krinik_mod_settings` (plan 38, 2026-10-31) | the «Моды Krinik'а» settings hub skeleton: merges `DT_KrinikUIModule` into `DT_UIModuleTable` once; writes the row labels («Счётчик кадров в углу экрана») into our window's live rows when our module opens; logs toggles of settings checkboxes inside our window | `NotifyOnNewObject(W_MainMenu_MainMenu_C)` + 500 ms → `ModController` CDO `MergeDataTables`; post-hook `GUIModuleController:ActivateModule` (our row only) + 100 ms → `FindAllOf(W_KrinikModSettings_C)`; pre/post hooks `SettingsCheckboxWidgetBase:HandleCheckboxToggled` (our window only) | merge 11 ms once per start; no timer, no poll. The checkbox drives nothing yet — the FPS counter switch is phase 2 |

| `krinik_vignette` (plan 40 phase 1, 2026-11-01) | the strength of the GAME's screen-edge vignettes: hunger, thirst, low health — store keys `ui_vig_hunger`, `ui_vig_thirst`, `ui_vig_health` (0…1, 0 = off; shipped 0 / 0 / 0.25: hunger and thirst off by `[OWNER]` 13:20, low health 0.25 by `[OWNER]` 14:34 «ставь 25%, потом я буду играть и глаами найду желаемое знаечение», after review folder 48) | `NotifyOnNewObject(W_NewHealthUI_C)` + 600 ms → once `NotifyOnNewObject(/Game/UI/HUD/W_FullScreenBuffEffect.W_FullScreenBuffEffect_C)` and the effects already alive; an effect's birth + 200 ms (the brush is set after construction); `settings.on_change` | strength = the effect widget's own `SetRenderOpacity(k)` (the game never writes it); kind by `Image.Brush.ResourceObject`: `MID_HealthScreenEffectMat` → health, `T_BuffFullScreenEffect_HungerThirst` → hunger or thirst by the hero's food / drink at birth (both 0 → the larger strength); others (heat, smoke) untouched; live effects in a table by FULL NAME (a weak-keyed table lost the UE4SS wrappers — «применено к 0», 14:06). Cost: calls only at a birth and a save, below the 1 ms clock. Report `testcases/reports/2026-11-01_conan-vignettes.md` |

| `krinik_mods_button` (plan 40.3, 2026-11-01) | the ONLY button of the inventory bar «Настройки модов» and its list «Моды Krinik'а · Моды Xevyr'а · Рыбалка · Прочее»; Xevyr and «Прочее» are sub-lists («‹ Назад» + mods by name, alphabetical) whose entries open the mod's own settings window by its module (`TOP`, `SUB` tables — 13 windows: KrinikModSettings, ExilesFishingTuning, AMR_Settings, LLH_Settings, PrP_Settings, SM_UI_Settings, DN_UI_Settings, EmberlightMasterConfig, EAA_Armorsettings, HosavUIsettings, LBPRWidgetID (LBPR's own window, since 2026-11-03; `SLOTS` 7), NightTerrorsSettings, PIFC_Settings; left out: ModControlPanel — empty, removed from the build 2026-11-03, Pickup+_Settings — drawn in pieces, Edit Appearance — not settings, PRMainMenu — crashed the game); collapses Xevyr's side tab | button: `WidgetBlueprintLibrary:Create(WBP_ButtonBase)` + `ButtonContainerLeft:AddChild` on the pause section's `XCS_Panel` event; list: a `VerticalBox` built by `StaticConstructObject` in the inventory's WidgetTree inside a `SizeBox` (min width = the button's), added to the bar's `Overlay_0` Left/Bottom with bottom padding = the bar's desired height (75); clicks: `RegisterKeyBind(LMB)` → `IsHovered` (returns on one flag while «Снаряжение» is not shown); a click outside closes the list; one window at a time (`ActivateModule(m, false)` on every open list module first); `_G.__krinik_mods_menu_esc` closes the open list window for the pause section's Esc; Xevyr tab: `NotifyOnNewObject(XCS_W_Container_C)` once → `RegisterHook(XCS_W_Container_C:Construct)` → `MenuContainer` Collapsed | labels: Noto Sans `Normal` set AFTER every label (a font set right after `Create` did not survive the button's construction — frame 16:58; the vanilla Cardo-SC-Bold has no Cyrillic); `SetFont` by editing the struct's fields — a freshly built table with the old `FontMaterial` crashed UE4SS (16:39). Xevyr tab: the window `XCS_W_Container` is a `WindowRoot` re-created on every entry to «Снаряжение» and re-shown by its Open — collapsing the root failed (17:04), a birth hook + next game-thread tick flashed ≥ 2 frames (60 fps video 17:13); the `Construct` post-hook is the same frame (video 17:15 clean). Cases `TC_conan_mods_menu_button_2026-11-01.md` B1–B14, report `2026-11-01_conan-mods-menu-list.md` |

| `krinik_pickup_prompt` (plan 42, 2026-11-01) | a light «E Взять» under the crosshair when E would take a foliage pickup (stones, branches, fibre, berries, fungi, algae, grubs, feathers, eggs, cobweb — 55 meshes of `PickupFoliageComponent_C`); the game has no prompt for them because they are foliage instances, found by the game only at the press. Since 2026-11-03 (bug 80) the plate stays off while the game's corpse / container strip is on screen (module `ContainerInfo` active, or a live `WBP_ContainerInfo_C` remembered at birth in the viewport) — E opens the corpse first; since 2026-11-06 (bug 83, case P1) the same for the five other prompts (talk, building, simple object, thrall, downed ally) | `NotifyOnNewObject(WBP_Crosshair_C)` + 600 ms → the plate built once in the crosshair's root `CanvasPanel` (rebuilt by itself when the game re-creates the crosshair — after an in-game loading screen, 22:22:32); `NotifyOnNewObject(FoliageInstancedStaticMeshComponent)` → the component list; ONE check a second (`ExecuteInGameThreadWithDelay` chain — the owner's own exception to rule 7, 21:30) and a near refresh slice half a second later | **since bug 77 (pack `008faf4`) the check CALLS the game's own probe** — the static `EnvironmentFunctionLibrary:PickupGatheringOneInstance(pc, hero, pc, Eye, ViewDir, PickupInteractionDistance, PickupTraceSphereRadius, {}, {})`, Eye = `AdjustableCamera` (first person, bonus 0) or `CameraThirdPerson` + forward × `ThirdPersonSpringArm.TargetArmLength`, as `UpdateHighlightTarget` does; true = E would take an instance; once a second, 5 / s while shown; no component list; the E rim's outline alpha follows the fade (`set_rim` — a RoundedBox outline ignores the parent's opacity); the plate's slot aligned (1.0, 0.5) — right edge at the dot, defaults −1 % / 0 %; cost 0.089 ms a check (report `2026-11-02_conan-pickup-native-probe.md`). History below: the probe copied the game's pickup search as our camera mod sees it: start camera + view × `ThirdPersonSpringArm.TargetArmLength`, length `PickupInteractionDistance`, points every 45 cm, `GetInstancesOverlappingSphere(point, PickupTraceSphereRadius, true)` on the «near» components (an instance within 6 m of the hero), picked instances have scale 0. **Timing since 2026-11-07 10:4x** (`[OWNER]` 10:41 «опрос луча E Взять ускоряем до 10 раз в 1 секунду, пока луч открыт» · 10:42 fade «до 0,1»): `CHECK_SHOWN_MS` 100, `FADE_S`
0.10 — P1: the fade starts 63–120 ms after the view leaves, lasts ≈ 75 ms, the plate gone in 134–198 ms (was 280–400). Plate since 2026-11-07 10:3x: `HB_KrinikPickup` → the soft `T_UI_InteractionUnderlay` backing `Brd_KrinikPickup` (alpha **0.45**, side paddings 24/24) UNDER THE WHOLE plate → `HB_KrinikPickupInner` = E in its own rim + «Взять» (`[OWNER]` 2026-11-07 10:22 «серую подкладку растягиваем так, чтобы E тоже над ней. И непрозрачность подкладки на 10% сильнее»; seen on a 4K frame at a stone, stand `stone-stand.lua`). Before: `HB_KrinikPickup` = E in its own rim (`Brd_KrinikPickupKey`, fill alpha 0.09) + «Взять» 15 on the soft `T_UI_InteractionUnderlay` backing (alpha 0.35, `[OWNER]` 21:57 «фон только под словом»; the backing's left padding `KEY_GAP` 6 — the gap from E to the word, 24 until `[OWNER]` 22:48 «вариант 3», review folder 55), 62 units under the crosshair, fade 0.2 s. Cost (100 repeats 21:50): check 0.12 ms, near slice of 20 — 0.18 ms. **Since 22:3x** a dead component leaves the list in the near refresh (the reference flight had grown it 281 → 1976 with 281 loaded — the near cycle 14 → ≈ 100 s). Remote read of the plate: the crosshair by `FindAllOf("UserWidget")` + full name (`FindAllOf("WBP_Crosshair_C")` returns nothing) → `GetWidgetFromName(FName("HB_KrinikPickup"))`. Cases P1–P11 `TC_conan_hub_rows_audit_2026-11-01.md`, report `2026-11-01_conan-pickup-prompt.md` | <!-- claim-ok: the clock times after the 2026-11-02 report name are the row's 2026-11-01 history -->


| `krinik_loot_rim` (bug 75, 2026-11-03) — **OFF since 2026-11-07** (not in `main.lua` SECTIONS; the kit's instant `AnimSelect` removed the cause, and the owner forbade hiding the rim even briefly) <!-- claim-ok: the clock times later in this row belong to 2026-11-03 --> | the quick-loot selection rim stays in its cell on an F take: the game's rebuild walks the selection and its last cell (bottom right) keeps a full rim ≈ 250 ms; we hide every OTHER cell's rim for 350 ms (`[OWNER]` 21:26 «можно … просто её делать невидимой на время мерцания?») | `SlotItemSelectionChanged` (+ one tick: the rim's place read, never inside a take, no param read) · `SlotItemAddedOrRemoved` (both calls + one tick: `SelectIndicator:SetVisibility(2)` on the other cells, back to 3 after 350 ms, the place read again) | cells = `InventoryGridView.WidgetTree.RootWidget` → ScrollBox → `InventoryBox` → `ItemGrid` children (18 pooled `InventoryGridSlotView_C`, place by `Slot:GetPosition()` / 100); panels compared by `GetAddress()` (EXP-0453); counters `_G.__krinik_loot_rim_seen` for the remote; no rim ≈ 0.3–0.4 s after a take, then on its place. Cases B2–B5, report `testcases/reports/2026-11-03_conan-quick-loot-rim-hold.md` |
| `krinik_hub_controller` (plan 48, 2026-11-07) | our hub page controller: OUR pages for 7 tabs (lazy, one per tick, nearest first; kept until the world is left), the GAME's «Снаряжение» and «Параметры» held at opacity 0 until no widget is born for 2 samples; the old page stays until the new one is shown; on close our pages Collapsed; Simple Minimap's helper row added to our «Карта» (adapter) | `NotifyOnNewObject(UserWidget)` (births + the newborn page; returns at once while the hub is closed — no class read in gameplay; the opening found by one scan, 692460f) · `CarouselWindow:OnChildActivated` (inside: the newborn's opacity only) · close checks after `Key.ESCAPE`, `Key.TAB`, `GUIModuleController:ActivateModule` (1 / 100 / 300 ms) | widgets kept by NAME, found by `FindAllOf` before each touch (stale refs crashed 06:29); one log line per hub close «хаб закрыт: переключений … ошибок …»; live 07:35–07:37 (background, remote switches): one page per tick on 13 of 13 transitions, 7 pages built (worst 53 ms), handler worst 91 ms (in the hub), 0 errors. **2026-11-07 10:2x — fast switching:** «closed» = no game page of any tab in the viewport (`game_page_in_viewport`; the old «the last recorded page is gone» test fired inside a switch and left an EMPTY hub — 2 of 6 bursts); our builds flagged `S.building` (no stale newborn); the Simple Minimap row's slot set to the mod's own Left / Center / 0 (it was copied from an unplaced helper → stood high). After: 38 of 38 bursts OK (SetCarouselIndex and Next/Prev), `_config/hubswitch/fast-burst.lua`, `fast-burst-eq.lua`. Open: the player's mouse / Esc / Tab path, a 144 fps recording, the direct «Снаряжение» ↔ «Параметры» click (3–4 bare ticks), the helper's «Свои маркеры» click on our map. Cases S1–S4 of `TC_conan_hub_shadow_pages_bisect_2026-11-07.md` |

**Hubs in one window (plan 40.3 I6.1–I6.3, seen 2026-11-02 00:28 +03:00, pack `dd73239`).** `krinik_mod_settings.lua`: `HUBS` (krinik · xevyr · other), a page's `hub`
(«krinik» when absent), `in_hub(p)` = live and of the open hub; the hub comes from the list's `_G.__krinik_hub` (`krinik_mods_button.lua` TOP `hub`) or the
shared variable `KrinikHubRequest` (`ModRef:SetSharedVariable` — the agent's remote; each UE4SS mod has its own Lua state, EXP-0438), cleared at fill. Pages not
live are not filled. The Damage Meter page `dm` (`own = "DamageMeter"`): read — `GameplayStatics:LoadGameFromSlot("DamageMeter", 0)` (CDO when absent); write —
the AUTHOR'S window: `ActivateModule(DN_UI_Settings)`, its controls by the author's maths (`DM_FIELDS`), its `SaveSettings`, then `ActivateModule(…, false)`
(it stayed open behind ours otherwise); only from its own hub. Seen: D1 (values = the mod's), D2 (a real Save → slot `segmentTimer` 10). Open: the other four
Xevyr pages; the list's Xevyr entry still a sub-list; the save's one-frame flash unmeasured.
**The Xevyr pages (2026-11-02, plan 40.3 I6.3, `[TESTED: 2026-11-02 · X1–X8 pass, testcases/reports/2026-11-02_conan-hub-xevyr-four-pages.md]`):** `amr`, `llh`, `prp`, `sm`, `dm` — alphabetical, the same order in the
kit PAGES and the Lua PAGES; one adapter table `AUTHORS` (key = a page's `author`): way «window» (dm, prp, sm — the author's window, its save functions, its
module closed after; sm also gets its window fields `UIScale` / `clampRange`) and way «call» (llh — `UpdateSettings` + its slot; amr — `ServerSaveSettings`);
`author_vals` = what was read at the opening — a page is written only when a row differs; the author windows open one after another (`write_authors`).
The kit re-orders the list and the switcher to PAGES (`keep_order`, effective on the second pass — the first creates the new widgets after the reused ones);
Lua shows a page by its widget (`show_page`, `SetActiveWidget`), never by the PAGES index. Per-mod notes: `ProximityParty.md`, `LLHighlight.md`,
`AlMerayah_Reborn.md`, `Simple_Minimap.md`, `DamageNumber.md`.
**Colour and key rows (2026-11-02, plan 40.3 I6.2, `[TESTED: 2026-11-02 · C1–C9 · testcases/reports/2026-11-02_conan-hub-colour-key-rows.md]`):** kit kinds
`color` (`Brd_KrinikSw_<id>` → `Brd_KrinikSwC_<id>_0` + `Txt_KrinikSwName_<id>`), `color9` (nine swatches), `key` (a UMG `InputKeySelector` `Ks_Krinik_<id>` styled
as `.key`); the palette plate `Brd_KrinikPal` (16 cells `Brd_KrinikPalC_<i>` with `Img_KrinikPalC_<i>`, `Img_KrinikPalOld/New`, buttons `PalCancel` / `PalOk`) and the
busy plate `Brd_KrinikKeyBusy` on the root canvas, both placed AT THE CURSOR. A value is linear `{R,G,B,A}` (a pick keeps the row's alpha); the name — the
nearest palette colour by sRGB, «свой цвет» beyond 0.06. **Traps paid:** a transparent `BrushColor` does not hide a rounded-box outline — draw the cell brush
only on the chosen one (`DrawAs` 4 / 0); a save must keep a SNAPSHOT of the values (the window's live list was shared and a later pick looked «unchanged»);
`mouse-seq.ps1` sends LeftAlt when it brings the game forward — a waiting key selector catches it (press the key in the same call as the click). The busy-key
list = Escape + `Default__InputSettings` ActionMappings / AxisMappings (90 keys; F2 among them).
**A hub hides another hub's pages by collapsing the WHOLE list row `HB_KrinikModItem_<key>`** (fixed 2026-11-02 07:3x, cases L0–L2, report
`2026-11-02_conan-hub-left-list-seam.md`): collapsing only `Brd_KrinikMod_<key>` left the row with its bar box — the hidden bar Image keeps 32 units — so the
Xevyr hub's one name stood under five empty rows, mid-height. **Trap:** a window opened by the remote during the world load is never filled (log «module opened,
but no visible …») — open it after the HUD birth line «HudOutline] новый HUD».

**Esc in a mod window opened over the inventory (2026-11-01, plan 40.3 B11).** The inventory stays only when the window's module row is Category **Modal** AND
**CloseOnESC true** (live row edits on modules not yet created: Modal alone — Proximity Party failed; CloseOnESC alone with Popup — EAA failed; both — Simple Minimap,
Lore & Loot, Night Terrors pass). A live edit of `DT_UIModuleTable` rows does nothing for a module already created in the session. Fixed natively in eight paks
(KRINIK MODIFIED; tables `ConanExiles/_config/krinik_patches/<Mod>__<UIModule table>.tsv`, rows `enum:<Row>/Category` and `rbool:<Row>/CloseOnESC`).

**Vignettes — how the game draws them (recon `researches/conan-vignettes/README.md`).** The container `W_FullScreenEffectContainer_C` holds
`W_FullScreenBuffEffect_C` widgets owned by the GAME INSTANCE (`…BP_ConanGameInstance_C_<n>.W_FullScreenBuffEffect_C_<n>` — not in a widget tree, so the
`WidgetTree_<n>.` filter of EXP-0421 drops them; drop only `…:WidgetTree.` templates). Low health: one widget alive from the HUD's birth, a dynamic material
`HealthScreenEffectMat` with the scalar `Intensity` (0 / 0.3 / 0.7 at 100 / 60 / 15 % health) — red blood splatter, already visible at 61 %. Hunger and thirst: ONE
texture, a new widget per «умирает от голода / жажды», a dark green-grey band (measure luma, not redness); the old ones lose their parent when the stat is
refilled. **Never** read `Buff` or walk this class's reflection from Lua (two native crashes, 13:31 and 13:52). Health setter for a stand: `p:AdjustHealth(<int
delta>)`, read back `IsFullHealth()`.

**The «i» circle (2026-11-01 14:1x, `[OWNER]` «(i) искажены в строках, где много теста»).** The «i» text (Noto Sans Bold 14) is 22.6 × 27.3; the circle is
round only inside the square `SB_KrinikInfo_<id>` (22.6 × 22.6) between the border and the text. Rows built after that box left the kit script (shout hold,
the vignettes) had the text straight in the border — a lemon. The kit now sets the box for every row by `info.set_content(box)` (replaces the text, then the
text goes into the box — no orphan). Check: the remote `Brd_KrinikInfo_<id>:GetContent()` is a SizeBox and its desired size 22.6 × 22.6.
**Ranges (2026-11-01 15:0x, plan 40.2 4a):** `cam_zoom_min` starts at 130 (below it the wheel cannot reach first person — game map: 30 fails, 130 works);
the other ends were checked and kept. **Hints after the same pass:** only units («в сантиметрах», «в градусах», «в секундах»), «во сколько раз» and
«больше — быстрее» remain; «вправо или влево», «колесо мыши» ×2, «с какого запаса», «с какой нагрузки», «в процентах» dropped (the «i» or the value says it).
**Hints:** a row gets the grey hint only when it adds something the «i» text does not say; the vignette rows have none (`[OWNER]` 14:08 «Иногда не нужно
серое пояснение» · «или очень кратко» · «и в описаниии по (i) будет объяяснено»).

**The pause section's poll no longer searches the scene (2026-11-01 14:2x, `[OWNER]` «не перебирают сотни объектов в каждом кадре?» · «или сотри объектов раз
в 1...2 секунды?»).** Until then `poll()` (every 250 ms) ran `FindFirstOf("GUIModuleController")` and `FindAllOf("BasePlayerChar_C")` — two walks of the whole
object array 4 times a second, 480 a minute. Now both objects are held and searched again only when dead (death, world load), at most once per 2 s; a minute
line «минута: поисков по сцене N из 240 опросов» proves it (main menu 28; in the world — see TC C1). The inventory slowdown unchanged (C2: 0.03 → 1.0).

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

**After an in-game loading screen (2026-11-03, plan 44, bug 79).** A teleport / waystone / respawn shows `W_IngameLoadingScreen_C`; `IsFullscreenGUIActive` is
true while it shows, and the pause section used to slow the world to 0.03 — the load never finished (the hero hung in the air). Since 2026-11-03 the poll
skips it (`loading_screen_up()`, the object cached, searched only while full-screen and ≤ once per 2 s) and disarms as at a world load. After the same
screen the game builds a NEW `DN_UI_DmgWidget_C` (the old one leaves the viewport) — the F1 label and the 20 % look were lost until `krinik_hud_outline`
also applies them on that widget's birth (`NotifyOnNewObject(/Game/Mods/DamageNumber/UI/DN_UI_DmgWidget.DN_UI_DmgWidget_C)` + 500 ms). Seen 13:11: time 1.00
through the teleport, landed in 4 s, the new widget «— F1» (frame). The owner's 12:55 «вод DPS вверху старый» was this loss after a teleport, not a stale build.

**Mirror pair:** `ue4ss/feedback/collect_report.ps1` is a COPY of the pack's `_config/player-report/collect_report.ps1` (the Lua mod needs it inside the game
folder). Check: `cmp _config/player-report/collect_report.ps1 _unpacked/KrinikConanUI/ue4ss/feedback/collect_report.ps1` — edit the source, copy again.

## Version

`modinfo.json` version = the BUILD version **1.0.0** since 2026-10-31 15:5x (kit source, `kit/modinfo.json`, the built pak by `_config/devkit/set-pak-version.py`) —
`[OWNER]` «в сбоке моды Krinik ставим по версии сборки 1.0.0» · 2026-10-31 15:39, superseding 3.0.1 of 2026-10-28. The pause-menu mod list (Simple Modlist)
reads it — see `SimpleModlist.md`; seen «v1.0.0» 15:51 (report `testcases/reports/2026-10-31_conan-krinik-versions-1.0.0.md`).
**Since 2026-11-02 18:5x the build version is 0.9.0** (`[OWNER]` 18:40 «Все моды Krinik опускаем до версии 0.9.0», plan 43): `kit/modinfo.json` 0.9.0 (and the kit's copy),
`kit-conanui-edit.py` `PACK_VERSION` «0.9.0» → the line under our logo in both menus; the pak rebuilt (kit edit + `kit-buildmod.py`); seen «0.9.0» on the
main-menu frame 18:56 (TC `TC_conan_release_0.9.0_2026-11-02.md` V3).

## Tests and runs

- `testcases/TC_conan_krinik_conan_ui_merge_2026-10-30.md` (U1–U8 pass), report `testcases/reports/2026-10-30_conan-krinik-conan-ui-merge.md`.
- The settings hub skeleton: `testcases/TC_conan_hub_kit_window_2026-10-31.md` (K1–K9, K2b, K8b pass), report `testcases/reports/2026-10-31_conan-hub-kit-window.md`.
- Older cases of the parts: `TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md`, `TC_conan_loot_panel_hidden_and_hold_prompt_2026-10-28.md`.

## Open

- **The owner's word 2026-11-02 09:04 — the pickup check rate while the plate shows:** `[OWNER]` «при открытой плашке E Взять, частота опросов должна повышаться
  до 5 раз в секунду - для того, чтобы в случае увода луча с Берущегося предмета - плашка закрывалась быстрее». DONE — `CHECK_SHOWN_MS` 200; seen 2026-11-02
  14:44–14:47: the plate goes 0.28–0.40 s after the view leaves (N2, report `2026-11-02_conan-pickup-native-probe.md`).

- **The owner's word 2026-11-02 08:57 — positions of «E Взять» and the corpse strip:** `[OWNER]` «можно виджеты E Взять и плашки трупов - дать настройку их
  положения на экране через наши настройки модов? По высоте и по горизонтали?» · «и по умолчанию сделать их в левой части экрана, чтобы в виде от третьего лица
  они не поверх героя были, а левее героя». BUILT 2026-11-02 10:5x (the four rows exist); the «E Взять» default moved 14:22 by `[OWNER]` «слишком далеко плашка от
  центра» · «поднять выше в одну линию с точной прицела, и правее» to the crosshair dot's line, right edge just left of the dot (−1 % / 0 %, bug 77). Former way: hub rows on the KrinikConanUI page — «E Взять: по горизонтали / по высоте», «Плашка трупа: по горизонтали
  / по высоте» (sliders in screen shares; store keys `ui_pickup_x/y`, `ui_strip_x/y`); `krinik_pickup_prompt` places its plate in the crosshair canvas by them
  (today 62 units under the crosshair); the strip — the kit's `WBP_ContainerInfo` slot (`OverlaySlot_5`) by default left of centre, the Lua offset from the rows
  (the strip already moves Left while the quick-loot window shows — `krinik_ui_fixes`); defaults — left of the hero in third person, the exact share by a frame.
  Together with the 08:54 strip size / transparency word above.

- **The owner's words 2026-11-02 08:55 on the on-screen XP gain:** `[OWNER]` «появляющийся опыт на экране поднять выше? сейчас он перекрывает героя» · «можно
  появляющийся опыт настраивать время его обображения нашим окном настройки модов?» — the second is a QUESTION (answered in chat: yes, likely — like the
  `ui_shout_hold` row), nothing built (EXP-0438). First: recon which widget draws the XP popup (vanilla HUD or Hosav's `UIMod_Hosav`) — a remote `dump` while
  XP is gained; then a raise by the widget's slot (native, rule 8) and, if the owner says so, a hub row «сколько держится опыт на экране».
  **08:58 the widget named by his frame:** the kill line «Каппа / +85 XP» (grey text over the killed creature, mid-screen right above the hero's head) —
  `[OWNER]` «вот виджет опыта, его бы сельно вверх, в центр верхей половины экрана»: the target is the CENTRE OF THE UPPER HALF of the screen.
  **Recon 08:59 (remote, read-only):** the widget is `W_Kill_xp_C`, owned by the game instance, NO parent and NO slot — added to the viewport directly (its place is
  set by `SetPositionInViewport` / alignment, most likely each kill at the creature's projected point). Next: which pak brings it (vanilla or a mod — grep the
  paks view / `retoc list`), its functions (`pult.sh "funcs W_Kill_xp_C"`), then a native fix of the place (rule 8) — or, if it is projected each kill, a hook
  on its show that sets the centre of the upper half. **Hosav's own options (09:02, `SaveUISettings_UIH_C`):** `XP_OnKill`, `XP_OnKill_Names`, `_Amount`,
  `_Background`, `_Sound`, `_CustomColor`, `_Color` — NO position and NO display time; so by HOUSE_RULES rule 8 the place is a native edit of `W_Kill_xp` (its
  position / alignment in its own graph — trace `PlayKill_Animation` and `Construct`), and a time row would be ours.

- **The rows scroll (2026-11-02 10:57, `[OWNER]` «в окне настроек Криника - лист с опциями, это скролящийся список. КОгда много пунктов - появляется скрол
  бар»):** the window height is the mockup's 845 always (`MIN_HEIGHT`; it followed the tallest live page before), the page scrolls in the kit's
  `SC_KrinikRows` (ScrollBox, Fill), whose bar shows only when the page does not fit. Cases SC1, SC2. `[NOT-TESTED]`.
- **DECIDED 2026-11-02 10:54 after review folder 59 (four variants on one corpse):** `[OWNER]` «фон 60, меньше на» · «30» · «даем это настройкой в моде UI
  криника» — the strip 30 % smaller (render scale 0.70) with the backing alpha 0.6, both as hub rows «Плашка трупа: размер / фон» (`ui_strip_scale` 0.70,
  `ui_strip_back` 0.60, applied by `krinik_ui_fixes.place_strip` on the strip's events; the kit ships the same defaults — `kit-conanui-edit.py` STRIP_SCALE /
  STRIP_BACKING_ALPHA). The places (08:57): «E Взять» −14 % / +6 %, the strip −22 % / 0 (shifts of the screen, rows `ui_pickup_x/y`, `ui_strip_x/y`; −8 and
  −15 were seen over the hero, frames p1 / s2f 10:40–10:42). Cases S1–S3, P1–P3 of `TC_conan_hub_rows_audit_2026-11-01.md`.
- **The owner's word 2026-11-02 08:54 on the corpse strip** (`WBP_ContainerInfo`, his frame: «Труп · Разделать труп · Труп» over a dark band): `[OWNER]` «можно
  эти плашки 1) сделать меньше на 25% 2) фон сдлеать более прозрачным?» — superseded by the decision above. Way: the kit (`kit-conanui-edit.py`, the strip block): the strip
  `OverlaySlot_5` content scaled to 0.75 (its render scale or the text sizes and paddings × 0.75 — the padding L/R 120 and the brush margins 0.40 scale with
  it), `Border_Underlay` brush colour alpha 0.8 → a lower value (show variants to the owner: 0.6 / 0.45 / 0.3 on one frame); then the kit build, a frame at
  the corpse (stand `_config/strip-open.sh`) before / after.

- **Hub rows «Плашки: по горизонтали / по высоте / размер / фон» (2026-11-06)** — renamed from «Плашка трупа: …»: the same four store keys `ui_strip_*` now drive
  the corpse / container strip AND the five other interaction prompts (bug 83).
- The FPS counter cannot be switched off alone since the merge (it had its own `enabled.txt`) — its row in the hub exists (skeleton), the store and the switch are plan 38 phase 2.
- The hub's «Закрыть» button does nothing on a click (a bare `WBP_ButtonBase`; the vanilla popups bind theirs natively) — Esc works through the pause section.
- The HUD blink section: tested 2026-10-30 (H1–H10, `testcases/reports/2026-10-30_conan-hud-blink-early.md`); the dim start 0.25 waits for the owner's eye;
  its cost per poll is unmeasured (os.clock 1 ms step). Trap paid there: `FindFirstOf(<widget class>)` returns the TEMPLATE in another widget's tree —
  take the live child from the event's HUD (`hud.W_SmoothHP`).
