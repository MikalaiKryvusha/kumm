# Test run report — Svarog's Dream, ночь 2026-10-18, пачки 2 и 3: пассивки без оружия, полосы врагов, бумага днём, баг 54 с навыком в обоих наборах

**Created:** 2026-10-18 03:40 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** пачка 2 — SvarogsDream `4bb19d6` + `PassiveBuffs.cs`;
пачка 3 — `53e4e0e` (правки по суду пачки 1)

## 1. Work

План 31, пункт 16 (пассивки под оружие без оружия в руках), беклог 18 «полосы врагов вдали гаснут на дальности значков», бумага стопки днём (пункт 7),
повторы P13 и P16, баг 54 с созданным условием гипотезы (навык в обоих наборах), весть бога в стопке. Кейсы — `testcases/TC_svarog_night_batch2_2026-10-18.md`
(I1–I5, E1, M8, P13, P16, S1) и `testcases/TC_svarog_night_batch3_2026-10-18.md` (B0–B4, P13r, P16r, MG, S1); основа — слова владельца в плане 31 и суд
ночи (`scratchpad/judge1/judge1.md`).

## 2. Contour

Игра владельца (BepInEx 5.4.23.5), 4K, машина в распоряжении агента по слову владельца «комп твой» (02:4x). Сейв — копия
`_backups/svarog-saves-2026-10-17_1936-owner-exit` (интервью #022, Q5). Оба запуска чистые, моды выложены холодно. REAL WORLD: accumulated — настройки
модов владельца (сверены `cfg_diff.py` и `cfg_run_diff.py`: тест ничего не оставил изменённым) — verified on the real world; data and machine — его
игра, копия его сейва — verified with real state; path — HUD, сумка, бой у Бора, как у игрока — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 03:11 +03:00 | `LOCK_MINUTES=40 bash tools/run-game.sh` (после `deploy-cold.sh KrinikUIRework`) | 0 · мир |
| 2 | 2026-10-18 03:12 +03:00 | `bash tools/rec_clip.sh i2 7 "wait 0.5" "click …/KrinikSwapButton" "wait 3"`; `h.sh "hover UI/ActionBar/KrinikHeroCard/Buffs/Buff~(2)" …` | 0 · клип `i2.mkv`, лист `i_sheet.webp` |
| 3 | 2026-10-18 03:13 +03:00 | `bash tools/h.sh "static WorldState isGodMode True" "teleport -737.6,96.3,1863.0" … "comps EnemyHealthBar 8"`; `h.sh "callon …HealthBar UnityEngine.CanvasGroup get_alpha" "teleport -590,96,1863" …` | 0 · альфа 0,99 → 0 |
| 4 | 2026-10-18 03:15 +03:00 | `bash tools/h.sh "callon UI/ActionBar/InfoMessages GameUI.UIInfoMessages ShowNewCustomMessage …" … "cfg … Hud HotbarDrag false/true"` | 0 · кадры `m8_crop`, `p13_sheet`, `p16e_crop` |
| 5 | 2026-10-18 03:22 +03:00 | `bash tools/h.sh "static WorldState isGodMode False"`; `python -I tools/cfg_diff.py …`; `h.sh "kill"` | 0 · закрыто |
| 6 | 2026-10-18 03:29 +03:00 | `SAVE_POINT=… bash tools/save-check.sh --restore`; `deploy-cold.sh KrinikUIRework KrinikFixes KrinikDevHarness`; `run-game.sh` | 0 · мир, снимок настроек 7 файлов |
| 7 | 2026-10-18 03:30 +03:00 | `bash tools/h.sh "slotspell 0"`; `h.sh "call SpellsActionManager AssignSpell 12 4" "slotspell 12"` | 0 · навык 4 в обоих наборах |
| 8 | 2026-10-18 03:31 +03:00 | `bash tools/rec_clip.sh b54r1 8 …`; `rec_clip.sh b54r2 8 …`; `rec_clip.sh b54r3 8 …` | 0 · клипы, листы `b54r1_row`, `b54r2_row`, `b54r3_row` |
| 9 | 2026-10-18 03:34 +03:00 | `bash tools/h.sh "click …SecondarySkillSlots/Group~(1)/Slot~(1)" "wait 1" … "click …/KrinikSwapButton" … "GetRemainingTime"` | 0 · остаток 15,87 |
| 10 | 2026-10-18 03:38 +03:00 | `bash tools/h.sh "call GodsFavorsManager ShowGodsIntervention Perun True" …`; `h.sh "kill"` | 0 · `cfg run diff: 0 changed` |

## 4. Checks

- Hygiene: `dotnet build` KrinikUIRework, KrinikFixes, KrinikDevHarness — Build succeeded; стражи `h.sh` (отказ на бессмертии без выключения) и
  `cfg_run_diff.py` доказаны красным и зелёным без игры (03:25).
- Functional run: полоса состояний, ряд ячеек, стопка, бой у Бора в игре владельца — кадры, клипы, дамп интерфейса, ответы пульта и журнал прочитаны.

| Case | Status | What was read |
|---|---|---|
| I1–I5 пассивки без оружия | pass — значок остаётся в полосе; **поправка 2026-10-18 09:03:** «виден бледным» шире кадра — на кадре без лука значок почти не виден (0,45 × серый 0,62 ≈ 28 % яркости на тёмной полосе), вид — интервью #024, Q4 | дамп (CG 0,45, серый), клип `i2.mkv`, лист `i_sheet.webp` |
| E1 полосы врагов вдали | pass | альфа 0,99 рядом, 0 на 150 м |
| M8 бумага днём | pass | `m8_crop.webp` |
| P13 выключатель ссылок | fail → правка; P13r — blocked (ссылки нет: вещь 408 не у героини) | `p13_sheet`, `p13r_sheet`, журнал `0 links` |
| P16 / P16r порядок под подсказкой | blocked (подсказка от пульта не открылась); порядок — журналом | `p16e_crop`, `p16r_crop` |
| B0–B4 баг 54 | B1, B2 — баг воспроизведён (флаг залип, навык не применяется); B3, B4 — правка работает, законная перезарядка сохранена | клипы `b54r1/2/3.mkv`, `b4b_crop.webp` |
| MG весть бога | fail → правка | `mg_crop.webp` |
| S1 уборка | partial (пачка 2: бессмертие между пачками) · pass (пачка 3) | `cfg_diff`, `cfg run diff: 0 changed` |

## 5. Found

1. Баг 54 воспроизведён и правка подтверждена; не объяснено «вся панель» владельца — интервью #024, Q1.
2. Выключатель `Hud/HotbarDrag` не снимал уже нарисованные ссылки — правка: смена настройки зовёт `AssignSpells`.
3. Строка стопки рисовалась поверх подсказки ячейки — правка порядка (`InfoMessages` перед `ActionBarMain`).
4. Весть бога лежала на ряду — правка по видимому баннеру и событием.
5. Ссылка на вещь, которой нет у героя, снималась молча; откат сейва оставлял файл ссылок героя — правки: строка журнала, `save-check.sh`.
6. Бессмертие жило между пачками (03:13–03:22) — страж в `h.sh`.

## 6. Traces

`SvarogsDream/_harness/`: `i_sheet.webp`, `m8_crop.webp`, `p13_sheet.webp`, `p13r_sheet.webp`, `p16e_crop.webp`, `p16r_crop.webp`, `mg_crop.webp`, `b4b_crop.webp`,
`c0_buffs.webp`; клипы и листы — `_harness/demo21/clips/i2.*`, `b54r1.*`, `b54r2.*`, `b54r3.*`; журналы — `_harness/log_batch2_0320.log`, `_harness/log_batch3.log`.

## 7. Verdict

partial — пассивки, полосы врагов, бумага днём и правка бага 54 прошли в игре; P13r и P16r заблокированы (ссылки нет, подсказка от пульта не
открылась), весть бога и порядок под подсказкой исправлены, но повтор — следующая пачка.
