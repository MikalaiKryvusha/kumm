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
