# KUMM — Current Status

> This file is read by the AI agent before every task. Update it on every significant change of state.
> It is the PRIMARY handoff between sessions: a new agent session starts with empty context and must be
> able to get productive from this file alone. Write accordingly — concrete, with file paths and commands.
> 🧠 Prime thinking principle — `PHILOSOPHY.md` (SIMPLICITY: KISS + Occam). Read your working framework
> in `AGENT_GUIDE.md`.
>
> ⚠️ **STATUS is a SUMMARY of NOW, not a chronicle.** A status file that only ever grows turns into
> the project's history book, and the agent that came for a quick "where are we" drowns in it
> (field: a 2 300-line STATUS — "an abyss, not a summary"). The rules that keep it a summary:
>
> - **Every line passes two tests:** *"if I remove this line, will the next agent make a mistake?"*
>   and *"does a newcomer still read the whole file in one sitting?"* Soft target: **~200 lines**
>   (one-two screens of substance) — the guard is a warning, not a wall, but crossing it means a
>   trim is overdue.
> - **Closed work is MOVED OUT, not accumulated:** when a phase/session's entry is no longer "now",
>   move it VERBATIM into `PROJECT_HISTORY.md` (the chronicle — that is what it is for).
>   `/end-chat-soft` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

> ⚠️ Force-closed 2026-10-06 21:39 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first
> /end-chat-soft pays this debt. Standing falsehood: none.

> **06.10, чат 20:55–21:39 — по замечаниям владельца в живом отсмотре:** цвета автора возвращены (плашки страницы бога, золото
> имён, плашка цвета класса); страница бога — шкала внизу, текст в рамке, «?» кружком, портрет поверх линии; «Мастерство» — ширина
> колонки постоянная, полосы на всю колонку, описание класса на подложке и своим переводом (14 классов); карточка навыка — один
> тёмный фон; меню по Esc и главное — рукописным и мельче; советы загрузки — просто и без тире (страж в `translation_deploy.sh`);
> курсор сквозь окно в компас — проверено мышью, нет. **Хук `tools/hooks/testcase-gate.mjs`** — прогон в игре только по свежему
> `testcases/TC_*.md` (`[OWNER]` «давай хук на это сделаем - написание тестов» · ≈21:25); документ
> `testcases/TC_svarog_character_window_cards.md`. SvarogsDream `51140a7`, `c4f2426`, `4a3e559`, `b889396`; KUMM `5546ef1`.
> Агент снял игру `kill`, пока владелец в ней играл (≈21:37, «и зачем ты игру закрыл? я просил?») — поднята обратно; память
> `dont-kill-game-owner-is-in`.

> **06.10, чат 20:09–20:55 — окно персонажа карточками** (живой отсмотр владельца, затем «продолжай по двум соседним табам,
> автономно»): «Атрибуты», «Преданность», «Мастерство» — карточки на общем листе, заголовки Gabriela медью с линией старого золота,
> мазки кисти и чёрные линии сняты; «Атрибуты» — раскладка «список — подробности», страница атрибута с прогрессом на одном месте
> (процент целым), свой перевод всех 12 страниц; карточка таланта и окна «?» без кривизны. SvarogsDream `5568aff`, `76c3ebd`,
> `ff3142f`, `58426b4`; отчёт `testcases/reports/2026-10-06_svarog-character-window-cards.md` (partial: вкус — слово владельца).
> До этого чата, 19:01–20:08 (в STATUS не попало): альманах и вкладки большого окна — рукописным, обучающие подсказки (28 окон) —
> своя вёрстка, Gabriela и свой перевод (`0dfd4c7`, `be99766`, `f729979`).

> **06.10, чат 17:43–19:01 — Svarog's Dream:** (1) **проверка переводов в игре** — записки, рецепты, ключи-шаблоны чисел и
> реплика из кода сработали (отчёт `testcases/reports/2026-10-06_svarog-wisdom-font-and-translation-keys.md`); EXP-0151
> поправлен: хвостовые пробелы XUnity срезает сам. (2) **Шрифт мудрости Gabriela** внедрён по границе владельца «кто говорит»
> (бумага мира — Gabriela, интерфейс и диалоги — Manrope; `ideas/07` п. 28, кадры `SvarogsDream/gallery/game/2026-10-06_шрифт-мудрости/в-игре/`);
> длинная записка влезает в бумагу. (3) **Диалоги 704 → 2405/7731** (файлов 26): повариха, вся война фракций, Великий
> Мученик, Суккуба, Задачник, огоньки Края Света, Видар, Ирий, Загрив, оборотень, король Кнез, Мокошь, «Путь недеяния» 1.
> Пульт: `comps <Тип>`, `\r\n` в аргументах; `h.sh` не ждёт закрытую игру (EXP-0154).

---

## Where we are now

> 🎯 **Svarog's Dream — снова главное** (`[OWNER]` «в новом чате продолжим со Сварог Дрим» · 2026-10-05 ≈20:55): досье
> `games/SvarogsDream/README.md`; передача дел — блок «Первым делом» ниже (вопросы владельцу, затем диалоги дальше).
>
> **Mafia II** (на паузе): сборка стоит, меню и графика проверены агентом; прицел, радио, Epilog, FPS — глазом владельца в
> сюжете (досье `games/Mafia2/README.md`, раздел «Дальше»); сюжет агенту не начинать (`[OWNER]` «не нужно игру начинать» ·
> ≈20:27).
>
> **Конан 2.2.3** — досье `games/ConanExiles/README.md`. Palworld — в ежедневном пользовании, правок не ждёт.
> **Oblivion Remastered запаркован до патча** — не ходить туда, пока владелец не скажет.

The engine works and the owner uses it daily for Palworld. What it does NOT have is any way to check
itself: there is no test of any kind, and both halves talk to the outside world (Nexus through a
browser, game folders on disk), so a fresh session cannot currently prove a change is safe without the
owner's eyes. That is the whole of the current focus — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🔲 next | no tests exist yet; the deterministic core is the target |
| Phase 2 — the second game | 🟢 **доказана на Конане** | движок принял Conan Exiles Enhanced **без единой правки**: слаг `conanexilesenhanced` из манифеста, `game_id` со страницы. Oblivion Remastered остаётся подготовленным (манифест на 168 модов), ждёт патча |
| Phase 3 — compatibility | 🔲 todo | источник конфликтов найден: `UnrealPak -List` из Dev Kit читает любой пак с Oodle (`researches/conan-devkit/`); работа — фаза 3 эпика `plans/06` |
| Phase 4 — optimization presets | 🔲 todo | |

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- [ ] **Запуск-гард перед любыми тестами (блокер).** Импорт `kumm.mjs` ЗАПУСКАЕТ CLI: диспетчер команд
      лежит на верхнем уровне, и под `node --test` он получит путь тест-файла вместо команды, свалится
      в `default` и напечатает шапку в поток TAP. Пока гарда нет, юнит-тест написать нельзя — проверка
      разбора имён 15.08 делалась разовым скриптом в скретчпаде. Гард: сравнить
      `pathToFileURL(process.argv[1]).href` с `import.meta.url`. Правка механическая, но задевает
      ~250 строк отступов — поэтому отдельным заходом и с `node --check` после.
- [~] **Round-trip check for the archive naming scheme** — **ПОЛОВИНА СДЕЛАНА 08.09.2026.**
      `test-parse-archive.mjs` проверяет РАЗБОР: 17 случаев, из них девять настоящих имён живой
      библиотеки Palworld, четыре конановских с короткими id, вторая схема Nexus и отрицательный
      контроль. Поводом был баг 03 (`\d{4}` в id мода). **Осталось**: круговой ход
      `libraryName()` → `parseArchive()` — то есть проверить, что ЗАПИСЬ и ЧТЕНИЕ согласованы, а
      не только чтение. Тест уже умеет вырезать функции из `kumm.mjs` в обход запуска CLI —
      каркас для этого готов.
- [ ] **Cases for `sameFile`/`stamp` and `pickCard`** — upload-date comparison rounded to the minute;
      variant selection between Steam/Gamepass, Capped/plain, presets. Pure, autonomous.
- [~] **A fixture pack** — **разово собрана и окупилась 08.09.2026**: поддельный пак + библиотека
      из архивов, названных по схеме движка, + папка игры с одним файлом-признаком. Прогнана в трёх
      режимах (`-Deploy -DryRun`, боевая раскатка, `-Verify`) и нашла **четыре** дефекта
      переносимости за один заход (`bugs/03_DONE_*`, `EXP-0043`). **Осталось**: превратить разовый
      скрипт в постоянный прибор в репозитории — сейчас он жил в scratchpad и умер вместе с сессией.
      Это самый дешёвый оставшийся пункт Phase 1: строитель фикстуры уже написан один раз.
- [ ] **Close the packaging drift** — `package.json` `"files"` ships `kumm.mjs` without
      `Deploy-ModPack.ps1`, so `npm i -g` delivers half the engine. Verify with `npm pack --dry-run`.
- [ ] **A real `help` command** — the switch block, the header comment (lines 18–28) and the README
      table are three hand-maintained copies of one list. One source, the rest generated or checked.
- [ ] **`kumm status` after `close`** — confirm it reports cleanly rather than throwing; cheap, and it
      is the command a session runs first.
- [ ] **Warn when a mod overrides `Engine.ini` at runtime** — обе болезни 21.08 были невидимы движку:
      деплой сверил каждый файл и всё равно отгрузил сборку, чью графику Lua-мод переписывает в мире.
      Дешёвый первый срез не требует запущенной игры: просканировать исходники модов на
      `[SystemSettings]` и присваивания `r.*` и доложить, какие из них сталкиваются с `Engine.ini` пака.
      **Свежий довод из практики:** `r.ViewDistanceScale` живёт в ЧЕТЫРЁХ местах с ТРЕМЯ разными
      значениями (мод 1.0, `_config/Engine.ini.SystemSettings-tuned.ini` 2.6,
      `_config/Krinik-Palworld-UE5-Engine.ini` 2.2), и побеждает мод. Это конкретный автономный
      кусок Phase 3 (`MASTER_PLAN.md`).
      **И второй довод, из Конана 08.09.2026: соперник бывает не мод, а САМА ИГРА.** Прибор
      `ConanExiles/_config/check-conflicts.py` показал, что игра ставит `r.ViewDistanceScale` и
      `grass.CullDistanceScale` из групп качества, применяемых ПОЗЖЕ нашей секции, — то есть наши
      значения проигрывали молча. Прибор простой (сверка нашего ini со снимком журнала игры) и
      просится в движок как общая проверка, а не как скрипт одного пака.

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- 🅿️ **Стрельба из лука «по-обливионски» — в дальнем ящике по слову владельца 12.09.** Не поднимать, пока он
      не скажет. Разведка — `researches/conan-archery/README.md`, запись в досье Конана.
- 🔴 **НЕ запускать `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute`**: в карантине единственный
      экземпляр сохранения Elden Ring и личное видео `ref.mp4`.
- 🧹 **Уборка 17.08 ждёт решений владельца:** образцы зловреда, задача RTSS, iTunes ради кодировщика OBS, три
      вещи из карантина. Ничего не восстанавливать без его слова. Полный текст — `PROJECT_HISTORY.md`, запись
      «2026-09-18 поздний вечер»; разбор — `researches/cleanup-2026-08-17/README.md`.
- ⏳ **Palworld `LoadingRange` стоит на ванильных 25600** — на что возвращать, владелец не назвал (предлагались
      51200 или 76800). Подробности там же в летописи.
- 🗺️ **Oblivion, до патча не срочно:** две строки мод-листа не сопоставлены с архивами, двух решейдов нет в
      библиотеке, консоль не открывается (не блокер). Подробности там же в летописи.
- 🕵️ **Строка «установка не из Steam» (досье Конана, летопись) — сверить с правилом обезличивания.** Словарь
      `tools/scrub-identity.mjs` её пропускает. Убрать ли её и нужна ли правка гейта — решение владельца;
      переписывать опубликованную историю агент сам не станет.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
      run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

> **План нового чата (21:39, `[OWNER]` «В новом чате, этот быстренько закрывай с планом на новый чат») — Svarog's Dream.**
> Перед любым прогоном в игре — случаи в `testcases/TC_svarog_character_window_cards.md` (хук `testcase-gate` иначе не пустит).
> Игру, в которой владелец, не закрывать (память `dont-kill-game-owner-is-in`).
> А. **Поп-ап «+» шкалы преданности** (кадр `SvarogsDream/_harness/plus_tip.webp`): открывается вверху на заголовке бога — поставить
>    у «+» (над ним, на экране); вид — одна тёмная подложка с каймой, как карточки; перевод 8 строк `PopulatePointsTooltip`
>    (`GameUI/UICharacterDevotionPanel.cs` в декомпиляции `%TEMP%/sv_full`, строки `+{50*N} (+50) to intervention damage.` и др.) —
>    шаблоном чисел. Предложено владельцу, «да» не сказано — он перенёс в новый чат.
> Б. **Имена богов без подсветки при наведении** — `[OWNER]` «имена богов сейчас без выделения ховером.... не очень красиво» · ≈21:39:
>    мазок кнопки прозрачен цветом (`DevotionCards.cs`, против шлейфа) — нужна своя подсветка наведения (например, имя светлее/медью).
> В. **Проверить глазом** (сделано кодом в `b889396`, не видено): настройки и загрузка сохранения главного меню рукописным
>    (`MenuFonts.cs`, кейсы C19–C22), «Загрузка» рукописным и совет ниже на экране загрузки (`LoadingLayout.cs`, C23–C24).
> Г. **Порядок в настройках главного меню** — ждёт слова владельца (кадр `SvarogsDream/_harness/owner_settings.webp`, список из
>    семи бед в чате 21:33: бирюзовая плашка, разнобой подписей, обрезанная «Цензура…», мазки списков, галочки, совет за плашкой, «50»).
> Е. **Единый Бог не переведён** — `[OWNER]` «единый бог что-то совсем не переведён...» · ≈21:39 (страница в «Преданности»: отношения,
>    вмешательство). Это `CharacterDevotion.OneGod`, бог Дома Веры, не Один (`[OWNER]` спросил «это не Один?»; ответ агента — по
>    перечислению кода и методичке §2 «Дом Веры (Единый Бог)»). Перевести его строки книжно-церковным голосом (STYLE §2, п. 6).
> Ж. **«Божье Вмешательство» пляшет по высоте у разных богов** — `[OWNER]` «Божье Вмешательство у разных богов по высоте пляшет...
>    нужно фиксировать» · 2026-10-06 после 21:39. Причина в `DevotionCards.cs` (`DevPage`): раздел поднимается на `up`, когда
>    длинное описание не помещается над шкалой. Сделать постоянную высоту заголовка раздела (по самому длинному описанию из
>    восьми или шагами кегля описания), а не подъём под каждого бога.
> З. **«?» у «Отношений» по наведению ничего не показывает** — `[OWNER]` «значок (?) по ховеру в отношения с Богом никакой подсказки
>    не показывает» · после 21:39. Это не значок подсказки, а число отношений (`Comment/relationsNumber`, игра пишет «?», пока не
>    известны); кружком «как на Атрибутах» его сделал агент по слову «кнопочка вопросительного знака не такая» — и он стал выглядеть
>    кнопкой. Сначала проверить в коде игры (`SetRelations`, `UICharacterDevotionPanel.cs`), есть ли у него своя подсказка; дальше —
>    к владельцу: дать подсказку «что такое отношения и как их поднять» или оформить число как значение, а не как кнопку.
> И. **«Мастерство»: дерево перков иногда прыгает вправо, шкала уровней внизу плавает влево-вправо при смене класса** —
>    `[OWNER]` «правый контейнер с древами перком иногда прыгает впрево при переключении между ветками мастерств» · «внизу полоса
>    прогресса при переключении веток мастерст чуть-чуть плавает вправо влево» · после 21:39. Причина (`MasteryCards.cs`, шаг 3):
>    сдвиг `dx` дерева и шкалы считается по первой колонке ТЕКУЩЕГО дерева — у каждого класса свой. Сделать сдвиг постоянным
>    (один на все 14 деревьев: по самому левому дереву или по краю карточки), шкалу — тем же постоянным; проверить «прыжок»
>    на первом кадре после смены класса (видео `tools/flicker.sh`). Кейс в `TC_svarog_character_window_cards.md` до прогона.
> К. **Дыра в карточке пассивного навыка** — `[OWNER]` «это поп-ап от ховера на пассивном навыке - какая-то дыра непонятная в нём» ·
>    после 21:39; кадр `SvarogsDream/_harness/owner_passive.webp` («Повар (пассивный навык)»): между описанием и «Не хватает Очков
>    Мастерства» — пустой тёмный прямоугольник. Вероятно, блок `NoCosts` карточки `SpellToolTip` (у пассивного нет расхода и
>    перезарядки) со своим тёмным фоном — проверить дампом; скрыть его фон и поднять «Не хватает…» под описание, низ фона — по
>    тексту (`SpellTipLook` в `TalentTip.cs`). Кейс в TC до прогона.
> **Сделано в чате 21:44–22:40** (случаи и итоги — `testcases/TC_svarog_owner_batch_2026-10-06_evening.md`): Л — наведение «Настройки
> модов» (SvarogsDream `f032313`); М — окно настроек модов в тёмной бумаге и золоте, флажки и числа по масштабу (`f032313`); Ж и Б —
> «Божье Вмешательство» на одной высоте, подсветка имени бога, «ключ — значение» языком «Прогресса» (`KeyValue.cs`), портреты по
> Моране, «Чемпион» прямым (`1a2aff0`). Рулбук §0 «Философия прекрасного» и §10а «Семь классов» (`c3c903b` + этот чат); хук
> `ui-gate` (тот же `style-gate.mjs --paths`) — код модов интерфейса правится только по прочитанному рулбуку; `testcase-gate` v2.1.
> Н. **«Атрибуты»: строки кликабельны — подсветка цветом при наведении** — `[OWNER]` «Давай в атрибутах тоже изменение цветом
>    сделаем их по ховеру, а то они кликабельные, а без ховера меняющего цвет непонятно это» · ≈22:36. Как у имён богов
>    (`KrinikDevHover` в `DevotionCards.cs`) — лучше общим компонентом наведения.
> О. **ВСЕ поп-апы игры — появление и закрытие фейдом 100 мс** — `[OWNER]` «ВСЕ поп-апы в игре: можно показ делать фейдом 100мс и
>    закрытие фейдом 100мс?» · ≈22:37. Один общий механизм (CanvasGroup на корне подсказки), не по окну.
> П. **Светловид не переведён** (отношения и вмешательство по-английски, кадр `_harness/dve_sheet.webp`) — вместе с пунктом Е.
> Д. Дальше по эпику 14 — диалоги: выгрузка «Путь недеяния» 2 и 3 готова (scratchpad прошлого чата пропал — заново `dialogue_batch.py dump`).
> 1. **Ждёт слова владельца (спросить первым):** (а) кегль Gabriela в журнале «События» — лист `SvarogsDream/gallery/game/
>    2026-10-06_шрифт-мудрости/в-игре/размер_журнала_АБВ.webp` (А 60 · Б 66 · В 72, ключ рядом), правка — `Fonts.cs`/`Pages.cs`;
>    (б) новые имена `[AI]` из партий диалогов — после «да» внести в `translation/glossary.tsv`: Пожиратели (Devourers), Невольничьи
>    Доки, Остров Корен, Гусар, Король Гоблинов, Орочья Орда, Гобло-Император, Едозуб, Чернобог, Лада, Стравон, Святой Гаврило,
>    Ярило, король Кнез, Милош, Трон, Пантеон, Золотой Телец; (в) термины машинных строк вне записок: категория журнала «Прокрутка»
>    (Scroll — «Свиток», как «Свитки Философа»?), «Квест сделал», английские итоги квестов и мировые события, «Fragment of
>    Svarog's Memory», машинная подсказка «Бой»; (г) строка методички `STYLE.md` §3 «без отсмотра в игре» устарела — правит владелец.
>    (д) вкус окна персонажа (кадры `SvarogsDream/gallery/game/2026-10-06_разметка-шрифта/после/`): раскладка «список —
>    подробности» в «Атрибутах», подписи карточек `[AI]` «Боги», «Святыни», «Равновесие мира»; дальше тем же языком — большое окно
>    «Карта · Квесты · …» и инвентарь. Не видено: курсор над компасом мышью, «Посвятить» при уровне ≥ 10.
> 2. **Диалоги дальше** — эпик `plans/14_EPIC_svarog_dialogues_translation.md`, фаза 2: **2405/7731, файлов 26/353**. Шаг: `python -I
>    tools/dialogue_batch.py dump <Файл> <out>` → черновик «номер⇥русский» (методичка `STYLE.md` читается ЦЕЛИКОМ — хук) →
>    `$PY -I tools/dialogue_batch.py pack …` → `$PY -I tools/dialogue_xunity.py "D:/Games/Svarog's Dream" --add <партия>` → `bash
>    tools/translation_deploy.sh`, где `$PY=/d/work/ai_sandbox/_tools/unitypy-venv/Scripts/python.exe` (там `pymorphy3`). Проверки:
>    «ours 0» в строке `entries` выкладки (ложные срабатывания — в `translation/glossary_exceptions_dialogue.tsv` с причиной),
>    `$PY -I tools/translation_quality.py "<игра>" translation/glossary.tsv translation/quality_report.md` и `grep zz_dialogue` по
>    отчёту — пусто; перед выкладкой — проход черновика на род героя («ушёл/пришёл/готов/сам/один»; мои заплатки «ушёл… ушла» — брак).
>    Следующие крупные: `PathOfNonDoing2`/`3`, `ImpYariloSpearQuest`, `ImpYariloQuest`, `StribogPantheonQuest2`.
> 3. **Реплики людей нашим переводом в игре глазом не видены** (видена одна — пузырь коровы). Разговор открывать методом игры:
>    `h.sh "comps Interactable 8"` → `h.sh "callon \"<путь>\" Interactable Interact True"` (EXP-0155); мышь в мир в этой сессии
>    не доходила — причина не разобрана.
> 4. **Эпитафия героя** — фаза 4 эпика 14, свой сбор модом (род по полу героя, таблица падежей ~90 убийц), принято владельцем;
>    сейчас в журнале машинная («Управляемый духом для дней 4»).
> 5. **Хвосты Сварога:** баг 20 (щелчок по жителю сквозь меню); бумага окна записки по размеру текста (сейчас длинный текст
>    ужимается кеглем); идея 12 (жители замечают героя) — теория, ждёт «да» владельца.

0а. **Эпик 10 «красота меню»** — фазы 1–6 закрыты, фаза 7 («Квесты») доведена в эпике 13 (строка «Первым делом»), осталась
   фаза 8 (карта) и мелочи — `plans/10_EPIC_svarog_menu_beauty.md`, раздел «На завтра». Прошлое — `PROJECT_HISTORY.md`, запись
   2026-10-06 02:07 +03:00. До DONE бага 15 — увидеть подмену земли при ходьбе; FPS — проверить пробуждение дальних при подходе героя.
   Шейдер пересобирается: `E:\Unity\2020.3.49f1\Editor\Unity.exe -batchmode -nographics -quit -projectPath
   SvarogsDream/unity/KrinikShaders -executeMethod KrinikBuild.Bundles` (≈30 с).
0. **Svarog's Dream — переработка UI** — план и статусы `ideas/07_svarog_mods.md`; рулбук `SvarogsDream/docs/UI_RULEBOOK.md`
   ждёт «да» владельца; тикет `bugs/20`. Пути пульта: `click UI/Enablers/InfoPanel` · `UI/InfoPanel/InfoPanelHeader/<Map|Quests|
   Progress|Logs|Almanac|Help>Header` · `click UI/Enablers/CharacterPanel` · `UI/CharacterPanel/CharacterPanelHeader/<Devotion|
   Attributes|Mastery>Header`. Полный прежний текст пункта — летопись, запись 2026-10-06 14:29.
1. **Конан на 2.2.3 — хвосты переезда.** Досье, раздел «✅ 2026-10-02»: графика на 4K — глазом владельца,
   Doubled Storage Size своим модом (шаг 6а), PauseGame — вернуть, если автор перевыложит. Старая 2.1.1 удалена.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Шесть файлов в `bugs/` без метки DONE, статусы — раздел «Open bugs»
   ниже. Единственный открытый баг самого движка — 06 (`-Only` обрезает `modlist.txt`).
4. **Следующее обновление KAIF** — после прохода `node tools/kaif-update-sweep.mjs <старый бандл> <новый бандл>`,
   пока исток не закрыл #72; навыки с нашими заполнениями сливает `node tools/kaif-update-merge-skills.mjs` (#73).
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (70 случаев). Хуки (heredoc, методичка
   перевода `style-gate`) подключены в местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
6. **Palworld** — в ежедневном пользовании, правок не ждёт. Досье `games/Palworld/README.md`; три замороженных
   опыта и правила замера — `PROJECT_HISTORY.md`, запись 12.09. **Oblivion** запаркован до патча.
7. **Два линтера KAIF красные по старым долгам, не по этой сессии.** `kaif-attribution-lint` — 11 мест, где слово
   владельца пересказано без цитаты (летопись, идеи 01/04/05, план 01, `researches/conan-devkit`), базы нет;
   `kaif-scenario-lint` — 2 (`plans/02`:38, `ideas/04`:160). Чинить цитатой из архива или принять базу
   `--write-baseline` — решение следующей сессии; `check` и `check --gate-budgets` при этом зелёные.

## Open bugs

Одиннадцать файлов без метки DONE (сверено 04.10 23:38 по `ls bugs`, плюс 18 и 19; 16 и 17 закрыты в этот вечер):

- 🔴 `bugs/20_svarog_world_click_through_open_menu.md` — щелчок по жителю сквозь открытое меню начинает разговор.
- 🔧 `bugs/15_svarog_whitish_world_against_low_sun.md` — белёсость земли против солнца: причина (блик стандартного шейдера)
  подтверждена, свой матовый шейдер в моде 2.1.0, прогон pass, 0.6 принято владельцем («да, 0.6 хорошо, оставляем» ·
  ≈10:22); до DONE — увидеть подмену земли при ходьбе.
- 🔴 `bugs/14_pickcard_exact_name_pins_old_file.md` — `kumm check` держится за старый файл, если автор когда-то
  вписал версию в имя файла (Bosses My New Besties, 02.10). Баг самого движка; план починки и кейс — в документе.
- 🟢 `bugs/13_conan_checker_nexus_403_system32_curl.md` — по существу закрыт 02.10: Nexus теперь закрыт Cloudflare
  для любого curl, Nexus читает `kumm check`; осталось поправить шапку прибора.
- 🔴 `bugs/06_deploy_only_truncates_modlist.md` — `-Only` молча обрезает `modlist.txt` и выключает остальные
  моды. Баг самого движка (`Deploy-ModPack.ps1`), воспроизводится каждый раз.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — симптом снят выключением мода, причина не найдена.
- 🔧 `bugs/08_conan_config_overrides_code.md` — починено, ждёт подтверждения владельцем.
- 🔬 `bugs/04_conan_camera_microjitter.md`, `bugs/05_conan_loadasset_delayed_abort.md` — разведка, без починки.
- ✅ `bugs/11_caption_plate_sized_per_frame.md` — закрыт по классу, метки DONE нет: оформить `/check-backlog`.

## KAIF — отправка и тикеты

Отправка в KAIF — без спроса владельца (`AGENT_GUIDE.md` → Push / GitHub authentication, его слово 18.09). Открытые
тикеты в истоке (#72, #73, #78, #80–#82, полевой отчёт #79) — летопись, запись «2026-10-04 вечер».
