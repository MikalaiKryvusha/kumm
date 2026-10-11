# Run report — баг 15: листва в моде (2.2.0), крыши и частокол, цена в FPS

**Created:** 2026-10-11 12:05 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikColorRework 2.2.0 (`FoliageGlare.cs`,
настройки `Foliage.Matte`, `Foliage.Glare` = 0, `Foliage.BuildingsMatte`); `krinik.shaders` 731 199 Б (срез блика неметаллов); копия
2.1.0 — `_backups/krinikcolorrework-2.1.0`

## 1. Work

`[OWNER]` «блик листвы делаем 0.1» → «давай выключим по умолчанию блики лситвы, даже 0.1 бесит» · «и фпс померяй разных вариантов» · «и я
помню что крышы блестели и частакол, вроде - проверь» · 2026-10-11. Случаи — `testcases/TC_svarog_bug15_foliage_mod_2026-10-11.md`
(C1–C6) и `testcases/TC_svarog_bug15_roofs_fps_2026-10-11.md` (C1–C6).

## 2. Contour

- Svarog's Dream (Unity 2020.3.49f1, Mono, deferred, HDR), 1280×720, полный экран; сейв владельца у Бары; лес у «Лесной Хижины»
  (перенос `teleport` при идущем времени).
- REAL WORLD: accumulated — сейв владельца (7/7 с копией 23:57 до прогонов); data and machine — его машина; path — мир игры с его сейвом.
  В 11:56:09 игра закрыта обычным выходом посреди замера (владелец — игра занимала его экран) → ironman записал сейв; откат из копии.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 11:51–11:52 | `dotnet build src/KrinikColorRework` (2.2.0); dll в `plugins/`; `run-game.sh`; `render`; `teleport cabinInWoodsLocation`; `timescale 0`; `TestFaceSun 15 0`; `shot fm_on`, `cfg … Foliage Matte false` + `shot fm_off`, `Glare 1` + `shot fm_g1` | кадры, журнал |
| 2 | 2026-10-11 11:53–11:56 | PresentMon `--process_name "Svarog's Dream.exe" --timed 15`; `perf 10` × 6 | PresentMon — 0 файлов; perf шумный; игру закрыли в 11:56:09 |
| 3 | 2026-10-11 11:56–11:57 | `cmp` сейва → 4/7; копия записанного в `_backups/svarog-saves-2026-10-11_1156-agent-run`; 3 файла из `svarog-saves-2026-10-10_2357-state` | 7/7 |
| 4 | 2026-10-11 11:57–11:58 | `Foliage.Glare` = 0 в коде и `.cfg`; срез `_KrinikWorldSpecularCut` в шейдере; `Unity.exe -batchmode … KrinikBuild.Bundles`; сборка мода | пакет 731 445 Б |
| 5 | 2026-10-11 11:58–12:01 | `run-game.sh`; Бара 18:05, `TestFaceSun 15 0/30/-30`, `global _KrinikWorldSpecularCut 0/1`, `shot r_*`; `timescale 1`, `teleport cabinInWoodsLocation`, `wait 30`; 2 × (игра / наш 0 / наш 0.1) × `perf 10`; `kill` | кадры, FPS |
| 6 | 2026-10-11 12:02–12:04 | срез только неметаллов, настройка `BuildingsMatte`; пакет 731 199 Б; `run-game.sh`; Бара 18:05, угол 30, `shot rb_on`, `cfg … BuildingsMatte false` + `shot rb_off`; `kill`; `cmp`; `reg query` | кадры, 7/7 |

## 4. Checks

Hygiene: пакет шейдеров (три сборки) и мод — 0 ошибок.
Functional run: мир игры с сейвом владельца: кадры леса и деревни у Бары прочитаны глазом и замером, журнал BepInEx, замер `perf` при
идущем мире (world=running).

- Листва 0.1 в моде: C1–C4 pass (шейдер ставится сам, выключение и ползунок на лету); C5 (FPS) blocked — перенесён в прогон 5; C6 pass после отката.
- Крыши и частокол: C2 pass — блестят: при срезе 0 настил причала и частокол против солнца белёсые, при 1 — тёмное дерево.
- FPS (C3, world=running, лес, 20 млн треугольников): игра 51.8 / 51.5, наш блик 0 — 52.1 / 50.6, наш 0.1 — 51.6 / 51.1; разница ≤ 0.6 % при
  разбросе кругов до 1.5 FPS — цены нет в пределах шума.
- Настройка «Дома и дерево» (C5): вкл = тёмное дерево, выкл = как в игре; журнал «foliage 0, buildings matte».
- C4, C6 pass — сейв 7/7, реестр 1280×720.

## 5. Found

- Блик неметаллов (дерево, солома, камень) против низкого солнца белит причал, частокол, коньки крыш — снят настройкой «Дома и дерево без
  белёсого блика» (металл с силой блика ≥ 0.2 не трогается; доспехи вблизи глазом не проверены).
- PresentMon 2.5.1 не пишет файл для «Svarog's Dream.exe» — замер FPS этой игры — пультом `perf`.
- Обычный выход из игры в режиме ironman пишет сейв — после любого прогона с переносом героя сверка сейва обязательна (сделано, откат).

## 6. Traces

- Кадры: `SvarogsDream/_harness/fm_on.webp`, `fm_off.webp`, `fm_g1.webp`, `r_{0,30,m30}_c{0,1}.webp`, `rb_on.webp`, `rb_off.webp`; листы —
  `SvarogsDream/gallery/game/2026-10-11_листва-блик/крыши-частокол-срез.webp`, `дома-и-дерево-настройка.webp`.
- Журнал: `D:/Games/Svarog's Dream/BepInEx/LogOutput.log` — «foliage glare …», «perf fps …».

## 7. Verdict

Pass: блик листвы 0 по умолчанию, блик дерева и домов снят отдельной настройкой, цена в FPS не видна в пределах шума; металл вблизи и
4K не смотрены.
