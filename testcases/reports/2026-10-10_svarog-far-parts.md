# Run report — Svarog's Dream: цена дальнего жителя по частям

## 1. Work

- Эпик 19 (`plans/19_EPIC_svarog_main_thread_offload.md`), строка «Дальше — разложить жителя по частям: агент навигации, коллайдеры и
  тела, скрипты ИИ, рендереры» (после опыта URO, EXP-0203).
- Случаи — `testcases/TC_svarog_far_parts_2026-10-10.md` (C1–C7). Новый пульт `farparts <м> nav|phys|render|ai|anim | restore`
  (`SvarogsDream/src/KrinikDevHarness/Plugin.cs`).

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, release-плеер, DX11; на опыт — 4K `ExclusiveFullScreen` (игра стояла в 1280×720 — так оставил владелец).
- Сейв владельца после его игры 13:35–14:35: день 10:14, лето, день 12, деревня. Копия до прогона —
  `_backups/svarog-saves-2026-10-10_1440-owner` (7 файлов). Часы игры стоят, отдаление до предела (`SetMaxZoom`).
- SvarogsDream `a6505b5` + пульт `farparts` (не закоммичен до прогона, собран 12:41, в игре та же библиотека — sha256 совпал).
- Прогон 12:42–12:46 той же задачи оборван вместе с прошлым чатом: итоги не записаны, уцелел один ответ пульта (`perf 10` 12:46 —
  77.2 FPS, Main Thread 12.94 мс).

## 3. Runs

1. 2026-10-10 14:42 — `bash tools/run-game.sh`; `bash tools/h.sh "fieldon Managers/StandardManagers/WorldTimeManager WorldTime isTimeDisabled True"`
   `"call CameraFollow SetMaxZoom"` `"perf 6"` ×2; `"call UnityEngine.Screen SetResolution 3840 2160 ExclusiveFullScreen"` и основа заново.
2. 2026-10-10 14:43–14:47 — `bash tools/h.sh "farchars 150"` / `"farchars restore"`; `"farparts 150 nav|phys|render|ai|anim"` /
   `"farparts restore"` — каждый с `"wait 3" "perf 6" "wait 2" "perf 6"` и основой после; `nav` — второй раз; кадры `"shot fp_base|fp_render|fp_after"`.
3. 2026-10-10 14:47 — `"fieldon … isTimeDisabled False"` `"kill"`; `sha256sum -c _backups/svarog-saves-2026-10-10_1440-owner/SHA256SUMS`;
   `reg add` трёх ключей экрана обратно в 1280/720/1; `reg query`.

## 4. Checks

Hygiene: `dotnet build src/KrinikDevHarness -c Release` — без ошибок.
Functional run: игра с сейвом владельца; прочитаны ответы пульта (`perf`, `farparts`, `farchars`), журнал `LogOutput.log`, кадры
`fp_base` / `fp_render` / `fp_after` (лист рядом); сейв и реестр сверены.

| Случай | Итог |
|---|---|
| C1 целиком | pass — −0.85 мс (24 жителя) |
| C2 навигация | pass — −0.4…−0.7 мс (20 агентов, два A-B-A) |
| C3 коллайдеры | pass — 0 |
| C4 рендереры | pass — 0, дальние вне кадра |
| C5 скрипты игры (и аниматоры) | pass — 0 |
| C6 жители после возврата | partial — журнал чист, дальних в кадре нет |
| C7 после прогона | pass — сейв 7/7, реестр возвращён к 1280/720/1 |

## 5. Found

1. **Дальние жители теперь дёшевы: −0.85 мс за 24 жителя дальше 150 м** (основа 15.2–15.5 мс). Утренние «≈3–4 мс» (development-плеер,
   ночь в Бору, 19.1 → 15.3) и «−2.2 мс» (опыт URO) мерились со старой службой значков: та двигала значки и дальних жителей.
2. **Почти вся оставшаяся цена — агент навигации**: он каждый кадр пишет позицию в трансформ жителя, и сдвиг рассылается по всей
   иерархии (кости, тела, рендеры). Коллайдеры, рендереры, скрипты игры и аниматоры дальних — 0 каждый.
3. Камера на отдалении смотрит сверху и видит ≈60 м: жители дальше 150 м в кадр не попадают вовсе.
4. Пульт `farparts` работает: выключение и возврат всех пяти частей без исключений в журнале.

## 6. Traces

- Кадры: `SvarogsDream/_harness/fp_base.webp`, `fp_render.webp`, `fp_after.webp`.
- Ответы пульта — `SvarogsDream/_harness/out.txt` (только последний вызов; цифры выше — из вывода команд).
- Копия сейва — `_backups/svarog-saves-2026-10-10_1440-owner`.

## 7. Verdict

Pass по цене частей (C1–C5, C7); C6 partial — после возврата дальние жители глазом не видены (вне кадра), журнал чист. Вывод для
эпика: усыплять дальних ради кадров незачем — выигрыш меньше 1 мс; если брать эти полмиллисекунды, то синхронизацией позиции
агента реже у тех, кто вне кадра, а не сном.
