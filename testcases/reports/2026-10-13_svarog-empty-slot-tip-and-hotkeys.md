# Test run report — Svarog's Dream: подсказка пустой ячейки и подписи клавиш

**Created:** 2026-10-13 19:55 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream, KrinikUIRework после правок 19:4x (коммит — тем же ходом)

## 1. Work

Подсказка пустой ячейки быстрых действий — нашей карточкой вместо серой плашки игры (E4b, E4b-2), подписи клавиш ячеек — белые,
размером и весом как числа шкал HUD (E19), контроль общей правки ширины подсказки (E4c). Основа — слова владельца 2026-10-13 вечером,
кейсы `testcases/TC_svarog_owner_remarks_2026-10-13_evening.md`.

## 2. Contour

Игра Svarog's Dream в 4K (3840×2160), сейв владельца с точки `_backups/svarog-saves-2026-10-13_1801-owner-exit-after-dawn-test`
(день 9), мод `KrinikUIRework` горячей выкладкой. После прогона: `h.sh kill`, сейв сверен и откатан (10 из 10 совпали), реестр экрана
возвращён.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-13 19:44 +03:00 | `bash tools/run-game.sh` · `tools/mouse.ps1 -X 1560 -Y 2080 -Button move` · `h.sh "shot e4b_2"` | карточка есть; кегль мельче, справа пустая полоса |
| 2 | 2026-10-13 19:46 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` · наведение · `h.sh "shot e4b_3"` | полосы нет; кегль ещё мельче |
| 3 | 2026-10-13 19:51 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` · наведение на пустую и полную · `h.sh "dump UI/ActionBar"` | кегль совпал; подписи белые ExtraBold |
| 4 | 2026-10-13 19:52 +03:00 | `tools/mouse.ps1 -X 1560 -Y 2080 -Button right` (дважды) | окно выбора открыто, подсказка погасла; закрыто вторым щелчком |
| 5 | 2026-10-13 19:54 +03:00 | ESC → «Графика» → `tools/mouse.ps1 -X 1014 -Y 813 -Button move` · `h.sh "shot e4c_7"` | подсказка «?» с переносом — рамка по тексту |
| 6 | 2026-10-13 20:00 +03:00 | `bash tools/run-game.sh` · `tools/mouse.ps1 -X 1560 -Y 2080 -Button right` · `h.sh "shot e5b_1"` | окно выбора: бумага, кольцо, высота 325 → 105; серые плашки и полоса прокрутки остались |
| 7 | 2026-10-13 20:01 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` · правый щелчок · `tools/mouse.ps1 -X 1530 -Y 1981 -Button move`, затем `-Button left` | E20 pass: плашек и полосы нет, строка светлеет, навык назначен, окно закрылось |

## 4. Checks

- **Hygiene:** `dotnet build src/KrinikUIRework -c Release` — успешно, предупреждений новых нет.
- **Functional run:** игра в мире, настоящая мышь по ячейкам 1 и 3, правый щелчок, страница «Графика»; прочитаны кадры `_harness/e4b_*`,
  `e4c_*`, дамп `_harness/dump.txt` и журнал `LogOutput.log` (`spell picker: opened / closed`).
- E4b — pass · E4b-2 — pass (третий прогон) · E19 — pass на 4K (720p–2K не сняты) · E4c — pass.

## 5. Found

- Первый образец кегля (`FindObjectOfType<SpellToolTip>`) брал не ту карточку — исправлено в этом же прогоне.
- Окно выбора навыка было старого вида (E5b) — одето в прогонах 6–7 (E20 pass).
- Хук кейсов не видит строки с номером вида `E5b-1` (шаблон `[A-Z]\d+[a-z]?`) — строку переименовал в E20.

## 6. Traces

`SvarogsDream/_harness/e4b_2_c.webp`, `e4b_3_sheet.webp`, `e4b_4_sheet.webp`, `e4b_5rc_c.webp`, `e4c_7c.webp`, `dump.txt`;
журнал `D:/Games/Svarog's Dream/BepInEx/LogOutput.log`.

## 7. Verdict

partial — E4b, E4c, E19 (4K) и E20 прошли, E4b и E19 приняты владельцем («выглядит хорошо, да»); E19 и E20 на 720p, 1080p и 2K не сняты.
