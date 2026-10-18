# Test run report — Svarog's Dream, ночь 2026-10-18, пачка 9: сообщения достижений в стопке над рядом

**Created:** 2026-10-18 07:03 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `6b6a4ad` (первый запуск); второй запуск —
`6b6a4ad` + `VisibleRect` в `MessageStack.cs` (откатан после прогона)

## 1. Work

План 31, пункт 7 — сообщения достижений над рядом (`[OWNER]` «сообщения богов и достижений появляются внизу слева поверх нашего худ виджета - нужно в
центр переносить над квик экшенами»; интервью #022, Q3 — А); суд пачек 6–7: достижения не вызывались. Кейсы — `testcases/TC_svarog_night_batch9_2026-10-18.md`.

## 2. Contour

Игра владельца (BepInEx 5.4.23.5), 4K, сейв — точка `_backups/svarog-saves-2026-10-18_0225-live-before-night-agent` (8 из 8 до и после). Два чистых запуска.
Экран заблокирован: события пульта и кадры изнутри игры — **замена** мыши и видео. REAL WORLD: accumulated — настройки модов владельца (`cfg_run_diff.py`:
0 изменённых) — verified on the real world; data and machine — его игра, копия его сейва — verified with real state; path — стопка на живом HUD, строки
вызваны методами игры — verified with real state.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 06:55 +03:00 | `SAFE_SPOT="-590,96,1863" LOCK_MINUTES=15 bash tools/run-game.sh`; `h.sh "click …/ActionBarEnabler" "callon UI/ActionBar/InfoMessages GameUI.UIInfoMessages ShowQuestFinishedMessage" … "ShowNewLevelUpMessage" … "ShowRecipeDiscoveredMessage"` | 0 · кадр `ac3_crop.webp` |
| 2 | 2026-10-18 06:56 +03:00 | `bash tools/h.sh "kill"`; `save-check.sh --restore`; `reg-snap.sh restore` | 0 · `cfg run diff: 0 changed` |
| 3 | 2026-10-18 06:59 +03:00 | `bash tools/deploy-cold.sh KrinikUIRework`; `SAFE_SPOT=… bash tools/run-game.sh`; `h.sh "static WorldState isEquiped" "click …/ActionBarEnabler" … "shot l2r"`; серия `shot s1…s4` | 0 · кадры `l2r_crop.webp`, `l2r_series.webp` |
| 4 | 2026-10-18 07:02 +03:00 | `bash tools/h.sh "kill"`; `save-check.sh --restore`; `reg-snap.sh restore`; `git checkout -- src/KrinikUIRework/MessageStack.cs`; `deploy-cold.sh KrinikUIRework` | 0 · прежняя сборка в игре |

## 4. Checks

Hygiene: `dotnet build` KrinikUIRework — Build succeeded (дважды).
Functional run: строки достижений вызваны методами игры на живом HUD, журнал стопки и кадры прочитаны. Мышью и видео не проверено — экран заблокирован.

| Case | Status | What was read |
|---|---|---|
| A5 безопасный старт | partial (щелчок «Оружие» без проверки — HUD оказался скрыт) | ответы пульта, `ac3_crop.webp` |
| AC1, AC3 задание, рецепт | partial (стопка подхватила, по-русски; место при скрытом HUD не оценено) | журнал `adopted` |
| AC2 новый уровень | fail (крупный текст в две строки налезает на соседнюю строку) | `ac3_crop.webp` |
| L2r правка высоты | fail (налезание осталось во всех кадрах серии; код откатан) | `l2r_series.webp` |
| S1 уборка | pass | первая уборка (прогон 2): `cfg run diff: 0 changed`, сейвы 8 из 8; вторая (прогон 4) — exit 0, её сверка настроек в отчёт не записана; сверка сейвов 2026-10-18 07:25 (`save-check.sh` без отката): 8 из 8, игра не запущена |

## 5. Found

1. Строка «Уровень повышен!» (заготовка без фона `Background`, крупный текст) в стопке налезает на соседнюю строку — план 31, пункт 7, правка следующей сессии;
   первая попытка (высота по `preferredHeight` от центра прямоугольника) не помогла.
2. Щелчок «Оружие» без чтения `isEquiped` может оружие убрать — первым шагом читать состояние (так и сделано во втором запуске).

## 6. Traces

`SvarogsDream/_harness/`: `ac1.webp`, `ac2.webp`, `ac3.webp`, `ac3_crop.webp`, `l2r.webp`, `l2r_crop.webp`, `s1…s4.webp`, `l2r_series.webp`; журналы —
`_harness/log_batch9.log`, `_harness/log_batch9b.log`.

## 7. Verdict

fail — строки достижений стопка берёт, но «Уровень повышен!» налезает на соседнюю; правка не удалась и откатана, в игре прежняя проверенная сборка.
