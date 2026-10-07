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

> 07.10 до 21:47 — летопись, записи 2026-10-07 14:06, 17:04, 21:47 (перевод диалогов до 8181/8181, баги 22–24, окно разговора).
> **07.10, 21:54–23:21 — баги 24, 25, 27 DONE, окно выбора героя по слову владельца, перевод черт, судеб и имён** — летопись,
> запись 2026-10-07 23:21.
---

## Where we are now

> 🎯 **Medieval Dynasty — новое главное** (`[OWNER]` «и начинаем эпик по модинку моей любимой игры с ПУСТЫМ БЛЯТЬ МИРОМ -
> Medieval Dynasty! Сделаем мир ПОЛНЫМ И ЖИВЫМ!» · 2026-10-07 ≈23:35). Пак — приватный репозиторий
> `D:\work\ai_sandbox\MedievalDynasty` (github `medieval-dynasty-modpack`), README пака — устройство игры и ключ pak; игра
> 2.7.0.3 (UE 4.27) распакована в `D:\Games\Medieval Dynasty Mods\_vanilla`; UE4SS 1161 стоит и встаёт
> (`testcases/reports/2026-10-07_medieval-dynasty-ue4ss-bootstrap.md`). Эпик — ступень 1, разведка
> `researches/medieval-dynasty/living-world.md` (локальная часть готова, веб — в работе); дальше мета-план `plans/15_EPIC_*`
> и интервью владельцу о развилках. Главная находка: экономика и население считаются только для деревни игрока.
>
> **Svarog's Dream — на паузе** с 2026-10-07 (было главным по `[OWNER]` «в новом чате продолжим со Сварог Дрим» ·
> 2026-10-05 ≈20:55): досье `games/SvarogsDream/README.md`; передача дел — блок «Первым делом» ниже.
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

> **«Мастерство» (C46–C82 — `testcases/TC_svarog_owner_batch_2026-10-06_evening.md`; блок целиком — летопись, запись 2026-10-07 14:06):**
> открыто — C63 и C60 в игре не проверены, прогон 00:35–00:45 без отчёта в `testcases/reports/`, метки кода `[NOT-TESTED]`.
> **Перевод правится в источнике** (`translation/*_ru.tsv`, `help_ru.py`), не в `zz_*.txt`. П. 31 ideas/07 ждёт `interviews/interview_007_*`.
> Перед прогоном в игре — случаи `[NOT-TESTED]` в TC (хук `testcase-gate`); код модов интерфейса — после `SvarogsDream/docs/UI_RULEBOOK.md`
> целиком (хук `ui-gate`). Игру, в которой владелец, не закрывать (память `dont-kill-game-owner-is-in`).
> **Ждёт владельца:** Г — порядок в настройках главного меню (кадр `SvarogsDream/_harness/owner_settings.webp`, семь бед 21:33); вкус — лист HUD рукописным
> (`SvarogsDream/gallery/game/2026-10-06_hud-рукописный/было-стало.webp`, вне git), тексты Единого Бога и Световида (`zz_krinik.txt`, блок
> «Преданность»), окно настроек модов, подвал «Мастерства», бумага записки (лист `SvarogsDream/_harness/note_sheet.webp`).
> 1. **Ждёт слова владельца (спросить первым):** (а) кегль Gabriela в журнале «События» — лист `SvarogsDream/gallery/game/
>    2026-10-06_шрифт-мудрости/в-игре/размер_журнала_АБВ.webp` (А 60 · Б 66 · В 72, ключ рядом), правка — `Fonts.cs`/`Pages.cs`;
>    (б) имена: все принятые стоят в `translation/glossary.tsv` с цитатой владельца; ждущих нет (последние — 57 героев выбора:
>    `[OWNER]` «перевод» · 2026-10-07, до 23:08; прозвища-роли — STYLE §1 п. 10). Новое имя из партии — сразу владельцу
>    табличкой «английский | русский | где», после «да» — в глоссарий. Маска-клад: баг-репорт на форуме Steam
>    (steamcommunity.com/app/2004640/discussions/0/581684470096116760/) — проверить ответ разработчика (lynxbird); починит сам —
>    снять галочку `Fixes.MaskPayout` мода `KrinikFixes`; (в) термины машинных строк вне записок: категория журнала «Прокрутка»
>    (Scroll — «Свиток», как «Свитки Философа»?), «Квест сделал», английские итоги квестов и мировые события, «Fragment of
>    Svarog's Memory», машинная подсказка «Бой»; (г) строка методички `STYLE.md` §3 «без отсмотра в игре» устарела — правит владелец.
>    (д) вкус окна персонажа (кадры `SvarogsDream/gallery/game/2026-10-06_разметка-шрифта/после/`): раскладка «список —
>    подробности» в «Атрибутах», подписи карточек `[AI]` «Боги», «Святыни», «Равновесие мира»; дальше тем же языком — большое окно
>    «Карта · Квесты · …» и инвентарь. Не видено: курсор над компасом мышью, «Посвятить» при уровне ≥ 10.
> 2. **Диалоги переведены целиком — 8230/8230** (фазы 2–3 эпика 14 + реплики героя, баг 27 DONE 22:18). Баги 24 (и мигание шрифтов
>    главного меню при запуске), 25 (рецепт и рассказ — тёмная бумага) — DONE, отчёт `testcases/reports/2026-10-07_svarog-bugs-24-27.md`.
>    **Окно выбора героя** (после смерти, у Велеса) переделано по слову владельца 22:28–23:10 (ideas/07, раздел «Окно выбора нового
>    героя»; `testcases/TC_svarog_hero_select_2026-10-07.md`, C1–C10): карточки, медь, пары, градиент, поп-ап черт, перевод черт,
>    судеб и 62 имён (`zz_selection.txt`). Проверять так: `run-game.sh` → `callon …/Veles Interactable Interact True` → вариант
>    «вернуть» → «Ясно»; героя НЕ выбирать (`[OWNER]` «героя не выбирай, а то вновь умирать придётся»). Не прогнан контроль C6;
>    прозвища после правок 23:18 («рыбак», «танцор», «попрошайка»…) в игре не видены; «друид» остаётся (`[OWNER]` «остальные ок»);
>    портреты — `SvarogsDream/art/heroes_avatars_original/` (вне git) — владелец раскрашивает их ИИ, потом заменить ими портреты в игре.
>    Дальше: 🔧 **баг 26** — правка порядка холста пузыря стоит, у частокола не видена: в сейве владельца герой душой в подземном мире;
>    проверить, когда герой жив у Бора (шаги — в `bugs/26_*`). 🔴 **баг 28** — 1106 строк кода игры вне всех словарей (Войны фракций,
>    «Преданность», беседы с богами, советы загрузки, учителя): разбор `translation/text_census.tsv` (прибор `tools/text_census.py`),
>    потом перевод партиями. Эпик 14 к закрытию (`/check-backlog`: критерии 1–3 выполнены, 5 — частично). В инвентаре
>    «Дальность атаки» со строчной при «Скорость Атаки». Новая реплика игры → партией: порядок из пяти шагов и тексты из данных
>    игры — досье `games/SvarogsDream/README.md`, раздел «Перевод диалогов партией».
> 3. **Игру вожу сам:** `tools/run-game.sh` · разговор `h.sh 'callon "<путь>" Interactable Interact True'` · ходьба
>    `tools/keys.ps1 -Key W -Ms 1500` · сумка владельца на Tab · проверка словаря на месте — `h.sh "settext <путь текста> <англ.>"` +
>    `gettext`; закрывать `h.sh "kill"`. Окно разговора теперь: ответы Gabriela старым золотом, речь жителя Gabriela, подписи-действия
>    Manrope (голубые #66CCFF, «(Уйти)» красная), под курсором светлеют в своём тоне — увидено, вкус владельца ещё не сказан.
> 4. **Эпитафия героя** — собрана модом (`0661612`, план 14 Э-1/Э-2, предпросмотр `latin 0`); в игре не видены смерть от врага
>    своим ходом и запись «новый герой».
> 5. **Хвосты Сварога:** идея 12 (жители замечают героя) — теория,
>    ждёт «да» владельца; ideas/07 «увидел агент сам» — открыты окно предмета (описание мастерской обрезано) и сравнение
>    (колонки под рамкой) — не перепроверены.

0а. **Эпик 10 «красота меню»** — фазы 1–6 закрыты, фаза 7 («Квесты») доведена в эпике 13 (строка «Первым делом»), осталась
   фаза 8 (карта) и мелочи — `plans/10_EPIC_svarog_menu_beauty.md`, раздел «На завтра». Прошлое — `PROJECT_HISTORY.md`, запись
   2026-10-06 02:07 +03:00. До DONE бага 15 — увидеть подмену земли при ходьбе; FPS — проверить пробуждение дальних при подходе героя.
0. **Svarog's Dream — переработка UI** — `ideas/07_svarog_mods.md`; рулбук `SvarogsDream/docs/UI_RULEBOOK.md` ждёт «да» владельца;
   пути пульта к окнам — летопись, запись 2026-10-07 21:47.
1. **Конан на 2.2.3 — хвосты переезда.** Досье, раздел «✅ 2026-10-02»: графика на 4K — глазом владельца,
   Doubled Storage Size своим модом (шаг 6а), PauseGame — вернуть, если автор перевыложит. Старая 2.1.1 удалена.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Одиннадцать файлов в `bugs/` без метки DONE, статусы — раздел «Open bugs»
   ниже. Единственный открытый баг самого движка — 06 (`-Only` обрезает `modlist.txt`).
4. **Следующее обновление KAIF** — после прохода `node tools/kaif-update-sweep.mjs <старый бандл> <новый бандл>`,
   пока исток не закрыл #72; навыки с нашими заполнениями сливает `node tools/kaif-update-merge-skills.mjs` (#73).
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (98 случаев). Хуки (heredoc, методичка
   перевода `style-gate`, `testcase-gate` v2.2, `ui-gate`, `stamp-gate`) подключены в местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
6. **Palworld** — в ежедневном пользовании, правок не ждёт. Досье `games/Palworld/README.md`; три замороженных
   опыта и правила замера — `PROJECT_HISTORY.md`, запись 12.09. **Oblivion** запаркован до патча.
7. **Два линтера KAIF красные по старым долгам, не по этой сессии.** `kaif-attribution-lint` — 11 мест, где слово
   владельца пересказано без цитаты (летопись, идеи 01/04/05, план 01, `researches/conan-devkit`), базы нет;
   `kaif-scenario-lint` — 2 (`plans/02`:38, `ideas/04`:160). Чинить цитатой из архива или принять базу
   `--write-baseline` — решение следующей сессии; `check` и `check --gate-budgets` при этом зелёные.

## Open bugs

Одиннадцать файлов без метки DONE (сверено 2026-10-07 23:21 по `ls bugs | grep -v DONE`):

- 🔴 `bugs/28_svarog_code_strings_outside_all_dictionaries.md` — 1106 строк кода игры вне всех словарей (класс бага 27).
- 🔧 `bugs/26_svarog_palisade_covers_speech_bubbles.md` — частокол над пузырями: порядок холста 30000 стоит, у частокола не видено.
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
