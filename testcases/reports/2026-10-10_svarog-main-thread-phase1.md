# Run report — Svarog's Dream: эпик 19, фаза 1 — цена наших дальностей, скрипты кадра, рывок UI-мода

## 1. Work

Замеры главного потока и правки `KrinikUIRework`:
- `IconClick.cs` — отсев значков под курсором по точке;
- `MenuFonts.cs` — в мире главное меню не искать;
- `Plugin.cs` — секундомеры частей `Update` и ловец кадров > 50 мс.

Случаи — `testcases/TC_svarog_main_thread_2026-10-10.md`, C5–C9. Основание:
- `[OWNER]` «оптимизация главного потока и ЦПУ … разгрузить нужно главный поток» · 2026-10-10 ≈01:59;
- план `plans/19_EPIC_svarog_main_thread_offload.md`;
- разведка `researches/svarogs-dream/main-thread-recon.md`, §6: сначала мерить своё.

## 2. Contour

Игра `D:\Games\Svarog's Dream`, 3840×2160 во весь экран (разрешение игры из её настроек), DX11 (`LegacyJobified`).

Сейв владельца 02:15:41 (копия `_backups/svarog-saves-2026-10-10_0216-owner`). Сцена: Бор, день (перемотка на паузе, затем ход),
камера 55°, предельное отдаление.

Конфиг камеры до и после прогона — один хеш (`837ee003…`). После прогона сейв сверен: 4/4.

SvarogsDream `884cc16` → `9b12e19`.

## 3. Runs

Запуск игры 2026-10-10 02:36 (`bash tools/run-game.sh`); горячие выкладки `bash tools/deploy-hot.sh KrinikUIRework` в 02:42, 02:45,
02:47, 02:48, 02:50.

Пульт:
- `bash tools/h.sh "timescale 0"`, `"callon … IncreaseTimeByOneHour True"` ×9, `"timescale 1"`;
- `"callon Camera CameraFollow SetMaxZoom"`, `"call KrinikCameraRework.Plugin TestFaceSun 55 90"`;
- `"cfg krinik.svarogsdream.camerarework DrawDistance <ключ> <значение>"`;
- `"cfg krinik.svarogsdream.uirework Icons Clickable false|true"`;
- `"perf 8"`, `"prof 8 20"`, `"wait N"`.

Закрытие — `bash tools/h.sh "kill"`.

## 4. Checks

**Hygiene.** `dotnet build` — 0 ошибок (предупреждения прежние).

**Functional run** — замеры `perf` / `prof`, журнал «update parts», «spike», «farthest corner».
- C5 pass — цена ключей.
- C6 pass — скрипты кадра.
- C7 partial → закрыт C8 — отсев значков безопасен (170 из 324 px), экономия 0.3 мс.
- C8 pass — `menu` 0.000 мс.
- C9 pass — low 1 % 45–48 FPS ровно.
- C10 pass — титульное меню оформлено как прежде.

## 5. Found

1. **Наш UI-мод — самый дорогой скрипт кадра**, 1.43 мс. Внутри — `FindObjectOfType<MainMenuOutOfGame>` раз в секунду: рывок
   40–50 мс каждую секунду. Главная причина низкого low 1 % (≈14).
2. **Цена наших дальностей:** трава 500 м — 2.3 мс главного потока, тени ×3 — 1.1 мс. lodBias ×4.5 (итог 13.5) и деревья ×3 — в шуме.
3. **Служба значков UI-мода** — `cost=0.588ms/fr` в строке состояния. Следующий кандидат.
4. **`perf` подряд без паузы** заражает второе окно подсчётом объектов (`count took 298ms`) — low 1 % ≈10 был артефактом. Между
   окнами нужна пауза.
5. **Игра на DX11 — в `LegacyJobified`.** Графические задания включены (ответ на открытый вопрос разведки).

## 6. Traces

- `SvarogsDream/_harness/ab0.webp`.
- Журнал `BepInEx/LogOutput.log`: строки `perf fps`, `prof frames`, `update parts`, `spike`, `farthest corner from icon point`.
- Таблица — `plans/19_EPIC_svarog_main_thread_offload.md`, статус «Фаза 1 начата».

## 7. Verdict

**pass.**
- low 1 % 14.5 → 45–48 FPS в опорной сцене (рывок UI-мода раз в секунду убран), главный поток −0.5…−1 мс.
- Цена наших дальностей измерена; урезать траву и тени — решение владельца (вкус против кадра).
- Главное меню вне игры после правки — как прежде (C10 pass, кадр `mm1`).
