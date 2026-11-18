# Clean-instance read (§7B) of the three build texts — README template, release notes 0.9.0, guide 3.1.1

> **Created:** 2026-11-18 · by a clean helper (no history, no pairs, no writer's rationale) on the pack state of `21075fb` (texts of `37a2263`)
> **Parent:** `plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md` R4; `HOUSE_RULES.md` 35.2, 35.6
> **Status:** findings received 2026-11-18 18:30 +03:00; to apply — agent text by the rewrite helper; the owner's own lines go to him as proposals
> **Outbound:** the owner's lines (findings 1, 2, 18, 19 and the rights / licence repetitions) — to the owner on the pairs page, never applied by the agent

Texts: A `_config/public_release/README.template.md` · B `_config/release/published_0_9_0/github/github_release_notes_2026-11-18.md` · C `docs/guide/guide-3.1.1.html`.

**The owner's own words (provenance checked 18:3x in `plans/35_conan_build_turnkey_quality.md` lines 192, 220–226):** C line 146 «Прокачка героя…» (his sample,
2026-10-31 17:29), C line 160 «Интерфейс» (17:34), the archery / camera phrasing «фундаментально переработана», «по классической школе ролевых игр 2000-х годов»
(line 192), C rights and licence (comment at line 451) = A §7–8. Findings on them are PROPOSALS for the owner.

## A. Meaning unclear or wrong

1. C 146 «Прокачка героя до 10 000 уровня» — OWNER'S TEXT. Comma splice («…видны в действии, герой быстрее бегает»), «Это значит» about the heading,
   «реализована», «позволяющая», «прокачка… прокачивать», «наслаждаться… прогрессией», «которая…, которые…», «реально», «и так далее».
   Proposal: «Героя можно свободно прокачивать до 10 000 уровня, почти без предела. Каждый новый уровень заметен в деле: герой быстрее бегает, выше и дальше
   прыгает, лучше стреляет из лука и не только.»
2. C 160 «Интерфейс» — OWNER'S TEXT. «Проделана колоссальная работа по исправлению дефектов … с целью повышения … устранения дефектов и приведения его к
   единому стилю» — split predicate, genitive chain, tautology, booster, hidden actor. Proposal: «Автор сборки проделал огромную работу над интерфейсом:
   исправил ошибки во многих окнах и элементах, сделал их удобнее и легче для чтения и привёл весь интерфейс к единому стилю игры Conan Exiles.»
3. A 34 (§1.1 item 1) and C 375: «То, что ещё не доделано и войдёт в версию 1.0.0» reads as the unfinished shipping inside 1.0.0; one paragraph uses 1.0.0 for
   the past beta (2.2.3) and the future full release. B 21 says it right («будет исправлено к версии 1.0.0»). Depends on F1, F2.
4. C 421 known issues: «Тени от листьев пальм мерцают. Это исправлено 7 ноября: тени листвы больше не мигают. Исправление войдёт в следующую версию сборки.» —
   a fixed item in a list of what will be fixed; «Это» without a noun; two names each (мерцают / мигают, листьев пальм / листвы). See F4.
5. Screen resolution step (A 65, B 106, C 181): «Если разрешение экрана ниже 3840 × 2160, смените его в настройках игры» tells the player to change the
   SCREEN's resolution in the game; C compares a screen's size with a resolution; A gives the reason (the build sets 3840 × 2160) only after the steps.
   Proposal A: «Если разрешение вашего экрана ниже 3840 × 2160, выберите в настройках игры разрешение своего экрана: сборка включает полноэкранный режим
   3840 × 2160.» B: «Сборка включает в игре полноэкранный режим 3840 × 2160. Если разрешение вашего экрана ниже, выберите в настройках игры разрешение своего
   экрана.» C: «<b>Выберите в настройках игры разрешение своего экрана,</b> если оно ниже 4K.»
6. C 455 (the agent's mechanical edit inside the owner's rights text): «(глава «Автор сборки и ссылки»)» reads as a README chapter. Proposal: «Авторы и
   страницы модов названы в README публичного репозитория сборки, а ссылка на репозиторий стоит в главе «Автор сборки и ссылки».»
7. B 17: «Дома героя ждёт поселение…» first reads as «дома́». → «Героя ждёт дома поселение со своим распорядком дня, а в поход вместе с героем выходит отряд
   до сотни спутников.»
8. C 322 «За убийство жреца героя преследуют волны верующих.» → «За убийство жреца волны верующих преследуют героя.» C 353 «…по ночам за стенами базы героя
   встречают демоны и нежить.» → «…по ночам демоны и нежить встречают героя за стенами базы.»
9. C 263: «начинают мигать заранее, до предела» → «начинают мигать заранее, пока до предела ещё есть запас, и мигают все в такт.»
10. A 53, C 228: «Пометка KRINIK MODIFIED стоит у модов других авторов, которые автор сборки доработал» — «которые» next to «авторов». A → «Если автор сборки
    доработал мод другого автора (перевёл на русский язык, поправил в нём интерфейс или исправил ошибки), у такого мода стоит пометка KRINIK MODIFIED.»
    C → «Если автор сборки доработал мод другого автора, у такого мода стоит пометка KRINIK MODIFIED.»
11. «Папка сборки» is never explained (A step 3 and `install.cmd`; B step 4; C step 3, `install.cmd`, `collect_report.cmd`) — name the real folder created in the
    game folder by the unpack.
12. B 53, C 397: «…умения, места осквернения святилищ и журнал поселения» — a three-noun chain; say what text the player sees (check against what was translated).
13. B 68, C 412: «В списках появления Ragnar's New Factions каждое место занимает существующий персонаж.» — calque of «spawn lists». → «В списках, по которым
    Ragnar's New Factions расселяет персонажей по миру, каждое место теперь занимает персонаж, который есть в игре.»
14. A 28: «…обновляет себя отдельно от неё» — «неё» is «версии» or «сборки». → «Лаунчер сам сообщает о новой версии сборки, а себя обновляет отдельно от сборки.»

## B. Grammar

15. C 158: «тысячи предметов декора помогут обставить дом по своему вкусу» — «своему» belongs to «предметы»; «сундук» four times in one sentence.
16. C 218 Table 1, F1 hold: the purpose clause belongs to another actor; «счётчика урона» twice. → «Показывает курсор мыши: курсором можно перенести мини-карту
    и окно счётчика урона или развернуть счётчик урона его кнопкой»
17. C 156: «Для этого в сборке есть…, а народы мира выглядят так, как их описал Роберт Говард» — «Для этого» covers the Howard clause. → colon after the first
    sentence; the Howard clause a sentence of its own.

## C. Calque and bureaucratese

18. C 142 camera feature, 235 Table 2, 209–217 Table 1 — the camera block's phrasing is the OWNER'S («по классической школе ролевых игр 2000-х»);
    «Реализованы сохранение положения камеры героя, сброс камеры до значения по умолчанию…» (agent text in Table 2) and Table 1's mixed verbs / nouns
    («Расстояние от камеры до героя» names no action). Table 1 cells proposed: «Сдвигает камеру вперёд и назад, влево и вправо, выше и ниже» · «Наклоняет
    взгляд камеры выше и ниже» · «Приближает камеру к герою и отдаляет от него» · «Сохраняет положение камеры · возвращает камеру в сохранённое положение» ·
    «Сбрасывает камеру в положение по умолчанию» · «Возвращает родной наклон камеры игры» · «Открывает меню арсенала: классы, руны, слава».
19. C 144 archery — OWNER'S «фундаментально переработана»; «Реализованы вид от первого лица… и стрельба в прыжке» (check whose). Proposal in the reader's words.
20. C 148: «Реализована пауза игры в инвентаре и хабе…» → «Пока открыт инвентарь или хаб, игра стоит на паузе: добычу можно разобрать и всё обдумать спокойно.»
21. C Table 2 249, 260, 321 «Реализован(а/ы)» → «Героя можно прокачать до 10 000 уровня.» · «Пока открыт инвентарь или хаб, игра стоит на паузе.» · «Добавлены классы
    с собственным опытом, три древа умений, руны и система славы.»
22. C 115–116 cover: «7 уникальных вручную написанных модов», «64 мода Мастерской Steam и Nexus Mods» → «<N> собственных модов автора сборки», «<M> модов
    других авторов из Мастерской Steam и с Nexus Mods» (numbers F3; cover words may be the owner's — check).
23. A 32 heading «1.1. Основные положения» → «1.1. О сборке».
24. B 62, C 406: «Раскладка подсказки к предмету больше не меняется.» → «Подсказка к предмету больше не меняет свой вид.»
25. B 55, C 399: «Ночью при моде Severe Weather Enhanced…» → «Когда работает мод Severe Weather Enhanced, ночью мир освещает родной свет игры.»
26. C 154: «бури, жара и холод по местному климату гонят героя» → «как велит климат края»; «из родных фракций» → «из фракций самой игры» (check).
27. C 323: «рецепты открывает благословение бога героя» → «…рецепты открываются, когда герой получает благословение своего бога.»

## D. Rhythm and small points

28. C 423: «Новая вкладка хаба дорисовывается в первые доли секунды после переключения.» → «После переключения новая вкладка хаба ещё долю секунды дорисовывается.»
29. C 190: «Подтвердите удаление в окне вопроса.» → «Подтвердите удаление в появившемся окне.»
30. A 26: «объединяет … лаунчер и русский перевод всех модов» → «…загрузчик UE4SS и лаунчер, и все моды в ней переведены на русский язык.»
31. B 33 «отряд до сотни человек» vs «спутников» elsewhere; B emoji headings (the owner's choice?).
32. OWNER'S TEXT: A §7 items 3–4 «принадлежат» ×4 in three sentences; A §8 and C «Лицензия» «распространяется» ×3 in two sentences — observation only.

## Fact notes

- **F1** A §1.1 item 1 and C «История версий» describe only 0.9.0 for 3.0.1; nothing on 3.1.0, 3.1.1, 0.9.1; C «Что нового» has only 0.9.0.
- **F2** two releases numbered 1.0.0 (the early beta for 2.2.3, the planned full release).
- **F3** C cover: 7 own + 64 others; C Table 2 lists 9 Krinik mods; `mods-table.mjs` 273–274: 9 + 63; B's 7 + 64 is right for 0.9.0.
- **F4** C «Известные проблемы» says 0.9.0 as of 2 November, 7 items; B's 0.9.0 list has 14; the palm-shadow fix «войдёт в следующую версию» while the guide is 0.9.1.
- **F5** C «Что нового 0.9.0» says the launcher updates the build and itself; B's 0.9.0 launcher entry names no update function.
- **F6** speed and jump grow with LEVEL (B, C feature) vs per AGILITY point (C Table 2, KrinikConanLocomotion).
- **F7** minimap coordinates «внутри её кольца» vs «Строка координат над мини-картой».
- **F8** «Настройка рыбалки» (Exiles Fishing row) vs «Рыбалка» (KrinikConanUI list).
- **F9** «Пещеры Сета» (B) vs «пещеры Сета» (C).
- **F10** A navigation row (line 23) leaves out section 6 «Ссылки».
- **F11** dates «02.11.2026» (A) vs «2026-11-02» (B, C); prose norm «2 ноября 2026 года».
- **F12** C chapter «Отзывы и обратная связь» is chapter 2, before «Установка» (maybe intended).
- **F13** B footer has an English rights line only.

Judged good and left alone: A ≈ 52 sentences (11 of them the owner's §7), B ≈ 80, C ≈ 190. No telegraph dash in A, B, C; «шкала» kept; the links section is
«Ссылки» / «Автор сборки и ссылки» everywhere.
