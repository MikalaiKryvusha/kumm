# Test cases — дальние деревья-картинки в дымке (свой шейдер) и граница настоящих деревьев 200 / 300 м

> **Основание:** `[OWNER]` «давай картинки, но сделаем шейдер. Мы же научились шейдеры делать. И погугли быстренько, как это делают» ·
> «настоящие дедевья можно до 300 метров расширить, или до 200» · «в Боту ФПС померяешь 200 vs 300» · «В Бору» · 2026-10-11.
>
> **Сборка:** KrinikColorRework 2.3.0 — `BillboardFog.cs` ставит `Krinik/TerrainEngine/BillboardTree` (пакет 725 187 Б, 6 шейдеров)
> материалам картинок с шейдером `Hidden/TerrainEngine/BillboardTree`; настройка `Foliage.BillboardHaze` (вкл). KrinikCameraRework 1.5.0 —
> `DrawDistance.TreeMeshDistance` (0 — по множителю, ≈150 м). **Сцена:** сейв владельца, время ИДЁТ; Бара — вид на гору (`TestFaceSun 8 60`);
> Бор (`teleport innBorLocation`) — FPS. После — `kill`, сейв (расхождение → откат), реестр.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | Запуск, журнал | «billboard fog: Krinik/TerrainEngine/BillboardTree supported=True», «billboard fog on: N materials» (N > 0) | журнал | pass 12:45 — «billboard fog: Krinik/TerrainEngine/BillboardTree supported=True», «billboard fog on: 15 materials, held 15» |
| C2 | Бара, гора: `BillboardHaze` вкл и выкл | вкл — деревья-картинки в дымке вместе с горой; выкл — чёткие, как в игре | кадры | pass 12:46 — `bb_sheet`: выкл — ярко-зелёные чёткие картинки, вкл — тают в дымке вместе с горой; разность кадров 9.9; журнал «off: 11 materials», снова «on: 15» |
| C3 | Бор, мир идёт: `TreeMeshDistance` 0 (150) / 200 / 300 × 2 круга `perf 10`, камера стоит | цена 200 и 300 м против 150 | `perf` | pass 12:47–12:51 — Бор: 150 — 53.9 / 53.3, 200 — 53.9 / 53.0, 300 — 54.0 / 53.9, треугольники 12.5 млн во всех: деревья Бора (CTI, Lordenfel, NatureManufacture) на эту границу не смотрят. Бара: 150 — 50.5 / 50.2, 200 — 50.4 / 49.9, 300 — 50.1 / 49.1 (≤ −1.5 %); граница применяется (`terrainset` читает 300, затем 150) |
| C4 | После: `TreeMeshDistance` 0, `kill`, сейв 7/7, реестр | как до прогона | `cmp`, `reg query`, `.cfg` | pass 12:52 — сейв 7/7, `TreeMeshDistance = 0`, реестр 1280×720 |
