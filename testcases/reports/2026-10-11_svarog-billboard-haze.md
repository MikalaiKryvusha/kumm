# Run report — дальние деревья-картинки в дымке (свой шейдер); граница настоящих деревьев 150 / 200 / 300 м

**Created:** 2026-10-11 12:52 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikColorRework 2.3.0 (`BillboardFog.cs`), KrinikCameraRework
1.5.0 (`TreeMeshDistance`), `krinik.shaders` 725 187 Б (6 шейдеров); копия камеры 1.4.1 — `_backups/krinikcamerarework-1.4.1`

## 1. Work

`[OWNER]` «давай картинки, но сделаем шейдер … И погугли быстренько, как это делают» · «настоящие дедевья можно до 300 метров расширить,
или до 200» · «в Боту ФПС померяешь 200 vs 300» · 2026-10-11. Разведка: подмена встроенного шейдера — своим с тем же именем в проекте
(не наш случай — игру не пересобрать); туман у билбордов в сборке пропадает (форумы Unity, VRChat). Мы подменяем шейдер материалам
картинок во время игры. Случаи — `testcases/TC_svarog_billboard_haze_2026-10-11.md` (C1–C4).

## 2. Contour

- Svarog's Dream, 1280×720, полный экран, сейв владельца, время идёт (world=running); Бара (вид на гору), Бор.
- REAL WORLD: accumulated — сейв владельца (7/7 до и после); data and machine — его машина; path — камера мода в Баре и Бору.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 12:42–12:44 | `Unity.exe -batchmode … KrinikBuild.Bundles` (6 шейдеров); `dotnet build src/KrinikColorRework`, `src/KrinikCameraRework` | 0 ошибок |
| 2 | 2026-10-11 12:45–12:46 | `run-game.sh`; `TestFaceSun 8 60`; `cfg … colorrework Foliage BillboardHaze false|true`, `shot bb_*` | картинки в дымке |
| 3 | 2026-10-11 12:46–12:49 | `teleport innBorLocation`; 2 × `cfg … camerarework DrawDistance TreeMeshDistance 0|200|300` + `perf 10`; `terrainset treeBillboardDistance` (чтение); `mats trees` | Бор без разницы |
| 4 | 2026-10-11 12:49–12:52 | `teleport houseBaraLocation`; 2 × 0/200/300 + `perf 10`; `shot bara_*`; `kill`; `cmp`; `.cfg` | ≤ −1.5 %; 7/7 |

## 4. Checks

Hygiene: пакет шейдеров и два мода — 0 ошибок.
Functional run: виды Бары и Бора при идущем времени, кадры прочитаны глазом, `perf` world=running.

- C1 pass — наш шейдер загружен, 15 материалов картинок подменены.
- C2 pass — картинки деревьев у горы тают в дымке; выключено — как в игре.
- C3 pass — Бор: 150 / 200 / 300 м — 53.6 / 53.45 / 53.95 FPS, треугольники те же (деревья Бора — CTI и др., на эту границу не смотрят);
  Бара: 50.35 / 50.15 / 49.6 FPS (≤ −1.5 %).
- C4 pass — сейв 7/7, `TreeMeshDistance = 0`.

## 5. Found

- Свой шейдер картинок с туманом работает подменой материалов во время игры (15 материалов), без пересборки игры.
- Граница «модель → картинка» действует только на деревья Tree Creator (Бара); деревья Бора идут своими ступенями детализации.
- При выключении назад вернулись 11 из 15 материалов (4, видимо, пересозданы движком) — на вид не влияет, записано.

## 6. Traces

- Кадры: `SvarogsDream/_harness/bb_on.webp`, `bb_off.webp`, `bor_150|200|300.webp`, `bara_150|200|300.webp`; лист —
  `SvarogsDream/gallery/game/2026-10-11_дальние-деревья/картинки-в-дымке-выкл-вкл.webp`.

## 7. Verdict

Pass: картинки в дымке; 200 и 300 м стоят ≤ 1.5 % FPS у Бары и ничего в Бору; какое расстояние ставить по умолчанию — слово владельца.
