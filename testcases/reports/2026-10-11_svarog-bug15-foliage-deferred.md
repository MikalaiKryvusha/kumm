# Run report — баг 15, листва: свой шейдер освещения deferred, блик и просвет листвы по отдельности

**Created:** 2026-10-11 11:45 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** `krinik.shaders` 731 429 Б (5 шейдеров, новый —
`Krinik/Internal-DeferredShading`), KrinikDevHarness с `deferredshader`; старый пакет — `_backups/krinik-shaders-2026-10-11-before-foliage`

## 1. Work

Белёсость листвы против низкого солнца (`[OWNER]` «на листве чуть-чуть белесость осталось» · 2026-10-09). Случаи C1–C6 —
`testcases/TC_svarog_bug15_foliage_deferred_2026-10-11.md`. Основа шейдера — исходник CTI Runtime Components (бесплатный пакет Asset
Store, `CTI_Internal-DeferredShading.shader`, прочитан из открытого репозитория) и встроенный шейдер Unity 2020.3.49f1 (MIT).

## 2. Contour

- Svarog's Dream (Unity 2020.3.49f1, Mono, deferred, HDR), 1280×720, полный экран; сейв владельца, герой перенесён к «Лесной Хижине»
  командой `teleport` (без сейва), время 18:32, `timescale 0`, камера `TestFaceSun 15 0`.
- REAL WORLD: accumulated — сейв владельца (7/7 до и после); data and machine — его машина; path — мир игры с его сейвом.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 11:38–11:40 | `Unity.exe -batchmode -nographics -quit -projectPath unity/KrinikShaders -executeMethod KrinikBuild.Bundles`; `dotnet build src/KrinikDevHarness`, `src/KrinikColorRework` | пакет 5 шейдеров, 0 ошибок |
| 2 | 2026-10-11 11:40–11:41 | `run-game.sh`; `timescale 0`; `teleport cabinInWoodsLocation` | blocked: мир не подгрузился при остановленном времени → `kill` |
| 3 | 2026-10-11 11:42–11:44 | `run-game.sh`; `teleport cabinInWoodsLocation` + `wait 12`; `timescale 0`; 8 × `call WorldTime IncreaseTimeByOneHour true`; `TestFaceSun 15 0`; `shot f15_A` … `deferredshader Krinik/Internal-DeferredShading`, `global _KrinikFoliageSpecular 1/0/0.5/0.25`, `global _KrinikFoliageTranslucency 1/0`, `shot f15_B1…B4`, `deferredshader restore`, `shot f15_A2` | 8 кадров |
| 4 | 2026-10-11 11:44 | `kill`; `reg-snap.sh restore`; `cmp` сейва; `reg query` | 7/7, 1280×720 |

## 4. Checks

Hygiene: пакет шейдеров и две сборки модов — 0 ошибок.
Functional run: мир игры с сейвом владельца, восемь кадров одного места прочитаны глазом и замером яркости верха кадра.

- C1 pass (со второго захода) — у игры кроны сосен против солнца бледно-жёлтые, осеннее дерево белёсое; яркость 50.3.
- C2 pass — наш шейдер при 1/1 = игра (50.1, разность 4.8 при ветре 2.6).
- C3 pass — блик листвы 0: 44.9, кроны зелёные, осеннее дерево оранжевое.
- C4 pass — просвет 0 без перемены (50.1): белизна — блик, не просвет.
- C5 pass — оба 0 = блик 0; возврат шейдера игры — кадр как A.
- C6 pass — сейв 7/7, реестр 1280×720.

## 5. Found

- Причина белёсости листвы найдена: блик листьев CTI (`gbuffer1.r` листвы), тот же френелевский блик, что у земли.
- Перенос героя при `timescale 0` не работает: подгрузка мира ждёт игрового времени (записано в кейсах).

## 6. Traces

- Кадры: `SvarogsDream/_harness/f15_A.webp`, `f15_B1…B4.webp`, `f15_s050.webp`, `f15_s025.webp`, `f15_A2.webp`; лист — `SvarogsDream/gallery/game/2026-10-11_листва-блик/варианты.webp`.

## 7. Verdict

Pass: причина подтверждена, шейдер снимает её на листве, не меняя остального; сила блика в игре — выбор владельца по листу вариантов,
в мод пока не встроено.
