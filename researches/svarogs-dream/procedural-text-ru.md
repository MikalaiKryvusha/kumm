# Research — Russian for procedurally assembled game text (case, gender, number): industry practice

> **Created:** 2026-10-06 (research subagent of the session, on the owner's word «может быть про конструктор понадобится разведка лучших практик.»)
> **Parent:** `plans/14_EPIC_svarog_dialogues_translation.md`, phase 0 / phase 4 (the epitaph builder)
> **Status:** ✅ done 2026-10-06 ≈16:45; read by the session agent, used for the phase-4 FORK
> **Outbound:** the choice for the epitaph builder → the owner, in chat (epic 14, phase 4)


Date: 2026-10-06. Scope: web research only, no code changes. Each claim has a source. Where I read primary files myself (GitHub raw), I say so. **[UNVERIFIED]** marks anything I could not confirm.

Bottom line: every shipped project that gets Russian procedural text right does it in one of three ways. (a) The engine stores a **case table per noun** (6 cases + gender, animacy encoded in the accusative), and the translator **picks the case at each slot** (RimWorld, Stellaris, Bannerlord). (b) The translator writes **case tags** in the dictionary and a **runtime post-processor** inflects the next word (Dwarf Fortress dfint + pymorphy2). (c) Without code, the translator **rephrases** so the slot sits in nominative: a head noun ("фракции {1}"), a colon, the present tense or a "×N" count. Even official localizations do (c) at scale, and the literature calls it "a necessary compromise".

---

## 1. How real Russian localizations handled it

### RimWorld (official Russian, Ludeon/RimWorld-ru). Read from the repo files myself.
- Repo: https://github.com/Ludeon/RimWorld-ru. The grammar data sits in `Core/WordInfo/`:
  - `Case.txt` (1,576 lines in Core). One noun per line, 6 forms separated by `;`, in the order И;Р;Д;В;Т;П. Raw: https://raw.githubusercontent.com/Ludeon/RimWorld-ru/master/Core/WordInfo/Case.txt
    `волк; волка; волку; волка; волком; волке` (animate: accusative = genitive)
    `левая почка; левой почки; левой почке; левую почку; левой почкой; левой почке` (phrases are stored whole)
  - `Gender/Male.txt`, `Female.txt`, `Neuter.txt`, `Plural.txt`: plain lists of nouns per gender (`левая нога`, `правая почка`…).
  - `Plural.txt` (`бронешлем; бронешлемы`) and `Imperfect.txt` (verb aspect pairs `изучить; изучать`).
- `LanguageWorker_Russian.cs` (in the repo root, shipped as the game's language worker). `TryLookUp(table, key, index)` lowercases the key. If the full key is missing, it strips words from the right and re-appends the tail: "mace of steel (norm)" → "mace of steel" → "mace". `Pluralize` falls back to ending rules by gender (а→ы/и, й→и, consonant+ы). For numbers it uses the `Case` table to choose between the forms. Raw: https://raw.githubusercontent.com/Ludeon/RimWorld-ru/master/LanguageWorker_Russian.cs
- How translators use the tables in strings (verbatim from `Core/Keyed/Letters.xml` / `Messages.xml`):
  - Case selection: `Неисправность в {lookup: {0}; Case; 5} вызвала короткое замыкание.` (index 5 = prepositional). Also `Мы обнаружили {lookup: {0}; Case; 3}!` and `злоупотребляет {lookup: {1}; Case; 4}`.
  - Gender selection: `{PAWN_nameDef} {PAWN_gender ? пришёл : пришла}`, and three-way `{0_gender ? износился : износилась : износилось}`.
  - Number agreement: `{2_numCase ? человек : человека : человек}`, `через {1_numCase ? день : дня : дней}`.
  - **The head-noun trick, used in the official text.** The faction name always stays nominative behind an inflected classifier: `засаду {lookup: {4}; Case; 1} из фракции {1}`, `похищен фракцией {FACTION_name}`. A count over Letters+Messages+Incidents found `фракции {N}` 40+ times and `фракцией {N}` 14 times. The case table covers common nouns, and proper names are wrapped in a declinable head noun.

### Crusader Kings 3 (Paradox; Russian is official). Patterns from a large Russian CK3 mod found with `gh search code`.
- Gender: `[Select_CString(CHARACTER.IsFemale, 'была убита', 'был убит')] вражеским солдатом`, plus the built-in `[target.GetSheHe]`. Source: Warcraft-GoA-Development-Team/Warcraft-Guardians-of-Azeroth-2, `localization/russian/wc_battles_l_russian.yml` (GitHub).
- Case: no case functions for character names are documented (https://ck3.paradoxwikis.com/Localization lists only gender functions such as GetSheHe/GetLadyLord and `|U`/`|L` formatting). Russian text uses the same **head-noun trick**: `убил персонажа [CHARACTER.GetShortUINameNoTooltip]`, `персонажем [TARGET_CHARACTER.GetShortUINameNoTooltip]` (same file). **[UNVERIFIED]** whether the vanilla CK3 Russian files use any case hooks. I found none.

### Stellaris (Paradox). The engine supports inflection markup.
- Names carry gender and case forms inline: `"Эфирный дракон&!masc|||gen:Эфирного дракона|||dat:Эфирному дракону|||acc:Эфирного дракона|||inst:Эфирным драконом|||prep:Эфирном драконе"`. Strings pick a case with `[Root.Owner.GetName&gen]` or `[Root.GetSpeciesAdj&pl,gen]`, and adjectives agree with `[species.GetAdj&fem]`. The same format exists for German (`Symbiont&!M|||GEN:…|||DAT:…`). Seen in files of github.com/Big-Brick/StellarisTool (`data/localisation/russian/*.yml`, apparently copies of game files) and the mod GalaxyOfTheCat. **[UNVERIFIED]** that this is vanilla engine behaviour rather than a mod; Paradox docs not found.
- The community "Russian Localization Fix RE" guide gives the player-facing syntax for custom empire names: `"Советский Союз&!masc|||gen:Советского Союза|||dat:…|||acc:…|||inst:…|||prep:…"`, with markers `&!masc/&!fem/&!neut/&!pl`. It warns that hand-typed capitals or hand-typed adjectives break declension. The mod "adds declension variants for all planet names, star names, ships". https://steamcommunity.com/sharedfiles/filedetails/?id=2951048990 , https://steamcommunity.com/workshop/filedetails/?id=681483874
- A cautionary case from the same mod page: random state prefixes produced the acronym «ЖОПЫ» for «Железные Объединённые Планеты». Procedural glue yields unplanned words in Russian.

### Mount & Blade II: Bannerlord. A built-in rule-based Russian declension engine.
- `RussianTextProcessor` (TaleWorlds.Localization.TextProcessor.LanguageProcessors) has `ProcessToken(...)` and `GetProcessedNouns(string str, string gender, string[] tokens)`. https://apidoc.bannerlord.com/v/1.1.0/class_tale_worlds_1_1_localization_1_1_text_processor_1_1_language_processors_1_1_russian_text_processor.html
- Markup, verbatim from Russian mod files I read (github.com/DivineOblivion/EE1259-russian-translation, `RussianTextProcessorFix/ModuleData/Languages/RU/fix_native.xml`; github.com/Phxc2v/bannerlord-tor-russian-translation):
  - On the noun entry, gender plus animacy, then part of speech: `{.MI}Патруль{.nn}`, `{.FI}Армия{.nn}`, `{.MA}Мятежник{.nnp}`, `{.MA}Степной{.ajp} {.MA}бандит{.nnp}`, `{.FI}Латный{.aj} {.FI}кираса{.nn}`. My reading: MI/MA/FI/NI = masc-inanimate/masc-animate/fem-inanimate/neuter-inanimate; nn/nnp = noun sg/pl; aj/ajp = adjective sg/pl. **[UNVERIFIED]** No official doc found; inferred from usage.
  - At the use site the case goes after the variable: `{.MI}Патруль{.nn} {SETTLEMENT}{.g}`, `поддерживающего {RULER}{.a}`, `заключить мир с {KINGDOM}{.i}`, `выкуп за {CAPTIVE_HERO.NAME}{.a}`. Gender branches: `{?LORD.GENDER}ней{?}нем{\?}`. (`{._}` also appears; meaning **[UNVERIFIED]**.)
  - Exceptions file `ModuleData/russian_declension_exceptions.xml`: `<Word value="купец"><Form case=".g" value="купца"/>… .gp/.d/.dp/.a/.ap/.i/.ip/.l/.lp`.
- The vanilla rule engine gets things wrong. The EE1259 README documents fixes: `нож → ножов` (fixed to `ножей`), `мудрец → мудрецей`, `огонёк → огонёка`, `Васильевич → Васильевичом`. Each fix caused regressions (`Пскович → Псковичем`, wrong). A `{.PR}` tag had to be added for adjective-type surnames (`Иванова`). https://github.com/DivineOblivion/EE1259-russian-translation (README). The TOR translation reports that misplaced declension markers caused **"RU-only crashes" in RussianTextProcessor**, and that it added gender markers to ~3,230 items and units. https://github.com/Phxc2v/bannerlord-tor-russian-translation
- Lesson: rule-based auto-declension of arbitrary nouns needs an exceptions table, and fantasy or foreign names are where it breaks.

### Dwarf Fortress (dfint, community Russian). The closest analogue to us: hook plus dictionary, no source code.
- `df-steam-hook` "intercepts text in the DF game and replaces it with its translation from a csv dictionary file". https://github.com/dfint/df-steam-hook-rs
- `changetext-py` "enhances Russian translation of Dwarf Fortress" with **pymorphy2**. Translators put grammeme tags in the dictionary, and a post-processor inflects what follows. Verbatim tests (`tests/test_tags.py`):
  - `"Разоблачение <gent:Башня>" → "Разоблачение Башни"`, `"Дайте мне <accs,inan:Башня>" → "Дайте мне Башню"`, `"о <loct:Башня>" → "о Башне"`.
  - `"…не выносит<accs> комары." → "…не выносит комаров."`
  - When the next word is untranslated Latin (a generated name), the tag is **dropped and the word left as is**: `"Она гражданин <gent> <capitalize> Livid Dyes." → "Она гражданин Livid Dyes."`
  - Residual error kept in a test: `"Здесь были 5 конкуренты"`. Number agreement was not solved there.
  https://github.com/dfint/changetext-py (marked "Legacy")
- The Steam DF translator describes the root problem: generated strings "do not work well with translation… you need to program a new procedural generation for each new language". https://github.com/dfint , https://steamcommunity.com/app/975370/discussions/0/5568165891217870502/

### Caves of Qud
- Developer statement: "truly localizing it is extremely difficult because of how much procedural language involved. It's an unsolved research project". He points players to XUnity.AutoTranslator as a partial route. https://steamcommunity.com/app/333640/discussions/0/4628105873918555140/ . Community Harmony-based Russian mods exist (https://github.com/memasevich/CoQ-ru-translate-public). **[UNVERIFIED]** how they decline.

### Wildermyth (official Russian by Lock On Games)
- Names get gender tags `[m] [f] [p] [n]` (e.g. `item.antlerbow=Antler Bow[f]`). Translators then use split tokens per language, e.g. `<site.articleDe:none/male/female/neutral/plural>`. For unavoidable cases they "separate content into split tags" (one text per weapon type, biome, season). https://wildermyth.com/wiki/Translating . **[UNVERIFIED]** the Russian-specific mechanism. The announcement gives no technical detail: https://store.steampowered.com/news/posts/?feed=steam_community_announcements&appids=763890

### Kenshi, Battle Brothers
- Kenshi FCS uses "word swaps" (`/HELLO/` placeholders chosen by conditions such as interlocutor gender and count). FCS 2.14 added a "dialogue word swap permutation preview", a tool that **renders all combinations** so translators can catch agreement errors. https://lofigames.com/kenshi-1-0-64-fcs-2-14-patch-notes/ , https://kenshi.fandom.com/wiki/Dialogue_Structure_Overlook
- Battle Brothers (ZoG Forum Team): the Russian translation reportedly skipped contracts and events "for technical reasons", and names in saves stay English. Search-snippet level only, because Steam rate-limited my fetches. **[UNVERIFIED]** https://steamcommunity.com/sharedfiles/filedetails/?id=927377083

---

## 2. Standards

- **CLDR plural rules, Russian** (https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html):
  one: `v=0 and i%10=1 and i%100!=11` (1, 21, 101) · few: `i%10=2..4 and i%100!=12..14` (2–4, 22–24) · many: `i%10=0 or i%10=5..9 or i%100=11..14` (0, 5–19, 100) · other: fractions (1.5).
  These are expressible as regex for integers: one `^(\d*[02-9])?1$`, few `^(\d*[02-9])?[2-4]$`, many = everything else.
- **Project Fluent.** Terms with case variants, gender as a term attribute, and parameterized terms:
  `-brand-name = { $case -> *[nominative] Firefox [locative] Firefoksie }`. Gender: `-brand-name = Aurora` + `.gender = feminine`, used as `{ -brand-name.gender -> [masculine] został zaktualizowany. [feminine] została zaktualizowana. }`. The guide names "all Slavic languages" as the target of this design. https://projectfluent.org/fluent/guide/terms.html . Plural selectors match CLDR categories, and a default variant `*` is mandatory. https://projectfluent.org/fluent/guide/selectors.html . Full 6-case example (`brand-name(case: "dative")`): https://github.com/projectfluent/fluent/wiki/Fluent-and-ICU-MessageFormat
- **ICU MessageFormat**: `{gender_of_host, select, female {…} male {…} other {…}}` with nested `plural`. Official advice: put select outside and plural inside, and "write full sentences in their sub-messages". ICU has no case-variant mechanism for inserted nouns. https://unicode-org.github.io/icu/userguide/format_parse/messages/
- **Unity Localization Smart Strings**: the plural formatter uses CLDR rules by String Table locale (`{0:plural:…|…|…}`). The choose formatter: `{0:choose(Male|Female):is he|is she|are they}`. https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/Smart/Plural-Formatter.html , https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/Smart/Choose-Formatter.html . Smart Strings also have no noun-case tables. Case has to come from your own data, as in Fluent terms.
- Takeaway: the standards cover **plural** (CLDR) and **gender select** (ICU/Fluent/Unity). Only Fluent models **case variants of an inserted noun**, and it does so as a per-noun table that the call site selects from. This is the same design as RimWorld/Stellaris/Bannerlord.

---

## 3. Translator-side techniques when the code cannot change

Sources:
- Nawrocka, *Game localization pitfalls: Translating variables and gender*, Beyond Philology 16/4, 2019 (Polish, same problem). https://doi.org/10.26881/bp.2019.4.05 (PDF read in full).
- Якимова А.Н., 2024 (Russian). https://moluch.ru/archive/550/120802
- toptr.ru (Russian agency library). https://www.toptr.ru/library/translation-truth/lokalizacziya-videoigr-slozhnosti-i-speczifika.html
- Allcorrect Localization Guide 2.0. https://allcorrectgames.com/wp-content/uploads/2023/10/Localization_guide_2_allcorrect.pdf

| Technique | Example | Who recommends | Verdict in sources |
|---|---|---|---|
| Colon/hyphen label, variable moved to the end | `Zabij: %s`. For us: `Погиб в возрасте 34 лет. Убийца: гоблин.` | Nawrocka: "the most basic strategy"; Yakimova | "most commonly used". The paper concedes these "may not sound perfectly natural but constitute a necessary compromise between completely non-grammatical and natural sounding" |
| **Specifying (head) noun**: inflect a generic noun, keep the variable nominative | `в месте {X}`; RimWorld `фракцией {1}`; CK3 `персонажем [NAME]` | Nawrocka ("specification"); used in official RimWorld and CK3 Russian | Preferred when the translator knows what the slot holds: "to make the sentence sound more natural" |
| Rephrase so the slot is grammatically nominative | «Возьми Х у Y» → restructure | toptr.ru | "не всегда звучит естественно, но это гораздо лучше, чем оставить слово в позиции косвенного падежа" |
| Past → present tense (gender-neutral verb) | `%player прибывает в город` instead of `прибыл` | Yakimova; Nawrocka (journals in present tense) | Accepted. Present tense in chronicles reads as historic present |
| Change of voice/subject | «был убит гоблином» → «пал от руки: гоблин» / «гоблин оборвал жизнь X» | Nawrocka (passive, change of subject) | Accepted for dialogue/journals. Don't overuse one formula |
| Number in brackets or ×N | `меч (%d)`, `меч × %d` | Yakimova; Nawrocka (brackets when a colon is already used) | Works for counters. Odd inside narrative |
| Slash forms `убит(а)` | — | Not recommended by any source I read | Nawrocka calls masculine-by-default "sexist and risks being ungrammatical". O'Hagan & Mangiron (quoted there): "the safest option is translations that work in all contexts… even if not preferred stylistically" |
| Gender-neutral synonyms | "should" → "must" (Polish); in Russian e.g. «нашёл смерть» → «смерть настигла X» | Nawrocka | Fine, case by case |

Further points from the sources:
- Narrative vs UI: Nawrocka says that in dialogue and journals "the naturalness of language cannot be compromised", while in short variable lines grammaticality beats style. Kischewski (quoted there): developers should "limit the use of variables to in-game parameters and use proper sentences whenever a game's narrative is concerned".
- Allcorrect, from practice: for a game with glued story fragments "we had to add a special tag system. Most of the text remained unchanged, but the grammar component was stored in tags." This is the dfint pattern, adopted by a vendor.
- Yakimova sums it up: texts with variables "редко бывают идеальными", and every solution is "лишь компромиссы".
- **Reader opinion of the label style:** I found no survey. Practitioners call it unnatural but grammatical (Nawrocka, toptr). Russian players complain loudly about wrong inflection: the Bannerlord adjective/noun clash «изношенный дамский ботинки» shows up in Nexus threads (search snippet), and the Stellaris fix mods exist because of it. **[UNVERIFIED]** that anyone prefers labels. The evidence only says labels beat broken cases.

---

## 4. When code hooking is possible: case tables and auto-declension

**Storage formats that shipped** (pick one, all equivalent):
- RimWorld: TSV-like line `И; Р; Д; В; Т; П`, gender in separate lists. Animacy is implicit (В = Р for animate). Lookup is lowercase with progressive right-trimming of the key.
- Stellaris: one string per name, `Name&!gender|||gen:…|||dat:…|||acc:…|||inst:…|||prep:…`.
- Bannerlord: rules plus an XML exception list per word, with singular and plural cases (`.g .gp .d .dp .a .ap .i .ip .l .lp`) and gender/animacy markers on the dictionary entry.
- Fluent: `-term = { $case -> … }` plus a `.gender` attribute.

For the pieces in our sentence, the minimal record is `{nom, gen, dat, acc, ins, prep, gender m/f/n/pl, animate}`, plus plural forms if the noun is ever counted.

**Filling the tables (offline, then human review):**
- pymorphy2/pymorphy3: dictionary from OpenCorpora. "For non-dictionary words a predictor is automatically engaged" (by ending similarity). `inflect({'gent'})`, `make_agree_with_number(n)` (`1 бутявка / 2 бутявки / 5 бутявок`), tags `anim/inan`, `masc/femn/neut`. https://pymorphy2.readthedocs.io/en/latest/user/guide.html . pymorphy3 is the maintained fork: https://github.com/no-plagiarism/pymorphy3 (last push 2025-10).
  Accuracy on names: the docs' own comparison with mystem shows pymorphy2 worse on first and last names (4 errors vs 1), and lists "people last and patronymic names, foreign people names… locations" as weak spots. Surnames lack a dedicated predictor. https://pymorphy2.readthedocs.io/en/latest/user/guide.html , https://github.com/pymorphy2/pymorphy2/issues/10 . The docs report general disambiguation at ~79% for the first parse. **[UNVERIFIED]** any accuracy figure for invented fantasy names; none found. dfint's real-world handling was to **skip inflection for untranslated Latin names**.
- Petrovich (rules for Russian first, last and patronymic names; ports include .NET `NPetrovich`): 99.66% on 88,314 examples, lowest in the instrumental (97.99% male). Real Russian anthroponyms only. https://habr.com/ru/articles/195874/ , https://github.com/petrovich/petrovich-net
- Morpher (commercial; .NET library and web service): the vendor's own 2008 test of ~1,000 full names gives a 1.5% error rate. https://morpher.ru/Competition/ . The free web service allows 100 requests/day and returns И/Р/Д/В/Т/П forms. https://morpher.ru/ws3/ . **[UNVERIFIED]** the claim that the free tier lacks gender tags. It says "millions of geographical names… company names, trademarks" exceed its dictionaries.
- Practical reading of the evidence: a model generates the draft table offline, and a human checks every fantasy name (Bannerlord's rule-engine regressions show why). Runtime auto-inflection of unknown words is where Bannerlord crashed and mis-declined.

**XUnity facts relevant to the hook decision** (README read: https://github.com/bbepis/XUnity.AutoTranslator):
- `r:"^…(.+)…$"=…$1…` substitutes capture groups **untranslated**. `sr:"^…$"=$1 $2` (splitter) **translates each group by its own dictionary lookup** and reassembles. Each lookup is context-free, so one key yields one form (always nominative), and the slot cannot request a case.
- `{{A}}` parameterization comes from `SubstitutionFile` (no regex).
- A plugin can query XUnity: `AutoTranslator.Default.TryTranslate(text, out translation)` (3.7.0+). Our Harmony hook can therefore reuse the XUnity dictionary for the nominative of each piece and then look the case up in our own table.
- `PostprocessorsFile` "modifies the translated text just after it is received from the translator". **[UNVERIFIED]** whether it applies to manual dictionary hits. Assume not, and do the post-processing in our BepInEx mod.

---

## Options for us (ranked)

| # | Option | How it works | Cost | Quality of Russian | Precedent in sources | Risks |
|---|---|---|---|---|---|---|
| 1 | **Harmony hook at the sentence builder + Russian templates + per-noun case table** | Postfix/prefix on the method that formats `"{name} was slain by a {enemy} at the age of {age}."`. Real objects are in hand (character gender, enemy id, integer age). We emit Russian directly from a template such as `{name} {g:был убит|была убита} {enemy.ins} в возрасте {age} {plural:года|лет|лет}` (age after «в возрасте» is genitive: «в возрасте 21 года / 25 лет»). The table holds `nom/gen/dat/acc/ins/prep + gender + animate` per enemy, faction, god and place. Mark the output so XUnity skips it (or leave it with no dictionary match). | One hook per builder (find via dnSpy/ILSpy). Table of a few hundred nouns: generated by pymorphy3, then reviewed. A small template engine (gender select, CLDR plural, case pick). | **Best**: natural sentences with full agreement | RimWorld (`{lookup: X; Case; 4}`, `_gender ?`, `_numCase ?`), Stellaris (`GetName&gen`), Bannerlord (`{X}{.i}`), Fluent terms | Game updates rename methods. Needs an exhaustive list of builders. Character names (procedural) still need a rule: keep them nominative (head noun or sentence-initial) or decline only Slavic-looking names with an exceptions list |
| 2 | **Dictionary case tags + runtime post-processor** (dfint pattern) | XUnity `sr:` splits the sentence. The Russian replacement carries tags: `$1 пал от руки <ablt>$2 в возрасте $3 <numCase:года|лет|лет>`. Our BepInEx mod post-processes the visible text (Harmony postfix on the TMP/UGUI text setter, after XUnity), finds the tags and replaces the next noun with the form from our table (not live pymorphy). | Small hook (one text-setter postfix) and a tag grammar. Same noun table as #1. | High for case and number. **Gender of the subject is unknown** from text alone, so the subject's verb must still be made gender-free by rephrasing, e.g. «{name} гибнет от руки <ablt>{enemy}…» (present tense) or a label «{name}. Причина смерти: …» | dfint changetext (`<gent:Башня>` → «Башни»); Allcorrect "grammar component stored in tags" | Tags leak to screen if the post-processor misses a component. Ordering versus XUnity. Name slots: dfint simply skips unknown Latin names. A sentence starting with the name avoids the gender problem only in present tense |
| 3 | **Pure dictionary, case-neutral rephrasing** | `r:`/`sr:` rules whose Russian puts every inserted piece in nominative: head noun («фракции {X}», «божества {X}», «существа {X}» — X stays nominative), colon/dash labels for chronicle lines («{name}: гибель в бою. Убийца — {enemy}. Возраст — {age}.»), historic present to dodge verb gender («{name} гибнет в бою»). Avoid constructions that put the name in an oblique case («смерть настигает {name}» needs accusative) | Zero code. Translator time only | Medium: grammatical, visibly "templated" in long chronicles | Official RimWorld `фракцией {1}`, CK3 `персонажем [NAME]`; Nawrocka, Yakimova, toptr all endorse it as a compromise | Monotony if one formula is overused (Nawrocka warns). Some English structures have no neutral rendering |
| 4 | **Enumerate finite slot values into exact or regex keys** | If enemies, factions and gods come from a fixed list, generate one `r:` rule per value with the inflected form baked in: `r:"^(.+) was slain by a Goblin at the age of ((?:\d*[02-9])?1)\.$"=$1 гибнет от руки гоблина в возрасте $2 года.` Numbers use CLDR-as-regex for the one/few/many split (one, few and many each get a rule; «в возрасте» takes the genitive: 1 года, 2 лет, 5 лет). | A generator script outputs N_values × N_templates × 3 plural rules. No game code | High for case and number. Gender of the *subject* still unknown (same as #2) | No direct game precedent (my construction on documented XUnity `r:` features). CLDR regex follows the CLDR rules | Rule explosion and XUnity regex performance ("use regexes sparingly"). Breaks on any new value |
| 5 | **Runtime auto-declension of arbitrary strings** (pymorphy-like in game, or Morpher API) | Inflect whatever arrives | Port or bundle a morph library (.NET: Morpher paid, NPetrovich for person names only) | Unpredictable on fantasy names | Bannerlord's rule engine: documented mis-declensions and RU-only crashes | Wrong forms on invented names; licensing; network for the API. **Not recommended**; use it only offline to draft the table for #1 and #2 |

**Suggested combination** (my inference from the sources, not a sourced claim): #1 for the high-volume narrative builders (death lines, world news). Each noun table is generated once with pymorphy3 and checked by a human, in RimWorld's `Case.txt` format. #3 for everything else and as the fallback when a hook misses. Adopt Kenshi's permutation preview as a test: render every template × gender × plural class × sample noun and read the output before shipping.
