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
- So vanilla Hosav blinks only at exactly 0 %.
- `Progress_Drink` — the same shape over `BP_HungerSystem.DrinkCurrent / DrinkMax` (field `DrinkAmount`), `NoWater`, flag `InNoWaterAnimation`;
  its `0.25` floats at `@uexp+152127` and `@uexp+152623`.
- Weight — in `Get_WeightText` (the weight text binding): `GetFloatStat(12, 0)` of the player (current weight) `GreaterEqual_DoubleDouble`
  `BP_EncumbranceSystem.GetEncumbranceMax()` → `PlayAnimation(OverEncumbered_Weight, 0, 0, Forward, 0.25)` + flag `InEncumberanceAnimation`; below
  max with the flag → one Reverse pass; `0.25` at `@uexp+112421` and `@uexp+112520`. `WeightVisible` only reads `WeightIndicator`.
- What blinks (the class's `AnimationBindings`, `_INST` exports): `NoFood` → `Border_EatImage`, `NoWater` → `Border_WaterImage` (both the border's
  `ContentColorAndOpacity`; the possessable name «Border_Weight» inside the animations is the author's copy-paste, the binding decides),
  `OverEncumbered_Weight` → `Image_Weight_Blinking` (`ColorAndOpacity`).
- The curves (ticks; keys at 0 · 30231 · 59925 — ≈0 · 0.5 · 1.0 s if the tick rate is 60000, to confirm live by `GetEndTime`): food/water —
  white (1,1,1,1) → RED (1,0,0,1) → white; weight — red (1,0,0) with alpha 0 → 1 (30062) → 0 (60197).
- The asset imports `LessEqual_DoubleDouble`, `Less_DoubleDouble`, `Greater_DoubleDouble`, `Multiply_DoubleDouble` — a threshold could be patched
  for food/water, but the weight compares weight ≥ max (no constant to change), so the early zone is driven from Lua (W36).

- Live (2026-10-30 14:47–14:50): the curve end is 0.999 s (food/water) and 1.003 s (weight) — the tick rate is 60000/s; below max weight the
  weight animation reports «playing» at its end with alpha 0 (Hosav's idle state, invisible).
- **Blink speed history** (rows `flt:Progress_Food|Progress_Drink|Get_WeightText 1.0 <speed>` in `UIMod_Hosav__W_SmoothHP.tsv`): author 1.0 →
  0.5 (2026-10-28, the owner: twice slower) → 0.25 (four times) → **0.30 (2026-10-30, «на 20% быстрее»)**; measured live 0.30 /s.
- A widget instance: take `W_SmoothHP` from the live HUD (`hud.W_SmoothHP` of `W_NewHealthUI_C`), never `FindFirstOf('W_SmoothHP_C')` — that returns
  the class TEMPLATE `…W_NewHealthUI_C:WidgetTree.W_SmoothHP` (EXP-0385).
- Rebuild after a recipe edit: `rebuild-krinik-paks.py --only UIMod_Hosav` builds, but its identity guard refuses an INTENDED change («1 of 228 chunks
  differ — НЕ СТАВЛЮ»); then copy `D:\Temp\kumm-rebuild-krinik\UIMod_Hosav-<n>\out\UIMod_Hosav.pak` into the library folder and `<game>\ConanSandbox\Mods`.

## Temperature icon stages (`W_SmoothHP::Get_TempImage`, 2026-11-01)

- `kismet-trace.py` on the legacy asset (NOT the author's `SUPERUI_Backup_ForFuckups/W_SmoothHP` — a `find` picks it first): the hero's
  `BPEnergyReceiver:GetEnergy` against doubles — comfort `≥ −20 AND ≤ 20` (`@uexp+101297`, `+101392`); heat `≥ 55 · ≥ 40 · ≥ 30 · ≥ 20`
  (`+101797`, `+102088`, `+102379`, `+102670`); cold `≤ −55 · ≤ −40 · ≤ −30 · ≤ −20` (`+102961`, `+103252`, `+103543`, `+103834`).
- The text shows other degrees than the energy: energy 21.1 → «32 °C», 33.0 → «39 °C» (≈ 19.6 + 0.59 × energy).
- Our colour of the temperature text (`KrinikConanUI:HudOutline`): red at ≥ 30, blue at ≤ −30, white between (the owner 2026-11-01 10:10).

## Our edits in the build

- Asset strings and layout — `_config/localization/asset-strings/UIMod_Hosav__*.tsv` (SaveUISettings_UIH, W_SmoothHP, W_UI_SettingsButton,
  DT_UIModuleTable_HosavNew, UIModuleTable_UIH, BPFL_Hosav_UI).
- The «k» decimal (2026-10-30), server metrics off, the two-column layout (2026-10-26).
- The rebuilt outer pak is uncompressed — 2–3× larger than the author's (26 → 51 MB), no effect on the game.

## Open

- W36 done 2026-10-30 (speed 0.30 here, the early zone in KrinikConanUI:HudBlink). Since 2026-11-01 12:1x the early zone is OUR colour tween, not these
  animations (`PlayAnimationTimeRange` ignores its end from Lua — EXP-0422); KrinikConanUI stops `NoFood` / `NoWater` / `OverEncumbered_Weight` while it
  drives an icon. Trap of this asset: after its first pass `OverEncumbered_Weight` idles «playing» at the last key (alpha 0) and rewrites the image every frame;
  while food is at exactly 0 % the weight image is overridden too. The pink-to-red look — the owner's eye (review folder 45).
