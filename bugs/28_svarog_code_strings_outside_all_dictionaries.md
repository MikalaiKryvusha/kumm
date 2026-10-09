# Bug 28 — Svarog's Dream: ≈1100 строк кода игры вне всех словарей — игрок видит их по-английски

**Status:** 🔴 OPEN — перепись есть, разбора и перевода нет
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
