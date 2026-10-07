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

> **07.10, ночь 23:47–01:37** — замечания владельца в живой игре (C46–C82): «Сделано» — летопись, запись 2026-10-07 01:37 +03:00; открытое — блок «Where to continue».
> **07.10, утро 09:31–11:18** — ideas/07 п. 30 (золото полностью, «Золото · Вес» без подложек — слово владельца), п. 32 («?» у 15 цифр
> статов), п. 33 (срез), п. 34 (тире 670 → 0, правка ТОЛЬКО в источниках `translation/*_ru.tsv`/`help_ru.py`, прибор `tools/dash_src.py`),
> п. 31 начат (100 ячеек, полоса со стрелками, колесо по ряду; не проверены стрелки, ползунок, перетаскивание, «Сортировать» — C20–C22);
> перевод начала игры 2405 → 2618/7731 (предыстории, Янко, VelesQuest1, VelesUnderworld1–5). Имена Марко, Янко, Йован и «Неужто и это
> из памяти твоей ушло?» приняты владельцем (глоссарий, STYLE). Хуки KUMM: `stamp-gate` (новый), `testcase-gate` v2.2, `style-gate` знает
> `dash_src.py apply`. Отчёты — `testcases/reports/2026-10-07_svarog-inventory-*`. Новый чат — продолжать перевод (`[OWNER]` «продолжаем
> переводы делать в новом чате» · ≈11:17), очередь — пункт 2 «Диалоги дальше».
> ⚠️ Force-closed 2026-10-07 11:18 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first /end-chat-soft pays this debt.
> Standing falsehood: none (комментарий `SvarogsDream/src/KrinikUIRework/Hud.cs:258` «102 слота» исправлен на 50 в этом закрытии).
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
      Доводы из практики (Palworld `r.ViewDistanceScale` в четырёх местах; Конан — соперник сама игра) — летопись,
      запись 2026-10-06 23:38, раздел «Доводы к пункту Engine.ini».

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

> **Открыто по «Мастерству» (C-случаи — `testcases/TC_svarog_owner_batch_2026-10-06_evening.md`):** шкала и деревья — левый конец
> полосы на краю экрана, у всех 14 одинаково (C73–C74, слово владельца); «?» души — своей подсказкой KrinikTip, починен (C75,
> `e30186f`; другие «?» подвала — по тому же пути); описание класса по наведению на имя — тоже KrinikTip, без чёрной полосы
> (C76–C78, у всех 14, всегда вниз; KrinikTip снимает экземпляры прошлых сборок); цвета автора в подсказках — по выбору владельца
> с листа `SvarogsDream/gallery/game/2026-10-07_цвета-подсказок/варианты.webp`: красный #FF4A4A, фиолетовый #BF6AFF, светлые тона
> автора как есть, ВСЕ цветные слова жирным (рулбук §6а п. 5, C79–C82, `09f4ec0`); C63 (пары карточки «Гнев Перуна» в одну строку) и C60
> (имена богов по схеме подсветки) — в игре не проверены. Прогон «Мастерства» 00:35–00:45 без отчёта в `testcases/reports/` —
> метки кода `[NOT-TESTED]`. `zz_glossary.txt` генерируется `glossary_fix.py`, а строку 599 («{{A}} −») я правил скриптом — сверить
> после следующей выкладки (сделано 07.10 утром: минус автора правилом в `glossary_fix.py`).
> **07.10 утро, инвентарь (ideas/07 п. 30–34; отчёт `testcases/reports/2026-10-07_svarog-inventory-gold-stat-tips.md`, всё pass):**
> золото и плашки «Золото · Вес», «?» у 15 цифр статов, остатки п. 33 и п. 34 (637 тире) — в их строках ideas/07. **Перевод правится
> в источнике** (`translation/*_ru.tsv`, `help_ru.py`), не в `zz_*.txt`. П. 31 ждёт `interviews/interview_007_svarog_inventory_x2.md`.
> **Пачка владельца (план 21:39) — сделана в чате 21:44–23:25, затем автономно до 23:38.** Случаи и итоги — `testcases/TC_svarog_owner_batch_2026-10-06_evening.md`
> (C1–C68, K1–K3); прогон окна настроек — `testcases/reports/2026-10-06_svarog-modmenu-theme-hover.md`. Перед прогоном в игре — случаи
> `[NOT-TESTED]` в TC и записанный итог прошлого прогона (хук `testcase-gate` v2.1); правка кода модов интерфейса — после чтения
> `SvarogsDream/docs/UI_RULEBOOK.md` целиком (хук `ui-gate`; §0 «Философия прекрасного», §10а «Семь классов просьб» — искать самому).
> Игру, в которой владелец, не закрывать (память `dont-kill-game-owner-is-in`).
> **Ждёт владельца:** Г — порядок в настройках главного меню (кадр `SvarogsDream/_harness/owner_settings.webp`, семь бед 21:33); вкус — лист HUD рукописным
> (`SvarogsDream/gallery/game/2026-10-06_hud-рукописный/было-стало.webp`, вне git), тексты Единого Бога и Световида (`zz_krinik.txt`, блок
> «Преданность»), окно настроек модов, подвал «Мастерства», бумага записки (лист `SvarogsDream/_harness/note_sheet.webp`).
> Д. Дальше по эпику 14 — диалоги: выгрузка «Путь недеяния» 2 и 3 готова (scratchpad прошлого чата пропал — заново `dialogue_batch.py dump`).
> 1. **Ждёт слова владельца (спросить первым):** (а) кегль Gabriela в журнале «События» — лист `SvarogsDream/gallery/game/
>    2026-10-06_шрифт-мудрости/в-игре/размер_журнала_АБВ.webp` (А 60 · Б 66 · В 72, ключ рядом), правка — `Fonts.cs`/`Pages.cs`;
>    (б) новые имена `[AI]` из партий диалогов — после «да» внести в `translation/glossary.tsv`: Пожиратели (Devourers), Невольничьи
>    Доки, Остров Корен, Гусар, Король Гоблинов, Орочья Орда, Гобло-Император, Едозуб, Чернобог, Лада, Стравон, Святой Гаврило,
>    Ярило, король Кнез, Милош, Трон, Пантеон, Золотой Телец; 07.10 днём: Железный Отряд (Iron Squad), Марьян, Яра, Император Троян,
>    Троянов Город, корчма «Долгий Путь» (A Long Road Inn), подпись варианта «(Наводка на Квест)» (Quest Direction); (в) термины машинных строк вне записок: категория журнала «Прокрутка»
>    (Scroll — «Свиток», как «Свитки Философа»?), «Квест сделал», английские итоги квестов и мировые события, «Fragment of
>    Svarog's Memory», машинная подсказка «Бой»; (г) строка методички `STYLE.md` §3 «без отсмотра в игре» устарела — правит владелец.
>    (д) вкус окна персонажа (кадры `SvarogsDream/gallery/game/2026-10-06_разметка-шрифта/после/`): раскладка «список —
>    подробности» в «Атрибутах», подписи карточек `[AI]` «Боги», «Святыни», «Равновесие мира»; дальше тем же языком — большое окно
>    «Карта · Квесты · …» и инвентарь. Не видено: курсор над компасом мышью, «Посвятить» при уровне ≥ 10.
> 2. **Диалоги дальше** — эпик `plans/14_EPIC_svarog_dialogues_translation.md`, фаза 2: **2970/7731, файлов 77/353** (07.10 днём: Велес 6–10 и
   смерти, разбойники, охота, руины, культист, Диоген, лавки и корчмы). Шаг: `python -I
>    tools/dialogue_batch.py dump <Файл> <out>` → черновик «номер⇥русский» (методичка `STYLE.md` читается ЦЕЛИКОМ — хук) →
>    `$PY -I tools/dialogue_batch.py pack …` → `$PY -I tools/dialogue_xunity.py "D:/Games/Svarog's Dream" --add <партия>` → `bash
>    tools/translation_deploy.sh`, где `$PY=/d/work/ai_sandbox/_tools/unitypy-venv/Scripts/python.exe` (там `pymorphy3`). Проверки:
>    «ours 0» в строке `entries` выкладки (ложные срабатывания — в `translation/glossary_exceptions_dialogue.tsv` с причиной),
>    `$PY -I tools/translation_quality.py "<игра>" translation/glossary.tsv translation/quality_report.md` и `grep zz_dialogue` по
>    отчёту — пусто; перед выкладкой — проход черновика на род героя («ушёл/пришёл/готов/сам/один»; мои заплатки «ушёл… ушла» — брак).
>    Очередь — путь игрока (`[OWNER]` «попереводим то, что близко в начале игры к игроку» · 2026-10-07 ≈10:55; порядок — `QuestID.cs`):
>    дальше `PathOfNonDoing2`/`3`, `ImpYarilo*`, прочие торговцы (`HedgehogTrader`, `TraderHanibal`, Корен, Змеевода). Подписи вариантов
>    «(Уйти)», «(Торговля)»… генератор красит цветом игры сам, `tools/dialogue_keycheck.py` в выкладке (баг 21, EXP-0163).
> 3. **Реплики людей нашим переводом в игре глазом не видены** (видена одна — пузырь коровы); случаи готовы —
   `testcases/TC_svarog_dialogue_translation_2026-10-07.md` D3–D5, K1 (Диоген у Бора: русская реплика, «(Уйти)» красным). Разговор открывать методом игры:
>    `h.sh "comps Interactable 8"` → `h.sh "callon \"<путь>\" Interactable Interact True"` (EXP-0155); мышь в мир в этой сессии
>    не доходила — причина не разобрана.
> 4. **Эпитафия героя** — фаза 4 эпика 14, свой сбор модом (род по полу героя, таблица падежей ~90 убийц), принято владельцем;
>    сейчас в журнале машинная («Управляемый духом для дней 4»).
> 5. **Хвосты Сварога:** идея 12 (жители замечают героя) — теория,
>    ждёт «да» владельца; ideas/07 «увидел агент сам» — открыты окно предмета (описание мастерской обрезано) и сравнение
>    (колонки под рамкой) — не перепроверены. После серии горячих перезагрузок межстрочный подсказок был выше (648 против
>    464 ≈ 1.2²; `[AI]` гипотеза — множитель копится, не проверена) — вкус подсказок судить после чистого перезапуска игры (C45).

0а. **Эпик 10 «красота меню»** — фазы 1–6 закрыты, фаза 7 («Квесты») доведена в эпике 13 (строка «Первым делом»), осталась
   фаза 8 (карта) и мелочи — `plans/10_EPIC_svarog_menu_beauty.md`, раздел «На завтра». Прошлое — `PROJECT_HISTORY.md`, запись
   2026-10-06 02:07 +03:00. До DONE бага 15 — увидеть подмену земли при ходьбе; FPS — проверить пробуждение дальних при подходе героя.
   Шейдер пересобирается: `E:\Unity\2020.3.49f1\Editor\Unity.exe -batchmode -nographics -quit -projectPath
   SvarogsDream/unity/KrinikShaders -executeMethod KrinikBuild.Bundles` (≈30 с).
0. **Svarog's Dream — переработка UI** — план и статусы `ideas/07_svarog_mods.md`; рулбук `SvarogsDream/docs/UI_RULEBOOK.md`
   ждёт «да» владельца. Пути пульта: `click UI/Enablers/InfoPanel` · `UI/InfoPanel/InfoPanelHeader/<Map|Quests|
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
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (94 случая). Хуки (heredoc, методичка
   перевода `style-gate`, `testcase-gate` v2.2, `ui-gate`, `stamp-gate`) подключены в местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
6. **Palworld** — в ежедневном пользовании, правок не ждёт. Досье `games/Palworld/README.md`; три замороженных
   опыта и правила замера — `PROJECT_HISTORY.md`, запись 12.09. **Oblivion** запаркован до патча.
7. **Два линтера KAIF красные по старым долгам, не по этой сессии.** `kaif-attribution-lint` — 11 мест, где слово
   владельца пересказано без цитаты (летопись, идеи 01/04/05, план 01, `researches/conan-devkit`), базы нет;
   `kaif-scenario-lint` — 2 (`plans/02`:38, `ideas/04`:160). Чинить цитатой из архива или принять базу
   `--write-baseline` — решение следующей сессии; `check` и `check --gate-budgets` при этом зелёные.

## Open bugs

Одиннадцать файлов без метки DONE (сверено 04.10 23:38 по `ls bugs`, плюс 18 и 19; 16 и 17 закрыты в этот вечер):

- 🔧 `bugs/21_svarog_option_labels_lose_colour.md` — подписи вариантов в нашем переводе теряли цвет автора; генератор починен
  (SvarogsDream `e2e6713`), ключи 23/23; до DONE — увидеть в игре (D3–D5, K1).
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
