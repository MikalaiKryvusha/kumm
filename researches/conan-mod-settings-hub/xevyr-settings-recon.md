# Research — Xevyr's five mods: every option of their settings windows and where each value lives

> **Created:** 2026-11-01 · **Parent:** plan 40.3 next step (the owner's decision 2026-11-01 13:40: «Окна «Моды Xevyr'а» - пооткрываешь его моды, посмотришь, какие он опции дает - вот они и должны быть не в его кривых косых окнах, а в нашем красивом»)
> **Status:** recon done — live game 2026-11-01 17:53–18:03 +03:00 (Conan Exiles 3.0.1, single player), then bytecode traces of the five windows offline
> **Outbound:** —

**Method.** Each window was opened by the remote (`GUIModuleController:ActivateModule(<module>, true, false)`), its live widget tree walked
(labels, CheckBox state, Slider value/min/max/step, ComboBoxString options, EditableTextBox text, tooltips), its functions and fields listed, its
SaveGame instance and the SaveGame class default object (`Default__…`) read. Then the window asset was extracted
(`patch-mod-asset.py extract`) and the save/load/handler functions traced (`kismet-trace.py`) to get the slider formulas and the apply path.
No setting was changed; no «Сохранить»/«Подтвердить»/«ОК» was pressed. Scratch (trees, function lists, traces, frames):
`D:\Temp\claude\d--work-ai-sandbox-KUMM\5edabf9c-bb7a-4f41-a2b4-217f63f79c26\scratchpad\recon\`.
[seen] = read from the live game or from the asset's bytecode this session; [inferred] = reasoned, not observed.

**Reading the slider column.** Every UMG `Slider` in these windows runs 0…1 with step 0.01 [seen]; the mod turns its value `v` into the saved
number by a formula in the handler and the save function, and back in the load function [seen in bytecode]. «snap N» = the mod's `SnapToSteps`
rounds `v` to N steps. Xevyr's own slider widgets (`Xev_UI_Slider_C`, `AMR_UI_Slider_C`) hold real units instead (`MinValue`, `MaxValue`,
`StepSize` read live).

## Summary

| Mod | Module · window class | Options | SaveGame class · slot | Applied where | Save button |
|---|---|---|---|---|---|
| The Damage Meter | `DN_UI_Settings` · `DN_UI_SettingsWindow_C` | 13 (21 controls) | `/Game/Mods/DamageNumber/DN_SG_SaveSettings.DN_SG_SaveSettings_C` · `DamageMeter` | client | «Сохранить» → `SaveSettings`, «Отмена» → `CancelSettings` |
| Proximity Party | `PrP_Settings` · `PrP_UI_Settings_C` | 4 | `/Game/Mods/ProximityParty/PrP_SAV_WindowSettings.PrP_SAV_WindowSettings_C` · `ProximityParty` | client | only «Закрыть» → `SaveSetting` (no cancel) |
| Simple Minimap | `SM_UI_Settings` · `SM_UI_Settings_C` | 10 (14 controls + 10 swatches) | `/Game/Mods/Simple_Minimap/SM_BP_SaveGame.SM_BP_SaveGame_C` · `SimpleMinimap` | client; one admin row → server | «Сохранить» → `SaveSettings` + `EnableSettings`, «Отмена» → `CancelSettings` |
| Lore & Loot Highlight | `LLH_Settings` · `LLH_W_Settings_C` | 5 | `/Game/Mods/LLHighlight/LLH_SAV_Settings.LLH_SAV_Settings_C` · `LLH_Settings` | client | «Подтвердить» → `SaveSettings` → `ApplySettings`, «Отмена» → `RevertSettings` |
| Al-Merayah Reborn | `AMR_Settings` · `AMR_UI_AdminSettings_C` | 13 | none — fields of the mod controller actor `AMR_MC_AlmerayahReborn_C` | **server** (RPC) | «ОК» → `AMR_AC_PlayerCont_C.ServerSaveSettings(13 args)` |

Slot names: DM, PrP, SM — the file `ConanSandbox/Saved/SaveGames/<slot>.sav` carries that SaveGame class path inside [seen]; SM and LLH also
by the window field `SaveName` = `SimpleMinimap` / `LLH_Settings` [seen]. `LLH_Settings.sav` does not exist yet — the player never pressed
«Подтвердить» [seen: directory listing]. All five windows opened; every row was read.

## 1. The Damage Meter — `DN_UI_SettingsWindow_C`

Window fields: `SaveGame` (→ `DN_SG_SaveSettings_C`), `dmgWidget` (`DN_UI_DmgWidget_C`), `dmgComponent` (`DN_AC_Main_Contr_C` on the player
controller), temps `tempSegmentTimer`, `tempRefreshTimer`, `oldUIScale`, `oldOpacity` [seen]. Title «Настройки». The console command
`dc damagemetersettings` opens this window (the key row's tooltip) [seen].

| Label (RU, verbatim) | Control | Widget | Writes | Applied | Default |
|---|---|---|---|---|---|
| Масштаб | slider; `UIScale = 0.5 + v/2` (0.5–1.0), no snap | `UIScaleSlider` | `UIScale` (double) | live preview on drag (`ScaleWindows`); saved by `SaveSettings`; also `breakdownUI` | 1.0 [seen CDO] |
| Цвет темы | colour button (`CP_UI_ColorButton_C` → opens `CP_UI_ColorPicker_C`) | `ThemeColor_Selector` | `ThemeColor` (LinearColor) | preview `ApplyTheme`; saved by `SaveSettings` | (0.005, 0.012, 0.024, 0.40) [seen CDO] |
| Непрозрачность | slider; saved `w_Opacity = 0.30 + v·0.65` (0.30–0.95), no snap | `SLD_Opacity` | `w_Opacity` (double) | preview `ApplyTheme` with `0.30 + v·0.55` (!) | 0.85 [seen CDO] |
| Сворачивать в угол | dropdown: «Вверху слева» · «Вверху справа» · «Внизу слева» · «Внизу справа» | `DDL_Anchor` | `RestoreAnchor` (int 0–3 via `GetAnchorIndex`) | `dmgWidget.SetRestoreAnchor` | 0 «Вверху слева» (our edit; author 2) [seen CDO] |
| Спрашивать о сбросе при входе | checkbox | `resetConfirmChk` | `resetConfirm` | saved only | false [seen CDO] |
| Время в журнале боя | checkbox | `ChkTimeStamp` | `bTimeStampLog` | `dmgComponent.bTimeStampLog`, `dmgWidget.ToggleTimeStamps` | false [seen CDO] |
| Всплывающие цифры урона → Игрок | checkbox | `chk_FloatingN` | `floatingNumbers` | `dmgComponent.hFloatingDamage` | true [seen CDO] |
| Всплывающие цифры урона → Под слежкой | checkbox | `chk_FloatingTracked` | `FloatingFollowerNumbers` | `dmgComponent.hFloatingDmgForTracked` | true [seen CDO] |
| Цвет полосы игрока | colour button | `PlayerColor_Selector` | `PlayerBarColor` (LinearColor) | `dmgWidget.playerBarcolor` | (0.522, 0.004, 0.000, 0.702) [seen CDO] |
| Цвета полос отслеживаемых | 9 colour buttons in `FollowerColorGrid` | `Follower1_Selector` … `Follower9_Selector` | `FollowerColors` (array of 9 LinearColor, gathered by `GetColorPickers`) | `dmgWidget.FollowerColors` + `ReinitializeColors` | 9 colours, alpha 0.70 (list in scratch `dn_*`) [seen CDO] |
| Частота обновления полос (только вид) | slider, snap 19; `refreshTimer = 0.05 + v·0.95` (0.05–1.0 s, step 0.05) + read-only text «0,2 с» | `refreshSlider` + `refreshText` (disabled) | `refreshTimer` (double) | `dmgWidget.refreshTimer` | 0.2 [seen CDO] |
| Пауза до новой стычки | slider, snap 10; `segmentTimer = 5 + v·10` (5–15 s, step 1) + read-only text «7 с» | `segmentSlider` + `segmentText` (disabled) | `segmentTimer` (double) | `dmgComponent.segmentTimer` | 7.0 [seen CDO] |
| Клавиша мыши (since 2026-11-01 20:4x «Клавиша вызова курсора», the owner's name) | key selector (`InputKeySelector`) | `key_MouseKey` | `MouseKey` (InputChord, `.Key`) | mod controller `MouseKey` (`GetModController`), `dmgWidget.SetHotkeyLabel` | F1 [seen CDO] |

Buttons: `Btn_Defaults` (the ↻ beside the logo, tooltip «Вернуть настройки по умолчанию») → `ResetSettings`; «Донат» `Button_0`, «Discord»
`Button_1` (open a site); «Сохранить» `SaveButton` → `SaveSettings` → `Close`; «Отмена» `CancelButton` → `CancelSettings` → `Close` [seen].

`SaveSettings` [seen in bytecode]: writes every field above into `SaveGame`, `SaveGameToSlot(SaveGame, <slot>, 0)`, then pushes the values into
`dmgWidget` / `dmgComponent` / the mod controller and calls `SaveSizeAndPos` / `SaveLogSizeandPos`. `InitializeControls(isReset)` is the reverse
(reads `SaveGame`, `slider = (value − min)/range`). SaveGame fields with no row: `DmgMeter_Size/_Pos`, `CombatLog_Size/_Pos`, `isDmgDone`,
`isLogShown`, `isWindowHidden`, `bIsTotal` — the meter's own state [seen].

## 2. Proximity Party — `PrP_UI_Settings_C`

Window fields: `SaveGame` (→ `PrP_SAV_WindowSettings_C`), `Widget` (`PrP_UI_MainList_C`), `oldWindowPos`, `oldUIScale` [seen]. Title «Группа
поблизости: настройки». No tooltips.

| Label (RU, verbatim) | Control | Widget | Writes | Applied | Default |
|---|---|---|---|---|---|
| Включено: | checkbox | `IsEnabled` | `IsEnabled` | list `WindowBorder` visibility; `PrP_AC_PlayerChar_C.Enabled` | true [seen CDO] |
| Масштаб: | slider, no snap; `UIScale = 0.5 + v·0.5` (0.5–1.0) | `ScaleSlider` | `UIScale` (double) | live preview on drag (list `SetScale`) | 0.8 [seen CDO] |
| Радиус отслеживания: | slider, snap 55; `trackRadius = 500 + v·5500` (500–6000, step 100) + text «4 000» | `RadiusSlider` + `RadiusText` | `trackRadius` (double) | `PrP_AC_PlayerChar_C.DetectionRange` | 4000 [seen CDO] |
| Макс. отслеживаемых: | slider, snap 14; `maxChars = round(1 + v·14)` (1–15) + text «5» | `widgetCount` + `maxTrackedText` | `maxChars` (int) | `PrP_AC_PlayerChar_C.CharLimit` | 5 [seen CDO] |

Button: «Закрыть» `Button_0` → `SaveSetting` (writes the four fields, `SaveGameToSlot`, applies to the component) → `Close` [seen]. There is no
cancel: closing by the button always saves. SaveGame field with no row: `position` (the list's drag position; live (40, 500)) [seen].
Side effect seen: `ProximityParty.sav` got a new mtime (18:00:12) during the second open/close of this window by `ActivateModule`, values unchanged
— `LoadSave` (load or create, then `SaveGameToSlot`) runs at construction [mtime seen; cause inferred].

## 3. Simple Minimap — `SM_UI_Settings_C`

Window fields: `SaveGame` (→ `SM_BP_SaveGame_C`), `SaveName` «SimpleMinimap», `Minimap` (`SM_UI_Minimap_C`), `ModController`
(`SM_BP_ModController_C`), `color`, `oldColor`, `color_H/S/V/A`, `UIScale`, `clampRange`, `timeDisplay`, `OldPosition`, `ColorArray` (10 swatch
colours) [seen]. Title «Настройки миникарты». Console command `dc minimapsettings` (the key row's tooltip) [seen].

| Label (RU, verbatim) | Control | Widget | Writes | Applied | Default |
|---|---|---|---|---|---|
| Настройки цвета → Быстрый выбор | 10 swatch buttons (colours from `ColorArray`) | `Color1` … `Color10` | window `color` → `literalColor` | live preview (`SetColorSliders`, `AdjustColorPreview`, `Minimap.InitColors`) | — |
| Настройки цвета → Тон | slider; `H = v·360` | `color_HueSlider` | window `color_H` → `color` → `literalColor` | live preview | from `literalColor` |
| Настройки цвета → Насыщенность | slider; `S = v` | `color_SaturationSlider` | `color_S` → `literalColor` | live preview | 〃 |
| Настройки цвета → Яркость | slider; `V = v` | `color_ValueSlider` | `color_V` → `literalColor` | live preview | 〃 |
| Настройки цвета → Прозрачность | slider; `A = 0.15 + v·0.85` | `color_AlphaSlider` | `color_A` → `literalColor` | live preview | 〃 |
| (hex box beside the preview) | text, `#RRGGBBAA`, on commit `HexToRGB` | `colorHexTextbox` | `color` → `literalColor` | live preview | «#800000B0» |
| (the colour group as a whole) | — | — | `literalColor` (LinearColor, sRGB via `ToSRBG`/`FromSRBG`) | — | (0.223, 0, 0, 0.690) [seen CDO] |
| Вращать миникарту | checkbox | `hRotate` | `bRotate` | `EnableSettings`: `Minimap.hRotate`, `CompassN` visibility, `MaskRotation` param | false [seen CDO] |
| Показывать координаты | checkbox | `ChkCoordinate` | `bShowCoordinates` | `Minimap.ToggleCoordinates` | true [seen CDO] |
| Масштаб | slider; `UIScale = 0.5 + v·0.5` (0.5–1.0) | `scaleSlider` | `UIScale` (double) | live preview `MinimapScale.SetUserSpecifiedScale` + `ClampPositionToScreen` | 0.85 [seen CDO] |
| Дальность видимости маркеров | slider; `markerClampR = 150 + v·400` (150–550) | `clampSlider` | `markerClampR` (double) | live preview `MinimapWidget.markerClampRange` | 250 [seen CDO] |
| Показ времени: | dropdown: «Сервер» · «Компьютер» · «Игра» | `timeSelector` | `TimetoShow` (int 0/1/2 via `timeDisplay`) | `Minimap.TimetoShow` | 0 «Сервер» [seen CDO] |
| Показывать членов клана | checkbox | `showGuild` | `guildTracking` | `MinimapWidget.guildTracking`; disabled + unchecked when the server's global tracking is off | true [seen CDO] |
| Везде (admin only) | checkbox, tooltip «Включает и выключает отслеживание членов клана по всему серверу» | `guildCheckGlobal` + label `guildGlobalTxt` | `SM_BP_ModController_C.globalGuildTracking` via `SetGlobalGuildTracking` — **server-wide**, only if `PlayerRef.IsAdmin` | on «Сохранить» | true [seen MC]; Hidden live (not admin) [seen] |
| Сместить панель путешествия вниз | checkbox | `chkJourney` | `bMoveJourney` | `MinimapWidget.mJourney` + `UpdateJourneyPosition` | true [seen CDO] |
| Клавиша курсора мыши (since 2026-11-01 20:4x «Клавиша вызова курсора») | key selector | `keySel_MouseHotkey` | `mouseHotkey` (InputChord) | mod controller `mouseHotkey` | F1 [seen CDO] |

Buttons: «Донат» `Button_0`, «Discord» `Button_1`, «?» `HelpButton` (opens module `SM_Tutorial`, cancels the edits), «Сохранить» `SaveButton` →
`SaveSettings` → `EnableSettings` → `Close`, «Отмена» `CancelButton` → `CancelSettings` (restores colour, scale, marker range, position) →
`Close`; an `Escape` input action in the window [seen]. `SaveSettings` also stores the minimap's current position into `w_Position` [seen].
SaveGame fields with no row: `b12hTime`, `ColorOption`, `zoomlevel` (the ± on the map), `bEnabled`, `TutorialHidden`, `mapHintWatched` [seen].

## 4. Lore & Loot Highlight — `LLH_W_Settings_C`

Window field: `SaveName` «LLH_Settings» [seen]. Title «Подсветка знаний и добычи — настройки». No tooltips.

| Label (RU, verbatim) | Control | Widget | Writes | Applied | Default |
|---|---|---|---|---|---|
| Подсветка знаний | checkbox (`Chk_W_CustomCheckbox_C`, inner `MainCheckbox`) | `chk_HighlightLore` | `LoreHighlightEnabled` | `UpdateSettings` | true [seen CDO] |
| Цвет подсветки знаний | colour button (`XCP_UI_ColorButton_C` → creates `XCP_UI_ColorPicker_C`, `AddToViewport` Z 1000) | `LoreColorPicker` | `LoreHighlightColor` (LinearColor) | `UpdateSettings` | (1, 0, 0, 1) [seen CDO] |
| Подсветка сундуков с добычей | checkbox (custom) | `chk_HighlightLoot` | `LootHighlightEnabled` | `UpdateSettings` | true [seen CDO] |
| Цвет подсветки сундуков с добычей | colour button | `LootColorPicker` | `LootHighlightColor` | `UpdateSettings` | (0, 1, 0.933, 1) [seen CDO] |
| Яркость подсветки | `Xev_UI_Slider_C` (shows 10–100, step 1, slider + number box «100»); `HighlightIntensity = 0.1 + percent·0.9` | `sld_Intensity` | `HighlightIntensity` (double 0.1–1.0) | `UpdateSettings` | 1.0 (shown 100) [seen CDO] |

Buttons: «Подтвердить» `btn_OK` → `SaveSettings(LSave)` (writes the five fields, `SaveGameToSlot(SaveName, 0)`) → `ApplySettings` → `Close`;
«Отмена» `Btn_Cancel` → `RevertSettings` → `Close` [seen]. `ApplySettings` = `GetPlayerCharacter(0)` → `LLH_AC_PlayerComp_C.UpdateSettings(LoreEnabled,
LootEnabled, Intensity, LoreColor, LootColor)` — a plain BP function, client [seen signature]. The component keeps the same five fields and its own
`SaveName` «LLH_Settings» and loads them at begin play [seen].

## 5. Al-Merayah Reborn — `AMR_UI_AdminSettings_C`

Window field: `MCRef` (`AMR_MC_AlmerayahReborn_C`, the mod controller actor in the level) [seen]. Title «Штурм Аль-Мерайи: настройки». Rows carry
custom tooltips (`AMR_UI_CustomTooltip_C`, set by `SetTooltipsRec` on the row containers) [seen]. Defaults = the controller's class default object.

| Label (RU, verbatim) | Control | Widget | Writes (`ServerSaveSettings` arg → controller field) | Default | Tooltip |
|---|---|---|---|---|---|
| Включено | checkbox (custom) | `chk_Enabled` | `Enabled` → `isFortActive` (replicated, `OnRep_isFortActive`, `ToggleFortLevel`) | true | «Переключает между крепостью Аль-Мерайя и старыми руинами» |
| Уборка трупов | checkbox | `chk_CorpseClean` | `corpseC` → `corpseCleanup` | true | «Быстро убирает трупы противников Аль-Мерайи, чтобы игра не начала тормозить» |
| Без добиваний | checkbox | `chk_FatalitySuppress` | `NoFatality` → `disableFatalities` | true | «Отключает добивания противников Аль-Мерайи, чтобы бой с толпой шел плавнее» |
| Легендарная катана | checkbox | `chk_Musashi` | `spawnKatana` | true | «Размещает в крепости легендарный клинок Мусаси» |
| Взрывчатка | checkbox | `chk_Explosives` | `spawnExplosives` | true | «Размещает в крепости взрывающиеся горшки, которые можно забрать» |
| Таран | checkbox | `chk_Ram` | `spawnBatteringRam` | true | «Размещает в крепости тараны, которые можно обыскать» |
| Золота в куче, не больше | `AMR_UI_Slider_C` 10–10000, step 10, number box | `sld_MaxGold` | `maxGoldPerPile` (int, `Round`) | 3000 | «Задает, сколько золота самое большее можно получить из каждой кучи в зале босса» |
| Время возрождения: поле боя | slider 5–600 s, step 0.5, one decimal | `sld_FieldRespawn` | `FieldCD` → `FieldRespawnCD` | 30 | «Задает время возрождения противников за стенами крепости» |
| Время возрождения: лучники | slider 5–600, step 0.5 | `sld_ArcherRespawn` | `ArcherCD` → `ArcherRespawnCD` | 30 | «Задает время возрождения лучников на стенах» |
| Время возрождения: стены | slider 5–600, step 0.5 | `sld_BattlementRespawn` | `BattlementCD` → `BattlementRespawnCD` | 20 | «Задает время возрождения противников внутри внешних стен» |
| Время возрождения: внешний двор | slider 5–600, step 0.5 | `sld_BaileyRespawn` | `BaileyCD` → `BaileyRespawnCD` | 20 | «Задает время возрождения противников во внутреннем дворе цитадели» |
| Перерыв между контратаками | slider 5–600, step 0.5 | `sld_CounterCooldown` | `CounterCD` → `CounterAttackCD` | 25 | «Задает перерыв между контратаками, когда игроки повреждают крепость» |
| Размер отряда контратаки | slider 1–10, step 1 | `sld_CounterAmount` | `CounterSize` → `CounterAttackSize` (int, `Round`) | 3 | «Задает, сколько противников придет в отряде, который контратакует штурмующих крепость игроков» |

All defaults [seen] on `Default__AMR_MC_AlmerayahReborn_C`; ranges [seen] on the live slider widgets. Apply [seen in bytecode]: at `Construct`
the window reads every field from `MCRef` (`GetMC`); «ОК» `btn_OK` → `GetPlayerController(0)` → component `AMR_AC_PlayerCont_C` →
`ServerSaveSettings(Enabled, NoFatality, corpseC, FieldCD, ArcherCD, BattlementCD, BaileyCD, CounterCD, CounterSize, spawnKatana, spawnExplosives,
spawnBatteringRam, maxGoldPerPile)` — flags `0xC2000C0` = Net + NetReliable + **NetServer**, a server RPC; «Отмена» `Btn_Cancel` → `Close`.
The controller has a plain `SaveSettings` with the same 13 parameters (flags `0xC020000`, no Net) — the RPC's server side most likely calls it
[inferred]. No `.sav`: the values live on the controller actor, which has a `PersistenceComponent` → the world database [inferred].

## Hard to bind from our own window

1. **Colour rows** (DM: theme, player bar, 9 followers; SM: swatches + H/S/V/A + hex; LLH: two). The game's settings rows have no colour control;
   each mod opens its OWN picker popup (`CP_UI_ColorPicker_C`, `XCP_UI_ColorPicker_C` added to the viewport at Z 1000). We need our own picker or
   a reuse of theirs [inferred].
2. **Key selectors** (DM «Клавиша мыши», SM «Клавиша курсора мыши») — `InputKeySelector` writing an `InputChord`, also pushed into the mod
   controller. Both tooltips warn that a key the game swallows locks the player out (`dc damagemetersettings` / `dc minimapsettings`) [seen].
3. **Writing the SaveGame is not applying.** Every mod pushes the values into live objects after the save (DM: `dmgWidget`, `dmgComponent`, the
   controller; PrP: `PrP_AC_PlayerChar_C`; SM: `EnableSettings` on the minimap + controller; LLH: `UpdateSettings`; AMR: the server RPC). A bound row
   must call that path or the mod's own function; the cleanest single entry per mod: LLH `LLH_AC_PlayerComp_C.UpdateSettings(…)` + the save,
   AMR `AMR_AC_PlayerCont_C.ServerSaveSettings(…13)`, the other three only through their window's `SaveSettings`/`SaveSetting` [inferred].
4. **Slider maths.** The saved numbers are not the slider values: each row needs its formula and snap (tables above); DM opacity previews with
   `0.30 + v·0.55` but saves `0.30 + v·0.65` — an author bug (preview tops at 85 %, the saved value at 95 %) — FIXED in our pak 2026-11-01 18:09 (`games/ConanExiles/mods/DamageNumber.md` edit 5) [seen in bytecode].
5. **Server rows.** AMR entirely (server RPC; the class is named «AdminSettings» — who may open it on a dedicated server is not read [open]) and SM
   «Везде» (only for `IsAdmin`; hidden live in single player — the hero is not admin there) [seen].
6. **PrP has no cancel** — its only button saves; and constructing the window rewrites `ProximityParty.sav` [seen mtime].
7. **AMR tooltip vs label** — RESOLVED 2026-11-01 18:17: the tooltips match the author English; OUR label for «Bailey» was the mistranslation (now «the Keep courtyard», pack `locres-fixes-2026-11-01.tsv`, seen in the window) — — «Время возрождения: внешний двор» says «во внутреннем дворе цитадели», «…: стены» says «внутри внешних стен»: one of
   the two texts is likely mistranslated (bailey = внешний двор) — worth a look before we reuse the tooltips [inferred]. The Battlement/Bailey
   argument wiring is taken from the parameter names; the tracer prints same-named locals alike, so the bytecode order alone does not prove it
   [inferred].
8. **Live values = defaults** in this profile for every row, except state fields outside the windows (DM `isLogShown`/`isWindowHidden`, SM
   `TutorialHidden`/`mapHintWatched`) [seen].
