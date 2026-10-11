# Test cases — баг 15: матовая земля на участках, подгруженных после перемещения героя

> **Основание:** `bugs/15_svarog_whitish_world_against_low_sun.md` — «Not DONE yet: terrain swap while walking (streaming) not observed»;
> `plans/18` — «Баг 15 — подмена земли при ходьбе (новые участки получают матовый шейдер). Кадр после прохода героя». Список владельца
> 2026-10-10 ≈23:33 («15»).
>
> **Сборка:** KrinikColorRework 2.1.0 (`MatteTerrain.cs`: раз в секунду — материал каждого участка `Terrain.activeTerrains`); пульт
> `KrinikDevHarness` с новыми `render` (участки по шейдеру) и `teleport <поле WorldMap | x,y,z>` (TeleportPlayer + StreamAfterTeleport,
> без сейва «Железного человека»). **Сцена:** сейв владельца (копия 23:57, 7/7 до прогона); после — `cmp`, при расхождении откат из копии.
>
> Измерения: участки до перемещения, после дальнего перемещения в две разные точки, контроль с выключенной подменой. Не покрыто: обычная
> ходьба пешком через границу участка (то же событие подгрузки — другой путь вызова), острова за морем.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | Мир загружен, `render` | все участки `Krinik/Terrain/Matte`, ни одного `Nature/Terrain/Standard` | вывод пульта | pass 11:35 — «terrains by shader: Krinik/Terrain/Matte 25» |
| C2 | `teleport innGradLocation`, ждать 10 с, `render`, кадр | все участки снова матовые; в журнале новая строка «matte terrain on: N terrains»; на кадре земля без белёсого блика | вывод, журнал, кадр | pass 11:35 — перенос 2158 м (139,88,-652 → -475,90,1417); через 10 с «Krinik/Terrain/Matte 25»; журнал: строк «matte terrain on» 5 → 12, held 50; кадр `b15w_grad` — корчма Града, земля без блика |
| C3 | `teleport houseMountainLocation`, ждать 10 с, `render` | все участки матовые | вывод, журнал | pass 11:36 — перенос 1716 м; «Krinik/Terrain/Matte 25»; строк в журнале 17 |
| C4 | Контроль: `cfg krinik.svarogsdream.colorrework Terrain Matte false`, 3 с, `render`; затем `true`, 3 с, `render` | при `false` — все `Nature/Terrain/Standard`; при `true` — снова все матовые | вывод | pass 11:36 — `false`: «Nature/Terrain/Standard 25»; `true`: «Krinik/Terrain/Matte 25» |
| C5 | После: `kill`, сейв — `cmp` с копией (расхождение → откат), реестр | сейв 7/7, реестр 1280×720 | `cmp`, `reg query` | pass 11:36 — сейв 7/7 без отката (перенос сейв не записал), реестр 1280×720, полный экран |
