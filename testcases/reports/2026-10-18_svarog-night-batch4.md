# Test run report — Svarog's Dream, ночь 2026-10-18, пачка 4: весть бога в стопке, выключатель ссылок, вещи сумки

**Created:** 2026-10-18 05:50 +03:00 (отчёт дописан после восстановления хода: ход висел ≈03:52–05:12) · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** SvarogsDream `5d9b2d2` + правка слежения за баннером (`MessageStack.cs`, позже `ab3a0c3`)

## 1. Work

План 31, пункт 7 (вести богов — по центру над рядом, интервью #022, Q3 — А), повтор P13 (выключатель `Hud/HotbarDrag` со ссылкой на вещь, которая
есть у героини), P16 (порядок «строка под подсказкой ячейки»). Кейсы — `testcases/TC_svarog_night_batch4_2026-10-18.md` (MG2–MG4, P16m, BG, P13m, S1).

## 2. Contour

Игра владельца (BepInEx 5.4.23.5), 4K, сейв — точка `_backups/svarog-saves-2026-10-18_0225-live-before-night-agent` (сейвы в распоряжении агента,
интервью #022, Q5). Запуск чистый, затем одна горячая выкладка `KrinikUIRework`. REAL WORLD: accumulated — настройки модов владельца (сверены
`cfg_run_diff.py`: 0 изменённых) — verified on the real world; data and machine — его игра, копия его сейва — verified with real state; path —
HUD и ряд ячеек, как у игрока, вести вызваны методом игры — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | ≈ 2026-10-18 03:43 +03:00 | `LOCK_MINUTES=40 bash tools/run-game.sh` | 0 · мир |
| 2 | 2026-10-18 03:44 +03:00 | `bash tools/h.sh "bag"` | 0 · 8 вещей, 408 PracticeBow есть |
| 3 | 2026-10-18 03:45 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.uirework Hud HotbarDrag false" … "true"` с кадрами | 0 · лист `p13m_sheet.webp` |
| 4 | 2026-10-18 03:47 +03:00 | `powershell -File tools/mouse.ps1 -X 2738 -Y 2081 -Button move` | 0 · подсказка не открылась (`p16m_crop.webp`) |
| 5 | 2026-10-18 03:48 +03:00 | `bash tools/rec_clip.sh mg2 7 … "call GodsFavorsManager ShowGodsIntervention Perun True" …` | 0 · клип `mg2.mkv` |
| 6 | ≈ 2026-10-18 03:49 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` (слежение 1,5 с) | 0 · RELOADED |
| 7 | 2026-10-18 03:50 +03:00 | `bash tools/rec_clip.sh mg4 6 … "call GodsFavorsManager ShowGodsIntervention Perun True" …` | 0 · клип `mg4.mkv` |
| 8 | 2026-10-18 03:51 +03:00 | `bash tools/h.sh "kill"`; `reg-snap.sh restore`; `hdr.ps1 on` | 0 · `cfg run diff: 0 changed` |

## 4. Checks

- Hygiene: `dotnet build` KrinikUIRework — Build succeeded; проверка покоя после выкладки — зелёная.
- Functional run: вести Перуна вызваны методом игры на живом HUD, ссылка на вещь включена и выключена настройкой — клипы, кадры, журнал прочитаны.

| Case | Status | What was read |
|---|---|---|
| BG вещи сумки | pass | ответ `bag`: вещь 408 есть |
| P13m выключатель ссылок | pass | лист `p13m_sheet.webp`: ссылка на «2» ушла и вернулась |
| P16m порядок под подсказкой | blocked (настоящая мышь не открыла подсказку; причина не найдена — не блокировка экрана: `LogonUI.exe` запущен в 04:51, после пачки; поправка по суду пачки 5) | `p16m_crop.webp` |
| MG2 весть бога | fail → правка слежения | клип `mg2.mkv`: баннер ≈1 с на ряду, потом прыжок |
| MG3 строка над вестью | partial | журнал `'New~Virtue' adopted`; строка вне обреза клипа |
| MG4 весть после правки | pass | клип `mg4.mkv`, лист 4 кадра/с: с первого кадра над рядом; подсказка зелья поверх баннера |
| S1 уборка | pass | `cfg run diff: 0 changed`, журнал `_harness/log_batch4.log` |

## 5. Found

1. Весть бога в миг показа разворачивается анимацией: первая раскладка стопки видит листья нулевого размера — правка: 1,5 с слежения (SvarogsDream `ab3a0c3`).
2. Подсказка ячейки E стоит слева над серединой ряда, не у ячейки (рулбук К6) — план 31, пункт 18 (в пачке 5 проверен наведением событием пульта; настоящей мышью — открыто).
3. Ссылку на вещь 408 в пачке 2 сняли, хотя вещь у героини есть — причина не найдена; ветка снятия теперь пишет строку в журнал.

## 6. Traces

`SvarogsDream/_harness/`: `p13m_sheet.webp`, `p16m_crop.webp`, `log_batch4.log`; клипы и листы — `_harness/demo21/clips/mg2.*`, `mg4.*` (`mg4_sheet.webp`).

## 7. Verdict

partial — весть бога над рядом и выключатель ссылок прошли в игре (MG4, P13m); P16m заблокирован, MG3 виден только журналом.
