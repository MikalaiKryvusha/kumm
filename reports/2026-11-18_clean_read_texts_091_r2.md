# Clean read r2 — release notes 0.9.1, README template (filled), guide 3.1.1

> **Created:** 2026-11-18 · by a clean reader (did not write the texts) on the pack tree of `50b4bce`
> **Parent:** `reports/2026-11-18_clean_read_three_texts_091.md` (r1) · `plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md` phase E
> **Status:** findings only; nothing applied. Lines r1 named as the owner's words are listed as still open, not re-judged.

Texts: **N** `_config/release/draft_0_9_1/github_release_notes_0_9_1.md` · **R** `_config/public_release/README.template.md`, judged as filled
in memory by `mods-table.mjs` (9 + 63, `docs/guide/Krinik-Conan-3.1.1-guide.pdf`, CL-383549) · **G** `docs/guide/guide-3.1.1.html`.

## Machine checks

- `kaif-voice-lint check N --genre reply`: 1 finding, the witness only (the file was written 92 min after the last portrait load); 0 text-pattern hits.
- `kaif-voice-lint check R --genre reply`: the same, 1 witness finding, 0 text-pattern hits.
- `dash_lint.py`: 91 files, 366 lines with a dash, all in translation tables (KrinikRU 349, HosavRU 9, two asset-strings TSV 4 + 4). `--only guide-3.1.1`: 0;
  `--only README.template`: 0. **N is outside dash_lint's scope** (`sources()` lists no release notes); a manual grep finds no spaced dash in N.

## 1. Release notes N

1. **Fact / RC.** «Krinik Mod Pack 0.9.1 выходит предварительной версией…», «> **Предварительная версия / Preliminary build**», the h3 «Krinik Mod Pack 0.9.1 ·
   …», «Части архива `Krinik_Mod_Pack_0_9_1.zip.001`, `Krinik_Mod_Pack_0_9_1.zip.002`…» (and the EN twins). Plan 55 sets RC1's `packVersion` «0.9.1-RC1»
   with the RC in the archive name and the title «0.9.1-RC1 (тестовая сборка)»; `make_release.sh` builds `NAME` from `packVersion`, so the parts will be
   `Krinik_Mod_Pack_0_9_1-RC1.zip.00N` and the default notes path `draft_0_9_1-RC1/…` will not find this file. Nothing tells a reader this is a test build
   or asks testers to report. Direction: an RC variant of the head, the banner and the part names; one line inviting test reports. Also keep the release
   ordinary: `Feed.Parse` skips `prerelease` (KrinikConanUpdates.cs:167), and step 2 of the install would fail for a GitHub pre-release.
2. **Consistency between texts.** «В этой версии появился лаунчер 1.0.0» and under **Добавлено** «Лаунчер KrinikConanLauncher 1.0.0.» (EN «the new
   launcher 1.0.0»). G «Что нового 0.9.0» and the 0.9.0 notes list the launcher as added in 0.9.0, so N says a shipped thing is new. Direction: «Лаунчер
   обновлён до версии 1.0.0: теперь он сам находит игру…», under «Изменено» or worded as a new version.
3. **Fact.** «Черта Проворства «Верная рука» ускоряет полёт стрел и метательного оружия на 20 %.» The game's perk makes them fly twice as fast
   (`vanilla-overrides-ru.tsv` line 12: vanilla «вдвое быстрее», the pack ×1.2), so the line reads as a buff when it is a cut. Direction: say «теперь на 20 %
   (в игре было вдвое)».
4. **Fact (omissions).** «Исправлено» leaves out two fixes for problems 0.9.0 players had: bug 85 (a rare UE4SS crash from key-bind Lua, 3.0.1 era, fixed
   `d45a680`, `c362a77`) and bug 94 (crafting started in the open hub finished instantly when the hub closed, fixed `9de0b63`). «Изменено» leaves out the draw
   distance 2.0 → 1.5 (`KrinikConanGraphics/Engine.ini` line 173, `807145f`), a change the player sees. Check also `fe5c37b` (XP per level 1000 × L^0.5).
   Direction: add one plain line for each change that ships.
5. **Fact.** «Ещё семь боссов можно оглушить и взять в рабы.» Commit `620d1c7` says «7 bosses recruitable **again**»: the EAA spawn table had taken their
   recruitability away (a mod conflict). Direction: move it to «Исправлено» with «снова»; «ещё» promises new bosses.
6. **Consistency with the shipment.** «Обои для рабочего стола V2 «Тёплый» и V2 «Реализм» в разрешениях 4K, 2K и 1080p.» `art/wallpapers` (modpack.json
   `extras`) also ships `V2_female_beta` Realism and Warm in three sizes (`bddc495`, 20:23, after N, R and G were written). The same gap is in R and G.
   Direction: name them, or leave them out of the archive.
7. **Fact / consistency.** «Как поставить сборку из архива без лаунчера… описано в README» points to R §3, which says only «Распакуйте архив сборки в папку
   игры». The parts are 7-Zip zip volumes, which Windows Explorer cannot open. The 0.9.0 notes said «Откройте первую часть… в 7-Zip или WinRAR» and gave
   the size (12.4 GB). Direction: restore the 7-Zip / WinRAR step and the total size in R (and G).
8. **Fact / RU.** «Положите их в одну папку рядом с лаунчером» (EN «into one folder next to the launcher»). `BuildUpdate.Prepare` looks for the parts in the
   launcher's own folder (`Path.Combine(here, p.Name)`), and the phrase reads as «a folder beside the launcher». Direction: «в ту же папку, где лежит
   лаунчер».
9. **Language RU.** «Шкала атрибута выше 20 листается стрелками под шкалой или колесом мыши, а список перков прокручивается колесом мыши.» «Шкала атрибута
   выше 20 листается» does not say what is paged (G adds «1–20, 21–40 и дальше»), and «колесом мыши» comes twice. Direction: take G's wording with the
   page example.
10. **Language RU.** «На русский язык переведены надписи, которые оставались английскими: загон для животных Emberlight, панель администратора
    Ironlight-Settlements и подсказка…» The list after the colon names objects (a pen is not a label). Direction: «надписи в загоне…, на панели
    администратора…».
11. **Language RU / EN.** «Черта Проворства» against «список перков» and «Описания перков» in the same notes (EN «The Agility trait» against «perk list»).
    One concept takes two words (ГЛ4). Direction: use one word for both, taken from the game's own term for the PerksTable row.
12. **Language RU.** Install step 2 «Лаунчер найдёт игру, а по кнопке «Установить сборку» скачает части…» hides the player's action inside a description
    (ДК4). The same happens in R's «Сборку можно поставить и одним лаунчером» paragraph and in EN. Direction: a step of its own, «Нажмите «Установить
    сборку»».
13. **Language RU, small.** «два новых мода автора» → «автора сборки» (З6); «Мод сборки KrinikConanLocomotion» says less than EN «The pack's own mod»
    (RU↔EN); «мигают все в такт» → «все мигают в такт»; «рядом с кнопками окна» is vague (which buttons?); «письмом на почту» → «по электронной почте».
14. **RU↔EN.** The Locomotion EN item adds «strikes **once**», which RU lacks. In the plans, EN item 2 «The «Моды Xevyr'а»… entry… will open…» breaks a list
    whose RU items are all infinitives («Сделать так, чтобы…»).
15. **Language EN.** Each of these reads as a calque to a native editor:
    - «The KrinikConanLauncher launcher 1.0.0»;
    - «in per cent» → «as a percentage»;
    - «A broken download resumes from the point where it stopped» → «An interrupted download resumes where it left off»;
    - «lies inside the pack archive» → «is also included»;
    - «After a crash of the game … at its next start» (twice) → «If the game crashes, … the next time it starts»;
    - «freeze for a moment less often on the road» → «fewer brief freezes while travelling»;
    - «An attribute's scale past 20 pages by the arrows» → «bar … is paged with»;
    - «light backing» → «background»;
    - «in one rhythm» → «in sync»;
    - «has left the pack» → «has been removed»;
    - «change in a jump» → «abruptly»;
    - «trembles» → «jitters»;
    - «painted into the images» → «baked into»;
    - «load the game» → «performance cost»;
    - «on «Install mod pack» it downloads» → «when you press»;
    - «by hand» → «manually»;
    - «How to install … and how to remove it is described» → «are»;
    - «Email:» against «e-mail» in the same page.
16. **Language EN.** «pushes off a wall he is climbing». The hero can be a woman (the pack ships Female New Faces). Direction: avoid «he».
17. **Fact / publication order.** The logo `…/main/art/logos/krinik-modpack-logo.webp` exists on the public `main` only after the new tree is pushed (the
    move from `_config/branding/` was `6240a47`, 20:06). That same push breaks the live 0.9.0 page, whose logo is
    `…/main/_config/branding/krinik-modpack-logo.webp`.

## 2. README R (filled)

1. **Fact.** `README.draft.md`, the file `make_public_tree.py` publishes as `README.md`, is still the 0.9.0 text: 3.0.1, «7_+_64», the 3.0.1 guide link and
   the step «Если разрешение экрана ниже 3840 × 2160». The template filled today differs from it in about 30 places. Direction: run `mods-table.mjs`
   before the public tree is built.
2. **Fact / RC.** The badge `[![Версия сборки](https://img.shields.io/badge/Версия_сборки-{{PACK_VERSION}}-FF1A8C.svg…)]` breaks with «0.9.1-RC1»:
   shields.io reads a single «-» as a field separator. Direction: escape it as `--` in the fill. The prose «Krinik Mod Pack 0.9.1-RC1 выходит
   предварительной версией» will also not say «тестовая».
3. **Fact.** «Руководство пользователя лежит в файле [docs/guide/Krinik-Conan-3.1.1-guide.pdf]…». No 3.1.1 PDF is tracked (only 2.2.3 and 3.0.1), and the
   public tree is `git archive HEAD`, so the link 404s unless the PDF is built and committed first.
4. **Fact.** §3 step 2 «Распакуйте архив сборки в папку игры» gives no 7-Zip or WinRAR step and no size (see N 7).
5. **Consistency between texts.** The Locomotion table cell «Стрельба из лука и удар оружием ближнего боя в прыжке. За каждое очко Проворства герой быстрее
   бегает и выше прыгает.» leaves out the wall push, the bow sprint and the stamina on the wall, which N gives as what the mod does. Direction: add them.
6. **Language RU / consistency.** The `mods-table.mjs` cells say they are «taken from … guide (Table 2)», but they have drifted back to older forms:
   - «Возвращена вырезанная разработчиком Funcom разрушаемая крепость…» (a participle chain; G: «Мод возвращает разрушаемую крепость, которую
     разработчик Funcom вырезал из игры.»);
   - «Сняты запреты игры на постановку построек в свободном месте» (G: «…мешали ставить постройки на свободном месте»);
   - «Оглушение и взятие в рабы боссов…»;
   - «…персонажей среди родных фракций, расселённых по миру» («расселённых» fits both nouns; G says «фракций самой игры»);
   - «Настройка движка на плавность»;
   - «Путевые камни с переносом между ними»;
   - «Трактирщики девяти народов в клетках тюремщика с равным шансом».

   Direction: copy G's Table 2 sentences.
7. **Language EN.** §1.2 «the build's author takes them… in the build's archive»: «build» appears here and «pack» everywhere else (ГЛ4).
8. **RU↔EN.** «The pack is installed, updated, launched and removed from a single launcher window» against RU «запустить с ней игру». The game is
   launched, not the pack.
9. **RU↔EN.** The Caverns of Set EN cell «Caves with the Akhlut Outpost settlement; …» drops RU's «между Логовом, Безымянным городом и Разбитыми
   источниками».
10. **Language EN.** «Version 0.9.0 of 2 November 2026» → «released on»; «What is not done yet and what … is listed» → «are»; «in the terms of the game's
    Russian version» → «using the terminology of»; «If the launcher has not found» → «cannot find»; «after the physics of» → «modelled on»; «with equal
    chance» → «an equal chance»; «the physics of streamed-in places updates in slices»; «passes through his own followers» (heroines exist); British
    «customisable / colour / armour / civilisation» next to US «License» (British noun «licence»); «» guillemets in English text.
11. **Fact.** The §1.2 table has no row for `art/`, which now holds the logos, wallpapers and icons (`6240a47`; R's own logo is `art/logos/…`).
12. **Consistency.** «обои… V1, V2 «Тёплый» и V2 «Реализм»» does not mention the female_beta pair (N 6).
13. **The owner's text, proposal only.** §7.5 «intended for informational purposes» and §8 «open to all of humanity for study» are legal calques of his
    «для ознакомления».

## 3. Guide G

1. **Fact / RC.** «…в папке сборки <code>Krinik_Mod_Pack_0_9_1</code>, которая лежит в папке игры» (line 174) and «В папке игры появится папка сборки
   <code>Krinik_Mod_Pack_0_9_1</code>» (179). The folder is the archive stem (`BundleDir = GameDir/Stem`), so it will be `…_0_9_1-RC1` for RC1. Direction:
   R's generic wording («начинается с `Krinik_Mod_Pack_` и кончается номером версии»).
2. **Fact.** Install step 2 «Распакуйте архив сборки в папку игры» has the same 7-Zip gap (N 7).
3. **Consistency.** Line 184, the wallpapers, misses the female_beta pair (N 6).
4. **Fact.** «Что нового 0.9.1» is N's list word for word, so it carries N 2–5 (the launcher «Добавлено», Dead Shot, the missing crash and craft fixes and
   draw distance, «Ещё семь боссов»).
5. **Consistency.** Table 2 «Полоска здоровья врага поднята чуть выше его черепа» against «Что нового» «поднята над его головой»: two words for one thing,
   and «черепа» sounds odd to a player.
6. **Language RU (agent text, r1 18 still open).** Table 2 «Реализованы сохранение положения камеры героя, сброс камеры до значения по умолчанию и
   возврат к сохранённому пресету игрока»: bureaucratese, the anglicism «пресет», and «значение» used for a position. The Table 1 camera cells are nouns
   («Сдвиг камеры…», «Расстояние от камеры до героя» with no action at all) while every other row has a verb.
7. **Language RU (r1 16 still open).** «развернуть счётчик его кнопкой»: «его» can mean the cursor or the counter.
8. **Language RU / fact.** Cover «9 уникальных вручную написанных модов»: «уникальных» is a booster. KrinikConanEngineTweaks is Engine.ini lines (`f02b2df`)
   and KrinikConanRussianTranslation is translation tables, so «вручную написанных модов» overstates. The wording came in with `1f82ce6` (10-31 18:01). I
   did not find it among the owner's words, so check with him before changing it.
9. **Language RU, small.** «60 видов рыбы в четырёх биомах и семи ступенях редкости»: the fish do not live «в ступенях» (→ «с семью ступенями
   редкости»). «добычей верхнего уровня» is a calque of «top-tier».
10. **The owner's text, unchanged.** Lines 146 «Прокачка…», 160 «Интерфейс», the camera and archery phrasing (142, 144) and the rights and licence chapter.
    r1 proposals 1, 2, 18 and 19 still wait for the owner.

## Checked and found clean

- 0.9.1, 3.1.1 and CL-383549 match `modpack.json` (`packVersion`, `launcher.gameVersion`, `builtFor`) in all three texts. N's marker line passes
  `make_release.sh` step 1.
- The game history agrees between R and G and with `builtFor`: 2.1.1 CL-373655, 2.2.3 CL-378132, 3.0.1 CL-379176, 3.1.0 CL-383024 (13–17 Nov), 3.1.1.
- 9 + 63 + UE4SS = 73 shipped. The `mods-table.mjs` integrity check passes (73 rows, 17 KRINIK MODIFIED), and every shipped mod is named in G.
- The launcher is 1.0.0. Every button label the texts quote exists in `KrinikConanText.cs`, RU and EN. The crash offer opens `issues/new`
  (KrinikConanLauncher.cs:214), the «Отзыв» button opens a mailto (`collect_report.ps1`:227), and `collect_report.cmd` ships in `extras`.
- The three author links match across N, R and G. The README anchors N uses resolve. The paths R links to exist (`art/logos/…`,
  `_unpacked/UE4SS/ue4ss/LICENSE`, `_config/branding/fonts/`).
- N's changes, known issues and plans are word for word G's, and R names G's chapter by its exact title.
- The guide PDF is attached as an asset and goes into the archive (`make_release.sh` step 5, `extras`).
- No dash stands in for a verb; only legal dashes appear (GOST captions, the owner's apposition).
- «шкала» is used throughout, with no «ползунок» or «слайдер». The links section is «Ссылки», «Links» or «Автор сборки и ссылки».
- The agent's text has no «не просто», «является» or «осуществляется».
