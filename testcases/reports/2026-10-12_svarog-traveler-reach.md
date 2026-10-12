# Test run report — листва в дымке (ясени, ягоды) и путник не исчезает посреди кадра

**Created:** 2026-10-12 09:48 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** KrinikColorRework (`RoofFog.cs` — `Foliage.FoliageQueueShaders`), KrinikCameraRework (`PatchTravelerReach`)

## 1. Work

Два замечания владельца из игры 2026-10-12: ясени и кустик-ягода вдали без дымки (баг 37) — `testcases/TC_svarog_ash_canopy_haze_2026-10-12.md`;
путник из Бары исчезает в воздухе (баг 38, первый симптом) — `testcases/TC_svarog_traveler_reach_2026-10-12.md`.

## 2. Contour

Игра на машине владельца, 4K, сейв владельца (копия `_backups/svarog-saves-2026-10-11_2342-owner-exit`), пруд у деревни; участок 100-100
(ясени) включён пультом `active`. Видео путника — запись экрана `gdigrab`.
REAL WORLD: accumulated — его сейв и конфиги — verified on the real world; data and machine — его машина — verified on the real world;
path — вид с пруда, как у него — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 09:35 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "pick 1676 374 3" "pick 2982 394 3"`; `cursorinfo` + `pick 2339 577 5` | 0 · листва `FoliageWind` q3000 |
| 2 | 2026-10-12 09:38 +03:00 | `bash tools/run-game.sh` (RoofFog с листвой); `cfg … Foliage RoofHaze False/True` + `shot fa_off/fa_on` | 0 · ясени в дымке |
| 3 | 2026-10-12 09:39 +03:00 | `ffmpeg -f gdigrab -framerate 30 -t 45 -i desktop …`; позиция путника каждые 2.5 с | 0 · видео, путь по дну (y 84.6, 82.1) |
| 4 | 2026-10-12 09:43 +03:00 | `bash tools/run-game.sh` (PatchTravelerReach); `grep "traveler reach"`; трасса путника | 0 · `100 -> 300` ×3 |
| 5 | 2026-10-12 09:47 +03:00 | `cfg … DrawDistance CharacterMeters 100/300`; `fieldon … NPCController isTravelerOnLongRun` | 0 · True / False |
| 6 | 2026-10-12 09:47 +03:00 | `bash tools/h.sh kill`; `cmp` сейва; `bash tools/reg-snap.sh restore` | 0 · сейв 7/7 |

## 4. Checks

Hygiene: сборки без ошибок
Functional run: в игре на сейве владельца — ясени и ягода с починкой и без (замер цвета), путник дня: трасса, расстояние, флаг модели,
контроль с дальностью 100; прочитаны строки `pick`, журнал, кадры, поля пульта

| Case | Status | Observation |
|---|---|---|
| Листва C1 | pass | ясень `MI_Ash_Tree_Canopy_01`, ягода `MI_Plant_01 Custom` — `Custom/Lordenfel/FoliageWind` q3000 |
| Листва C2 | pass | ясень выкл (81,98,66) → вкл (135,158,162) — как соседи |
| Путник C1 | pass | патч на Awake, Start, Update |
| Путник C2 | pass | в 267 м модель видна (`isTravelerOnLongRun=False`) |
| Путник C3 | pass | контроль 100 м — прячется |
| C4 | pass | сейв 7/7 |

## 5. Found

- путник ходит по дну водоёма (y на 6–8 м ниже берега) — баг 38, второй симптом, открыт
- поправлено своё: «24 м/с — режим дальнего бега» неверно, это его собственный бег (баг 38, Forensics)

## 6. Traces

`SvarogsDream/gallery/game/2026-10-12_путник-по-дну/01 путник из Бары - по дну и исчезает.mp4`; кадры `SvarogsDream/_harness/fa_*`;
журнал `SvarogsDream/_harness/logs/2026-10-12_traveler_reach.log`.

## 7. Verdict

partial — листва в дымке и путник не исчезает до 300 м проверены; дно водоёма открыто.
