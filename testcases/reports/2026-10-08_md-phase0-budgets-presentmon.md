# Test run report — Medieval Dynasty фаза 0: бюджет кадра PresentMon и видеопамять (шаг 0.6, критерий 5)

**Created:** 2026-10-08 14:55 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** Medieval Dynasty 2.7.0.3, UE4SS 1161, пак со всеми модами (мост v11, проба v3, пробуждение v10, цвет,
пилот, быстрый старт); PresentMon 2.5.1 Intel

## 1. Work

Критерий №5 фазы 0 (`plans/16_epic15_phase0_recon_and_stand.md`): FPS по PresentMon, 60 с, сцена деревни; ваниль / только
UE4SS / с мостом; видеопамять. Кейсы — `testcases/TC_md_phase0_budgets_presentmon_2026-10-08.md` (B1–B5), **записаны после
прогона** (нарушение порядка, второе за день — EXP-0182).

## 2. Contour

Машина владельца (RTX 5070 Ti, 4K 144 Гц HDR), сейв `Autosave2_Ox`, герой в своей деревне; копия сейвов
`D:/Games/Medieval Dynasty Mods/_save-backup/2026-10-08_145229_pre-run`. Оболочка агента повышена (EXP-0183).

## 3. Runs

- 2026-10-08 14:52–14:54: `route-pilot-load.ps1` → 15 с → `PresentMon-2.5.1-x64.exe --process_name Medieval_Dynasty-Win64-Shipping.exe
  --output_file …/_pm/pm-mods-on-60.csv --timed 60 --terminate_after_timed --no_console_stats --session_name kumm-pm
  --stop_existing_session` (14:53:17–14:54:17); на 30-й секунде `nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu,power.draw`;
  разбор `pm_stats.py` (scratchpad); `route-close.ps1`.

## 4. Checks

Hygiene: — (кода в прогоне нет).
Functional run: захват кадров игры на сейве владельца по пути его запуска; прочитаны CSV PresentMon (5904 строки) и вывод `nvidia-smi`.

| Кейс | Статус | Что прочитано |
|---|---|---|
| B1 захват | pass | 5904 кадра за 60 с, код 0 |
| B2 разбор | pass | кадр медиана 10,03 мс (p95 12,64, p99 13,33); CPU busy 9,54 (12,16 / 12,85); GPU busy 10,14 (10,57 / 10,81); 98,5 FPS, 1 % low 75; рывок 368 мс на CPU — один |
| B3 видеопамять | pass | 11 149 / 16 303 МиБ на всю карту, GPU 93 %, 268,8 Вт |
| B4 ваниль / только UE4SS | blocked | нужен маршрут загрузки без UE4SS и снятие `dwmapi.dll` — отдельный прогон |
| B5 закрытие | pass | сейвы 50 из 50, сессии `kumm-pm` нет |

## 5. Found

- **Сцена деревни в 4K упирается в обе стороны:** CPU ≈ 9,5 мс и GPU ≈ 10,1 мс на кадр — запаса ни у кого нет. Для мира-
  сервера это довод держать игровой поток лёгким (соль п. 21: мир снаружи, игра только применяет разницу).
- Кадр по кадромеру моста (11,2–11,3 мс в той же сцене, 14:11–14:13) и по PresentMon (10,0 мс медиана) сходятся.
- Сборка PresentMon из FrameView SDK как отдельная программа не работает (EXP-0008, 2026-08-15) — сегодня этот тупик
  пройден повторно из-за досье, указывавшего на неё; досье исправлено, баг 31 закрыт.
- Кейсы после прогона — второй раз за день.

## 6. Traces

`D:/Games/Medieval Dynasty Mods/_pm/pm-mods-on-60.csv` (вне репозиториев).

## 7. Verdict

**partial** — замер «с модами» сделан и разобран, видеопамять снята; сравнение с ванилью и «только UE4SS» не сделано (B4).
