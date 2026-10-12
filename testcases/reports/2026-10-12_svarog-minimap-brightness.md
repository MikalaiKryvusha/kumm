# Test run report — яркость миникарты настройкой 0.5…2

**Created:** 2026-10-12 10:55 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** KrinikUIRework (`MiniMapLight.cs`, `Hud.MiniMapBrightness`), пакет krinik.shaders + `Krinik/UI/Bright`

## 1. Work

`[OWNER]` «1 якрость карты хорошо - вынести настройкой. От 0.5 до 2» · 2026-10-12. Набор случаев —
`testcases/TC_svarog_minimap_brightness_setting_2026-10-12.md` (C1–C5).

## 2. Contour

Игра на машине владельца, 1280×720 (его разрешение в реестре), сейв владельца (копия `_backups/svarog-saves-2026-10-11_2342-owner-exit`),
мир у пруда, миникарта. Мод интерфейса — горячая выкладка; пакет шейдеров — с перезапуском.
REAL WORLD: accumulated — его сейв и конфиг — verified on the real world; data and machine — его машина, его разрешение — verified on the
real world; path — HUD — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 10:50 +03:00 | `bash tools/run-game.sh`; `cfg … Hud MiniMapBrightness <0.5|1|1.5|2|1>` + `shot mb_<v>` | 0 · выше 1 не светлеет |
| 2 | 2026-10-12 10:52 +03:00 | `Unity.exe -batchmode … -executeMethod KrinikBuild.Bundles` (Krinik/UI/Bright); `bash tools/run-game.sh`; те же кадры | 0 · 1.5 = 2 |
| 3 | 2026-10-12 10:54 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` (новый материал на значение); те же кадры | 0 · по шагам |
| 4 | 2026-10-12 10:54 +03:00 | `bash tools/h.sh kill`; `cmp` сейва; `bash tools/reg-snap.sh restore` | 0 · сейв 7/7 |

## 4. Checks

Hygiene: сборки без ошибок; пакет шейдеров — 9 шейдеров, `ok Krinik/UI/Bright`
Functional run: в игре на сейве владельца — миникарта на пяти значениях подряд, три сборки; прочитан средний тон карты по кадрам и лист

| Case | Status | Observation |
|---|---|---|
| C1 | fail → C4 | `_TextureSampleAdd` перезаписывает движок |
| C4 | fail → C5 | маска держит копию материала |
| C5 | pass | 72 < 87 < 98 < 107 |
| C2 | pass | обратно 1 — 88 |
| C3 | pass | сейв 7/7 |

## 5. Found

- none (два промаха своей сборки — разобраны в C1, C4)

## 6. Traces

`SvarogsDream/gallery/game/2026-10-12_часы-статы-миникарта/04 миникарта - яркость 0.5, 1, 1.5, 2.webp` (открыт владельцу в ACDSee, снимок
экрана); журнал `SvarogsDream/_harness/logs/2026-10-12_minimap_brightness.log`.

## 7. Verdict

pass — настройка 0.5…2 работает по шагам; владелец выбрал 2 («2 нравится, ставим по умолчанию»), по умолчанию 2.
