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

> **НОВЫЙ ЧАТ ПЕРВЫМ — HUD Сварога по идее 15 (продолжение).** Всё, что владелец накидал, дословно — `ideas/15_svarog_kartochka_geroya_hud.md`
> (раздел «План», «Доработки по слову владельца», «К Ф2»); тест-кейсы с итогами — `testcases/TC_svarog_hero_card_2026-10-12.md` (C1–C29).
> **Ф1 сделана 2026-10-12 20:37–21:16** (SvarogsDream `dab207b`, `de67962`; правки 21:15 — пульс фона нежнее, нули статов темнее — выложены,
> в коммите закрытия): карточка героя внизу слева — портрет (скругление, тонкая рамка), «Ева», «Уровень N», значок класса с тенью,
> Здоровье · Мана · Выносливость · Мораль · Сытость, опыт во всю ширину; фон 50 % (`HeroCard.Opacity`), уголки золотом только 23:00–7:00;
> пульс фона и цифры с 33 % и ниже; иконки состояний игры над портретом; щелчок по аватару — сумка; всплывающие окна шкал (механика по
> коду игры), статов (как в инвентаре), класса; шары, сферы и опыт игры спрятаны; обновление только по событиям игры. Код —
> `KrinikUIRework/HeroCard.cs`, `CardTips.cs`, `BuffTipColors.cs`. Макеты — `SvarogsDream/gallery/game/2026-10-12_hud-макеты/`.
> **Пульс и рывки — сделано 2026-10-12 21:20–21:47** (отчёт `testcases/reports/2026-10-12_svarog-hitch-water-and-card-pulse.md`): «мало кадров»
> было от ДВУХ причин — рывок ~100 мс раз в 0.5 с с 11:16 от нашего мода воды (баг 39, `FindObjectsOfTypeAll` в такте; починено, 120 → 1–3
> рывка в минуту) и 8 бит цвета. Теперь пульсирует тонкий контур шкалы #9A1C1C прозрачностью, 6.9 с, с переносом остатка округления
> (`[OWNER]` «ОК» после показа); уголки — 22:00–7:00, плавно за 10 с. В игре глазом агента НЕ проверены: плавность контура во времени, переход
> уголков (C33). Не разобран: `fps 20` после перезапуска — low1% 0.8 (одна долгая пауза).
> **Хвосты Ф1 (не прогнаны):** C3 (шкала меняется при беге/уроне), C4 (фон на лету), C9 (720p–4K + смена на лету), C10 (скрытие HUD Caps
> Lock — карточка уходит вместе с ячейками), C11 — **не больше 0,1 мс на кадр** (`[OWNER]` «он супер мало должен жрать» · «не больше 0.1 мс» · «почти ничего» · 2026-10-12): скрипт пульса 0.009 мс, перестройка холста не мерена, C14c/C29 (правки 21:15), C15 (щелчок → сумка), C24
> (пять шкал наведением), C27 (днём уголков нет), C12 (повторная загрузка), K1.
> **Ф2 (следующая):** строка ячеек по центру низа `1 2 3 4 5 6 7 8 9 0 Q E F G Пробел`, клавиши ПОД ячейками, кнопки меню строкой в правом
> углу вместе с их ореолами (`Hud.cs` `FollowGlow`: `Enablers/EffectLevelUp`); тексты игры над HUD (`Cast Bar`, «Не хватает Маны.»,
> сообщения `suggestionManager`/`uiCharacterMessages`) — найти в коде и предложить место листом.
> **Новое от владельца:** родные всплывающие окна игры — в стиле окон карточки (тёмная бумага, скругление, кайма золотом) — `[OWNER]`
> «ты свои поп-апы сделал - крсисиво» · «в этом стиле родные сможешь везде переделать?» · «радиусы на углах - бордер золотом» · 2026-10-12
> (общая обвязка — `PopupLook.cs`, `Plates.cs`). Разметка местности у игры уже есть (текстуры земли, бафф «На Дороге») — `ideas/14`.
> **Игра:** перезапущена агентом 21:39 с сейвом владельца (его выход `quit` 21:38:42 — копия `_backups/svarog-saves-2026-10-12_2138-owner-quit`,
> это новая точка сверки: `SAVE_POINT=… bash tools/save-check.sh`); реестр возвращён 21:39. Владелец ведёт стрим в OBS — OBS не трогать
> (`[OWNER]` «и ты наш ОБС не убивай плиз» · 2026-10-12).
> **На отсмотр:** `SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/` — 6 пунктов дня + 7 «HUD — макеты карточки героя»; ждут его взгляда.
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
> 0а. **Баг 38** (путник по дну пруда) — **сильно позже** по слову владельца; цитата — летопись, запись 21:16.
> 0б. **HUD — идея 15:** Ф1 сделана, дальше Ф2 и хвосты — первый пункт этого раздела.
>
> 2. **Близнецы прыжков** — `[OWNER]` «это тебе на тесты» · 2026-10-12: проверять самому кадрами, владельцу не нести. «Раз в секунду» над
>    интерфейсом — `MenuFonts.cs:82`, `Fonts.cs:261`, `Icons.cs:189`, `MapLayout.cs:381/384`; первым кадром, как в отчёте no-jump.
>    Разбор по коду (гипотезы) — летопись, запись 2026-10-12 19:22.
> 3. **Настройки по Esc** — колонку меню НЕ трогать (рулбук §9); «?» и подсказки — блок «Новый чат ПЕРВЫМ — «?»…» выше; полный текст пункта — летопись, запись 21:16.
> 3б. **Миникарта:** яркость по умолчанию 1.5 — сделано (`[OWNER]` «миникарту по яркости 1.5 поставить» · 2026-10-12; `Hud.cs` и его конфиг).
>    **Стрелка героя на миникарте** — перерисовать зелёной, ровной, красиво (`[OWNER]` «стрелку героя на миникарте красиво перерисовать
>    зеленым, ровным» · 2026-10-12) — сначала варианты на кадре владельцу.
> 3а–4. Экран смерти, «ОК» окон, «Перезарядка» — сделано, ждут глаза (папка «НА ОТСМОТР НИКОЛАЕМ»); текст пункта — летопись, запись 21:16.
>
> Перевод (баг 28, 79 склеек) — раздел «Open bugs»; «Преданность» — летопись, запись 21:16.

1. **Конан на 2.2.3 — хвосты переезда.** Досье, раздел «✅ 2026-10-02»: графика на 4K — глазом владельца,
   Doubled Storage Size своим модом (шаг 6а), PauseGame — вернуть, если автор перевыложит. Старая 2.1.1 удалена.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Девять файлов в `bugs/` без метки DONE (2026-10-11 14:50), статусы — раздел «Open bugs»
   ниже. Открытые баги самого движка — 06 (`-Only` обрезает `modlist.txt`) и 14 (`kumm check` держится за старый файл).
4. **KAIF: следующее обновление, линтеры по старым долгам; Palworld** — летопись, запись 2026-10-12 21:16.
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (138 случаев). Хуки (heredoc, методичка
   перевода `style-gate`, `testcase-gate` v2.4, `ui-gate`, `stamp-gate` v2 — и на командах оболочки) подключены в местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
## Open bugs

Файлов без метки DONE — 10 (2026-10-12 10:47: баги 36 и 37 закрыты, 38 — новый):

- 🔧 `bugs/39_svarog_frame_hitch_twice_per_second.md` — рывок раз в 0.5 с от мода воды; починено и измерено 21:39–21:44, ждёт глаза владельца.
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
