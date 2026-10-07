# Test run report — Svarog's Dream: перепись реплик диалогов после починки выемки (баг 22)

**Created:** 2026-10-07 20:27 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `90c7844`, игра
Svarog's Dream в `D:/Games/Svarog's Dream` (Assembly-CSharp как установлен)

## 1. Work

Выемка реплик `tools/dialogue_extract.py` после правки шаблона вызова (говорящий первым аргументом, выбор литерала условием) и её
сторож `unread_calls`. Основа: критерий 1 эпика `plans/14_EPIC_svarog_dialogues_translation.md` — «покрытие считает генератор по
источнику — коду игры»; баг `bugs/22_DONE_svarog_dialogue_census_missed_speaker_calls.md`.

## 2. Contour

Инструменты перевода в репозитории SvarogsDream; декомпиляция `Assembly-CSharp.dll` установленной игры (только чтение, во временную
папку); питон `_tools/unitypy-venv`. Игра не запускалась. REAL WORLD: accumulated — установленная игра владельца с его папкой
`AutoTranslator`; data and machine — его машина, его копия игры; path — выкладка `tools/translation_deploy.sh` в папку игры:
verified on the real world (выкладка код 0, словарь совпал с закоммиченным).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | ≈ 2026-10-07 20:24 +03:00 | `$PY -I tools/dialogue_extract.py "D:/Games/Svarog's Dream" <scratchpad>/en_new.tsv` (говорящий, без тернарника) | 1 · static 7998, unread calls 13 (тернарники) |
| 2 | 2026-10-07 20:25 +03:00 | то же после тернарника | 0 · lines 8145, static 8021, unread calls 0 |
| 3 | 2026-10-07 20:25 +03:00 | `$PY -I <scratchpad>/extract_mutant.py "D:/Games/Svarog's Dream" <scratchpad>/en_mutant.tsv` (прежний шаблон) | 1 · lines 7847, static 7731, unread calls 362 |
| 4 | ≈ 2026-10-07 20:26 +03:00 | `$PY -I tools/dialogue_extract.py "D:/Games/Svarog's Dream" translation/dialogue_en.tsv` | 0 · static 8021, unread 0 |
| 5 | ≈ 2026-10-07 20:26 +03:00 | `bash tools/translation_deploy.sh` | 0 · zz_dialogue 7567/8021, глоссарий ours 0, ключи вариантов 65/65 |

## 4. Checks

Hygiene: сторож красный на мутанте с прежним шаблоном (прогон 3: 362, код 1), ноль на починенной выемке (прогон 2).
Functional run: выемка по коду установленной игры — прочитан вывод (8021 постоянных, 0 непрочтённых); сверка ключей старой и новой
таблиц `comm` — ушло 0, добавилось 272 (+ тернарники); выкладка в папку игры — прочитан `git diff` словаря: совпал с коммитом.

| Случай | Ожидание | Наблюдение | Статус |
|---|---|---|---|
| Реплика с говорящим `Yell(Rusalka1, "Lay in the sun with me..")` | есть в таблице | есть | pass |
| Тернарник Мокоши о герое по полу | обе ветки строками | «He smells…», «She smells…» в таблице | pass |
| Старые реплики | ни одна не пропала | ушло 0 | pass |
| Сторож на прежнем шаблоне | красный | 362, код 1 | pass |

## 5. Found

- Баг 22: 290 реплик (233 постоянных + тернарники) вне переписи — починен в этом же прогоне.

## 6. Traces

Декомпиляция и таблицы прогонов — scratchpad сессии (`decomp/`, `en_new.tsv`, `en_mutant.tsv`, `mutant.py`); итог — SvarogsDream
`90c7844` (`translation/dialogue_en.tsv`, `tools/dialogue_extract.py`).

## 7. Verdict

pass — перепись полна по всем формам вызова, которые знает сторож; реплики вне вызовов Fluent — GAP сторожа, не проверены.
