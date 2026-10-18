# Test run report — Svarog's Dream: выкладка перевода проверяет синтаксис всех скриптов до первой записи

**Created:** 2026-10-18 07:16 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `94125be` + правка
`tools/translation_deploy.sh` (строка `py_compile`)

## 1. Work

Предложение урока EXP-0317: 17.10 перенесённая метка без `#` в `tools/dialogue_xunity.py` роняла выкладку на середине — словари в
`_config/xunity/` пересобирались наполовину, в папку игры не уходило ничего (сборщики пишут в репозиторий, копия в игру — в конце скрипта). Правка —
`"$PY" -m py_compile "$ROOT"/tools/*.py` первым шагом: выкладка встаёт до пересборки, а сломанный `xunity_dupes.py` больше не выпустит в игру
одни советы загрузки (их `cp` стоит раньше него). Поправка 2026-10-18 07:26 по суду: первая редакция говорила, что в игре словари были наполовину
новыми, — неверно. Кейсы —
`testcases/TC_svarog_translation_precheck_2026-10-18.md` (P1, P2).

## 2. Contour

Рабочее дерево SvarogsDream, питон `_tools/unitypy-venv`, папка русификатора игры `AutoTranslator/Translation/ru/Text/`. Игра закрыта, замок
свободен. REAL WORLD: accumulated — словари владельца в папке игры, выложенные в 07:06 — verified on the real world; data and machine — его
папка игры, его машина — verified on the real world; path — тот же `bash tools/translation_deploy.sh`, которым выкладывается перевод — verified
on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 07:14 +03:00 | `python -m py_compile tools/*.py` (90 файлов) | 0 |
| 2 | 2026-10-18 07:14 +03:00 | `python -m py_compile <scratchpad>/broken_probe.py` (строка без `#`) | 1 · `SyntaxError: invalid syntax` |
| 3 | 2026-10-18 07:14 +03:00 | `bash tools/translation_deploy.sh` | 0 · список словарей до `zz_worldevents.txt` |
| 4 | 2026-10-18 07:15 +03:00 | `cp broken_probe.py tools/zz_broken_probe.py`; `bash tools/translation_deploy.sh`; `rm tools/zz_broken_probe.py` | 1 · `SyntaxError … zz_broken_probe.py, line 3` |

## 4. Checks

Hygiene: `py_compile` 90 скриптов — 0; на сломанном файле — 1 (контроль самой проверки).
Functional run: выкладка перевода запущена дважды на папке игры владельца, вывод и время изменения `zz_spells.txt` прочитаны.

| Case | Status | What was read |
|---|---|---|
| P1 все скрипты целые | pass | `exit 0`, выкладка дошла до последнего словаря |
| P2 один скрипт сломан | pass | `SyntaxError` первым шагом, `exit 1`; `zz_spells.txt` в папке игры (последняя запись) — 07:15:15 до и после; первая запись в игру `krinik_loading_tips_ru.txt` — 07:15:15.29, пересборка `_config/xunity/zz_items.txt` — 07:14:25 (обе от прогона 3, прочитаны после прогона 4, 07:25); `git status tools` — только `translation_deploy.sh` |

## 5. Found

none

## 6. Traces

Вывод команд — в этом отчёте (раздел 3); пробный файл `C:\Users\<USER>\AppData\Local\Temp\claude\…\scratchpad\broken_probe.py` (вне репозиториев).

## 7. Verdict

pass — сломанный скрипт останавливает выкладку первым шагом, до пересборки словарей и до записи в папку игры; целые скрипты выкладку не
задерживают.
