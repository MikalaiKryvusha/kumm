# Test run report — Svarog's Dream, ночь 2026-10-18, пачка 5: подсказка ячейки над ячейкой, прогон собранного раньше

**Created:** 2026-10-18 05:50 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `ab3a0c3` + `TooltipFit.cs`
(`PatchSlotTipAboveCell`, `FitAboveCell`, выключатель в кадре, габарит без выделений; горячо — габарит надписи по тексту, затем «свежий замер»)

## 1. Work

План 31, пункт 18 (подсказка ячейки — над ячейкой, рулбук К6, К1) и прогон собранного раньше: пункт 8 (пустая Q без перезарядки), пункт 5 (окно
вестей под текст), пункт 17 (крит выше 100 %, стойка мага), подписи и ряд кнопок, полоса черт. Кейсы — `testcases/TC_svarog_night_batch5_2026-10-18.md`
(A0–A1, T1–T7, T3r, T6f–T6g, Q8, P8, P16, L1, D2, D3, M2, C4, K1, C3, S1).

## 2. Contour

Игра владельца (BepInEx 5.4.23.5), 4K, сейв — точка `_backups/svarog-saves-2026-10-18_0225-live-before-night-agent` (возвращена до запуска и после).
Экран машины заблокирован (`LogonUI.exe` в сеансе консоли): настоящая мышь и запись экрана недоступны — наведение и щелчки событиями пульта, кадры
изнутри Unity; это **замена** пути игрока и правила видео-смоука. REAL WORLD: accumulated — настройки модов владельца (`cfg_run_diff.py`: 0
изменённых) — verified on the real world; data and machine — его игра, копия его сейва — verified with real state; path — HUD, ряд, кнопки, окно
вести, как у игрока, но наведение событием пульта, не мышью — verified with real state.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 05:25 +03:00 | `SAVE_POINT=… bash tools/save-check.sh --restore`; `bash tools/deploy-cold.sh KrinikUIRework` | 0 · 8 из 8, выложено |
| 2 | 2026-10-18 05:25 +03:00 | `powershell -File tools/hdr.ps1 off`; `LOCK_MINUTES=40 bash tools/run-game.sh` | 0 · героиня убита ордой (A0) |
| 3 | 2026-10-18 05:27 +03:00 | `bash tools/h.sh "kill"`; `save-check.sh --restore` | 0 · 8 из 8 |
| 4 | 2026-10-18 05:28 +03:00 | `SAFE_SPOT="-590,96,1863" LOCK_MINUTES=45 bash tools/run-game.sh` | 0 · жива, 352 из 1027 (A1) |
| 5 | 2026-10-18 05:30 +03:00 | `bash tools/h.sh "call SpellsActionManager AssignSpell 12 4" "call SpellsActionManager AssignSpell 17 5"` | 0 · навыки в «1» и «6» |
| 6 | 2026-10-18 05:31 +03:00 | `bash tools/rec_clip.sh t6 16 "wait 15"` + `mouse.ps1 -Button move` по ячейкам | клипа нет, курсор 0,0 (T6) |
| 7 | 2026-10-18 05:35 +03:00 | `bash tools/h.sh "hover …/Group~(1)/Slot~(1)" … "hover …/Slots/Slot~(8)"` с `shot` | 0 · лист `t_sheet.webp` |
| 8 | 2026-10-18 05:37 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`; `h.sh "hover …"` | 0 · RELOADED, лист `t_sheet2.webp` |
| 9 | 2026-10-18 05:39 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`; `h.sh "hover …" "shot t6g0" …` | 0 · RELOADED, лист `t_sheet3.webp` |
| 10 | 2026-10-18 05:42 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.uirework Tooltips SmartPlacement false" … "true"` | 0 · лист `t5_sheet.webp` |
| 11 | 2026-10-18 05:44 +03:00 | `bash tools/h.sh "fieldon Player PlayerStats currentHealth 600" "click …/Slots/Slot~(8)" …` | 0 · лист `q8_sheet2.webp` |
| 12 | 2026-10-18 05:45 +03:00 | `bash tools/h.sh "active UI/GamePopUps/WorldEvents/86-ScandalAtCourt 1" … "call FixTotalDamageCrit CritFactor 150" …` | 0 · кадр `l1.webp`, числа |
| 13 | 2026-10-18 05:46 +03:00 | `bash tools/h.sh "hover …/Enablers/ActionBarEnabler" "hover UI/Enablers/InfoPanel" "cfg … Hud ButtonsRow false" …` | 0 · лист `c4k1_sheet.webp` |
| 14 | 2026-10-18 05:47 +03:00 | `bash tools/h.sh "kill"`; `save-check.sh --restore`; `reg-snap.sh restore`; `hdr.ps1 on` | 0 · `cfg run diff: 0 changed`, замок FREE |

## 4. Checks

- Hygiene: `dotnet build` KrinikUIRework — Build succeeded (четыре сборки); проверка покоя — зелёная (16 при пределе 40); красное 109 — сразу после второй
  перезагрузки, T7 снят при нём; разобрано в пачке 6: красное бывает только в первую секунду после перезагрузки (мод заново собирает карточку и ряд),
  в покое `tmoved` — 16 (UI 10, значки мира 6); правка — пауза перед проверкой в `deploy-hot.sh`.
- Functional run: подсказки ячеек «1», «6», пустой «2» и E показаны событием наведения на живом HUD и сняты кадрами изнутри игры; выключатель
  проверен на месте игры; зелье выпито щелчком по ячейке; окно вести, числа «Суммарного Урона» и кнопки — кадры, ответы пульта и журнал прочитаны.
  Мышью и видео не проверено — экран заблокирован.

| Case | Status | What was read |
|---|---|---|
| A0 / A1 старт с точки | fail → правка `SAFE_SPOT` → partial (бессмертие сбросила загрузка, правка — после `waitfor`) | `b5_start.webp`, `b5_alive.webp`, ответ пульта |
| T1, T2, T4 подсказки «1», «6», пустой | pass | журнал `above cell Slot (1)/(6)`, лист `t_sheet.webp` |
| T3 / T3r подсказка E | fail (габарит 1665 при подложке 789) → правка → pass | журнал `1665x275 … moved 689,-182`, кадр `t3.webp`; дамп 05:35 (`Name` 1626, `Description` 1514) прочитан в сессии, файл `dump.txt` позже перезаписан; `t3r.webp` |
| T5 контроль выключателем | pass | `t5_sheet.webp` |
| T6 / T6f / T6g без прыжка | blocked / blocked / partial | клипа нет; серия кадров ловит только итог |
| T7 свежий замер | partial (у E первый кадр — подложка прошлой карточки) → правка собрана, T7r — холодным запуском | журнал 05:39 |
| Q8 пустая Q | pass | `q8_sheet2.webp` |
| P8, P16 еда на Q | blocked (перетаскивание мышью недоступно, яблок нет) | — |
| L1 окно вести | pass | `l1.webp` |
| D2, D3 крит и маг | pass (прямой вызов формулы) | 2,380 = 2,380; 1,04; 1,6 |
| M2 строка с картинкой | blocked (пульт не передаёт `Sprite`) | — |
| C4, K1, C3 кнопки и полоса | pass | `c4k1_sheet.webp`, `c3_strip.webp` |
| S1 уборка | pass | `cfg run diff: 0 changed`, сейвы 8 из 8 |

## 5. Found

1. Габарит карточек считался по прямоугольникам надписей, а они вдвое шире текста — прижим к краю уводил карточку E от ячейки; та же ошибка
   у общей правки краёв всех карточек — исправлено (`TooltipFit.cs`, `Bounds`).
2. В первом кадре показа размер надписей и подложки — ещё от прошлой карточки — правка собрана, проверка T7r.
3. Точка сейва ночи убивает героиню без бессмертия; бессмертие, выставленное до загрузки, загрузка сбрасывает — `run-game.sh` с `SAFE_SPOT` (EXP-0313).
4. Экран заблокирован — мышь и запись экрана молча не работают (EXP-0314). (Поправка по суду: P16m пачки 4 этим не объясняется — `LogonUI.exe` запущен в 04:51, после пачки 4.)
5. Цифра перезарядки E стоит на шве Q/E — план 31, пункт 19.
6. Подпись кнопки справа — серая плашка без каймы (рулбук К6) — план 31, пункт 20.
7. Описание навыка «Рунные Стрелы (Порядок)» — английская заглушка игры «Missing Description» (навык назначен пультом).

## 6. Traces

`SvarogsDream/_harness/`: `b5_start.webp`, `b5_alive.webp`, `t1…t4.webp`, `t_sheet.webp`, `t_sheet2.webp`, `t_sheet3.webp`, `t5_sheet.webp`,
`q8_sheet.webp`, `q8_sheet2.webp`, `l1.webp`, `c4k1_sheet.webp`, `c3_strip.webp` (`dump.txt` перезаписан дампом кнопок в 05:46); журналы — `_harness/log_batch5a_death.log`,
`_harness/log_batch5.log`.

## 7. Verdict

partial — подсказка ячейки над ячейкой, контроль выключателем, пустая Q, окно вести, крит и стойка мага, кнопки прошли в игре; «без прыжка в
первом кадре» (T7r), еда на Q (P8, P16) и строка с картинкой (M2) — следующая пачка; мышь и видео — замена пультом, экран заблокирован.
