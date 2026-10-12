# Test run report — дымка белёсо-серая (баг 37) и вес шрифта часов

**Created:** 2026-10-12 08:56 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** KrinikColorRework (настройка `Sky.HazeWhite`), KrinikUIRework (`Hud.WorldClockFont`), пакет `krinik_manrope_ttf` + Rubik 700/600/500

## 1. Work

Два прогона подряд: дымка вдали без синевы (`bugs/37_…`, `testcases/TC_svarog_haze_whitish_2026-10-12.md`) и вес шрифта часов по слову
владельца «часам нужно легче вес» → «вес часов тяжелее» (`testcases/TC_svarog_clock_weight_2026-10-12.md`).

## 2. Contour

Игра `D:\Games\Svarog's Dream` на машине владельца, DX11, 4K; сейв владельца (копия `_backups/svarog-saves-2026-10-11_2342-owner-exit`),
время идёт; день — `IncreaseTimeByOneHour` по часу с ожиданием 12 с (17 шагов до полудня).
REAL WORLD: accumulated — его сейв и конфиги модов — verified on the real world; data and machine — его машина — verified on the real
world; path — HUD и мир, как видит он — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 08:46 +03:00 | `bash tools/run-game.sh` | 0 · мир |
| 2 | 2026-10-12 08:47 +03:00 | `bash tools/h.sh "callon Managers/StandardManagers/WorldTimeManager WorldTime IncreaseTimeByOneHour True"` ×17, пауза 12 с | 0 · полдень игры |
| 3 | 2026-10-12 08:52 +03:00 | `bash tools/h.sh "callon Camera CameraFollow SetMaxZoom" "call KrinikCameraRework.Plugin TestTilt 12"`; `cfg … Sky HazeWhite <0|0.5|0.8|1>` + `shot hz_<v>` | 0 · четыре кадра |
| 4 | 2026-10-12 08:53 +03:00 | `bash tools/h.sh kill`; `cmp` сейва; `bash tools/reg-snap.sh restore` | 0 · сейв 7/7 |
| 5 | 2026-10-12 08:55 +03:00 | `bash tools/run-game.sh`; `cfg … Hud WorldClockFont <5 шрифтов>` + `shot cw_<имя>` + `dump` часов | 0 · пять кадров, `font=` совпал |
| 6 | 2026-10-12 08:56 +03:00 | `bash tools/h.sh kill`; `cmp` сейва; `bash tools/reg-snap.sh restore` | 0 · сейв 7/7 |

## 4. Checks

Hygiene: сборки без ошибок; пакет шрифтов собран Unity (`KrinikFonts.BuildTtf`, 677 626 байт)
Functional run: в игре на сейве владельца — дымка на четырёх значениях в полдень при пологой камере, часы на пяти шрифтах; прочитаны
кадры и дампы

| Case | Status | Observation |
|---|---|---|
| Дымка C1 | pass | при 0 гора и даль голубые, при 0.8–1 белёсо-серые (`hz_sheet`) |
| Дымка C2 | pass | резкой полосы у горизонта нет |
| Дымка C3 | skipped | крыша вдали — следующим заходом |
| Часы C1 | pass | `font=` в дампе = заданному, вес убывает по шагам (`cw_sheet`); владелец: «часы суппер» на Rubik-Bold |
| C4 / C2 | pass | сейв 7/7 после обоих прогонов, реестр вернул |

## 5. Found

- плоские деревья-картинки у горизонта ярко-зелёные поверх дымки — шов (кадры `hz_*`), в беклог

## 6. Traces

`SvarogsDream/gallery/game/2026-10-12_дымка-белёсая/`, `SvarogsDream/gallery/game/2026-10-12_часы-статы-миникарта/03 часы - вес шрифта.webp`;
журналы `SvarogsDream/_harness/logs/2026-10-12_haze_white.log`, `2026-10-12_clock_weight.log`.

## 7. Verdict

partial — часы приняты владельцем; дымка белёсая на кадрах, но крыша вдали (второй симптом бага 37) не разобрана, и вкус дымки — за
глазом владельца.
