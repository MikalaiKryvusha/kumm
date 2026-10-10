# Bug 28 — Svarog's Dream: ≈1100 строк кода игры вне всех словарей — игрок видит их по-английски

**Status:** 🟡 IN PROGRESS — 2026-10-11 00:13: остаток **79** (192 → 79), все — куски склеек (эпитафии «Прогресса» 46, Путь
Недеяния 12, охотники 7, окна ошибок загрузки 7, «Преданность» 3, Красный Орден 2, «Новая Добродетель» 2); строки с подстановкой
переведены (118 строк словаря: `code_interp_ru.tsv` — 93 ключа и 1 правило, `code_buff_plus.tsv` — 24; баффов «+…» всего 25, один из
них в `code_interp_ru.tsv`; поправка 2026-10-11 по судье — было «93 ключа + 25 баффов»); в разобранные легли 53 строки: 41 журнала
отладки, 4 хвоста карточек, 8 пределов переписи (6 «красных» баффов, 2 строки портов); по пути найдены и починены пять
близнецов в ключах и правилах XUnity — раздел «2026-10-11». `testcases/reports/2026-10-11_svarog-bug28-interp.md`. ~~остаток 192~~
(2026-10-10 21:48 — перепись не считала строки с подстановкой). Новых имён ждут владельца 38 (34 от 2026-10-09 + 4 от 2026-10-11)
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
почему), в словаре с пометкой `[AI]`.

| Время | Шаг | Остаток (строк / уник.) | Коммит SvarogsDream |
|---|---|---|---|
| 14:41 | разбор: 1106 по старому счёту → unknown 1092 (14 закрыты шаблоном чисел), куски склейки 83, шум и иная форма 264 | 745 / 621 | 4335f31 |
| 14:45 | партия 1: карта (WorldMap 21) и «Преданность» (UICharacterDevotionPanel 56) — 77 строк | 668 | 4335f31 |
| 14:50 | партия 2: подсказки умений, отказы умений, надписи боя, Звериный Облик, баффы, мелкие окна — 103 строки | 539 | 23490c0 |
| 14:53 | партия 3: Войны Фракций (FactionWarManager) — 106 строк | 357 | 1db0010 |
| 14:56 | партия 4: беседа с Единым Богом (GodConversationManager) — 25 строк | 307 | adbc959 |
| 15:04 | партии 5–6: учителя, суд Красного Ордена, «Прогресс», реплики квестов и богов, титры — 216 строк | 66 → 65 | f07316a, b1c03a6 |

Итог 15:04: в `code_ru.tsv` 527 строк (42 с пометкой `[AI]` — новые имена), разобранного в `text_census_ok.tsv` 213 строк;
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

## 2026-10-10 02:53 — why the remaining 65 are not done tonight

The remainder are pieces the game glues at runtime: epitaphs of «Прогресс» (ProgressManager), the Path of Non-Doing summary, load-error
windows, «New Virtue:». Whole epitaph combinations that were seen once live in `_AutoGeneratedTranslations.txt` (machine, from the
era of the online translator) — e.g. the hero Tina’s epitaph showed in Russian on 2026-10-10 02:02. The right fix is splitter rules
(`sr:` by `\n`) plus `r:` per sentence with the name and gender; checking it in the game needs a hero death, and the owner plays in
Iron Man mode (the save is written on death) — so only on a test save copy, with the owner awake. Not started at night.

## 2026-10-11 — strings with interpolation, and five twins in XUnity keys and rules

`[OWNER]` «в новом чате делаем 28» · 2026-10-10 ≈23:33. Run report `testcases/reports/2026-10-11_svarog-bug28-interp.md`, cases
`testcases/TC_svarog_bug28_interp_2026-10-10.md`, SvarogsDream `2434f68`.

**How XUnity actually looks a string up** (read in its decompiled code, kept as `SvarogsDream/tools/xunity_template.py`):
every digit run (plus `*+,-./:` inside it) becomes its own letter `{{A}}`, `{{B}}`… in order, colour codes included
(`#008914` → `#{{B}}`, `#88cf77` → `#{{A}}cf{{B}}`); exact key first, then the template; `r:` rules are matched against the
TEMPLATE; a string that is not found whole is split by tags and every piece between tags is looked up on its own; a rule's
translation that contains a quote is cut to the text between its first and last quote.

**Batch.** `translation/code_interp_ru.tsv` — 94 rows: 93 keys written in that form (mastery tooltips, buff-tooltip pieces incl.
«+Bonus MS and Resistance.», map and ports, shrines, soul globe, arena, prison, debt, sellswords) plus one `r:` rule (the arena
record holder's name); `code_buff_plus.tsv` — 24 buffs as «+text» (Russian taken from `code_ru.tsv`); 118 dictionary lines in all.
(Corrected 2026-10-11 after the judge: the commit `2434f68` message and the first wording here counted the rule inside the 93.) Generator `code_xunity.py` checks every key is a fixed point of the
XUnity template. Census: exact template, pieces between tags, a hole tried as the number 7; 41 debug-log strings (confirmed by
the code line: `Debug.Log`/exception) and 4 card tails into `text_census_ok.tsv` with the reason.

**Five twins found on the way, all fixed at the generator and seen working in the game (settext/gettext):**

| # | Defect | Scope | Fix | Case |
|---|---|---|---|---|
| 1 | buff tooltip looks up «+text», keys had no «+» — buffs English | 25 buffs | `code_buff_plus.tsv` | C4 → R1 |
| 2 | literal number in a rule pattern («2% daily», «5 days», «over 6 seconds») — rule dead | 11 dialogue, 73 spell rules, «Scaling … per 100» | `dialogue_xunity.rx_literal`, `spells_xunity.lit(xunity=True)` | C10 ×3 → R2, R3, R5 |
| 3 | stat rules `([-+x0-9<].*)` — a bare number is `{` after templating | 54 rules | `glossary_fix.py`: `{` in the class | R4 |
| 4 | repeated insertion as a back-reference — equal numbers get different letters | dialogue rules with a repeat | own group per occurrence | R6b |
| 5 | rule translation with a quote (`<font="Manrope-Medium SDF">`) shown as «Manrope-Medium SDF» | 37 dialogue rules | translation wrapped in quotes | R6 fail → R6b, R9 |

Twin 5 was LIVE for the owner: every dialogue option with a styled price whose rule had no number in the pattern (trainers'
«Enhance … skills from level X to Y (N coins)») showed the font name instead of the option.

TWINS: searched `^r:"[^"]*"=.*"` over `_config/xunity/zz_*.txt` — 37 sites, all in `zz_dialogue.txt` (fixed); literal digits in
rule patterns over all `zz_*` — `zz_spells` 73, `zz_dialogue` 11 (fixed at both generators), `zz_glossary` 54 (digits only in the
class — twin 3, fixed); hand rules in `zz_krinik*.txt` — 0. Not searched: rules in the machine dictionary (not ours).

**Next.** The 79 glued pieces: `sr:` splitter rules plus `r:` per sentence (epitaphs need the hero's name and gender); the
in-game check of epitaphs needs a hero death — only on a COPY of the save, with the owner present (Iron Man).

**Next, measured 2026-10-11 00:24 — template keys XUnity can never produce** (key ≠ XUnity template of itself with letters = 7;
script logic as in `code_xunity.interp_rows`): 67 of ≈850 — `zz_worldevents` 47/47 (colour digits left literal), `zz_notes` 7,
`zz_krinik` 5 (hand: «Blunt Armor: <color=#1E6A0F>{{A}}</color>»), `zz_krinik_gametips` 3, `zz_dialogue` 2 («{{A}}-{{B}} meters» —
XUnity sees «10-15» as ONE number; «(Pay 10g)» literal), `zz_glossary` 1, `zz_selection` 1 («2x»), `zz_spells` 1. An exact key
beside most of them still serves the numbers the game ships, so the visible damage is limited to other numbers. Fix at the source:
`notes_xunity.templated()` → `xunity_template.templatize` (worldevents, notes, quests, code share it), then the hand files.
Tried 2026-10-11 00:26 and ROLLED BACK (not deployed — the deploy refused): with the exact template the dead keys of the generated
dictionaries went to 0, but the strict glossary check gave 14 findings on the new template lines and `zz_dialogue.txt` grew by 298
lines — both need reading before a deploy. Read in a scratch copy at 00:33 (no deploy): diff without CR — `zz_dialogue` −2 +296,
`zz_notes` −7 +27, `zz_worldevents` −47 +128, `zz_selection` −1 +1, `zz_code` +2, `zz_glossary` −1; all 14 glossary findings are
FALSE — texts already reviewed (credits with Latin names, long notes and world events) whose exceptions are keyed by the exact key,
so the new template line of the same text is not recognised. Tomorrow: let `glossary_lib` match an exception by the template of
its key too, re-apply the patch (`scratchpad/patch_templated.py` logic: `number_spans` + `templatize` in `templated()`), deploy,
check one world event and one note by `settext`. **Done the same night, 00:33–00:36:** both changes applied (`templated()` on
`templatize`/`number_spans`; `glossary_lib.load_exceptions` adds the template of each exception key), deploy green (`ours 0`), in the
game T1 — world event on the number 37 (absent from the dictionary) in Russian with its colour tag intact, T2 control; SvarogsDream
`29dc660`. Dead template keys in generated dictionaries 57 → 0; left 10 in hand files (`zz_krinik` 5, `zz_krinik_gametips` 3,
`zz_glossary` 1, `zz_spells` 1). A note with `\r\n` could not be sent through the harness (`settext` converts only `\n`).
The 5 in `zz_krinik` («Blunt Armor: <color=#1E6A0F>{{A}}</color>», «Piercing Damage: x<color…») are redundant: the stat rules of
`zz_glossary.txt` for the same labels catch the value (it starts with `<` or `x`) — remove them at the next hand edit. The 3 tips
were generated (`gametips_xunity.py` uses the same `templated()`) but the generator was missing from `translation_deploy.sh`, so its
dictionary lagged; added to the deploy and regenerated 00:39–00:40 (SvarogsDream `af16a48`, `c830c82`) — +21 template lines, exact
lines unchanged; not checked in the game by `settext`. Left: `zz_glossary` 1 («Attack Speed: {{A}}% <color=#1E6A0F>(+10%)</color>» —
the «Attack Speed» stat rule catches it), `zz_spells` 1 («Scaling: … x2 ALC …» — the Scaling wrapper and piece rules catch it): both
redundant, no visible damage. The judge also noted: rule translations that hard-code a number the pattern now
matches as a letter («5 ульев», «2% в день», «за 6 секунд», «за каждые 100 очков») are right only while the game keeps those numbers.
