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
> **Svarog's Dream** — досье `games/SvarogsDream/README.md`, беклог `plans/18_svarog_backlog_checklist.md`. Правила прогона: «Железный
> человек» пишет сейв сам — после каждого своего `h.sh kill` → `bash tools/save-check.sh --restore` (точка сверки
> `_backups/svarog-saves-2026-10-11_2342-owner-exit`, 7/7) и `bash tools/reg-snap.sh restore`; время не останавливать (память
> `svarog-no-timescale-zero`); HDR, если выключал для записи, — `powershell -File tools/hdr.ps1 on`.
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
- 🧹 **Ревизия диска C 2026-10-12** — опись `C:\РЕВИЗИЯ_ДИСКА_C_2026-10-12.md`, скрипты `C:\РЕВИЗИЯ_C_2026-10-12\01…04`; владелец прогнал
      все четыре 2026-10-12 ≈20:08–20:11, свободно 30 → 179,8 ГБ; 01, 02, 04 — журналы прочитаны, 03 ещё шёл (удаление VS Build Tools 2022).
      Разведка — `researches/cleanup-2026-10-12/README.md`. **Долг** (`[OWNER]` «ладно, потом перезагружусь. Запиши в долг» · 2026-10-12):
      1. Владелец перезагружается (компонент WSL выключен, Windows ждёт перезагрузки).
      2. После — `dism /Online /Cleanup-Image /StartComponentCleanup` от администратора (в скрипте 04 DISM вернул `0x800F0806`, ждёт перезагрузки).
      3. Прочесть `C:\РЕВИЗИЯ_C_2026-10-12\03_dev_tools.log` до конца: SDK 17763/19041, .NET SDK 6/7, Python 3.12, CUDA 12.6/13.0, cuDNN;
         проверить PATH и `CUDA_*` (должен остаться только 13.3).
      4. Расширения зловреда в Chrome Default/Profile 3 и Edge ещё стоят — браузер не перечитал политику `ExtensionInstallBlocklist`:
         `chrome://policy` → «Обновить правила» (или перезапуск Chrome), Edge — при запуске; затем проверить, что папки расширений исчезли.
      5. `C:\dump\MEMORY.DMP` (8 ГБ) — скрипт 04 вопрос про него пропустил (причина не найдена); удалить — `Remove-Item C:\dump\MEMORY.DMP -Force`, если владелец скажет.
      6. Пересобрать `_tools\capture-venv` и `_tools\unitypy-venv` на Python 3.14, затем снять 3.10 и переписать PATH (`[OWNER]` «оставить
         последний, переписать PATH» · 2026-10-12). Ждут его слова: Python 3.11 (chatterbox, NGL), Unity 6000.6, список программ раздела 5 описи,
         «AliExpress»-помощники и «Fnet».
      7. Коммит записей этой ревизии и push не прошли — отказ классификатора прав; изменения добавлены к коммиту.
- 🔴 **НЕ запускать `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute`**: в карантине единственный
      экземпляр сохранения Elden Ring и личное видео `ref.mp4`.
- 🗂️ **Старые вопросы к владельцу** (уборка 17.08 — зловред, RTSS, iTunes, карантин; Palworld `LoadingRange` 25600 — на что вернуть;
      Oblivion — строки мод-листа и решейды; строка «установка не из Steam» и правило обезличивания) — летопись, запись 2026-10-12 19:22.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
      run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

> **Medieval Dynasty (на паузе) — чек-лист возврата (интервью #010, план фазы 1, KARMA К2, как гонять игру, моды пака, долг
> закрытия 16:35) — летопись, запись 2026-10-09 19:41, раздел «Перенесено из STATUS дословно».**
>
> **НОВЫЙ ЧАТ ПЕРВЫМ — озвучить владельцу беклог** (`[OWNER]` «в новом чате начнём с того. что ты мне озвучишь беклог, что сделали, что
> осталось сделать по модам и идеям» · 2026-10-12): `/check-backlog` + `plans/18_svarog_backlog_checklist.md`, `ideas/`, `bugs/` — что сделано
> и что осталось по модам и идеям, голосом (`SvarogsDream/tools/voice_say.py`, текст файлом) и коротко в чате; дальше — по слову владельца.
>
> **Svarog's Dream — демо для авторов ОТМЕНЕНО, модинг — для себя.** `[OWNER]` «значит на этом демо делать мы заканчиваем. Это не стоит
> того.» · «модинг не отменяет - отменяется демо» · «Пы продолжаем заниматься модингом для себя» · 2026-10-12 ≈19:22 (досье
> `games/SvarogsDream/README.md`, «Моды — для себя»). `[AI]` Наружу
> (сборку, ассеты, перевод) — ничего без отдельного слова владельца. Что осталось от работы над демо (чат 16:45–19:22) — приборы в сборке:
> пульт `rec` (запись кадр за кадром, ровно при любой нагрузке), `gwait`, `recwait`, `glide`/`glidexy` (курсор плавно), `areas` (перепись
> участков мира с метками Woods/Desert/Snow/Swamp…); камера `DemoOrbit`/`DemoSky`; `tools/rec_clip.sh`, `hdr.ps1`, `save-check.sh`,
> `clip_motion.py`, `demo21_*.sh/py`; дальние деревья в дымке — `Foliage.BillboardDesat 0.7`, `BillboardDarken 0.15` (вкус ждёт глаза,
> лист `SvarogsDream/_harness/d21_bb_variants.webp`). Найден и не починен шов: плашка «Осколок Памяти Сварога» висит в стороне от записки
> (`FitNotePaper`, `KrinikUIRework/Notes.cs`). Сценарий и разведка мест — `plans/23` (отменён, как справка). Уроки — EXP-0227, EXP-0228.
>
> **Новый чат ПЕРВЫМ — «?» и подсказки настроек** (`[OWNER]` «делаем знак вопроса у каждой опуции слева от ее названия» · «отной колонкой
> слева на всех страницах будет» · «есть Англ текст без перевода в подсказках» · «по чему подсказок нет - написать на основе кода и того, как
> игра работает и Юнити» · 2026-10-12). Разведка готова — `researches/svarogs-dream/settings-tips-recon.md` (что делает каждая опция по коду,
> перепись 111 опций: без «?» 50, машинный перевод 29, без перевода 25; список с английским — `settings-tips-census-2026-10-12.txt`).
> Шаги: (1) код — колонка «?» слева от названий в `SettingsLayout.cs` и новые «?» через `KrinikTip` для опций без подсказки; (2) перепись
> заново с `\n` в тексте (ключи XUnity — точный текст), перевод 54 подсказок своим словарём `_config/xunity/zz_krinik_settings.txt` по
> `translation/STYLE.md` (хук style-gate: прочитать перед записью); (3) 50 новых текстов (+ подписи «Spell Slot N -» без перевода); (4) прогон
> по `testcases/TC_svarog_settings_tips_2026-10-12.md`. Ещё: C8 ритма (флажок и список после сдвига) не проверен; стрелка героя на
> миникарте — зелёная ровная (варианты владельцу).
> Сейв: владелец закрыл игру в 16:24 — файлы его выхода в `_backups/svarog-saves-2026-10-12_1624-owner-exit`, живой сейв возвращён к точке
> сверки 7/7.
>
> **Дальше (по порядку владельца, продолжение):**
> 0. **Вода, идея 13** — `[OWNER]` «отражение грузит проц?? нельзя это просто шейдерами ГПУ делать? домики было бы хорошо отражать, постройки.
>    Может поверхность воды можно сделать какую-то приятнее?» · 2026-10-12. (а) поверхность — 3–4 варианта настроек материала `Water Swamp`
>    (рябь, блики, прозрачность, пена у берега) листом; нужен пульт `matset <материал> <свойство> <значение>` (не написан); (б) избы в воде —
>    экранное плоское отражение SSPR, только ГПУ (разведка: Ghost Recon Wildlands GDC 2017, открытые реализации под Unity), в пару к
>    дешёвой камере для гор. Разведка — `researches/svarogs-dream/water-recon.md`.
> 0а. **Баг 38** — путник бежит по дну пруда — **сильно позже** (`[OWNER]` «Баг 38: путник бежит по дну пруда. Чиним разметкой зон мира
>    (идея 14). - сильно позже» · 2026-10-12, до 19:42).
> 0б. **Макеты переработки HUD — заказаны и не показаны** (`[OWNER]` «и я не увидел переработки HUD - я заказывал макеты"» · 2026-10-12,
>    до 19:42): `ideas/15_svarog_kartochka_geroya_hud.md` — карточка героя внизу слева (шкалы, состояния над портретом), правый HUD — кнопки
>    меню и быстрые ячейки; разведка образцов (NWN, Baldur's Gate) → макеты на кадрах игры, тёмная бумага и старое золото.
>    **Сделано 2026-10-12 вечером:** три варианта листом (`SvarogsDream/gallery/game/2026-10-12_hud-макеты/`, копия в «НА ОТСМОТР НИКОЛАЕМ/7»),
>    ждёт выбора владельца → потом код в `KrinikUIRework` (шкалы — `PlayerActionBar` игры, холод — состояние `BuffID.Cold`).
>
> 2. **Близнецы прыжков** — `[OWNER]` «это тебе на тесты» · 2026-10-12: проверять самому кадрами, владельцу не нести. «Раз в секунду» над
>    интерфейсом — `MenuFonts.cs:82`, `Fonts.cs:261`, `Icons.cs:189`, `MapLayout.cs:381/384`; первым кадром, как в отчёте no-jump.
>    Разбор по коду (гипотезы) — летопись, запись 2026-10-12 19:22.
> 3. **Настройки по Esc: левую чёрную колонку меню НЕ ТРОГАТЬ** — `[OWNER]` «ну вот как БЫЛО, так и делай» · 2026-10-12 (рулбук §9, память;
>    история — летопись, запись 2026-10-12 19:22).
>    **Страницы справа от колонки — как «Управление»** (`[OWNER]` «Видео, графика, звук, гемплей - остальные настройки нужно так переделать
>    красиво!» · «с упревлением же блять сделано!» · 2026-10-12): вертикальный ритм «Видео», «Графики», «Аудио» сделан (`SettingsLayout.cs`
>    `StackRows`, выключатель `Menus.SettingsRhythm`; `testcases/TC_svarog_settings_rhythm_2026-10-12.md` — C8 флажок/список не проверен).
>    **В работе:** «?» у КАЖДОЙ опции одной колонкой слева от названия на всех страницах; английские подсказки перевести; недостающие —
>    написать по коду игры и Unity (`[OWNER]` «делаем знак вопроса у каждой опуции слева от ее названия» · «отной колонкой слева на всех
>    страницах будет» · «и там я смотрю есть Англ текст без перевода в подсказках» · «по чему подсказок нет - написать на основе кода и того,
>    как игра работает и Юнити»). Перепись 16:27 (`ListSettingsRows`): 166 опций, без «?» — 100, подсказок без перевода — 58;
>    `testcases/TC_svarog_settings_tips_2026-10-12.md`.
> 3б. **Миникарта:** яркость по умолчанию 1.5 — сделано (`[OWNER]` «миникарту по яркости 1.5 поставить» · 2026-10-12; `Hud.cs` и его конфиг).
>    **Стрелка героя на миникарте** — перерисовать зелёной, ровной, красиво (`[OWNER]` «стрелку героя на миникарте красиво перерисовать
>    зеленым, ровным» · 2026-10-12) — сначала варианты на кадре владельцу.
> 3а–4. Экран смерти (крупная красная «Продолжить»), «ОК» окон по Г2 (167 кнопок), «Перезарядка» не на портрете — сделано 2026-10-12, ждут глаза:
>    отчёты `testcases/reports/2026-10-12_svarog-death-big-red-button.md`, `…_svarog-ok-buttons.md`; окно «Выход из игры?» не трогать
>    (`[OWNER]` «тут не нужно трогать»). Подробно — летопись, запись 2026-10-12 19:22.
> 5. Дальше по порядку владельца 14:55: отражения в воде (`ideas/13`), окно разговора с портретом, баг 28, зоны мира → карта температур.
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
7. **Линтеры KAIF по старым долгам** — `kaif-attribution-lint` (база 12 мест, новых 0), `kaif-scenario-lint` (2 места эпика 15) —
   летопись, запись 2026-10-12 19:22.

## Open bugs

Файлов без метки DONE — 10 (2026-10-12 10:47: баги 36 и 37 закрыты, 38 — новый):

- 🔴 `bugs/38_svarog_traveler_runs_lake_bottom_and_vanishes.md` — путник бежит по дну водоёма; исчезание починено 2026-10-12.
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
