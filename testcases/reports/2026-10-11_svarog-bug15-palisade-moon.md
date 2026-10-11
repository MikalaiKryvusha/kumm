# Run report — баг 15: блеск досок и частокола против луны; «супер светлая ночь» — инструмент агента

**Created:** 2026-10-11 12:23 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikColorRework 2.2.0, `krinik.shaders` 731 199 Б

## 1. Work

`[OWNER]` «я говорил про блеск частокола, когда смотришь ПРОТИВ источника света … на 180 градусов. Но и на твоем кадре тоже странность …
какая-то суппер светлая ночь...» · 2026-10-11. Случаи C1–C3 — `testcases/TC_svarog_bug15_palisade_moon_2026-10-11.md`.

## 2. Contour

- Svarog's Dream, 1280×720, полный экран; сейв владельца, Бор (`teleport innBorLocation`), ночь 23 ч, `timescale 0`.
- REAL WORLD: accumulated — сейв владельца (7/7 до и после); data and machine — его машина; path — мир игры с его сейвом.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 12:19–12:21 | `ilspycmd -t WorldTime …Assembly-CSharp.dll` (доля дня: `MoveTowards(…, 0.1 * Time.deltaTime)`); `run-game.sh`; `teleport innBorLocation`; `timescale 0`; 13 × `IncreaseTimeByOneHour true`; `TestFaceSun 15 180`; `shot nt_before`; `call WorldTime SetDayNightImageVisibility 0`; `call WorldTime SetDayNightSceneLighting`; `shot nt_after` | 58.2 → 21.2 |
| 2 | 2026-10-11 12:21–12:22 | 9 ракурсов `TestFaceSun 10|15|25 -30|0|30` × `cfg … Foliage BuildingsMatte true|false` × `shot pm_*` | пары кадров |
| 3 | 2026-10-11 12:23 | `kill`; `reg-snap.sh restore`; `cmp` сейва; `reg query` | 7/7, 1280×720 |

## 4. Checks

Hygiene: —.
Functional run: Бор ночью с сейвом владельца, 20 кадров прочитаны глазом и замером.

- C1 pass — «супер светлая ночь» на кадрах агента — дневной свет при ночных часах: после выставления доли дня кадр 58.2 → 21.2, крыша 174 → 22.
- C2 pass — лицом к луне (наклон 25°, угол 0) при «выкл» доски стен и настила таверны в белёсых полосах (2398 пикселей светлее на > 40),
  при «вкл» настройки «Дома и дерево» — тёмное дерево.
- C3 pass — сейв 7/7, реестр 1280×720.

## 5. Found

- Инструмент агента: ночь прыжком часов при `timescale 0` даёт ночь по часам и ДНЕВНОЙ свет, пока доля дня не выставлена
  (`call WorldTime SetDayNightImageVisibility 0` + `SetDayNightSceneLighting`). Под подозрением все ночные кадры, снятые прыжком
  часов при остановленном времени (Бор 12:10–12:16 — поправлено; прошлые ночные кадры неба и демо — не пересмотрены).
- Блеск досок против луны — тот же блик неметаллов, снимается настройкой «Дома и дерево без белёсого блика».

## 6. Traces

- Кадры: `SvarogsDream/_harness/nt_before.webp`, `nt_after.webp`, `pm_{10,15,25}_{-30,0,30}_{on,off}.webp`, `pm_zoom.webp`; листы —
  `SvarogsDream/gallery/game/2026-10-11_листва-блик/бор-ночь-против-луны-доски.webp`, `бор-ночь-против-луны-кадр.webp`.

## 7. Verdict

Pass: блеск досок против луны подтверждён и снят настройкой; светлая ночь на прошлых кадрах — ошибка съёмки агента, не игры.
