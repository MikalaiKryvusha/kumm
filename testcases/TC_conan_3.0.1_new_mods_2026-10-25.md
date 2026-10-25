# Test cases — 13 Workshop mods added to the Conan 3.0.1 pack, Russian for all of them

> **Created:** 2026-10-25 · **Basis:** `plans/33_conan_pereezd_3.0.1.md` steps 14, 21–25 and 27; the owner's words 2026-10-25
> «нужна русификация» (each mod), «Сборка, которую мы собираем - должна быть внутри согласованной быть, безконфликтной»;
> compatibility findings `ConanExiles/docs/12` (section «Совместимость»), `docs/02` §2.1 · **Contour:** the owner's install
> `D:\Games\Conan Exiles 3.0.1` (CL-379176), test hero (copy in `mods/_save-backup/3.0.1-test-hero-2026-10-25`), pack
> `D:\work\ai_sandbox\ConanExiles` at `b7c00ef`+, `Language=ru`, game driven in the background (memory `conan-game-stays-in-background`)
> under the machine lock.

Dimensions covered: mount of every new pak; Russian text of every translated mod on one of its own screens; the mod that brings its own
Russian (Rideable Pets); the conflicts named by the matrix — file overrides that roll back a 3.0 change (Ymir's heightmap, Shemite
cinematic cell, LegitReligious stat table), the file shared by two mods (Bosses vs LBPR), runtime table merges (game log); the encounter
settings objects. Not covered on purpose: full gameplay of each mod (the owner's play), the multiplayer path, performance with 56 paks
(a separate measured run if the owner reports drops).

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| D1 | Deploy self-check | `Deploy-ModPack.ps1 -Deploy -PackDir <pack>`; then `_config/deploy-localization.py` | `verify … 0 missing`; locres hash = pack | pass | 2026-10-25 11:32: 63/63 entries, 174 files, verify 80 present 0 missing; locres `2d0a7526…` «совпадает» (7 049 entries) |
| M1 | No pak rejected | launch → menu; grep game log | no `too old`, no `Failed to mount`, no `ValidateMod_` error | pass | launch 11:34:10; game log 11:34:56 — none of the four strings |
| M2 | All paks mounted | same log; ConanModPackStatus line | `Mounting mod pak` count = lines of `modlist.txt` (57 with Era of Trials); `СБОРКА: моды 57/57` | pass | 57 × `Mounting mod pak` = 57 lines; `СБОРКА: моды 57/57` 11:34:49 (42/57 at 11:34:45 — mounting still in progress); menu frame m01 — Russian, «Версия #379 176», frame and offline modal hidden |
| W1 | World entry with the test hero | Continue → world | `LoadMap(ConanSandbox)`, HUD frame, process alive 60 s | — | |
| T1 | Damage Meter in Russian | hold F1 / open its window | «Счётчик урона», no English labels of the table | — | |
| T2 | Exiles Fishing in Russian | inventory / its panel | fishing item names and panel labels Russian | — | |
| T3 | Ironlight in Russian | knowledge / build menu → Town Center item and window | names, journey step text Russian | — | |
| T4 | Map mods in Russian | knowledge menu or item search for Caverns of Set / Shemite / Ymir items | item names Russian | — | |
| T5 | Night Terrors / Ambush / RNF / Riding Thralls / Waystones in Russian | their admin window / item / NPC name via remote dump | Russian strings | — | |
| T6 | Rideable Pets own Russian | its knowledge entry | text from `ST_RideablePets_ru` («Наука дрессировщиков») | — | |
| H1 | Hosav settings button (owner's report) | inventory bottom-left, with and without our locres (`deploy-localization.py --remove`) | button present in both, or the cause named | — | |
| G1 | Runtime table merges | `python _config/who-overwrites-table.py` over the game log | list of tables written by ≥2 mods; spawn table: Diverse Barkeeps vs RNF Distribution named | — | |
| Y1 | Ymir's Respite heightmap x3_y5 (changed in 3.0) | teleport to the cell; frame | no floating / sunken Funcom 3.0 objects — or the defect named and the mod set `enabled: false` | — | |
| S1 | Shemite cinematic cell x1_y4 (changed in 3.0) | teleport; frame | nothing broken visible | — | |
| B1 | Bosses My New Besties vs LBPR (`BP_ThrallSystemComponent`, LBPR wins) | knock out a boss (admin spawn) → wheel | boss accepted or refused — decides the owner's choice | — | |
| L1 | LegitReligious old `ItemStatModificationTable` | compare a vanilla 3.0 item stat modifier row present only in 3.0.1 | modifier present or lost | — | |
| E1 | Encounter settings objects | remote dump of Ambush `ConfigSetting…` and Night Terrors `NightTerrorsServerSettings` | default values read (MinTimeBetween, MaxExtraTime, AmbushChance …) | — | |
| F1 | Female New Faces vs Heritage | character creation of a NEW slot (no world entry) | new faces present in the editor | — | |
| X1 | Clean exit | `_config\close-game.ps1` | process gone | pass | 11:35 — «closed cleanly in 3,6 s (UE4SS.dll free)» |
| SW1 | Severe Weather mounts (64 paks, owner's word 2026-10-25 «ставим, попродуем сразу с настройками тумана, как у него задано») | launch; grep game log | `SevereWeatherEnhanced` among `Mounting mod pak`; 64 × mount = 64 lines `modlist.txt`; `СБОРКА: моды 64/64`; no `too old` | pass | 16:34 log: `Mounting mod pak … SevereWeatherEnhanced.pak`; 64 × mount; `СБОРКА: моды 64/64` 16:34:47; no `too old` |
| SW2 | World entry with 64 paks (= W1) | `launch-bg.ps1 -GameArgs -continuesession`; log + frame | `LoadMap` of the world, HUD in the frame, process alive 60 s | pass | `-continuesession` ignored (menu); entered by pult `call <menu> BndEvt__…B_Continue…SignalClicked… <button>` 16:42:59 → `LoadMap(ConanSandbox)` 4,5–6,3 s; frame: desert, HUD; alive for minutes. Also W1 |
| SW3 | The mod's console answers (vs Storage Reach Expanded's table) | pult `exec dc SW_config severity:normal`; frame | one of Crom's six phrases on screen | blocked | command accepted by the engine console, no phrase in the frame (the chat is hidden, or `dc` needs the chat console) — not confirmed |
| SW4 | Fog visible as the author meant | frame with `r.Fog 1` (deployed) and pult `exec r.Fog 0`, same spot, same minute | the two frames differ in haze / distance; if identical — the mod's fog is not drawn, say so | pass | fog0/fog1 16:46: with fog the desert is in warm haze, far city washed out; without — crisp, blue sky. Owner: «вижуально мне без тумана нравится» → `r.Fog=0` |
| SW5 | Price of the fog in frames | PresentMon with `r.Fog 1`, then `r.Fog 0`, same spot, no input | median frame time and 1 % low of both; difference named in ms | pass | 8 s × 2 each, auto settings (TSR): fog 11,68/11,70 ms, no fog 11,63/11,81 ms, p99 13,9–14,9 — difference within noise. First try: background cap 60 fps (`FrameRateLimit=60`), then a stale ETW session `kumm-pm` ate events — stopped with `logman stop kumm-pm -ets` |
| RU1 | New Russian file in the world (7 147 entries) | frame of inventory with Pickup+ / Double Storage Space item or a known Hosav label | Russian text, Hosav header «Лёгкая / Тяжёлая» unchanged | partial | HUD frame: «Лёгкая / 0 / 0% сниж.», Damage Meter Russian; the four QoL mods' items not opened. Simple Minimap tutorial — English (mod not in the translation set) |
| P1 | Pult `lua <code>` | `lua return 1+1` → `result.txt`; `lua return #FindAllOf("TextBlock")` | `2`; a positive count; an error is logged with its text | pass | 17:07 `lua return 1+1` → `2`; HUD search chunks returned 35 / 30 rows; an error earlier logged as «ошибка: … UFunction expected 1 parameters» |
| HR1 | Hosav HUD text found (owner 2026-10-25 «тонировку фона - или больше тени под текст») | pult `lua`: TextBlocks whose path holds the Hosav HUD | the HP / stamina / armour / XP texts named with their paths | pass | `W_NewHealthUI_C_* → W_SmoothHP / W_SmoothHP_Cernter → TextBlock_ArmorText, _DamageAmount, _ExperienceAmount, _WeightText` + gauge numbers; 50 TextBlocks under `W_NewHealthUI_C_` |
| HR2 | Variants on one spot, bright desert noon | shadow / outline variants via `SetShadowOffset`, `SetShadowColorAndOpacity`, `Font.OutlineSettings` + `SetFont`; 4K frames, HUD crop | frames for the owner's eye | pass (frames) — taste is the owner's | A shadow 3 px — letters doubled, dropped; B outline over shadow; C outline 2 px; D outline 1 + shadow 1,5; E (owner's word «под текст без смещения по xy») soft halo 3 px, alpha 0,55, no offset. Sheet before / C / E — `НА ОТСМОТР НИКОЛАЕМ\2 HUD читаемость` |
| HR3 | Mod `KrinikHudOutline` (owner chose «чёрная обводка 2 точки супер!») | deploy; launch; enter world; UE4SS log; HUD crop 4K | log «новый HUD …», «обводка 2 точки поставлена N полям» with N ≈ 50; the frame matches variant C of the sheet | pass | 17:13 deploy 71/71, verify 89/0; 17:14:36 «новый HUD: W_NewHealthUI_C_2147459081» · «обводка 2 точки поставлена 50 полям»; 17:14:41 second pass «уже стояла у 50»; HUD crop `hr3_c.webp` = variant C |
| HR4 | Control: mod off | same build without the mod → frame | no outline (= «Как было») | pass | frames 17:08 `hud4_before` — the same 64-pak build before the mod existed, shadow/outline reset: plain text |
| CFG1 | Owner's graphics restored in 3.0.1 | `deploy-config.py Engine.ini Game.ini GameUserSettings.ini`; launch → world | menu and world alive; DLSS on; FOV 75; 141 fps cap; no VSync | pass after fix | 16:56 crash on the first DLSS frame (bug 63, `r.NGX.DLSS.Preset=13`); fixed pack 17:02 alive, `Creating NGX DLSS Feature 2228x1253 → 3840x2160`; world with DLSS 70,8 fps median 4K (17:01) |
