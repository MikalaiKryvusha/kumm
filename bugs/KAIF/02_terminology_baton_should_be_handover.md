# KAIF improvement request: the canon calls the session hand-off a "baton" — the industry word is "handover", and the term does not survive translation

kaif-fp: skills `end-chat-soft` · `end-chat-force` · `pause` · `nightloop` · `team-deployment` :: term-not-industry-standard :: v2.5

**Autocapture** (from `.kaif/kaif.json`): KAIF 2.5 · project KUMM · sphere `programming` · language `ru` ·
tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0

**Dedup attestation:** searched `bugs/KAIF/` (`ls bugs/KAIF/` → one ticket, `01_DONE_package_json_reformatted_wholesale.md`,
about `package.json` rewriting — unrelated) and origin issues
(`gh issue list --repo MikalaiKryvusha/KAIF --state all --search "baton"` and `--search "handover"`
→ hits are unrelated: #43 field report, #37 AUTH rule, #34 team board, #4 voice portrait).
No match found.

**Reported by the project owner**, verbatim: *«Это не "baton" — это сленг, которым локально пользуется
Николай. В индестрии это называется "HANDOVER", часто то, что мы пишем в STATUS, пишут в HANDOVER.md»*.

## Gap

The framework's word for "what the finishing session leaves the next one" is **baton**. It appears
**16 times across 7 skill files**:

| file | occurrences |
|---|---|
| `end-chat-soft/SKILL.md` | 6 |
| `end-chat-force/SKILL.md` | 5 |
| `nightloop/SKILL.md` | 1 |
| `pause/SKILL.md` | 1 |
| `team-deployment/SKILL.md` | 1 |
| `team-deployment/references/team-constitution-template.md` | 1 |
| `team-deployment/references/team-status-board-template.md` | 1 |

Two independent problems with it.

**1. It is not the industry term.** The established name for a structured hand-off between shifts,
teams or sessions is **handover**, and the artifact that carries it is commonly `HANDOVER.md`. An
agent that has read the wider world's engineering writing recognizes "handover" instantly and knows
what belongs in it; "baton" it has to learn from this framework alone. For a framework whose whole
premise is that a context-less session must get productive from the documents, choosing the
non-standard word costs comprehension for no gain.

**2. It does not survive translation, and the framework already knows this.** Rendered into Russian
by a localizing session, *baton* became **«батон»** — which in Russian means *a loaf of bread*, not
a relay baton (that is «эстафетная палочка»). The result reads as nonsense in the owner's own status
file, and the owner asked what it meant.

The framework itself already contains the better word: `end-chat-soft`'s Russian trigger aliases say
**«передай эстафету»** — the correct Russian rendering — while the body of the same file says
*baton*, which localizes to bread. The canon disagrees with its own triggers.

## Evidence from this project

`STATUS.md` carried the heading *«🎮 Игровой батон (Palworld)»* and `PROJECT_HISTORY.md` three more
uses, all produced by sessions following the skills. The owner read them and asked outright:
*«Что значит Батон?»* — the word had to be explained, and the explanation was that it is a literal
rendering of an English term the owner had never chosen.

## Proposed change

1. **Rename the concept to "handover" throughout the skills** — 16 occurrences in 7 files. The
   phrases become "record the handover", "no closure without a handover", "the handover for the
   next chat".
2. **Fix the Russian rendering rule alongside it.** «Эстафета» / «передача дел» are correct;
   «батон» must never be produced. Worth a line in whatever guidance drives localization, because
   this class of defect — a term that is fine in English and absurd in the target language — will
   recur with other words.
3. **Optional, and the owner's observation is the argument for it:** the industry does not only use
   the word, it uses the *file* — `HANDOVER.md`. KAIF puts the same content inside `STATUS.md`.
   Keeping one file is defensible (the framework's own rule is that STATUS is the single state
   file, and a second file would need a DRY answer), but if the split is ever considered, the
   industry precedent is on the side of a named handover artifact. Filed here as context, not as a
   request.


## Полевые данные из второго проекта (KAGO, 2026-09-09, в ответ на рассылку)

KAGO проверил у себя и переименовал: **90 вхождений в 39 файлах** (их коммит `64004d8`).
Три факта, которых в первой редакции этого тикета не было.

**1. Разброс шире, чем два зеркала — и мой рецепт проверки был неверен.** Первая редакция
предлагала `grep .claude/skills` — у KAGO это дало бы **16 из 90**, одну восьмую беды. Термин
живёт в ЧЕТЫРЁХ зеркалах навыков (`.claude`, `.agents`, `.cline`, `.grok`), плюс `.roo/commands`
в другом формате, плюс `.kaif/KAIF_REFERENCE.md`, `.kaif/hooks/stop-status-guard.mjs`,
`TEAM_CONSTITUTION.md`, `TEAM_STATUS.md`. В KUMM подтвердилось ровно то же: я объявил «не
осталось нигде» после 32 замен, а всего их оказалось **81**.

**Верный рецепт проверки** (заменяет прежний):
```
grep -rli "baton" . --exclude-dir=.git      # какие файлы задеты
grep -ro  -i "baton" . --exclude-dir=.git | wc -l   # сколько всего вхождений
```

**2. Подтверждение механизма из второго источника.** У KAGO русская половина НЕ пострадала:
`grep -i "батон"` по `.md` даёт ноль, их STATUS с первой сессии говорит «Эстафета». Их же
формулировка: «мы стояли в одном переводе от вашей ошибки». Это сильнее, чем если бы «батон»
у них уже лежал: канон говорит `baton`, русские подсказки того же файла говорят «передай
эстафету», и хлеб появляется ровно в тот момент, когда кто-то переводит КАНОН, а не подсказку.
Дефект не в переводчике — он в расхождении канона со своими же триггерами.

**3. Якоря в `deploy-manifest.json` после переименования указывают в пустоту.** Манифест
описывает, что было развёрнуто из origin, и трогать его нельзя — иначе расхождение прячется.
Но внутри у него подписи-якоря по ЗАГОЛОВКАМ:

```
"signature": "## Step 1. The baton — only what must not be lost"      (строка 1766)
"signature": "### Step 1. Record status & the baton in STATUS.md"     (строка 1813)
```

В обоих проектах — те же две строки с теми же номерами. После переименования таких заголовков
в файлах больше нет. **Если `/kaif-update` ищет секции по этим якорям, миграция по ним ПРОМОЛЧИТ,
а не упадёт** — то есть тихо пропустит две секции вместо того, чтобы сказать об этом.

Это отдельное требование к апстриму, шире самого переименования: **поиск по якорю, который не
нашёлся, обязан спрашивать, а не молчать.** Любое будущее переименование заголовка в каноне
даст тот же класс отказа, и он невидим по построению.

## Что НЕ переименовывать (решено в обоих проектах одинаково)

Записи прошлого и цитаты — переименовать их значит подделать документ:
`.kaif/backup-*/**` (снимок предыдущей версии), `.kaif/deploy-manifest.json` (что приехало из
origin), сам этот тикет и строка в `STATUS.md`, цитирующая дефект.

## Why it matters beyond taste

A framework that hands work between context-less sessions lives or dies on its vocabulary being
instantly legible. A word that (a) must be learned from this framework alone and (b) turns into
*bread* in the owner's language fails both halves of that job.

**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/57 (2026-09-09, on the owner's
direct instruction: *«заведи в KAIF запрос на улучшение — переименование»*). Keep this document open
until an update retires the term.
