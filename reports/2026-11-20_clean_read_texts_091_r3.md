# Clean read r3 — release notes 0.9.1-RC1, README (generated), guide 3.1.1, Krinik change notes
> **Created:** 2026-11-20 · by a clean reader (did not write the texts) on the pack tree of `7c72d78`
> **Parent:** `reports/2026-11-18_clean_read_texts_091_r2.md` (r2)
> **Status:** findings only; nothing applied.

Texts: **N** `_config/release/draft_0_9_1/github_release_notes_0_9_1.md` · **R** `_config/public_release/README.draft.md` (table cells from
`mods-table.mjs`) · **G** `docs/guide/guide-3.1.1.html` (visible Russian text) · **C** `_config/release/krinik_change_notes.json` · plus the pak-less sentence
of `_config/devkit/set-pak-modinfo.py`. Read against the owner's portrait (loaded 2026-11-20 11:09), `RUSSIAN_RULES.md`, `AI_RUSSIAN_DEFECTS.md`, HOUSE_RULES
14 / 21 / 22 / 33 / 35 and the maintainer's 14 facts. Line numbers are those of the current files.

## Machine checks

- `kaif-voice-lint check N --genre reply`: «✅ voice-lint OK — 0 findings in 1 file(s), 218 line(s)». Nothing to judge.
- `kaif-voice-lint check R --genre reply`: «✖ voice-lint: 2 finding(s) in 1 file(s), 395 line(s)». Both hits are «уникальных» in game terms (line 97
  «легендарных и уникальных вещей», line 101 «уникальных неигровых персонажей»). These are rarity and NPC classes of the game, not evaluations, so both are false positives.
- `kaif-voice-lint check G --genre reply`: «✖ voice-lint: 16 finding(s) in 1 file(s), 525 line(s) … · 2 hit(s) silenced by a row's exception». The
  breakdown is 11 CSS percentages (lines 9, 10, 61, 66, 72, 73), 1 HTML comment holding the owner's verbatim quote (470) and 3 game terms «уникальных» (150, 341, 347).
  All 15 are false positives. One hit is real: the cover's «9 уникальных вручную написанных модов» (116). That is an owner's line, so it goes to proposal O4.
- `dash_lint.py --only guide-3.1.1`: «файлов прочитано 1, строк с тире 0». `--only README.template`: «файлов прочитано 1, строк с тире 0». I also ran
  `--only krinik_change_notes`: «файлов прочитано 1, строк с тире 0». dash_lint reads neither N nor the cells in `mods-table.mjs`, so I scanned both by hand.
  The only spaced dashes in Russian text are legal ones: «0.9.1-RC1 — это» (N 25), GOST captions («Таблица 1 — …», «Рисунок 1 — …»), the mod names
  «MSCasaDesFlores — …» and the owner's apposition «правообладателям — авторам модов» (R 185, G 511). No dash stands for a verb.
- Form of N: a script found no two non-empty lines in a row outside lists, tables, HTML and the comment. Every paragraph is one line.

## N — release notes

No blocker. All 14 facts hold, and the RU and EN halves match item for item: added 3 / 3, changed 17 / 17, fixed 10 / 10, known issues 7 / 7, plans 5 / 5.

1. **Russian · polish.** «Лаунчер сборки обновлён до версии 1.0.0: теперь он сам находит игру … О новой версии сборки и о своей новой версии лаунчер
   сообщает сам и ставит каждую одной кнопкой.» (25). «Сам» appears in two sentences in a row. In «ставит каждую одной кнопкой» the launcher seems to press the
   button itself, although the player presses it. Line 43 says it better: «поставить каждую можно одной кнопкой». Direction: use line 43's form in the summary
   and keep one «сам».
2. **Russian · polish.** «Атрибуты героя прокачиваются без предела: очки можно вкладывать и после 20.» (47). The text never says what the 20 counts (points in one
   attribute). C has the same gap: «Очки атрибутов можно вкладывать и после 20.» Direction: name the unit once.
3. **Russian · polish.** «Настройки Less Building Placement Restrictions открывает пункт «Прочее» в списке «Настройки модов».» (56). The object comes first, so the reader
   takes «Настройки» for the subject and trips on «открывает». Direction: put the subject first, or take R's form «Настройки открываются из списка …».
4. **Russian / logic · polish.** «Семь боссов вновь можно оглушить и взять в рабы. Эту возможность у них отнимал конфликт модов.» (64; the same in G 433). The
   ability to knock bosses out belongs to the player, so «у них» (the bosses) names the wrong owner. The EN half has it right: «a mod conflict had taken this away».
   Direction: say what the conflict did without «у них».
5. **Russian · polish.** «Язык выбирается в поле «Язык окна».» (46; the same in G 162 and 415). This is an agentless passive in a line that tells the player
   what to do. It is the class the owner named on 2026-10-31 17:25 (a feature that seems to act by itself) and portrait seam ШВ10. Direction: give the player's verb.
6. **Russian · polish.** «Они открывают заметки Steam к версии игры» (44; the same in G 162 and 413). «Заметки Steam» is not a phrase a player knows. The link in
   `modpack.json` (`launcher.gameNotes`) is the Steam news page of the update. Direction: name it as the news or patch notes of the update on Steam.
7. **Fact / clarity · polish.** «Затем запустите `KrinikConanLauncher.exe` из папки сборки» (103). N never says which folder that is. R and G add that its
   name starts with `Krinik_Mod_Pack_`, and fact 13 gives the full name `Krinik_Mod_Pack_0_9_1_RC1`. Direction: name the folder at this step.
8. **English · polish.** A native editor would change these:
   - «the launcher tells you and installs it with one button, and your settings and saves stay in place after a pack update» (122). One sentence glues two
     facts, and the launcher presses the button. Direction: «lets you install it with one button», and a separate sentence for the saves.
   - «describes what the pack does, what it contains, the mod authors and the rights holders» (124). «Describes … the mod authors» is a zeugma. Direction: «names».
   - «strikes once with a melee weapon in a jump» (132) → «mid-jump» (R 260 has the same «in a jump»).
   - «open the Steam notes for the game version» (141) → the game's patch notes on Steam.
   - «20 % faster», «about 5 % more» (146, 147). English sets the sign without a space: «20%», «5%».
   - «unpack the pack into the game folder» (200) → «extract».
   - «If the game crashed or froze, or a mod misbehaves» (206). The tenses are mixed.

## R — README (generated)

1. **Fact / contradiction · blocker.** §1.1 item 3 says «Все моды сборки переведены на русский язык» (36). §2 then defines the mark: «Если автор сборки доработал мод
   другого автора (перевёл на русский язык, поправил в нём интерфейс или исправил ошибки), у такого мода стоит пометка **KRINIK MODIFIED**.» (54). By these two
   sentences, all 63 mods of other authors would carry the mark. Table 1 marks 17 of them. The EN half repeats the conflict (233, 251). G 239 defines the mark
   without the parenthesis and has no conflict. Direction: define the mark by what sets the 17 apart, for example that their own files were changed. Another
   way: say that the other mods' Russian text ships in KrinikConanRussianTranslation. Outside the scope of this read: `MODIFIED_NOTE` in `set-pak-modinfo.py` (line 36)
   gives the same three reasons to every marked mod.
2. **Russian / English · polish (an error class the owner named).** Cell 1, KrinikConanCamera: «Положение камеры (расстояние, высота, боковое смещение, наклон
   взгляда) задаётся с цифрового блока клавиатуры, сохраняется и сбрасывается.» (60). EN: «is set from the numeric keypad, saved and reset» (257). The position
   seems to save and reset itself. The owner called this exact form «ошибка класса» on 2026-10-31 17:25 (plan 35). This cell is also the mod's description in the
   game's own mod list. Direction: name the player's actions, as G's Table 2 does: «Положение камеры можно сохранить, вернуть … или сбросить …».
3. **Russian · polish.** Three cells mix a whole sentence with a verbless fragment or a chain of verbal nouns:
   - Archery: «…а её скорость задаёт сила натяжения лука по физике The Elder Scrolls IV: Oblivion. Вид от первого лица с луком в руках.» (61). Also,
     «по физике Oblivion» attaches to «натяжения лука», which is the wrong noun.
   - Graphics: «…и плавно гаснут. Настройки графики сборки: дальность прорисовки, тени, туман, DLSS.» (65).
   - Locomotion: «Стрельба из лука и удар оружием ближнего боя в прыжке, спринт с натянутым луком, прыжок от стены, по которой лезет герой, и выстрел из лука
     в полёте после такого прыжка.» (63). Five verbal nouns come in a row before two sentences with verbs.

   Direction: one form per cell, with verbs, taken from G's Table 2 (G 250–272).
4. **Russian · polish.** Cell 5, KrinikConanUI: «Пауза в инвентаре и хабе, HUD Hosav, переработанный для читаемости, счётчик кадров и кнопка «Отзыв» в главном меню и в
   меню Esc.» (64). «В главном меню и в меню Esc» can be read as the place of the frame counter too. «Переработанный для читаемости» copies the English
   participle «reworked for readability». Direction: split the cell into sentences.
5. **Russian · polish.** Three smaller cells:
   - Damage Meter: «Счётчик урона и урона в секунду в реальном времени: герой, спутники, другие игроки.» (73). «Урона» comes twice, and after the colon a list in
     the nominative does not say whose damage it is. G 311 says this cleanly.
   - RNF NPC Distribution: «Дополнение к Ragnar's New Factions: вместе с ним расселяет новых персонажей по миру.» (119). «Расселяет» has no subject.
   - Al-Merayah Reborn: «В крепости есть неигровые персонажи и осада.» (116; also G 364). «Есть осада» does not collocate.

   Direction: G's Table 2 sentences where they exist.
6. **Russian · polish.** «Сборку можно установить одним лаунчером, который сам скачает архив сборки, или из архива, скачанного заранее.» (136; also G 177).
   «Одним» reads first as a count («with one launcher»). «Сборка включает в игре русский язык.» (155; also G 194). «Включает» reads first as «includes». Line 155 also
   packs three unrelated facts into one paragraph: the language, the fallback installer and the wallpapers. Direction: an unambiguous word in each, and one
   paragraph per topic.
7. **Russian · polish.** «Если игра упала, лаунчер при следующем запуске сам предложит собрать отчёт. Нажмите в этом окне «Да»…» (173; also G 173). No window was
   named before «в этом окне». The launcher's box is titled «Отчёт о падении игры» (`KrinikConanText.cs:168`). Direction: name the window.
8. **Form · polish.** The centred subtitle ends with a period: «Сборка модов Krinik Mod Pack 0.9.1-RC1 для Conan Exiles Enhanced 3.1.1.» (9; EN 206 too).
   Portrait §2.4 says a heading on its own line takes no period.
9. **English · polish.** A native editor would change these:
   - «A single launcher window installs, updates and removes the pack and starts the game with it.» (225). A window does not act. Direction: «From a single launcher window you can …».
   - «The hero can level up to level 10,000» (259). «Level» comes twice.
   - «Bow shots and melee strikes in a jump» (260) → «mid-jump».
   - «spreads over the chests around that hold the same items» (276) → «nearby chests that hold …».
   - «attach it to an issue in [Issues]» (368). The word repeats.

## G — user guide

1. **Fact / contradiction · blocker.** «Окна настроек всех модов открываются одной кнопкой «Настройки модов» внизу инвентаря: «Моды Krinik'а», «Моды Xevyr'а», «Рыбалка»,
   «Прочее».» (276). Other lines of the guide contradict this:
   - two mods' settings open by console commands («Команда `dc PIFCSettings` … `dc SW_config` открывает настройки погоды», 233; «Настройки открывает
     команда консоли `dc SW_config`», 369);
   - the Hosav HUD is set up by «кнопкой «Настройки интерфейса» на вкладке «Снаряжение»» (308);
   - Organizer and Chest Labels are set up in the chest's radial menu (319, 320).

   The 0.9.0 notes said «настройки модов сборки», without «всех». Direction: drop «всех», or name the mods the button covers.
2. **Fact / one word for one concept · polish.** G gives version 0.9.1 a status that N and R do not:
   - «и для Conan Exiles Enhanced 3.1.1 выходит предварительная версия сборки 0.9.1» (389);
   - the heading «Версия 0.9.1 (предварительная)» (401);
   - «Сборка перешла на игру … и выходит предварительной версией 0.9.1. Перед этой версией выходит тестовая сборка 0.9.1-RC1…» (402);
   - «в предварительной версии 0.9.1» (474).

   N and R use only «тестовая сборка» (RC1), the plain version number (0.9.1) and «полноценный выпуск» (1.0.0). The 0.9.0 entry carries no status word.
   In Russian, «предварительная версия» is the usual name for a pre-release, which RC1 is not (fact 1). r2 flagged this word in N (r2 N1). N and R were changed,
   G was not. «Выходит предварительной версией» is also an awkward instrumental. Direction: one set of status words across N, R and G. Whether 0.9.1 gets any
   word besides its number is the owner's call.
3. **Russian · polish.** «Папка сборки лежит в папке игры, и её имя начинается с `Krinik_Mod_Pack_` и кончается номером версии.» (174). «Её» stands right after
   «папке игры» and can be read as the game folder's name (RUSSIAN_RULES §1). R's order has no such problem: «В папке игры появится папка сборки: её имя…».
   Direction: R's order, or the noun instead of «её».
4. **Russian / consistency · polish.** The feature block says «она собирает отчёт и открывает письмо автору сборки» (162). The KrinikConanUI row says «одно
   нажатие на неё собирает отчёт и готовит письмо автору сборки» (287). One action gets two verbs. The collector opens a mailto letter
   (`collect_report.ps1:227`), so «открывает» is the accurate verb. Direction: use one verb.
5. **Form · polish.** In Table 1, some cells with several sentences end with a period (NumLock «…ещё и автобег.», 218). Others drop the last period after inner
   sentences that have one (PackRat «…на элемент постройки», 226; F1 «…разворачивает счётчик», 229; Esc «…с версиями», 232; console, 233). Direction: one rule
   for the whole table.

G also carries N 4, N 5 and N 6 (lines 433, 162 / 415, 162 / 413) and R 6 and R 7 (lines 177, 194, 173). They are counted once, under N and R. A small repeat:
«В походе за героем идёт отряд до сотни спутников, и рабы едут верхом рядом с героем.» (150) has «героем» twice in one sentence (RUSSIAN_RULES §10).

## C — Krinik change notes (+ the set-pak-modinfo sentence)

1. **Fact · blocker.** KrinikConanUI: «Вкладки хаба переключаются сразу, и по экрану больше не пробегает тёмная волна.» This contradicts fact 14 and the known
   issue that N 77 and G 478 list: «После переключения новая вкладка хаба ещё долю секунды дорисовывается.» A player reads both in the same build. Direction: drop «переключаются
   сразу» and keep the dark-wave fix as N 70 words it. This is the only text of the four that promises instant switching. A search for «сразу», «мгновенн»,
   «instant», «at once» and «right away» finds no other such line.
2. **Fact, precision · polish.** KrinikConanUI: «Если рядом лежит труп, подсказка «E Взять» не появляется: клавиша E сначала открывает труп.» N 68 and G 437 say «Над
   трупом в кустах видна только подсказка у трупа, без второй подсказки «E Взять».» C widens the fix to any corpse nearby. Bug 80 hides our prompt only while
   the corpse strip is on screen, which is when E opens the corpse. Direction: describe the case where E opens the corpse, as N does.
3. **Completeness · polish.** The KrinikConanUI note has no line «Полоска здоровья врага поднята над его головой и не закрывает самого врага.» N 67 lists this as fixed in
   0.9.1, and G 282 puts it under KrinikConanUI. Direction: add the line if the change ships in that pak, or move G's line to the mod that carries it.
4. **Russian · polish.** KrinikConanGameplay: «Очки атрибутов можно вкладывать и после 20.» It has the same unnamed «20» as N 2.

The rest of C is clean. Every line is a whole sentence, and the fixes, the draw distance, Dead Shot and the experience curve match the facts.

**The set-pak-modinfo sentence is clean.** For the current manifest, `unlisted_krinik_note()` renders «Ещё пять модов сборки Krinik Mod Pack ставятся без пака, и
в этом списке их нет: KrinikConanCamera, KrinikConanEngineTweaks, KrinikConanLocomotion, KrinikConanModPackManager и KrinikConanRussianTranslation.» It is a whole sentence
with its verbs. The cause comes first. Number agreement holds for 1, 2–4 and 5+ («ставится / ставятся», «его / их»). The five names match `modpack.json`
(Krinik mods that ship, of a kind other than «pak»). One note outside the player's text: the docstring on line 52 still shows the old dash form («…не видны в этом
списке — они ставятся без пака…»).

## Owner's lines — proposals

These lines are the owner's own words or come from his text. Nothing is demanded. Each item is a proposal for him.

- **O1 · G 146** «Это значит, что в игре реализована практически бесконечная прокачка, … которая влияет на способности героя, которые реально видны в действии,
  герой быстрее бегает, выше и дальше прыгает…». This is his sample, verbatim from plan 35 (2026-10-31 17:29). A colon before «герой быстрее бегает» would turn the
  comma splice into an explanation. The «которая … которые» chain could be split.
- **O2 · G 160** «Проделана колоссальная работа по исправлению дефектов … с целью повышения его удобства, читаемости, устранения дефектов и приведения его к единому
  стилю игры Conan Exiles.» These are his words (17:34). «Дефектов» comes twice. Dropping the second «устранения дефектов» changes nothing else.
- **O3 · G 142** «Реализованы сохранение положения камеры героя, сброс камеры до значения по умолчанию и возврат к сохранённому пресету игрока.» These are his words
  (17:25). r2 noted the anglicism «пресет» and «значение» used for a position. This stays a proposal only.
- **O4 · G 116 (cover)** «9 уникальных вручную написанных модов». The brief names the cover as the owner's, although r2 (G8) did not find these words among his.
  The lint flags «уникальных» as an evaluation without proof. «Вручную написанных» overstates for KrinikConanEngineTweaks (kind «config» in `modpack.json`) and
  KrinikConanRussianTranslation (kind «files»). Ask him.
- **O5 · R 387 / 386 / 393 (the English half of his rights text)** «The pack is provided «as is»». The English half has Russian guillemets (r2 R10, still open);
  “as is” is a mechanical fix that keeps his words. «intended for informational purposes» (386) and «open to all of humanity for study» (393) are legal calques
  of his «для ознакомления» (r2 R13, still open).
- **O6 · R 196 / G 520** «загрузчик UE4SS распространяется под лицензией MIT …, шрифты распространяются под лицензией SIL Open Font License». The verb repeats.

## Checked and found clean

- Fact 1 (test build): N's h3 «Krinik Mod Pack 0.9.1-RC1 · …», the banner «Тестовая сборка / Test build», and «Если при установке или в игре что-то пошло не так,
  сообщите об этом автору сборки…» together with its EN twin. R's badge escapes the hyphen (`0.9.1--RC1`). `modpack.json` `packVersion` is «0.9.1-RC1».
- Fact 2: N's logo is the `main/_config/branding/…` URL. N's README links point to the README top. R keeps `art/logos/…`.
- Fact 3: the launcher is «обновлён до версии 1.0.0». All its new abilities are named in N and G. Every quoted button exists in `KrinikConanText.cs` in RU and EN:
  «Указать папку игры» / Choose game folder, «Продолжить скачивание» / Resume download, «Отзыв» / Feedback, «Собрать отчёт» / Collect report,
  «Установить сборку» / Install mod pack, «Удалить сборку» / Remove mod pack, «Обновить сборку» / Update mod pack, «Обновить лаунчер» / Update launcher,
  «Что нового» / What's new, «Язык окна» / Window language. G's 0.9.0 entry lists the launcher as added in 0.9.0.
- Facts 4–10 and 12 hold in N, G and C. Fact 10 matches `art/wallpapers`: V1 and four V2 variants, three sizes each, 15 files. Fact 11: «черта» is used throughout,
  and no «перк» is left. Fact 13 holds in R and G.
- Paths: `ConanSandbox.exe` sits in the game root and `uninstall_krinik_build.cmd` in the game folder. `collect_report.cmd` ships in the archive root
  (`extras`). The guide PDF goes into the archive root (`build-docs.py:127`) and is a release asset (`make_release.sh` step 5).
- The Locomotion claims in N, R and G match `games/ConanExiles/mods/KrinikConanLocomotion.md`: run and jump grow per Agility point, the hero pushes off a wall and goes wall to wall,
  hanging spends stamina, the bow shoots in the flight after a push, a melee weapon swings once in the air, and the hero can sprint with the bow drawn.
- Counts: 73 shipped = 9 Krinik + UE4SS + 63 (0.9.0 had 64 before ModControlPanel left).
- Terms: «шкала» everywhere, with no «ползунок» or «слайдер» (rule 21). No «контакты». The links sections are «Ссылки», «Links» and «Автор сборки и ссылки», with no
  sentence that calls them an address for reports (rule 22).
- The hero: no «he» in either EN half. «His» in R 385 is the pack author. The Russian verbs about the hero agree with the noun «герой», and no form addressed to
  the player gives a gender away.
- Typography: «ёлочки» and decimal commas in RU; “ ” in EN except O5; no Title Case headings. The emoji headings in N follow the published 0.9.0 notes.
- r2 findings now fixed: N 1–17; R 1, 2, 4–9, 11 and 12, and R 10 except the guillemets; G 1–5, 7 and 9, plus the noun cells of Table 1 from G 6. Still open:
  r2 R3 (see the next line), and in the owner's lines R10's guillemets, R13, the rest of G6, G8 and G10 (O1–O5 above).
- Before publication, not a text defect: R links `docs/guide/Krinik-Conan-3.1.1-guide.pdf`, which is not in the tree until `build-docs.py` runs (r2 R3).

## Verdict

- **N:** no blocker. It is ready after the polish (N 1–8).
- **R:** one blocker. The KRINIK MODIFIED definition contradicts «все моды переведены» (R 1, RU and EN).
- **G:** one blocker. «Окна настроек всех модов открываются одной кнопкой» contradicts the guide's own console and radial-menu lines (G 1).
- **C:** one blocker. «Вкладки хаба переключаются сразу» contradicts the known issue of this build (C 1).
- **The set-pak-modinfo sentence:** clean.

Polish counts: N 8, R 8, G 4, C 3. The owner's lines hold 6 proposals.
