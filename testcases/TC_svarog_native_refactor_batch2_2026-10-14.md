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
| G1 | Лагерь после загрузки: `call KrinikCameraRework.Plugin GrassProtoReport` | строка: участков N, прототипов M, разбивка по видам (`tex/GrassBillboard`, `tex/Grass`, `mesh/VertexLit`, `mesh/Grass`), шейдеры материалов травы | вывод пульта в `_harness/batch2_recon/recon.txt` | [NOT-TESTED] |
| G2 | Лагерь: `GrassSetCost 0`, `1`, `2` | цена присвоения тех же прототипов и `RefreshPrototypes` по участку, мс — порядок прежних 20 мс | `recon.txt` | [NOT-TESTED] |
| G3 | Перенос `teleport innGradLocation`, через 8 с — `GrassProtoReport` и `GrassSetCost 0` | опись города; та же разбивка видов или другая | `recon.txt` | [NOT-TESTED] |
| B1 | Город, 60 с у жителей (реплики идут сами) | строки `bubble fit slow … preferred · layout · mesh · subs · glyphs +N` и `bubble postfix slow … style+box · second fit` — какая часть платит; растут ли глифы | журнал BepInEx → `_harness/batch2_recon/log.txt` | [NOT-TESTED] |
| A3 | Журнал после захода | ни одного исключения наших модов | `grep -E "Exception"` по журналу захода | [NOT-TESTED] |
| A4 | После: `kill`, сейв, реестр | как до прогона, сейв 10 из 10 | `save-check.sh --restore`, `reg-snap.sh restore` | [NOT-TESTED] |
