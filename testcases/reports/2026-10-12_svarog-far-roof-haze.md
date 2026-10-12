# Test run report — крыша и деревья вдали без дымки (баг 37, второй симптом), густота дымки

**Created:** 2026-10-12 09:21 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** KrinikColorRework (`RoofFog.cs`, `Sky.HazeDensity`), KrinikDevHarness (команда `pick`)

## 1. Work

Почему крыша вдали и деревья не в дымке (`[OWNER]` «деревья и крышу вдали дымка не покрыла» · 2026-10-12) и починка крыши; густота
дымки на выбор владельца. Набор случаев — `testcases/TC_svarog_far_objects_haze_2026-10-12.md` (C1–C7).

## 2. Contour

Игра `D:\Games\Svarog's Dream` на машине владельца, DX11, 4K; сейв владельца (копия `_backups/svarog-saves-2026-10-11_2342-owner-exit`),
время идёт; три запуска (поиск → густота → крыша). Дом участка 98-102 после перезапуска выключен игрой — включён пультом `active` для
кадра; ясени участка 100-100 после перезапуска выключены — не сняты.
REAL WORLD: accumulated — его сейв и конфиги — verified on the real world; data and machine — его машина — verified on the real world;
path — вид от пруда у деревни, как на его кадре 03 — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 09:07 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "pick 2045 566 8"` … | 0 · деревья террейна, не Renderer |
| 2 | 2026-10-12 09:08 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.colorrework Sky Haze False" "shot fh_off" … "shot fh_on"` | 0 · дымка ≈20–25 % на 300–500 м |
| 3 | 2026-10-12 09:12 +03:00 | `cfg … Sky HazeDensity <1|1.5|2>` + `shot fd_<v>`; `bash tools/h.sh "pick 1788 462 6"` | 0 · крыша `thatched_roof_col6` Standard q3000 |
| 4 | 2026-10-12 09:15 +03:00 | `bash tools/h.sh "pick 1392 365 5"`; дымка выкл/вкл по кадру `fo_forest` | 0 · ясени `SM_Ash_Tree_01`, листва ≈8 % |
| 5 | 2026-10-12 09:17 +03:00 | `bash tools/run-game.sh` (RoofFog); `cfg … Sky HazeDensity 1.2` | 0 · `roof fog on: 1 materials to cutout` |
| 6 | 2026-10-12 09:20 +03:00 | `active "WorldAreas/Area (98-102)/…/RoundHouse" 1`; `cfg … Foliage RoofHaze False/True` + кадры; `teleport 644.1,92,-440` + `shot fr_near` | 0 · крыша в дымке, вблизи целая |
| 7 | 2026-10-12 09:21 +03:00 | `bash tools/h.sh kill`; `cmp` сейва; `bash tools/reg-snap.sh restore` | 0 · сейв 7/7 |

## 4. Checks

Hygiene: сборки без ошибок
Functional run: в игре на сейве владельца — вид владельца на гору, замеры цвета с дымкой и без, три густоты, крыша вдали с починкой и без,
крыша вблизи; прочитаны строки `pick`, журнал мода, кадры и цвета пикселей

| Case | Status | Observation |
|---|---|---|
| C1 | blocked → снято в C6 | в первом запуске крыши не было |
| C2 | pass | сухие деревья — деревья террейна (модели до 300 м), дымка на них ≈20 % |
| C3 | pass | на 300–500 м всё получает ≈20–25 % — это кривая тумана, а не «объект без тумана» |
| C5 | pass | ×1.5 — даль гуще, ×2 — гора в молоке; крыша золотая на всех; владелец: «1 густота» → «можно 1.2» |
| C6 | pass | крыша вдали в дымке, вблизи без дыр; выкл — как у автора |
| C7 | blocked | ясени выключены игрой после перезапуска |
| C4 | pass | сейв 7/7 после каждого запуска |

## 5. Found

- листва ясеней `SM_Ash_Tree_01` (материал `MI_Ash_Tree_Canopy_01`, шейдер `Custom/Lordenfel/FoliageWind`) почти не берёт дымку (≈8 % там,
  где соседи ≈40 %) — то же, что у крыши, другой шейдер; следующим заходом (баг 37)

## 6. Traces

`SvarogsDream/gallery/game/2026-10-12_дымка-белёсая/02…05`; кадры `SvarogsDream/_harness/fh_*`, `fd_*`, `fo_*`, `fr_*`;
журнал `SvarogsDream/_harness/logs/2026-10-12_roof_fog.log`.

## 7. Verdict

partial — крыша починена и проверена вдали и вблизи, густота 1.2 по слову владельца; листва ясеней — открыта.
