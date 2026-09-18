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

> **18.09 вечер — KAIF обновлён 2.5 → 2.7** (маршрут бутстрап; счётчики боя равны репетиции в песочнице,
> задания обновления совпали побайтно, деревья — с точностью до окончаний строк).
> Найден и доставлен дефект машинерии: обновление молча теряет апстримную дельту модуля, чей заголовок
> проект уже переименовал сам, — `bugs/KAIF/03_*`, [KAIF#72](https://github.com/MikalaiKryvusha/KAIF/issues/72).
> Отчёт — `reports/KAIF_UPDATES/KUMM_KAIF_2.7_UPDATE_REPORT.md`; что изменилось для владельца —
> `KAIF_FRAMEWORK.md`, раздел про 2.7; уроки — `EXP-0117` … `EXP-0119`. Второй дефект (заполнения с
> `<…>` внутри не выводятся) — [KAIF#73](https://github.com/MikalaiKryvusha/KAIF/issues/73). Новый прибор
> `tools/kaif-update-sweep.mjs` — сверка дерева с бандлом после любого обновления KAIF.

> **18.09 — разведка по патчу 2.2.0 и решение владельца заморозить Конана на неделю.** Патч вышел
> 15.09 (UE 5.8.2, Iris), моды прежней варки игра не берёт совсем. Посчитано по ЖИВОМУ составу
> сборки: **38 из 45 чужих модов пересобраны авторами за двое суток**, отставших семь и ни один не
> блокер. Заведён прибор `ConanExiles/_config/check-mod-updates.py` (Steam + Nexus, три исхода
> вместо двух). Конспект — `researches/conan-2.2.0-gotovnost/README.md`; уроки — `EXP-0115`, `EXP-0116`.

> **18.09 поздний вечер — отправка в KAIF без спроса, два стража, каденция молитвы.** Слово владельца:
> «ОТПРАВКА В KAIF ВСЕГДА РАЗРЕШЕНА И ОБЯЗАТЕЛЬНА!!!!» — полевой отчёт 2.7 ушёл как #79, тикеты #78, #80–#82.
> Два стража против моих повторяющихся ошибок: `tools/check-claim-before-evidence.mjs` в хуке коммита (время
> впереди часов, отметка `[TESTED: дата` без отчёта) и `tools/hooks/no-backslash-heredoc.mjs` в хуке Bash;
> первую версию опроверг судья, вторая проверяется `node tools/test-guards.mjs`. Каденция молитвы решена
> владельцем «да, как в KAGO»: целиком раз за сессию, дальше строка с тремя принципами. Интервью 001 закрыто.
> При закрытии STATUS подстрижен с 472 до ~200 строк: закрытое прошлое — дословно в `PROJECT_HISTORY.md` (запись 18.09
> «стрижка STATUS»), живой справочник по Конану — в новое досье `games/ConanExiles/README.md`.

---

## Where we are now

> 🎯 **Активная игра сейчас — Conan Exiles Enhanced 2.1.1** (пак `D:\work\ai_sandbox\ConanExiles`,
> подробности — досье `games/ConanExiles/README.md`). 🧊 **С 18.09 Конан ЗАМОРОЖЕН до ~25.09** — переезд на
> 2.2.x по слову владельца, работы не брать. Разведка и порядок дня переезда —
> `researches/conan-2.2.0-gotovnost/README.md` и первый раздел досье. Palworld — в
> ежедневном пользовании владельца, правок не ждёт. **Oblivion Remastered запаркован до патча —
> игры на диске нет**, не ходить туда и не предлагать по ней работу, пока владелец не скажет.

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

### 🗡️ Конан — досье `games/ConanExiles/README.md`

🧊 Заморожен до ~25.09.2026. Слово владельца 18.09: «через неделю займёмся 2.2.x — будем ставить и собирать на
ней сборку, обновлять наши моды». Всё живое по Конану — порядок дня
переезда, пак и его приборы, Dev Kit, открытые хвосты 16.09 (сейв на 21-м уровне, мерцание теней), справочник
долгов и правил, оплаченных граблями, — перенесено 18.09 из STATUS в досье дословно. Первая команда в день
переезда: `cd D:\work\ai_sandbox\ConanExiles` и `python _config/check-mod-updates.py`.

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

1. **Конан — не раньше ~25.09.** Досье `games/ConanExiles/README.md`, раздел «🧊 2026-09-18 — КОНАН ЗАМОРОЖЕН НА НЕДЕЛЮ»:
   порядок дня переезда по шагам. До этой даты работы по Конану не брать и не предлагать.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Шесть файлов в `bugs/` без метки DONE, статусы — раздел «Open bugs»
   ниже. Единственный открытый баг самого движка — 06 (`-Only` обрезает `modlist.txt`).
4. **Следующее обновление KAIF** — после прохода `node tools/kaif-update-sweep.mjs <старый бандл> <новый бандл>`,
   пока исток не закрыл #72; навыки с нашими заполнениями сливает `node tools/kaif-update-merge-skills.mjs` (#73).
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (36 случаев). Хук Bash подключён в
   местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
6. **Palworld** — в ежедневном пользовании, правок не ждёт. Досье `games/Palworld/README.md`; три замороженных
   опыта и правила замера — `PROJECT_HISTORY.md`, запись 12.09. **Oblivion** запаркован до патча.
7. **Два линтера KAIF красные по старым долгам, не по этой сессии.** `kaif-attribution-lint` — 11 мест, где слово
   владельца пересказано без цитаты (летопись, идеи 01/04/05, план 01, `researches/conan-devkit`), базы нет;
   `kaif-scenario-lint` — 2 (`plans/02`:38, `ideas/04`:160). Чинить цитатой из архива или принять базу
   `--write-baseline` — решение следующей сессии; `check` и `check --gate-budgets` при этом зелёные.

## Open bugs

Шесть файлов без метки DONE (сверено 18.09 по их собственным статусам; до этого здесь стояло «нет открытых» —
неправда):

- 🔴 `bugs/06_deploy_only_truncates_modlist.md` — `-Only` молча обрезает `modlist.txt` и выключает остальные
  моды. Баг самого движка (`Deploy-ModPack.ps1`), воспроизводится каждый раз.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — симптом снят выключением мода, причина не найдена.
- 🔧 `bugs/08_conan_config_overrides_code.md` — починено, ждёт подтверждения владельцем.
- 🔬 `bugs/04_conan_camera_microjitter.md`, `bugs/05_conan_loadasset_delayed_abort.md` — разведка, без починки.
- ✅ `bugs/11_caption_plate_sized_per_frame.md` — закрыт по классу, метки DONE нет: оформить `/check-backlog`.

Известный дефект движка, ждущий, когда его возьмут: **дрейф упаковки** — `package.json` `"files"` не включает
`Deploy-ModPack.ps1`, поэтому `npm i -g kumm` ставит половину движка (`npm pack --dry-run` → 4 файла).

## KAIF — отправка и тикеты

**Отправка в KAIF не спрашивает владельца — его слово 18.09:** «ОТПРАВКА В KAIF ВСЕГДА РАЗРЕШЕНА И ОБЯЗАТЕЛЬНА!!!!
БЕЗ ДОПОЛНИТЕЛЬНОГО ЗАПРОСА РАЗРЕШЕНИЯ У ВЛАДЕЛЬЦА!!!» Тикеты, запросы, полевые отчёты, поправки — командой
`node .kaif/kaif-core.mjs report <файл>` (`AGENT_GUIDE.md` → Push / GitHub authentication).

Открыты в истоке, все от 18.09: [#72](https://github.com/MikalaiKryvusha/KAIF/issues/72) — обновление теряет
дельту модуля с заголовком, переименованным самим проектом; [#73](https://github.com/MikalaiKryvusha/KAIF/issues/73)
— заполнения с `<…>` не выводятся; #78 — текст поставки держал полевой отчёт у владельца; #80 — шум линтера
опыта; #81 — песочница равна проходу лишь с точностью до окончаний строк; #82 — вопрос владельцу в чате не
проходит проверку археологии. Полевой отчёт 2.7 — #79. Прежний список тикетов — летопись, запись 18.09.
