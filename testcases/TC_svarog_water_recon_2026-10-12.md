# Test cases — разведка воды (идея 13): чем рисуется пруд, есть ли отражение

> **Основание:** `ideas/13_svarog_otrazheniya_v_vode.md` — `[OWNER]` «Шейдер воды как - дыра в земле, словно не хватает отражения.... и
> эффектов поверхности воды» · 2026-10-11; «давай воду красивой сделаем, беремся за воду» · «шейдерами» · 2026-10-12.
> Код ассета: Lux Water в `Assembly-CSharp-firstpass.dll` (`LuxWater_PlanarReflection`, `LuxWater_WaterVolume`, …).
>
> **Сцена:** сейв владельца (копия `_backups/svarog-saves-2026-10-11_2342-owner-exit`), пруд у деревни. После — `kill`, сейв 7/7, реестр.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | `pick` по воде пруда | объект, шейдер, очередь, все материалы | строки `pick` | pass 11:01 — `Details/_WaterPlane (1)`: `Water Swamp` [`Lux Water/WaterSurface Tessellation` q2999] |
| C2 | Есть ли в сцене `LuxWater_PlanarReflection` | список объектов или «нет» | `comps LuxWater_PlanarReflection 3000` | pass 11:01 — на пяти плоскостях воды; у пруда: включено, `Resolution=Half`, `reflectSkybox=True`, `renderShadows=True`, камера `_WaterPlane (1)ReflectionCamera` создана |
| C3 | Свойства материала воды | значения для разведки | `mats Water Swamp` → `dump.txt` | pass 11:02 — `_PlanarEnabled 1`, `_ReflectionStrength 0.63`, `_FresnelPower 5`, `_ReflectionBumpScale 0.3`, `_Glossiness 0.9`, Gerstner, пена, каустика включены; `_LuxWater_ReflectionTex` пустая — у первого материала с этим именем из 38 «Water…», не обязательно у пруда |
| C5 | Пульт `camrt Reflection`: маска слоёв камеры отражения, путь отрисовки, дальность, картинка | что попадает в отражение | строки `camrt`, `camrt_<n>.jpg` | pass 11:04 — `_WaterPlane (1)ReflectionCamera` и `_WaterPlaneReflectionCamera`: `mask=0 []`, Forward, far 1000, rt 640×360; картинка — только небо с облаками (`camrt_0.jpg`): причина «дыры» |
| C4 | После: `kill`, сейв 7/7, реестр | как до прогона | `cmp`, `reg-snap.sh restore` | [NOT-TESTED] |
| C6 | Сборка WaterReflection: отражение выкл (как у автора) · вкл Quarter · вкл Half, вид на пруд с избами, наклон 20° | во вкл в воде видны избы, деревья, берег (перевёрнутые, размытые); выкл — только небо | кадры `wf_off`, `wf_q`, `wf_h`, лист; журнал `water reflection on: mask …` | pass 11:07 — журнал `mask 131329 (Default,Ground,WoodPlatform), planes 33`; в пруду отражаются горы (`wf_q`) |
| C7 | Цена кадра: `perf 8` на тех же трёх | разница медианы кадра против «выкл» — число | строки `perf` | fail 11:07 — выкл 60.3 FPS / 15.6 мс, пакетов 5651; Quarter 41.4 / 23.1 мс, 9981; Half 39.0 / 24.4 мс, 10320; главный поток 16.5 → 24–25.5 мс, ожидание видеокарты ≈ 0 — упор в процессор; `[OWNER]` «ЭТО ПИЗДЕЦ КАК ДОРОГО!!!!» — выключено по умолчанию |

Итог C4: владелец закрыл игру прогона сам («охуел от такой просадки ФПС»), игра записала сейв при выходе (11:08:23) — откат к копии,
7/7; запись выхода — `_backups/svarog-saves-2026-10-12_1108-run-exit`; в конфиге владельца `Water.Reflections = false`.
