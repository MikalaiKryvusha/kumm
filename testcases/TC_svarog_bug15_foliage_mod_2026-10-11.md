# Test cases — баг 15, листва в моде: KrinikColorRework 2.2.0, «Листва без белёсого блика», блеск 0.1

> **Основание:** `[OWNER]` «блик листвы делаем 0.1» · 2026-10-11 (лист вариантов `SvarogsDream/gallery/game/2026-10-11_листва-блик/`);
> причина и шейдер — `testcases/reports/2026-10-11_svarog-bug15-foliage-deferred.md`.
>
> **Сборка:** KrinikColorRework 2.2.0 — `FoliageGlare.cs`: при старте глобальные `_KrinikFoliageSpecular` = 0.1, `_KrinikFoliageTranslucency`
> = 1, раз в секунду ставит `Krinik/Internal-DeferredShading` вместо шейдера освещения игры; настройки `Foliage.Matte` (вкл), `Foliage.Glare`
> (0.1). **Сцена:** сейв владельца, перенос к «Лесной Хижине» при идущем времени, затем `timescale 0`, 18:32, камера против солнца.
>
> Измерения: включено против выключено на одном кадре; ползунок на лету; цена FPS (PresentMon, 15 с на состояние, кадр стоит). Не
> покрыто: листва не-CTI, ночь, 4K, смена сцены (вход в пещеру).

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | Запуск, журнал и `render` | «foliage glare: Krinik/Internal-DeferredShading supported=True», «foliage glare on: deferred Hidden/CTI/… -> Krinik/…, strength 0.1»; `render` — deferred `Krinik/Internal-DeferredShading` | журнал, вывод | pass 11:52 — обе строки в журнале («strength 0,1»), `render`: «deferred shading UseCustom Krinik/Internal-DeferredShading» |
| C2 | Лес, вечер, против солнца: кадр «вкл» | кроны зелёные, осеннее дерево не белёсое (как «0.1» между 0 и 0.25 листа) | кадр, яркость | pass 11:52 — `fm_on`: крона осеннего дерева оранжевее (насыщенность 0.68 против 0.63 «выкл», ярче 0.27/0.30), хвоя чуть зеленее; по всему кадру −1.4 % (в кадре много земли) |
| C3 | `cfg … Foliage Matte false`, кадр «выкл»; `render` | как в игре (кроны бледные); deferred `Hidden/CTI/Internal-DeferredShading`; журнал «foliage glare off» | кадр, вывод, журнал | pass 11:52 — `fm_off`: осеннее дерево бледно-жёлтое; deferred `Hidden/CTI/Internal-DeferredShading`; журнал «foliage glare off: deferred -> Hidden/CTI/…» |
| C4 | `Foliage Matte true`, `Foliage Glare 1` → кадр; обратно `0.1` | при 1 кадр как «выкл» (ползунок работает на лету) | кадр, яркость | pass 11:52 — `fm_g1`: крона 75/58/28, насыщенность 0.63 — как «выкл» (76/59/28) |
| C5 | FPS: PresentMon 15 с «вкл», 15 с «выкл» на стоящем кадре | разница средних — в пределах шума (≤ 3 %) | CSV PresentMon | blocked 11:53–11:56 — PresentMon записал 0 файлов (процесс с апострофом в имени не нашёлся); пульт `perf 10`: мир догружался (треугольники 2.3 → 10.3 млн), цифры шумные; на втором круге игру закрыли обычным выходом в 11:56:09 (ironman записал сейв) — замер перенесён в `TC_svarog_bug15_roofs_fps_2026-10-11.md` C3 |
| C6 | После: `kill`, сейв 7/7 (расхождение → откат), реестр; мод 2.2.0 остаётся с `Foliage.Matte = true` | как до прогона, кроме мода | `cmp`, `reg query`, `.cfg` | pass 11:57 после отката — выход записал сейв (4/7: `saveFile-0`, `healthCheckSaveFile`, `saveFileExportable` 11:56:08), записанное — в `_backups/svarog-saves-2026-10-11_1156-agent-run`, три файла возвращены из `svarog-saves-2026-10-10_2357-state` → 7/7; реестр 1280×720; `.cfg`: `Foliage.Matte = true`, `Glare = 0` (слово владельца) |
