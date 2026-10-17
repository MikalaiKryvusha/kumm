# Test run report — Svarog's Dream: дорогие дети участка и массив террейнов без нового в кадре

**Created:** 2026-10-17 08:48 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `949d2f8` (мод камеры — дробление
контейнера и с одним ребёнком, секундомер `stream child slow`; мод цвета — `TerrainWatch.Active`)

## 1. Work

Кейсы K4–K6 `testcases/TC_svarog_harness_mobbar_once_2026-10-17.md`: что стоит дорогой ребёнок содержимого участка при подгрузке на бегу
(дробление или включение), дробление контейнера с одним ребёнком, мод цвета без нового массива террейнов в каждом кадре. Основа — бюджет
`[OWNER]` «Лаги не допустимы в игре, когда герой бегает» · 2026-10-14 и правило 5 разведки (ноль выделений памяти в кадре геймплея).

## 2. Contour

Игра владельца, 4K, чистые запуски `tools/run-game.sh` с его сейвом (точка `_backups/svarog-saves-2026-10-17_0723-before-stream-gate`;
после каждого запуска сверка 7 из 7, реестр возвращён); маршрут `tools/measure-walk.sh` (Град → 400 м на восток → назад). REAL WORLD:
accumulated — сейв владельца и его настройки модов; data and machine — его машина; path — бег по миру, как играет он.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-17 08:36 +03:00 | секундомер `stream child slow`; `bash tools/run-game.sh`, `bash tools/measure-walk.sh > _harness/logs/2026-10-17_measure-walk-k4.txt` | 0 · K4 замер |
| 2 | 2026-10-17 08:40 +03:00 | дробление при `childCount > 0`; новый чистый запуск, `bash tools/measure-walk.sh > _harness/logs/2026-10-17_measure-walk-k5.txt` | 0 · K5 pass, пик `BareBefore` 9,70 |
| 3 | 2026-10-17 08:45 +03:00 | `TerrainWatch.Active`; новый чистый запуск, `bash tools/measure-walk.sh > _harness/logs/2026-10-17_measure-walk-k6.txt` | 0 · K6 pass |
| 4 | 2026-10-17 08:49 +03:00 | новый чистый запуск; `h.sh "static WorldState isGodMode True" "teleport -576,108,-596" "wait 25" "shot k2b"`, затем `h.sh kill` и откат сейва | 0 · K2b pass |

## 4. Checks

Hygiene: сборки модов камеры и цвета без ошибок; выкладка `deploy-cold.sh` — md5 пар совпали
Functional run: бег героя 400 м туда и обратно, три чистых запуска на игре владельца; прочитаны строки `modcost`, журнал `LogOutput.log`
(`stream child slow`, `stream square`, `matte terrain`), исключения

| Case | Status | Observation |
|---|---|---|
| K4 | pass (замер) | дробление 0,00–0,01 мс, цена — в `SetActive`; `Humans … children 1` не дробился (1,61 мс); со скриптами — волк 8,56, `SiegeSetup` до 12,67, частицы ~1,1 |
| K5 | pass | `Humans` дробится: самый дорогой ребёнок востока 1,62 → 0,52 мс; разово `WaterReflection.BareBefore` 9,70 мс |
| K2b | pass | три полосы, дорогие части (`fade 0,36`, `level 0,78`) — только у первой: цена цифры уровня разовая |
| K6 | pass | худший кадр бега 1,68 / 2,00 мс; `BareBefore` 0,01 мс; матовая земля на месте; исключений 0 |

## 5. Found

- Дорогие дети участка со своими скриптами (волк, `SiegeSetup`, частицы `pf_vfx`, `HoneyCollector`) — дробить нельзя; это пол худшего кадра на бегу (1,1–1,7 мс) и пики после телепорта (до 12,7 мс).
- Разовый пик `WaterReflection.BareBefore` 9,70 мс — после правки не повторился в одном прогоне; причина не доказана.
- У мода камеры свои вызовы `Terrain.activeTerrains` (например, `TopRayGroundDistance`) — общий массив мода цвета ему не виден.

## 6. Traces

`SvarogsDream/_harness/logs/2026-10-17_measure-walk-k4.txt`, `…-k5.txt`, `…-k6.txt`; итоги — в файле кейсов.

## 7. Verdict

pass — дробление контейнеров и общий массив террейнов работают, мир цел; худший кадр бега 1,68–2,00 мс, до 1 мс не дошли.
