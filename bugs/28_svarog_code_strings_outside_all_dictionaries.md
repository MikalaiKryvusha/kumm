# Bug 28 — Svarog's Dream: ≈1100 строк кода игры вне всех словарей — игрок видит их по-английски

**Status:** 🟡 IN PROGRESS — разбор сделан, 527 строк переведено; остаток 65 строк, все куски склеек (нужны правила r:/sr:);
34 новых имени ждут владельца (2026-10-09 15:04)
**Severity:** S2 — английский текст в русской игре по многим окнам; данные не задеты
**Version/build:** SvarogsDream `2a4ed60` + `tools/text_census.py` · **When/context:** 2026-10-07 ≈22:00, найдено при починке бага 27
(перепись класса «реплики вне выемки»)

## Goal vector

Achieve: каждая строка кода игры, которую видит игрок, либо в нашем словаре (переведена), либо разобрана как не видимая игроку
(отладка, имена ассетов) — и это число считает прибор, а не память.

Acceptance: `python -I tools/text_census.py "<игра>" translation/text_census.tsv` → в выдаче только строки из списка разобранных
(файл исключений с причиной на строке), «unknown» = число исключений.

## Symptom

Баг 27 (реплики героя по-английски) оказался одним случаем класса: выемка `dialogue_extract.py` ищет по шаблону вызова, а текст
игры живёт и в присваиваниях полей, массивах, строках окон и менеджеров. Перепись по ВСЕМ литералам кода (не по шаблону) против
ключей всех словарей (`zz_*.txt` и машинного XUnity):

- до партии реплик героя — 1148 строк в 183 файлах; после — **1106 в 180** (`SvarogsDream/translation/text_census.tsv`).
- Крупнейшие: `FactionWarManager` 177 (Войны фракций: «The Horde Ascends», «Wrath of the Old Gods»), `ProgressManager` 74
  («10 plants collected.» — часть может закрываться правилами `r:` с числом, прибор их не учитывает), `LoadingScreen` 61 (советы
  загрузки — сверить с `zz_krinik_tips.txt`: ключи могли разойтись формой), `UICharacterDevotionPanel` 56 (реплики богов в
  «Преданности»), `GodConversationManager` 50 (беседы с богом, длинные тексты с `\r\n`), `TrainerFaithRedOrder` 38, `CastSpell` 25
  (подсказки умений), `WorldMap` 22 («The old gods have revoked your access.»), учителя `Trainers*`/`ConversationTraining*` по 8–10.
- Шум (не видит игрок): `RuntimeProfiler` 20, сообщения об ошибках `OptionsPresenter`, имена клавиш («Mouse ScrollWheel»).
- После разбора и перевода (2026-10-09 15:04, вывод `text_census.py`): unknown 430 → из них куски склейки внутри ключа 84,
  разобранный шум и переводы другой формы 281, **остаток 65 (уник. 63) в 9 файлах** — см. «Progress».

## Owner's word

`[OWNER]` «28 — 1106 строк кода игры не переведены - допереводим» · 2026-10-09, до 08:36.

## Quest outcomes in the journal — a composed key outside the census (2026-10-09)

Seen live in the owner's journal: «Alternate Path: Threads intertwined to create a different path.» (frame
`SvarogsDream/_harness/ev2.webp`, 09:47). The census does not see it: the string is DATA, not a code literal — `QuestManager`
(decompiled line 375) writes `questName + ": " + questDoneDescription` into the log and the save. Extractor
`SvarogsDream/tools/quests_extract.py` → `translation/quests_en.tsv`: 184 quests (id · name · done · log key), `29a8e67`; 40 of 184
names already have a machine translation (quest window), the rest are English. Next: translate names (they are NAMES — table
«английский | русский | где» to the owner first, STYLE) and done-descriptions → a generator `quests_xunity.py` writing the exact
log keys «Имя: описание» into `zz_quests.txt` (the `templated()` path of worldevents). The code-built «<hero>'s equipment: Your
items have been returned.» (QuestManager:46) needs an `r:` rule. Old journal entries are fixed by the same exact keys (the
log text is translated on show), unlike world events, which the game stored already machine-translated.

## Progress — разбор и перевод строк кода (2026-10-09)

`[OWNER]` «допереводим» · «перевод нужно продолжить делать» · 2026-10-09. Работа без запуска игры; словарь XUnity
перечитывает при следующем старте. Числа ниже — из вывода `python -I tools/text_census.py`, время — из `date`.

**Прибор.** `tools/text_census.py` теперь считает виды: ключ как есть или шаблоном чисел (XUnity TemplateAllNumberAway:
«…level 15…» лежит ключом «…level {{A}}…»); кусок склейки (рядом «+» или «+=») внутри ключа или правила `r:`; разобранное
`translation/text_census_ok.tsv` (файл кода · строка или «*» · почему). Печатает остаток и пишет `translation/code_en.tsv` —
источник нового генератора `tools/code_xunity.py` (разбор записок `notes_xunity.py`) → `_config/xunity/zz_code.txt`, строкой
в `translation_deploy.sh`. Новые имена — `SvarogsDream/translation/names_pending_owner.tsv` (english · предложение · где ·
почему), в словаре с пометкой [AI].

| Время | Шаг | Остаток (строк / уник.) | Коммит SvarogsDream |
|---|---|---|---|
| 14:41 | разбор: 1106 по старому счёту → unknown 1092 (14 закрыты шаблоном чисел), куски склейки 83, шум и иная форма 264 | 745 / 621 | 4335f31 |
| 14:45 | партия 1: карта (WorldMap 21) и «Преданность» (UICharacterDevotionPanel 56) — 77 строк | 668 | 4335f31 |
| 14:50 | партия 2: подсказки умений, отказы умений, надписи боя, Звериный Облик, баффы, мелкие окна — 103 строки | 539 | 23490c0 |
| 14:53 | партия 3: Войны Фракций (FactionWarManager) — 106 строк | 357 | 1db0010 |
| 14:56 | партия 4: беседа с Единым Богом (GodConversationManager) — 25 строк | 307 | adbc959 |
| 15:04 | партии 5–6: учителя, суд Красного Ордена, «Прогресс», реплики квестов и богов, титры — 216 строк | 66 → 65 | f07316a, b1c03a6 |

Итог 15:04: в `code_ru.tsv` 527 строк (42 с пометкой [AI] — новые имена), разобранного в `text_census_ok.tsv` 213 строк;
`glossary_check.py --strict` — 0 нарушений в наших файлах; выкладка прошла целиком (на партиях 2–4 её останавливала строгая
проверка на чужом незакоммиченном `zz_krinik_newgame.txt`, тогда `zz_code.txt` копировался в игру отдельно и сверялся `cmp`).

Находки:
- **Советы загрузки (61) были переведены давно**: игра показывает `$"Tip {num + 1}: {loadingTips[num]}"`, ключи
  `Tip {{A}}: …` в `zz_krinik_tips.txt`; шесть советов с числом сходятся только шаблоном (`{{B}}`). Прибор считал их
  непереведёнными — ложный счёт класса EXP-0168, второй прибор того же бага.
- Метки окна предмета («Blunt Damage: x», «Bonus HP: ») показываются только с числом — ключи шаблоном уже есть.
- Текст беседы с богом игра печатает по букве (`TypeText`, `Substring`): ключ ловит только полный текст, русский встанет
  в конце печати — смотреть в игре.

**Остаток 65 (уник. 63) — только куски склеек**, целым ключом не переводятся: эпитафии «Прогресса» (ProgressManager 31:
`text += "\n Killed no one."`, имя героя + «'s death greatly upset…»), итоги Пути Недеяния (PathOfNonDoing3 12),
`$"{text}{text3} has a bounty on you…"` (HeadHuntQuestioning 7: правило `r:` есть, но группы `$1$2` выходят английскими),
окна ошибки загрузки с именем файла (LoadSaveGameManager 4, WorldStreamingPreloader 3), дописывания «+=» в DevotionSelection 3
и UIBuffTooltip 1, `GetGenderGreetings() + ", …"` (TrainerFaithRedOrder 2), «New Virtue: » + имя (VirtuesManager 2).
Следующий шаг — правила `r:` (и `sr:`, где группа сама требует перевода) по полному тексту склейки.

TWINS: searched — сама перепись `tools/text_census.py` и есть поиск близнецов класса: все строковые литералы Assembly-CSharp
(`code_en` 547 после разбора) против всех словарей сборки; вне словарей — 65 строк (63 уник.) в 9 файлах, перечислены выше. Другие
места класса «текст вне словаря» (реплики героя — баг 27; диалоги Fluent — эпик 14) закрыты своими выемками.

## In-game check (`testcases/TC_svarog_bug28_ingame_2026-10-09.md`, 15:25, 720p)

C2 — перевод реплик Перуна, Мораны, Велеса pass; раскладка fail (описание «Божьего Вмешательства» под плашкой «Отношения» — вынесено
в план 18, разбор 2026-10-09 19:39); C1, C3, C4, C6 — blocked (игру закрыл владелец); C5 — partial; C7 (правка `d8a4cc6` описаний
«Божьего Вмешательства», 15:29) — [NOT-TESTED].

## Judge pass — 2026-10-09 19:45 (долг закрытия чата 15:44)

Независимый судья: **проверено с оговорками**. Подтверждено наблюдением: шесть коммитов (4335f31 … b1c03a6) есть, строк в
`translation/code_ru.tsv` прибавлено 77 + 103 + 106 + 25 + 216 = 527; `zz_code.txt` — 540 ключей (13 — варианты с числами); остаток
«65 (63 уник.) в 9 файлах» воспроизведён повторным прогоном `text_census.py` на копии в scratchpad (вывод совпал с закоммиченным
`text_census.tsv` байт в байт); 527 строк чисты (заполнители, числа, переносы, кавычки, латиница — только имена людей в титрах).
Не воспроизводимы сейчас: промежуточные остатки таблицы «Progress»; `glossary_check.py --strict` судья не повторил (нет `pymorphy3`) —
повторено агентом 19:45 окружением `_tools/unitypy-venv` (отчёт в scratchpad): `entries 17563 hits 5957 ok 5777 word 8 case 0 english
0 exceptions 172 ours 0`, код выхода 0 — в наших файлах нарушений нет. Оговорки внесены выше (TWINS, проверка в игре) и в STATUS.

## Root cause

Класс `census-by-own-pattern` (EXP-0168, второй удар — баг 27): каждая выемка перечисляет текст по своему шаблону, и знаменатель
перевода врёт молча. Механизм против класса — перепись по всем литералам против всех словарей (`tools/text_census.py`).

## Fix plan

1. Разбор списка: видимое игроку / шум — файл исключений с причиной (по образцу `quality_ok.tsv`), прибор вычитает его и печатает
   остаток.
2. Перевод видимого партиями по файлам (выемка `dialogue_*` — где это реплики Fluent; для окон и менеджеров — свой путь, как
   `worldevents_*`), начиная с того, что игрок видит чаще: советы загрузки, «Преданность», карта, умения.
3. Прибор — в `translation_deploy.sh` строкой счёта (сначала докладом, красным — когда остаток станет нулём).

## Decisions made without the owner

(при закрытии)

## Links

Баг 27 (реплики героя), баг 22 (говорящий первым аргументом), EXP-0168, `SvarogsDream/tools/text_census.py`.
