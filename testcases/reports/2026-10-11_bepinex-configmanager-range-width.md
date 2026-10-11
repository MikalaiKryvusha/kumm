# Run report — BepInEx.ConfigurationManager: ширина числа у ползунка (PR #127) и общая ширина по ревью

**Created:** 2026-10-11 16:47 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** форк CM, ветка `range-field-width`:
`52a0af4` (прогоны 1–2, ширина по замеру каждого поля) и рабочее дерево с общей шириной (прогон 3, сборка BepInEx5 sha256 2050c274…)

## 1. Work

Поле числа и метка «%» у ползунка в окне настроек модов. Прогоны 1–2 — первая версия PR #127 (случаи C1–C4, их итоги стояли в
тест-кейсах без отчёта — отчёт дописан здесь). Прогон 3 — правка по ревью ManlyMarco (одна общая ширина, только растёт, предел
10 знаков; `[OWNER]` «там нужно резол делать, он наш код прокомментировал» · 2026-10-11). Случаи C1–C7 —
`testcases/TC_bepinex_configmanager_range_width_2026-10-11.md`.

## 2. Contour

- Svarog's Dream (Unity 2020.3.49f1, Mono, BepInEx 5.4.23.5); прогоны 1–2 на 3840×2160, прогон 3 на 1280×720, полный экран; окно по F8.
- REAL WORLD: accumulated — сейв и настройки владельца (сейв 7/7 с копией `svarog-saves-2026-10-10_2357-state` после каждого прогона);
  data and machine — его машина; path — F8 в мире.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 ≈16:15 | CM форка `52a0af4` без полей метки в `plugins/ConfigurationManager/`; `bash tools/run-game.sh`; F8; `shot cmw_4k` | C1 fail — «100 %» второй строкой |
| 2 | 2026-10-11 ≈16:16 | сборка с `margin.horizontal`; `run-game.sh`; F8; `shot cmw2_4k`; `kill`; CM 19.0 назад | C1b pass, C4 pass |
| 3 | 2026-10-11 16:45–16:47 | `dotnet build ConfigurationManager/ConfigurationManager.csproj -c Release`; dll в `plugins/ConfigurationManager/`; `bash tools/run-game.sh`; `keys.ps1 -Key F8`; `mouse.ps1 -X 631 -Y 377`; `mouse.ps1 -X 631 -Y 520 -Button wheel -Clicks -8`; `tools/h.sh "shot cmw3c"`; `h.sh kill`; `cmp` сейва; CM 19.0 назад; `reg-snap.sh restore` | C5, C6, C7 pass |

## 4. Checks

Hygiene: сборки CM BepInEx5 и IL2CPP — 0 ошибок.
Functional run: окно настроек модов в игре владельца по F8, страница Krinik Color Rework, кадры прочитаны глазом.

- C1 fail → C1b pass (4K: числа целиком, «100%» в одну строку).
- C2 не прогнан (перетаскивание; устойчивость — по устройству замера).
- C3 не доказан (720p после смены разрешения — окно не перестроилось).
- C4 pass — всё возвращено.
- C5 pass — 1280×720: поля «480.0», «2.0», «2.0» и метки «100%», «25%», «0%» одной ширины в одном столбце.
- C6 pass — столбец ≈ 120 px, не уже 50.
- C7 pass — сейв 7/7, CM 19.0, реестр 1280×720 / 1.

## 5. Found

- C1: метка «%» без полей стиля переносилась — исправлено в `52a0af4`.
- Прогон 3 — none.

## 6. Traces

- Кадры: `SvarogsDream/_harness/cmw_4k.webp`, `cmw2_4k.webp`, `cmw3.webp`, `cmw3b.webp`, `cmw3c.webp`.

## 7. Verdict

Pass: общая ширина ставит все поля у ползунков ровным столбцом и не режет числа; 4K с общей шириной не прогнан отдельно
(ширина не меньше замера, принятого на 4K в C1b).
