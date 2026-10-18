# Test run report — Svarog's Dream, ночь 2026-10-18, пачка 7: значок строки на бумаге стопки, сборка без цикла сеток, пауза проверки покоя

**Created:** 2026-10-18 06:22 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `857a9b5` + `MessageStack.cs` (бумага по тексту и
значку строки с картинкой)

## 1. Work

План 31, пункт 7 (строка с картинкой — значок отдельно от плашки, кейс M2 пачки 6; рулбук §10 п. 3 «всё ли прилеплено»); регресс подсказки ячейки после
удаления цикла «сетки до раскладки» (T7a пачки 6); пауза 3 с перед проверкой покоя в `deploy-hot.sh`. Кейсы — `testcases/TC_svarog_night_batch7_2026-10-18.md`.

## 2. Contour

Игра владельца (BepInEx 5.4.23.5), 4K, сейв — точка `_backups/svarog-saves-2026-10-18_0225-live-before-night-agent` (8 из 8 до и после). Холодная выкладка
`KrinikUIRework`, затем одна горячая той же сборки (R1). Экран заблокирован: события пульта и кадры изнутри игры — **замена** мыши и видео. REAL WORLD:
accumulated — настройки модов владельца (`cfg_run_diff.py`: 0 изменённых) — verified on the real world; data and machine — его игра, копия его сейва —
verified with real state; path — стопка и подсказки на живом HUD, вызванные методами игры и событием наведения — verified with real state.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 06:18 +03:00 | `SAVE_POINT=… bash tools/save-check.sh`; `bash tools/deploy-cold.sh KrinikUIRework`; `SAFE_SPOT="-590,96,1863" LOCK_MINUTES=30 bash tools/run-game.sh` | 0 · безопасный старт, HUD скрыт |
| 2 | 2026-10-18 06:19 +03:00 | `bash tools/h.sh "click …/Enablers/ActionBarEnabler" "callon UI/ActionBar/InfoMessages GameUI.UIInfoMessages ShowNewCustomMessageWithImage New~Virtue Fight" … "cfg … Hud MessageStack false" … "true"` | 0 · лист `m2_sheet.webp`, `m2c_s.webp` |
| 3 | 2026-10-18 06:20 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`; `bash tools/h.sh "call SpellsActionManager AssignSpell 12 4" … "hover …" …` | 0 · проверка покоя 16; журнал сдвигов |
| 4 | 2026-10-18 06:21 +03:00 | `bash tools/h.sh "kill"`; `save-check.sh --restore`; `reg-snap.sh restore` | 0 · `cfg run diff: 0 changed`, замок FREE |

## 4. Checks

Hygiene: `dotnet build` KrinikUIRework — Build succeeded.
Functional run: строки стопки вызваны методами игры на живом HUD, подсказки ячеек — событием наведения, выкладка — тем же путём, что всегда; кадры,
  журнал и строка проверки покоя прочитаны. Мышью и видео не проверено — экран заблокирован.

| Case | Status | What was read |
|---|---|---|
| A3 безопасный старт | pass | ответы пульта; щелчок «Оружие» вернул HUD |
| M2r строка с картинкой | pass | `m2r`: текст и значок на одной бумаге |
| M2s простая строка | pass | `m2s` |
| M2c контроль стопки | pass | `m2c_s.webp`, журнал `restored` |
| T7b подсказка без цикла | pass | журнал `alpha 0,00` у всех сдвигов, `t7be_crop.webp` |
| R1 пауза проверки покоя | pass | `rest check: ui moved 16 per frame (limit 40)` |
| S1 уборка | pass | `cfg run diff: 0 changed`, сейвы 8 из 8 |

## 5. Found

none — значок строки с картинкой на бумаге, подсказки без видимого прыжка, проверка покоя без ложной тревоги.

## 6. Traces

`SvarogsDream/_harness/`: `m2r.webp`, `m2s.webp`, `m2c.webp`, `m2c_s.webp`, `m2_sheet.webp`, `t7be.webp`, `t7be_crop.webp`; журнал — `_harness/log_batch7.log`.

## 7. Verdict

pass — все кейсы пачки прошли в игре; оговорка: наведение событием пульта, не мышью (экран заблокирован).
