# Run report — листва деревьев и кустов: таяние по альфе при отдалении камеры

**Created:** 2026-10-11 15:03 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikColorRework 2.5.0 (`FoliageCoverage.cs`), `krinik.shaders` 928 859 Б, KrinikCameraRework 1.5.1

## 1. Work

`[OWNER]` «Проверить листву деревьев и кустов, нету ли такой же проблемы по альфа, как в траве» · 2026-10-11 14:55. Случаи —
`testcases/TC_svarog_foliage_alpha_melt_2026-10-11.md` (C1–C7). Класс — `bugs/35_DONE_svarog_grass_melts_at_zoom_out.md`.

## 2. Contour

- Svarog's Dream, 1280×720, полный экран, сейв владельца, время идёт (world=running); Бор (`innBorLocation`), лесная деревня (`houseMountainLocation`).
- REAL WORLD: accumulated — сейв владельца (7/7 до и после); data and machine — его машина; path — его камера при отдалении.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 14:56–14:59 | `run-game.sh`; `teleport innBorLocation`; `mats trees`; `fieldon Camera CameraFollow targetZoom 40…240`; `teleport houseMountainLocation`; `matmul Leaves|Lordenfel _Cutoff 0.5|0.7|1`; `TestFaceSun 12 150`; `shot fa_*`, `fl_*`, `fc_*` | таяние есть, ×0.7 |
| 2 | 2026-10-11 14:59 | `kill`; `reg-snap.sh restore`; `cmp` | 7/7 |
| 3 | 2026-10-11 14:59–15:00 | `FoliageCoverage.cs`; `dotnet build`; DLL в `plugins/KrinikColorRework/` | 0 ошибок |
| 4 | 2026-10-11 15:00–15:02 | `run-game.sh`; `teleport houseMountainLocation`; `targetZoom 240`; `cfg … Foliage LeavesNoMelt false|true` ×2 + `perf 10`; `shot fv2_*` | плотнее, цены нет |
| 5 | 2026-10-11 15:02 | `targetZoom 125`; `kill`; `reg-snap.sh restore`; `cmp`; `.cfg` | 7/7 |

## 4. Checks

Hygiene: мод — 0 ошибок сборки.
Functional run: мир игры при идущем времени, отдаление камеры игрой, кадры прочитаны глазом и числами, `perf` world=running.

- C1 pass — семьи листвы: CTI/LOD Leaves, Lordenfel FoliageWind, Tree Creator Leaves Optimized, NatureManufacture Tree_Leaves; пороги 0.3–0.65.
- C2 partial — во дворе трактира деревьев мало, опыт перенесён в лесную деревню.
- C3 pass — таяние есть, слабее травы; ×0.5 и ×0.7 вдали близки; вблизи ×0.7 как в игре.
- C4 pass — сейв 7/7.
- C5 pass — 882 материала, вкл — кусты и кроны плотнее.
- C6 pass — FPS выкл 63.0 / 68.3, вкл 65.2 / 68.2.
- C7 pass — сейв 7/7, реестр, настройки.

## 5. Found

- Шейдеры листвы игры — из магазина, исходников нет: «покрытие по мипу», как у травы, не собрать; порог ×0.7 даёт тот же итог вдали без цены.
- Пульт `matmul` режет имя шейдера по пробелу — искать одним словом (`Leaves`, `Lordenfel`).

## 6. Traces

- Кадры: `SvarogsDream/_harness/fa_*.webp`, `fl_sheet.webp`, `fc_sheet.webp`, `fv2_sheet.webp`; галерея — `SvarogsDream/gallery/game/2026-10-11_листва-при-отдалении/`.

## 7. Verdict

Pass: кроны и кусты больше не редеют при отдалении камеры, цены нет; вкус — глаз владельца (настройка «Кроны при отдалении: порог»).
