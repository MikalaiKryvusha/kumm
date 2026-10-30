# Mod notes — Hosav's Custom UI (`UIMod_Hosav`, Workshop 3748867573)

> **Created:** 2026-10-30 · **Parent:** `[OWNER]` «странно, что ты над модами этими уже неделю работаешь и у тебя НЕ ЗАПИСАНЫ ПО НИМ КОНСПЕКТЫ!!!» ·
> «и ты их каждый раз по-новой словно разбираешь, как первый раз видишь!» · «а не по тысячу раз переоткрывать одно и то же!» · 2026-10-30 ≈14:28
> **Status:** living notes — the ONE place for this mod's internals; the knowledge-hook refuses work on the mod until this file is read in the session
> **Outbound:** —

**What it is.** The build's HUD: health/stamina bars, food, water, weight, armour, temperature, XP line, compass, the enemy target frame, the party
side panel, a settings window. KRINIK MODIFIED in the build: the pak is rebuilt by `rebuild-krinik-paks.py` from the manifest field `krinikBuild`
(asset string tables `ConanExiles/_config/localization/asset-strings/UIMod_Hosav__*.tsv` + `patch-mod-asset.py` rows).

## How to look inside (the tools — do not rediscover)

- Extract one asset to legacy + JSON: `python -I -X utf8 _config/devkit/patch-mod-asset.py extract UIMod_Hosav <Asset> <work>` (≈10 s).
- Export table: `_tools/src/uaj/bin/Release/net8.0/uaj.exe exports <legacy .uasset> VER_UE5_8 > exports.tsv` (functions are `RawExport` rows;
  `VER_UE5_6` lists no functions).
- A function as a tree: `python -I -X utf8 _config/devkit/kismet-trace.py <legacy .uasset> exports.tsv <Asset>.json <Function>`.
- Names: the JSON's `NameMap` (the raw Zen headers in `Conan Exiles Mods/_text-extract-3.0.1/3748867573/x/…` glue names together).
- The knowledge-hook lock: read THIS file in its own tool call before the first extract of the session — a Read sent in the same message as the
  extract is not in the session log yet and the extract is refused (seen 2026-10-30 ≈14:4x).
- Edit: `patch-mod-asset.py build` rows — `flt:<Function>\t<old>\t<new>`, `dbl:…`, `int:…`, `bool:<Function>@<n>…`, `prop:<Export>/<path>…`.

## Assets and what they do

| Asset | Role | Facts |
|---|---|---|
| `W_SmoothHP` | the top HUD (bars, food, water, weight, armour, temperature, XP, corruption) | 313 exports, 472 imports; author's copy `SUPERUI_Backup_ForFuckups/W_SmoothHP` — ignore. Slots `CanvasPanelSlot_N` → element; layout edit `prop:CanvasPanelSlot_N/LayoutData/Offsets/Left\|Top\|Right\|Bottom` (table `UIMod_Hosav__W_SmoothHP.tsv`). Build 2026-10-26: two columns, rows 77 · 102 · 127 — damage `_12` icon / `_13` text · armour `_8` / `_10` · temperature `_9` / `_11` (column −240 / −220); food `_22`, bar `_35` / `_23` · water `_24`, bar `_33` / `_25` · weight `_20` / `_21` (column −10 / 10) — order by the owner's word ≈15:45. Top row 5: XP `_16` icon (shrunk to 0×0) / `_17` text (−240), corruption `_14` / `_15` (−10 / 10). Bars: health `_36`, stamina `_1`, background `_27` (T −11, height 160). Functions (`RawExport`): `Progress_Food`, `Progress_Drink`, `Get_WeightText`, `WeightVisible`, `Tick`, `FoodProgressColor`, `WaterProgressColor`, `Get_AmountEatText`, `Get_AmountDrinkText`, `Get_TemperatureText`, … |
| `W_NewHealthUI` | the root HUD widget (`W_NewHealthUI_C`), holds `W_SmoothHP` | our `KrinikConanUI` sections attach by its creation event (`/Game/Mods/UIMod_Hosav/W_NewHealthUI.W_NewHealthUI_C`): FPS counter, text outline (51 TextBlocks, Roboto Bold ×1.1), F1 label |
| `BlueprintLibrary/BPFL_Hosav_UI` | helpers | `TextOverflowPrevention_Numbers`: ≥ 100 000 → «k», ≥ 1 000 000 → «M»; build 2026-10-30: «k» with ONE decimal truncated (`Divide_IntInt` 10→100, 10000→100000, `/100.0`→`/10.0`, `int:` rows) |
| `SaveUISettings_UIH` | settings save object, slot `HosavUISave_New` (the file appears after the player saves settings) | build default: server metrics off (`ServerInfo` false) |
| `W_UI_SettingsButton` | «Настройки интерфейса» — its own viewport layer (`CanvasPanel_0` → `Overlay_0` → `Border_0` → vanilla `WBP_ButtonBase`) | author polls `Delay 3.0` + `IsModuleActive(CharacterInventory)` (silenced in the build; visibility by `KrinikConanUI:PauseGameInMenu` on `XCS_Panel`); click → `ActivateModule('CharacterInventory', False)` then `ActivateModule('HosavUIsettings', True)`; moved into the hub bar it stops clicking (2026-10-29) |
| `W_ExampleWidget_User` | the settings window | module `HosavUIsettings` in `UIModuleTable_UIH` (twin `HosavUISettings` in `DT_UIModuleTable_HosavNew`) |
| `W_EnemyHealthbar_InHUD` / `W_NewEnemyHealth` | the enemy target frame in the HUD (not the bar over the mob's head) | — |

## Food, water and weight blink (recon 2026-10-30 ≈14:2x, plan 36 W36)

- Three widget animations in `W_SmoothHP`: `NoFood`, `NoWater`, `OverEncumbered_Weight` (exports 209–211, `_INST` 309–311); each holds ONE
  `MovieSceneColorTrack` — the blink is a COLOUR animation. Flags `InNoFoodAnimation`, `InNoWaterAnimation`, `InEncumberanceAnimation`; an image
  `Image_Weight_Blinking`.
- `Progress_Food` (the food bar's percent binding — runs every frame): `v = FClamp(FoodCurrent / FoodMax, 0, 1)` (BP_HungerSystem of the player's
  `BasePlayerChar_C`); `EqualEqual_DoubleDouble(v, 0.0)` → if not playing: `PlayAnimation(NoFood, StartAt 0, NumLoops 0 = forever, Forward,
  PlaybackSpeed 0.25)`, flag on; when `v > 0` and the flag is on: `PlayAnimation(NoFood, 0, 1, Reverse, 0.25)`, flag off. The two `0.25` floats —
  `@uexp+154246` and `@uexp+154742` of the legacy asset extracted 2026-10-30.
- So vanilla Hosav blinks only at exactly 0 %. Not traced yet: `Progress_Drink` (expected the same shape), the weight path (where
  `OverEncumbered_Weight` is played — `Get_WeightText` / `WeightVisible`), which widget each colour track binds.

## Our edits in the build

- Asset strings and layout — `_config/localization/asset-strings/UIMod_Hosav__*.tsv` (SaveUISettings_UIH, W_SmoothHP, W_UI_SettingsButton,
  DT_UIModuleTable_HosavNew, UIModuleTable_UIH, BPFL_Hosav_UI).
- The «k» decimal (2026-10-30), server metrics off, the two-column layout (2026-10-26).
- The rebuilt outer pak is uncompressed — 2–3× larger than the author's (26 → 51 MB), no effect on the game.

## Open

- W36 (plan 36): blink 20 % faster (PlaybackSpeed 0.25 → 0.30), from 10 % food/water and from 90 % of max weight; dim → full brightness by the
  blinking icon's `RenderOpacity` from the `KrinikConanUI` HUD section (the colour track does not touch it).
