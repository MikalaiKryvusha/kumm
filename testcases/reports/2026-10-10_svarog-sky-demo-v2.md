# Run report — Svarog's Dream: демо v2 — небо, луны и сияния разного цвета, 4K

## 1. Work

Демо неба — `[OWNER]` «я и просил в демо ДОЛГИЕ сцены, не менее 5 секунд … много разных! ночное небо! Разного цвета луны в небе, аура
разного цвета! а ты в бору крыши и лес снимал!» · 2026-10-10. Случаи — `testcases/TC_svarog_sky_demo_v2_2026-10-10.md` (C1–C9).

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, release-плеер.
- Сейв владельца 02:15 (Бор), копия `_backups/svarog-saves-2026-10-10_0918-pre-devplayer`.
- SvarogsDream после `c0f5942`:
  - шейдер `KrinikSkyGradient` — `_AuroraBase/_AuroraTop/_AuroraFringe`;
  - `Sky.cs` — пять палитр сияния, пять оттенков луны, `TestAuroraPalette`, `TestMoonColor`;
  - пульт — `fieldon`, `animrate`.
- Пакет шейдеров собран Unity 2020.3.49f1 в 10:21 («4 shaders, 708488 bytes»).

## 3. Runs

1. 2026-10-10 10:22–10:35 — черновой прогон 720p:
   - `bash tools/run-game.sh`;
   - `h.sh "fieldon Managers/StandardManagers/WorldTimeManager WorldTime isTimeDisabled True"`;
   - камера отвязана: `callon Camera CameraFollow set_enabled False`, `callon Camera Transform set_position …`, `set_eulerAngles -10,180,0`;
   - интерфейс скрыт: `active UI/ActionBar 0`, `active UI/Enablers 0`;
   - превью `TestAuroraPalette 0..4`, `TestMoonColor 0..4`, `TestNight 4|5|18`;
   - запись 21 сцены; монтаж `python -I cut3.py`.
2. 2026-10-10 10:38–10:48 — 4K:
   - `SetResolution 3840 2160 ExclusiveFullScreen`; проверка: кадр 3840×2160, float-захват — максимум 1.0;
   - курсор в угол: `cursor 3839 2159`;
   - запись `ffmpeg -f lavfi -i "ddagrab=output_idx=0:framerate=30" -c:v h264_nvenc -cq 18 rec.mkv` — сцены 1–18;
   - в 10:46:05 захват оборвался («AcquireNextFrame failed: 887a0026»): игра сбросила 4K при промотке часов;
   - повторный `SetResolution`, `rec3.mkv` — сцены 19–21;
   - `kill` в 10:48.
3. Монтаж — `python -I cut4.py sky-4k.mp4`, затем concat 17 сцен → `sky-4k-v2.mp4`.

## 4. Checks

Hygiene: сборка пакета шейдеров и модов без ошибок.
Functional run: игра в 4K на сейве владельца, превью каждой ночной сцены прочитаны глазом; ролик — лист кадров на 3-й секунде каждой
сцены и громкость голоса по сценам.

| Случай | Итог |
|---|---|
| C1 | pass |
| C2 | pass |
| C3 | pass |
| C4 | pass |
| C5 | pass |
| C6 | fail (720p, −22°) → в 4K pass на −7°: штрих звезды виден на листе |
| C7 | partial (720p, пересвет) |
| C8 | partial |
| C9 | pass с исключениями |

## 5. Found

1. **Разрешение сбрасывается при промотке часов**: исключительный 4K → 720p; захват экрана рвётся (887a0026).
2. **Окно без рамки на HDR-столе** — 8-битная запись пересвечена; в исключительном полном экране стол SDR (захват ≤ 1.0).
3. **Рассвет и закаты на записи экрана белые даже в 4K SDR**, а кадры движка тех же секунд пастельные: мир на записи ≈1.6 раза
   светлее (EXP-0200). Какая картинка у владельца на экране — не проверено.
4. **Падающие звёзды** появляются низко у горизонта: при взгляде на 22° вверх их нет.
5. **«Луна срезана справа» из v1 — ошибка агента:** прямой край — фаза первой четверти (ночь 20). Поправлено в STATUS, плане 18, отчёте
   прошлого прогона и README галереи.

## 6. Traces

- Ролик — `SvarogsDream/gallery/game/2026-10-10_демо-4K/демо-небо-4K-v2.mp4` (102 с, 3840×2160, AAC); лист `…-v2-лист.webp`.
- Находка — `находка-рассвет-закаты-белые-на-записи.webp`.
- Превью `SvarogsDream/_harness/`:
  - `aurora5`, `moon5`, `moon2scan`;
  - `p01`, `p17`, `p18`, `p19`.
- Сырьё — scratchpad сессии:
  - `demo2/` (720p);
  - `demo3/`: `rec.mkv`, `rec3.mkv`, `a.wav`, `marks_ab.txt`, `marks.txt`, `cut4.py`.

## 7. Verdict

partial:
- ночное небо (16 сцен) и день вошли в 4K;
- рассвет, закаты и гроза не вошли — на записи пересвечены, причина расхождения с кадром движка не найдена.
