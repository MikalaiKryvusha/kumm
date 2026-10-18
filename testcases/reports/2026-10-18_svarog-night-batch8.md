# Test run report — Svarog's Dream, ночь 2026-10-18, пачка 8: цифра перезарядки у E и Q, цифра у ссылки на еду, обратное включение стопки

**Created:** 2026-10-18 06:46 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `fd31e3e` + `HotbarDrag.cs` (цифра у ячейки со
ссылкой: `CountdownTimer.countdown`)

## 1. Work

Поправки по суду пачек 6–7 (`scratchpad/judge67/judge67.md`): R2 — цифру перезарядки после правки смотрели только на «1», у Q со ссылкой красная рамка
без цифры (кадр `p8b`, дефект `HotbarDrag.StartCooldown`); R3 — у кейса M2c не увидено обратное включение стопки. План 31, пункты 19 и 7. Кейсы —
`testcases/TC_svarog_night_batch8_2026-10-18.md` (A4, CE, CQ, M2v, S1).

## 2. Contour

Игра владельца (BepInEx 5.4.23.5), 4K, сейв — точка `_backups/svarog-saves-2026-10-18_0225-live-before-night-agent` (8 из 8 до и после), в файл ссылок до
запуска дописана строка `51 268`. Холодная выкладка `KrinikUIRework`. Экран заблокирован: щелчки событиями пульта, кадры изнутри игры — **замена** мыши
и видео. REAL WORLD: accumulated — настройки модов владельца (`cfg_run_diff.py`: 0 изменённых) — verified on the real world; data and machine — его игра,
копия его сейва — verified with real state; path — ряд и стопка на живом HUD, щелчки по ячейкам событием пульта — verified with real state.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 06:43 +03:00 | `bash tools/deploy-cold.sh KrinikUIRework`; `SAFE_SPOT="-590,96,1863" LOCK_MINUTES=25 bash tools/run-game.sh`; `h.sh "click …/Enablers/ActionBarEnabler"` | 0 · безопасный старт, HUD виден |
| 2 | 2026-10-18 06:44 +03:00 | `bash tools/h.sh "fieldon Player PlayerStats currentHealth 600" "click …/Slots/Slot~(8)" … "give 268" "give 268" … "click …/Slots/Slot~(7)" … "cfg … Hud MessageStack false" … "true" … "callon UI/ActionBar/InfoMessages GameUI.UIInfoMessages ShowNewCustomMessage After~on"` | 0 · лист `c8_sheet.webp`, кадр `m2v_crop.webp` |
| 3 | 2026-10-18 06:45 +03:00 | `bash tools/h.sh "kill"`; `save-check.sh --restore`; `reg-snap.sh restore` | 0 · `cfg run diff: 0 changed`, замок FREE |

## 4. Checks

Hygiene: `dotnet build` KrinikUIRework — Build succeeded.
Functional run: перезарядка запущена щелчками по E и по Q со ссылкой на живом HUD, стопка выключена и включена настройкой, строка вызвана методом игры;
кадры и журнал прочитаны. Мышью и видео не проверено — экран заблокирован.

| Case | Status | What was read |
|---|---|---|
| A4 безопасный старт | pass | ответы пульта; HUD вернул щелчок «Оружие» |
| CE цифра на E | pass | `ce`: «29» по центру коробки E |
| CQ цифра на Q со ссылкой | pass | `cq0` «3» → `cq1` «2», рамка и «29» по центру; журнал `hotbar use: cell 51 … consume` |
| M2v обратное включение стопки | pass | журнал `'After~on' adopted`; `m2v_crop.webp` |
| S1 уборка | pass | `cfg run diff: 0 changed`, сейвы 8 из 8 |

## 5. Found

1. У ячейки со ссылкой на вещь перезарядка шла без цифры (найдено судом по кадру `p8b`) — `HotbarDrag.StartCooldown` теперь ставит `CountdownTimer.countdown`,
   как игра; проверено, CQ.

## 6. Traces

`SvarogsDream/_harness/`: `ce.webp`, `cq0.webp`, `cq1.webp`, `c8_sheet.webp`, `m2v.webp`, `m2v_crop.webp`; журнал — `_harness/log_batch8.log`.

## 7. Verdict

pass — все кейсы пачки прошли в игре; оговорка: щелчки событием пульта, не мышью (экран заблокирован).
