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

> 07–08.10 и Medieval Dynasty до паузы; Сварог 09.10 день и небо до 10.10 02:03 — летопись, запись 2026-10-10 03:38; сессия 10.10 с 14:37 — запись 2026-10-10 16:31. Сварог: вечер 10.10 (18:46–21:48) и карта потока эпика 19 — летопись, запись 2026-10-11 00:46; чат с 2026-10-10 23:42 — там же.
---

## Where we are now

> 🎯 **Svarog's Dream — главное с 2026-10-09** (`[OWNER]` «забей на Medieval Dynasty … мы работаем дальше над Сварогом» · ≈13:25;
> масштаб: 16:9 на 720p, 1080p, 2K, 4K — `MASTER_PLAN.md`). Medieval Dynasty — на паузе, абзац ниже — для возврата.
>
> **Medieval Dynasty (на паузе)** — пак `D:/work/ai_sandbox/MedievalDynasty`, эпик 15 (`plans/15_…`, фаза 0 — `plans/16_…`),
> баг 29 (HDR) открыт; чек-лист возврата — летопись, записи 2026-10-09 19:41 и 2026-10-10 03:38.
>
> **Svarog's Dream — снова в работе** с 2026-10-09 (`[OWNER]` «продолжаем делать Сварог Дрим» · «грумим беклог, смотрим, какие
> простбы, баги, идеи остались не выполнеными, обсуждаем» · до 08:32): досье `games/SvarogsDream/README.md`; передача дел — летопись,
> запись 2026-10-08 02:20; **беклог после груминга 09.10 — чек-лист `plans/18_svarog_backlog_checklist.md`** (идти по нему). Medieval Dynasty при этом не закрыт (интервью #010 отвечено 2026-10-11: меню модов — панель справа, F10).
> **Ночь 2026-10-10 01:31–03:36** (баг 32, экран карты, небо, фаза 1 эпика 19, «Преданность», судьи ночи) — летопись, запись
> 2026-10-10 16:26 («перенесено из STATUS дословно»).
> - **Режим «Железного человека»** пишет сейв сам (выход, таймер, смерть); выход в главное меню и обычный выход тоже пишут сейв.
>   **Время НЕ останавливать** (`[OWNER]` «заебал ты с этой остановкой времени!!! ты много неправильно делаешь и снимаешь, когда его
>   останавливаешь!» · 2026-10-11): ночь — часами при идущем времени в городе, ждать ≥ 12 с; защита героя — копия сейва и откат
>   (память `svarog-no-timescale-zero`).
> - Точка сверки сейва — `_backups/svarog-saves-2026-10-10_2357-state` (все прогоны 2026-10-11 сверены с ней, 7/7); реестр — 1280/720/1.
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
- [ ] **A real `help` command** — the switch block, the header comment (lines 18–28) and the README
      table are three hand-maintained copies of one list. One source, the rest generated or checked.
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

> **Medieval Dynasty (на паузе) — чек-лист возврата (интервью #010, план фазы 1, KARMA К2, как гонять игру, моды пака, долг
> закрытия 16:35) — летопись, запись 2026-10-09 19:41, раздел «Перенесено из STATUS дословно».**
>
> **Svarog's Dream — НОВЫЙ ЧАТ (передача 2026-10-11 17:44, чат с 16:20).** `[OWNER]` «засетаешь их в игру, и закроешь чат» · 2026-10-11.
> Первым делом — спросить владельца о листах портретов (он отсматривает «было | стало» и называет по именам, кого перерисовать).
> Правила дня — как раньше: время не останавливать; после прогона `kill`, сейв 7/7 против `_backups/svarog-saves-2026-10-10_2357-state`
> (выход в меню, обычный выход и «Новая игра» ПЕРЕПИСЫВАЮТ сейв — откат из копии); **реестр экрана игра уводит в 4K из своих настроек
> («Разрешение экрана 3840x2160» в «Видео») — после прогона ставить 1280×720 / 1 руками** (`Set-ItemProperty HKCU:\Software\VI Games\Svarog's Dream`
> `'Screenmanager Resolution Width_h182942802' 1280`, `Height_h2627697771 720`); время в тексте — из `date`.
>
> **Сделано в этом чате:** BepInEx CM PR #127 — ревью ManlyMarco отработано (общая ширина, `5f1cddf`, ответ и закрытие ветки ревью),
> ждёт его слова; настройки в игре больше не прыгают при переключении (`SettingsLayout.cs`, отчёт `testcases/reports/2026-10-11_svarog-settings-no-jump.md`);
> **портреты героев**: Gemini через отладочный Chrome :9223 (профиль `%LOCALAPPDATA%\aistudio-cdp\profile`, владелец вошёл; AI Studio
> закрыл модели картинок за планом — работает приложение gemini.google.com), эталон Adam v13 («во, вот это супер»), таблица промптов
> `SvarogsDream/art/heroes_color_prompts.tsv` (возраст/пол из данных игры `art/heroes.tsv`, волосы/глаза — по оригиналу), раскрашено
> **39 из 62** (с 40-го Radovan — дневной лимит: «Лимит сбросится в 2:38 PM»); в игре — модуль `KrinikUIRework/HeroPortraits.cs`,
> файлы `<игра>/krinik_portraits/*.jpg`, журнал `portraits: 39 colored` — **глазом в игре цветной портрет НЕ видели** (выбор героя — в
> прологе у Дуба Жизни, TC `testcases/TC_svarog_hero_portraits_2026-10-11.md` C2b blocked). Листы — `SvarogsDream/gallery/game/2026-10-11_портреты-было-стало/`.
>
> **Ждёт глаза владельца (с утра 2026-10-11):** налёт золота часов 0.35; звук `skill_up`; боевые надписи ×1.5 и по-русски; крестик «Уйти»
> вкладкой; дым ночью ×0.25; баг 15 (белёсость против солнца). Когда выйдет релиз CM — проверить окно настроек модов и убрать наш
> транспайлер ширины числа (`KrinikModMenu/Plugin.cs`, `NumberWidthTranspiler`).
>
> **Дальше:**
> 1. **Портреты (вечер 2026-10-11):** владелец назвал 22 героя на перерисовку, v1 НЕ удалять — новые ложатся рядом «<имя> v2.webp».
>    Классы правил промпта К1–К8 — `researches/svarogs-dream/gemini-avatar-coloring.md` («Классы правил v2», итоги тройки); поправки
>    героев — столбцы `skin`/`notes`/`look_age` в `art/heroes_color_prompts.tsv`; принятые версии — `art/heroes_avatars_color/_chosen.tsv`
>    (Андрей v2, Ясен v3, Коста v7). Прогон — очередь `bash tools/redraw_queue.sh _harness/color/queue19.txt` (строка `<n> <версия>
>    [ПЕРЕМ=…]`), лист «оригинал | v1 | новая» открывается владельцу сам; все версии героя — `python tools/portrait_variants.py`.
>    Вкладка второго аккаунта — `GEMINI_TAB=/u/1/`. Остановить прогон — `TaskStop` и `kill` ТОЛЬКО его PID (никогда `taskkill /IM
>    node.exe`: 2026-10-11 это уложило pm2 владельца с ndim-server-prod). Потом 40–62 (`color_heroes.sh 40 62`), затем
>    `python tools/portraits_sheet.py <папка>` и JPEG в `krinik_portraits` по `_chosen.tsv`.
>    Увидеть портрет в игре: дойти в прологе до Дуба Жизни на КОПИИ сейва (или найти экран, где игра показывает `characterImage`).
> 2. **Близнецы прыжков** (`[OWNER]` «как со многими другими вещами было - прыгало»): «раз в секунду» над интерфейсом — `MenuFonts.cs:82`,
>    `Fonts.cs:261`, `Icons.cs:189`, `MapLayout.cs:381/384`; проверить первым кадром, как в отчёте no-jump.
> 3. **Главная колонка страниц настроек → вкладки сверху**: два макета на кадрах `_harness/mt_*.webp` (А — колонка прячется, кисть на её
>    место, два ряда вкладок и «‹ Меню»; Б — окно по центру поверх мира) — владельцу на выбор. Подвкладки сверху уже сделаны 10.10.
> 4. Шов: пузырь реплики жителя уходит под чёрную колонку меню по Esc (кадр `_harness/mt_menu.webp`).
> 5. Дальше по порядку владельца 14:55: отражения в воде (`ideas/13`), окно разговора с портретом, баг 28, зоны мира → карта температур.
>
> Долг: линтер происхождения — 33 старых замечания (план 15 — 30, приёмка владельцем; интервью #008, летопись, шаблон канона — по 1).
>
> **Svarog's Dream — ждёт слова владельца (после ночи 2026-10-10):**
> 5. **Перевод:** баг 28 — остаток 79 склеек (2026-10-11; эпитафии — только смертью героя на КОПИИ сейва при владельце), `bugs/28_…`.
>    38 имён — приняты владельцем 2026-10-11 (интервью #012), в глоссарии.
> 6. **«Преданность»:** «Перезарядка» поверх портрета — контур не лёг (C4 fail, откатано), план 18; вкус места — владелец.

1. **Конан на 2.2.3 — хвосты переезда.** Досье, раздел «✅ 2026-10-02»: графика на 4K — глазом владельца,
   Doubled Storage Size своим модом (шаг 6а), PauseGame — вернуть, если автор перевыложит. Старая 2.1.1 удалена.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Девять файлов в `bugs/` без метки DONE (2026-10-11 14:50), статусы — раздел «Open bugs»
   ниже. Открытые баги самого движка — 06 (`-Only` обрезает `modlist.txt`) и 14 (`kumm check` держится за старый файл).
4. **Следующее обновление KAIF** — после прохода `node tools/kaif-update-sweep.mjs <старый бандл> <новый бандл>`,
   пока исток не закрыл #72; навыки с нашими заполнениями сливает `node tools/kaif-update-merge-skills.mjs` (#73).
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (138 случаев). Хуки (heredoc, методичка
   перевода `style-gate`, `testcase-gate` v2.4, `ui-gate`, `stamp-gate` v2 — и на командах оболочки) подключены в местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
6. **Palworld** — в ежедневном пользовании, правок не ждёт. Досье `games/Palworld/README.md`; три замороженных
   опыта и правила замера — `PROJECT_HISTORY.md`, запись 12.09. **Oblivion** запаркован до патча.
7. **Линтеры KAIF по старым долгам.** `kaif-attribution-lint` — `[AI]` база принята 2026-10-10 (`.kaif/attribution-lint.baseline.json`,
   12 мест: летопись, идеи 01/04/05, план 01, `researches/conan-devkit`; два сегодняшних места переписаны цитатой и «решать владельцу»);
   новых 0 — любое новое место без цитаты краснеет, долг только уменьшается. `kaif-scenario-lint` — форма поправлена 2026-10-10
   (идеи 04, 13, план 02, пустые строки между сценариями эпика 15); осталось 2 — сценарии эпика 15 без конкретного значения
   (`plans/15`:173, 186): числа дают замеры фазы 0 Medieval Dynasty, выдумывать нельзя.

## Open bugs

Файлов без метки DONE — 9 (сверено 2026-10-11 14:50 по `ls bugs | grep -v DONE`; баг 35 закрыт 14:50 словом владельца):
- 🔴 `bugs/29_md_hdr_menu_washed_after_auto_hdr.md` — HDR: Auto HDR выключен для exe, мир принят, инвентарь (UI) пересвечен.
- 🔴 `bugs/28_svarog_code_strings_outside_all_dictionaries.md` — строки кода игры вне всех словарей (класс бага 27): 1106 → 65 → 192 → **79**
  (2026-10-11 00:13: подстановки переведены, остались склейки; пять близнецов в правилах XUnity починены); C7 перевода богов в игре не прогнан.
- 🔧 `bugs/15_svarog_whitish_world_against_low_sun.md` — белёсость земли против солнца: причина (блик стандартного шейдера)
  подтверждена, свой матовый шейдер в моде 2.1.0, прогон pass, 0.6 принято владельцем («да, 0.6 хорошо, оставляем» ·
  ≈10:22); до DONE — увидеть подмену земли при ходьбе.
- 🔴 `bugs/14_pickcard_exact_name_pins_old_file.md` — `kumm check` держится за старый файл, если автор когда-то
  вписал версию в имя файла (Bosses My New Besties, 02.10). Баг самого движка; план починки и кейс — в документе.
- 🔴 `bugs/06_deploy_only_truncates_modlist.md` — `-Only` молча обрезает `modlist.txt` и выключает остальные
  моды. Баг самого движка (`Deploy-ModPack.ps1`), воспроизводится каждый раз.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — симптом снят выключением мода, причина не найдена.
- 🔧 `bugs/08_conan_config_overrides_code.md` — починено, ждёт подтверждения владельцем.
- 🔬 `bugs/04_conan_camera_microjitter.md`, `bugs/05_conan_loadasset_delayed_abort.md` — разведка, без починки.

## KAIF — отправка и тикеты

Отправка в KAIF — без спроса владельца (`AGENT_GUIDE.md` → Push / GitHub authentication, его слово 18.09). Открытые
тикеты в истоке (#72, #73, #78, #80–#82, полевой отчёт #79) — летопись, запись «2026-10-04 вечер».
