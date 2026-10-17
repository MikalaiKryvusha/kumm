# Test run report — Svarog's Dream: «пылевая буря» у Бары — поиск ракурса

**Created:** 2026-10-17 08:28 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `a0aa18c` (моды в игре — STATUS п. 0)

## 1. Work

Кейсы `testcases/TC_svarog_dust_storm_bara_2026-10-17.md` (P1–P3): найти ракурс дальней светлой равнины без дымки у Бары — замечание владельца
2026-10-15 (`[OWNER]` «не покрыта шейдером дымки» · «очень яркая» · «словно нет расстояния до неё»).

## 2. Contour

Игра владельца, 4K, чистый запуск `tools/run-game.sh` с его сейвом (точка `_backups/svarog-saves-2026-10-17_0723-before-stream-gate`; после
запуска сверка 7 из 7, реестр возвращён), день в игре. REAL WORLD: accumulated — сейв владельца; data and machine — его машина; path — камера
над героем у трактира Бары, как смотрит он.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-17 08:26 +03:00 | `bash tools/run-game.sh`; `h.sh "teleport innBaraLocation" "wait 8" "call KrinikCameraRework.Plugin CamPitch 20" "call KrinikCameraRework.Plugin CamZoom 240"` и 12 × `CamYaw <0…330>` + `shot p1_<угол>`; `python -I _harness/sheet.py p1_sheet.webp 4 0.17 …` | 0 · P1 pass |
| 2 | 2026-10-17 08:27 +03:00 | `h.sh "call KrinikCameraRework.Plugin CamYaw 270" "groundat 720 144" "groundat 400 90" "groundat 1900 120" "groundat 1300 300"` | 0 · P2 pass |
| 3 | 2026-10-17 08:27 +03:00 | `h.sh "terrainset basemapDistance 2000" "shot p3_270"`, затем `terrainset basemapDistance 1000` | 0 · P3 гипотеза опровергнута |

## 4. Checks

Hygiene: NONE
Functional run: облёт камеры игры вокруг героя у трактира Бары на игре владельца; прочитаны лист 12 кадров, пара кадров 270°/30°, вывод `groundat`

| Case | Status | Observation |
|---|---|---|
| P1 | pass | на 240–300° у горизонта бледная кремовая равнина, на 0–60° даль в серой дымке |
| P2 | pass | равнина — террейн `t97-99`, `t96-99`, 417–476 м от камеры |
| P3 | fail (гипотеза опровергнута) | `basemapDistance` уже 1000; при 2000 кадр не изменился |

## 5. Found

- Кандидат «пылевой бури»: 270° от трактира Бары, террейн участков 97-99 и 96-99 в 420–480 м — ждёт глаза владельца.
- Пульт `terrainset` без значения падает `IndexOutOfRangeException` (печать текущего значения не работает) — мелочь пульта.

## 6. Traces

`SvarogsDream/_harness/p1_sheet.webp`, `p1_<угол>.webp`, `p1_pair_270_30.webp`, `p3_270.webp`, `p3_pair_270.webp`; папка отсмотра
`SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/17 Пылевая буря у Бары - та ли это равнина/`.

## 7. Verdict

partial — ракурс и место найдены, причина нет; одна гипотеза опровергнута; следующий шаг — подтверждение владельца, затем чем рисуется эта земля.
