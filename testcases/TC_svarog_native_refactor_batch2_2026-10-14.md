# Test cases — Svarog's Dream, эпик 26, пачка 2: трава камеры и пузырь реплики дешевле в худшем кадре

> **Основание:** `plans/26_EPIC_svarog_native_refactor.md`, раздел «Пачки» — пачка 2; отчёт пачки 1
> `testcases/reports/2026-10-14_svarog-refactor-batch1.md` (худшие кадры: высота травы участка в моде камеры 20–26 мс, пузырь реплики 11–12 мс);
> `[OWNER]` «сразу пиши, а потом запускай и пачкой тестируй, потом фикси пачкой, опять пачкой тестируй» · 2026-10-14.
> **Заход 1 — разведка (сборки с приборами, без правок поведения):** `KrinikCameraRework.Plugin.GrassProtoReport` (опись прототипов травы и
> шейдеров её материалов), `GrassSetCost <i>` (цена присвоения прототипов и `RefreshPrototypes`); секундомер частей `KrinikBubbleFit.Fit`
> и постфикса `PatchYellBubble` (строки журнала `bubble fit slow`, `bubble postfix slow`). Ответ разведки выбирает путь правки: высота
> травы в шейдере (только если вся трава — текстура «к камере») или иначе.
> **Сцена и порядок:** точка сейва → `bash tools/run-game.sh` → `bash _harness/batch2_recon.sh` → `h.sh kill` → сейв `--restore`, `reg-snap.sh restore`.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| D0 | Выкладка `_harness/deploy_set.sh` при закрытой игре; точка сейва `_backups/svarog-saves-2026-10-14_2236-before-batch2` | сейв 10 из 10 на точке; в игре UIRework `4285c95…`, CameraRework `8fe6fbd…` | вывод `deploy_set.sh`, `save-check.sh` | pass — 22:36: 10 same, 0 differ; хеши `4285c9577e8f`, `8fe6fbdabaaf` |
| G1 | Лагерь после загрузки: `call KrinikCameraRework.Plugin GrassProtoReport` | строка: участков N, прототипов M, разбивка по видам (`tex/GrassBillboard`, `tex/Grass`, `mesh/VertexLit`, `mesh/Grass`), шейдеры материалов травы | вывод пульта в `_harness/batch2_recon/recon.txt` | pass — 22:37: участков 25, прототипов 791: `tex/GrassBillboard` 296, `tex/Grass` 214, `mesh/Grass` 281 (модели — NatureManufacture Advanced Grass 235, Tree Creator Leaves 45); материалы травы — наши копии `WavingDoublePass` 25 и `BillboardWavingDoublePass` 25, `Vertexlit` 25 |
| G2 | Лагерь: `GrassSetCost 0`, `1`, `2` | цена присвоения тех же прототипов и `RefreshPrototypes` по участку, мс — порядок прежних 20 мс | `recon.txt` | pass — 22:37: присвоение 25,2 / 9,7 / 23,1 мс (47 / 17 / 42 прототипа), один `RefreshPrototypes` — 25,4 / 8,0 / 20,2 мс: вся цена — пересчёт прототипов движком |
| G3 | Перенос `teleport innGradLocation`, через 8 с — `GrassProtoReport` и `GrassSetCost 0` | опись города; та же разбивка видов или другая | `recon.txt` | pass — 22:37: город — прототипов 580: `mesh/Grass` 229, `tex/Grass` 258, `tex/GrassBillboard` 93; присвоение 14,3 мс (22 прототипа) |
| B1 | Город, 60 с у жителей (реплики идут сами) | строки `bubble fit slow … preferred · layout · mesh · subs · glyphs +N` и `bubble postfix slow … style+box · second fit` — какая часть платит; растут ли глифы | журнал BepInEx → `_harness/batch2_recon/log.txt` | pass — 22:38: за 60 с одна реплика: постфикс 14,45 мс = `StyleBubble` с постройкой плашки 14,13 + вторая подгонка 0,32; `Fit` 3,31 мс (сетка букв 1,45, раскладка 0,60), глифов +0 — платит не подгонка и не атлас, а первый показ пузыря у жителя |
| A3 | Журнал после захода | ни одного исключения наших модов | `grep -E "Exception"` по журналу захода | pass — 22:39: в журнале 0 строк `Exception` |
| A4 | После: `kill`, сейв, реестр | как до прогона, сейв 10 из 10 | `save-check.sh --restore`, `reg-snap.sh restore` | pass — 22:39: `kill`, сейв 10 из 10 на точке `2236-before-batch2`, реестр возвращён |

**Заход 2 — правки:** высота травы на видеокарте (мод камеры ставит `_KrinikGrassHeightCut`, прототипы не трогает; мод цвета —
`GrassGround.cs`, карты высот участков в массив текстур; шейдеры травы `KrinikGrassCommon.cginc`); пузырь — секундомер частей
`StyleBubble`/`BubbleBox`, повторной подгонки в постфиксе нет. Скрипт — `bash _harness/batch2_run.sh`.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| G4 | Лагерь после загрузки — журнал | строка `grass ground: terrains N (new N, skipped 0)`; ни одной строки `grass height x`; `grass coverage on` | журнал → `_harness/batch2_run/log.txt` | pass — 22:47–22:49: `grass ground: terrains 3…25 (skipped 0), heightmap 513 R16, side 300`, 0,04–0,44 мс на смену; строк `grass height x` нет; `grass coverage on` |
| G5 | Лагерь: кадр при `GrassHeight` 0,5 (по умолчанию), потом 1 и снова 0,5 | на 0,5 трава у героя заметно ниже, чем на 1; травинки стоят на земле — не висят над ней и не утоплены (кромка у дороги, склон) | кадры `b2_grass_05`, `b2_grass_10`, `b2_grass_05b`; лист рядом | blocked — у костра камера сверху, травы на стоянке нет (лист `_harness/b2_grass_sheet.webp`); снято в G8 |
| G6 | Перенос в город, через 8 с — кадр травы | трава в городе низкая, как на 0,5 в лагере; журнал `grass ground` после переноса | кадр `b2_grass_town`; журнал | pass — 22:49 кадр `b2_grass_town`: трава у дома стоит на земле; журнал `grass ground` после переноса — 25 участков |
| G7 | Тот же перенос — мод цвета | строк `grass coverage: materials recreated` нет или единицы (было 17–24 за заход — связка с присвоением высоты) | счёт строк в `log.txt` | pass — за заход одна строка `materials recreated` (было 17–24) |
| A2b | `modcost`: костёр 10 с, бег W 8 с, перенос 20 с | худший кадр больше не `KrinikCameraRework.Plugin.Update` (было 20–26 мс); перенос — без травы камеры в списке худшего кадра | `_harness/batch2_run/modcost.txt` | pass — костёр avg 0,351 · max 0,966 мс; бег avg 0,358 · max 0,751 мс (обе сцены ≤ 1 мс, были 26 и 10,9); перенос avg 0,504 · max 22,7 мс — худший кадр пузырь (11,5 + 9,6), `KrinikCameraRework.Plugin.Update` max 2,08 мс (было 20–26) |
| B2 | Город, 60 с у жителей | строки `bubble style slow … log+scale · game texts · panel · own text · layout · fit` — какая часть платит; постфикс — без второй подгонки (`after` около 0) | `log.txt` | pass — 22:49: `bubble style slow 11,24`: журнал строения и масштаб 1,59 · тексты игры 0,55 · плашка 2,13 · свой текст 1,48 · раскладка 1,70 · подгонка 3,61 — платит постройка пузыря при первом показе, по частям; постфикс `after 0,02` |
| G8 | Заход 3: город, травяной край у дома (перенос `innGradLocation`, камера 30): кадры при `GrassHeight` 0,5, 1, 0,2 | трава заметно ниже на 0,5 и ещё ниже на 0,2, чем на 1; корни на земле, не висят | кадры `b3_g05`, `b3_g10`, `b3_g02`; лист кропов | pass — 22:52, лист `_harness/b3_sheet.webp`: на 1 трава высокая, на 0,5 заметно ниже, на 0,2 ещё ниже; корни на земле. Владелец в 22:54 — «сверху трава … тонкий без толщины спрайт»: это давний баг 44 (камера строго сверху), не правка пачки |
| A3b | Журнал захода | 0 исключений | `grep Exception` | pass — заходы 2 и 3: 0 исключений |
| A4b | `kill`, сейв, реестр | сейв 10 из 10 на точке `2236-before-batch2` | `save-check.sh --restore` | pass — 22:50 и 22:52: сейв 10 из 10 на точке `2236-before-batch2`, реестр возвращён |
