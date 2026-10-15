# Test run report — Svarog's Dream: мелкие баги пачкой + эпик 26, пачка 3 (и замечания владельца по ходу: счётчик FPS, вода, панель)

**Created:** 2026-10-15 21:26 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `1050849`, `3d4ea88` + рабочее
дерево (`HudRow.SlotsHeld`); в игре: UIRework `a9d278591f0d`, ColorRework `84566627eab8`, CameraRework `851d6c941869`, DevHarness `c28d9b55ac2b`. К закрытию 21:39 (md5): UIRework `1574514af595`, ColorRework `498d15c759f3`, CameraRework
`eb7a48017650`, ModMenu `a7b7dc5d45c4`, KrinikFixes `f50b7e0472c4`, DevHarness `e2d36b89fdeb` (SvarogsDream `e56d6bc`)

## 1. Work

Пачка из плана 25 и пачки 3 эпика 26 по кейсам `testcases/TC_svarog_batch3_smallbugs_2026-10-15.md`: запятая в координатах (F1), снимок
материалов травы у мода цвета (G1), цена пузыря реплики относительно переноса в трактире Бары (B1), заголовок навыка `bugs/42` (K1). По ходу
— просьбы владельца в игре: счётчик FPS (P1–P5), вода у мостков Бары `bugs/51` (W1–W3), сломанная панель быстрых действий (H1).

## 2. Contour

Игра владельца (GOG, 4K, HDR), запуски агента: 21:01, 21:12, 21:22, 21:30, 21:33, 21:37 (все чистые, `tools/run-game.sh`); горячие выкладки UIRework — 21:07,
21:09 (первый запуск), 21:15 (второй). Сейв — точка `_backups/svarog-saves-2026-10-15_2100-before-batch3` (10 из 10 перед каждым запуском).
Владелец смотрел и управлял игрой во втором запуске (показывал баги воды).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-15 21:00 +03:00 | `SAVE_POINT=… bash tools/save-check.sh`; `bash _harness/deploy_set.sh …` | 10 same; хеши = собранные |
| 2 | 2026-10-15 21:01 +03:00 | `bash tools/run-game.sh`; `h.sh "findall SM_Cliff"` | мир; координаты точкой |
| 3 | 2026-10-15 21:01 +03:00 | `h.sh "modcost 30 14 bg" "wait 6" "teleport innBaraLocation" "modcostwait"` | худший кадр 43,5 мс (пузырь) |
| 4 | 2026-10-15 21:05 +03:00 | `ffmpeg -f lavfi -i ddagrab=… -t 5 water_bug.mp4` (по слову владельца) | запись бага воды |
| 5 | 2026-10-15 21:08 +03:00 | `h.sh "cfg … Water ScreenReflectionMaxDist 250" "comps LuxWater_PlanarReflection 600"` | 6 плоскостей воды |
| 6 | 2026-10-15 21:12 +03:00 | `h.sh kill`; `save-check.sh --restore`; `deploy_set.sh`; `run-game.sh` | чистый запуск с правкой воды |
| 7 | 2026-10-15 21:14 +03:00 | `h.sh "shot owner_2113"` (по слову владельца) | кадр воды |
| 8 | 2026-10-15 21:17 +03:00 | `h.sh "shot t_on1" "cfg … Terrain Matte false" … "shot t_off" …` | равнина вдали та же |
| 9 | 2026-10-15 21:22 +03:00 | `kill` → `--restore` → `deploy_set.sh` → `run-game.sh`; `h.sh "shot h1_load" "teleport innBaraLocation" … "shot h1_move"` | ряд ячеек на месте |
| 10 | 2026-10-15 21:23 +03:00 | `h.sh "call KrinikCameraRework.Plugin DemoOrbit 30 12 12 12"` + `ffmpeg … water_fix3.mp4` | ракурс не тот |
| 11 | 2026-10-15 21:30 +03:00 | `kill` → `--restore` → KrinikFixes `f50b7e0472c4` в `plugins` → `run-game.sh`; пробел через `keys.ps1` | `jump #1`, «Пробела» в ряду нет |
| 12 | 2026-10-15 21:33 +03:00 | чистый запуск с `Shared/PatchEach.cs` во всех модах; `grep` журнала и Player.log | 0 `patch … failed`, 0 `IL Compile Error` |
| 13 | 2026-10-15 21:36 +03:00 | `mouse.ps1`: меню по Esc → «В меню» → «Нет» | окно закрылось с первого щелчка |
| 14 | 2026-10-15 21:38 +03:00 | `kill` → `--restore` → DevHarness `e2d36b89fdeb` → `run-game.sh`; `h.sh "teleport innBaraLocation" … "shot d1_view" "groundat 3300 1200" …` | 82,3 / 412,7 / 473,4 м |
| 15 | 2026-10-15 21:39 +03:00 | `h.sh kill`; `save-check.sh --restore`; `reg-snap.sh restore` | 10 same, `restored` |

## 4. Checks

Hygiene: сборка пяти модов без ошибок; храповик `refactor_inventory.mjs --check` ok (поиски в кадре 8 → 7).
Functional run: игра владельца, шесть запусков; прочитаны вывод пульта, журнал BepInEx, кадры изнутри движка и записи экрана.

| Case | Status | Observation |
|---|---|---|
| D0 | pass | 10 same; хеши выложенных = собранные |
| F1 | pass | `@ -222.2,119.8,191.8` |
| G1 | pass | `grass scan … (colorrework …)`: 2,54 мс первый, затем 0,62 / 0,04 мс |
| B1 | partial | `#1` 16,55 мс через 0,3 с, `#2` 3,27 через 1,3 с, `#3` 0,88 через 5 с; второй заход 10,52 / 2,36 / 0,64; обычные 0,39–1,35 мс |
| P1 | fail (по слову владельца) | `b3s_fps`: ×2,5 ExtraBold — «забольшой шрифт» |
| P3 | fail | `b3s_fps3`: выложена сборка без веса и подъёма |
| P4 | partial | `b3s_fps4`: SemiBold, контур, читается на светлом; владелец просил отступ и размер |
| P5 | pass | `b3s_fps5`, итог `b3s_fps7`: «56» у угла, SemiBold ×1,62, контур, отступ 0,5 % |
| W3 | fail | скриншот 21:14: стены изб не отражаются и при 250 м |
| H1 | partial | ряд на месте после загрузки и переноса; виновник прошлого сдвига не пойман |
| W1 | blocked | облёт пультом не даёт ракурса владельца |
| W2 | partial | дальний пруд стабилен в кадрах 10–12 `water_fix3_sheet` |
| K1, K2 | blocked | подсказка мастерства не адресуется до показа |
| B6 | partial | плашки реплик у голов, по тексту |
| C5 | partial | 21:36: «Выход в главное меню?» закрылось щелчком «Нет» с первого раза; «Загрузить?» не проверено |
| G2, P2 | skipped | не дошли |
| J1 | pass | 21:30–21:31: `jump: space slot AnimalSlot hidden`, `jump #1` (высота 2,20); ряд без «Пробела» (`j1_row`) |
| X1 | pass | 21:33: 0 `patch … failed`, 0 `IL Compile Error`; «Настройки модов» в меню паузы (`x1_menu`) |
| D1 | partial | 21:38: `groundat` работает — террейн 82,3 / 412,7 / 473,4 м; равнина за камышом не измерена |
| A1 | pass | 0 строк `Exception` |
| A2 | pass | 21:39: процессов игры 0; сейв 10 same на точке; реестр `restored` |

## 5. Found

- `bugs/51` — вода у Бары: отражение пропадает с углом камеры, дальний пруд мигает, стены изб не отражаются (заведён по показу владельца).
- Панель быстрых действий: кто-то возвращает ячейки на места игры после нашей раскладки — проверка `SlotsHeld` добавлена, виновник не найден.
- Дальняя равнина за камышом у Бары светлая и без дымки (владелец: «пылевая буря … не покрыта шейдером дымки … словно нет расстояния») —
  не наш матовый шейдер земли (контроль выключателем в 21:17); причина не найдена.
- Пузырь: вторая дорогая группа — 2,5–3,8 мс без переноса (первая фраза нового говорящего?).

## 6. Traces

`SvarogsDream/_harness/`: `b3s_fps*.webp`, `owner_2113.webp`, `b3s_dust.webp`, `terrain_onoff2.webp`, `qa_now_crop.webp`, `h1_sheet.webp`,
`water_bug/` (`water_bug.mp4`, `water_bug2.mp4`, `water_fix*.mp4`, листы), `batch3/modcost_transfer.txt`; журнал BepInEx `LogOutput.log`.

## 7. Verdict

partial — мелочи F1, G1, счётчик FPS и панель приняты кадрами; вода и заголовок навыка не доказаны в игре; пузырь — данные собраны, правки нет. После 21:26: прыжок и патчи по классу приняты (J1, X1), «Нет» в окне выхода в меню работает
(C5, «Загрузить?» не проверено), прибор `groundat` работает, а «пылевая буря» не измерена (D1).
