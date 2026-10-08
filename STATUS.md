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
> **2026-10-07 23:35 – 2026-10-08 02:20 — Medieval Dynasty: пак, распаковка, UE4SS, эпик 15 (разведка, соль, мета-план), фаза 0**
> (мост, перепись, часы, дороги Оксбоу, заморозка дальних и будильник, цена кадра, руль — распорядок), HDR, быстрый старт —
> летопись, запись 2026-10-08 02:20.
---

## Where we are now

> 🎯 **Medieval Dynasty — главное** (`[OWNER]` «и начинаем эпик по модинку моей любимой игры с ПУСТЫМ БЛЯТЬ МИРОМ - Medieval
> Dynasty! Сделаем мир ПОЛНЫМ И ЖИВЫМ!» · 2026-10-07 ≈23:35). Пак — приватный репозиторий `D:/work/ai_sandbox/MedievalDynasty`
> (github `medieval-dynasty-modpack`; README — устройство игры, ключ pak); игра 2.7.0.3 (UE 4.27) распакована в
> `D:/Games/Medieval Dynasty Mods/_vanilla`; UE4SS 1161. **Эпик 15** — мета-план `plans/15_EPIC_medieval_dynasty_living_world.md`
> (`[OWNER]` «с этого места завтра продолжим обсуждать получившийся метаплан» · 2026-10-08 ≈00:26), соль —
> `researches/medieval-dynasty/essence.md`, устройство игры — `game-internals.md`, интервью #008 ждёт. **Фаза 0** —
> `plans/16_epic15_phase0_recon_and_stand.md`: моды пака `KrinikBridge` v9 (только чтение), `KrinikWake` v3 (действие),
> `KrinikProbe` v2, `KrinikFastStart` v4 (меню за ≈6 с, ролики убраны). Итоги ночи — в «Коротко» плана 15. HDR включён
> (`tools/hdr.py on`), но **не починен**: меню серое и высветленное после уведомления Auto HDR — баг 29; поправка 2026-10-08
> 09:35 — «798 нит» давал Auto HDR Windows, а не HDR игры (без Auto HDR пик 360).
>
> **Svarog's Dream — на паузе** с 2026-10-07 (было главным по `[OWNER]` «в новом чате продолжим со Сварог Дрим» ·
> 2026-10-05 ≈20:55): досье `games/SvarogsDream/README.md`; передача дел — летопись, запись 2026-10-08 02:20 (указатель в «Where to continue»).
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

> **Medieval Dynasty — первым делом (эпик 15, фаза 0; ночь 07→08.10, отчёты `testcases/reports/2026-10-08_md-*`):**
> 00. **Псих-разведка СДЕЛАНА 2026-10-08 13:08** — `researches/medieval-dynasty/recon-psyche.md` (PAD, ALMA, RimWorld, The
>    Sims, Crusader Kings 3, Dwarf Fortress, GAMYGDALA — первоисточники с цитатами; §9 — гибрид: характер 5 · настроение PAD 3 ·
>    нужды 6 · стресс 1 · отношение по знакомым · память). Выжимка по-русски — `plans/15`, «Психика» → «Итог разведки». Мерка
>    владельца: `[OWNER]` «простая в использовании система, мощная, но простая» · «возможно эта система - будет мутант, гибрид».
>    Модель названа **KARMA** — публичный репозиторий `D:/work/ai_sandbox/KARMA` = github `MikalaiKryvusha/KARMA` (13:18), спецификация
>    `docs/MODEL.md` 0.2 (слой «Стремления»: мечта · вехи · желания и страхи). **Дальше:** выбор владельца — 5 черт и 6 нужд (в
>    спецификации помечены `[AI]`); проверочные сценарии модели в KARMA (их обязана проходить любая реализация — «слух о медведе»,
>    «невротик в покое»); затем эталонная реализация на C# и «Воля». Модель ≠ реализация: профили «полный» и «лёгкий» (стол).
> 0. **СЛЕДУЮЩИЙ ШАГ — 0.2c F6, цепочка точек** (`[OWNER]` «давай в новом чате с этого места продолжим», 2026-10-08 ≈12:41).
>    Найдено: житель доходит до точки в поле, если она ≤ 150 м от дороги (3/3, 0–3 м); точка в 197 м от дороги — НЕ доходит
>    (застревают ≈400 м, F5). Готово к прогону: `KrinikWake` v9 `retarget X Y` (новая цель тем же ведомым); сценарий
>    `goto BP_NPC_Multi_Village_C 3 schedpt -5415 67082` (W1, 100 м от дороги) → когда все L ≤ 6 м — `retarget -14472 70570` →
>    `trackall` каждые 10 с, `feed` раз в 4 мин. Прогон 12:33 прерван до первой команды (владелец вышел из игры); автосейв выхода
>    12:39 отложен в `D:/Games/Medieval Dynasty Mods/_save-backup/2026-10-08_1239_autosave-on-exit` (вдруг владелец играл).
>    **Как гонять:** `powershell -File <пак>/tools/route-pilot-load.ps1 [-Save Autosave2_Ox]` (снимок сейвов → якорями без кликов
>    → мир ≈30 с → `feed`), закрывать ТОЛЬКО `tools/route-close.ps1` (сейвы 1:1). Кейсы — `testcases/TC_md_phase0_free_path_*`.
>    Пропущенные церемонии закрытия (слово владельца «без церемоний», 2026-10-08 12:41): судья, README, бонсай-стрижка STATUS,
>    `check --gate-budgets` — долг следующего `/end-chat-soft`.
> 1. **Мета-план ПРИНЯТ** (`[OWNER]` «метаплан принят», 2026-10-08 ≈09:37); интервью #008 и уточнения У1–У3 отвечены — всё в
>    `plans/15`. HDR — баг 29: Auto HDR выключен для exe, мир «стал получше», **инвентарь (UI) ещё пересвечен** (`r.HDR.UI.Level`).
> 2. **Руль жителя ДОКАЗАН — через распорядок** (автономный час 10:05–11:05, `KrinikWake` v6 `goto <Класс> <N> sched` +
>    `trackall`): переписать места всех занятий в `ActivitiesBySeason`, `IsFurniture=false`, `CurrentActivityID=-1` — житель идёт
>    сам (161 м — дошёл за 110 с; 455 → 237 м за 6 мин у пятерых). Дальше 150 м игра ведёт ПО ДОРОГАМ (`BP_NPC:SetPath` →
>    `GetPathToTarget`), дистанция по прямой колеблется — **следующий шаг 0.2b:** критерий «прибытие / прогресс по пути»,
>    долгий прогон на ОДНОЙ копии сейва (игра пишет автосейв во время прогона — EXP-0179). Отчёт
>    `testcases/reports/2026-10-08_md-phase0-steer-by-schedule.md`; конспект — `game-internals.md`, «Steering…».
> 2а. **Сделано в тот же час:** прототип сервера мира на C# — 0.009 мс на игровой час при 500 субъектах, 1 == 16 потоков бит в
>    бит (`MedievalDynasty/server/WorldBench`, отчёт `…-world-server-bench.md`); носители свойства вещи — `MaxHP` и
>    `NoteDetailsRowName` экземпляра (мост v10 `inv`, отчёт `…-item-instance.md`; запись + сохранение — открыто).
> 3. **Шаг 0.5 (спавн):** рецепты — чит-меню разработчиков `UI_CheatMenu` (SpawnBandit, SpawnAnimal, Force spawn POI).
> 4. **Как гонять игру:** пак `D:/work/ai_sandbox/MedievalDynasty`, раскатка `Deploy-ModPack.ps1 -Deploy -PackDir <пак>`, запуск
>    `Medieval_Dynasty.exe` — одной командой `powershell -File tools/route-restart-load.ps1` пака (снимок сейвов + мир ≈30 с + `feed` героя), закрывать ТОЛЬКО `tools/route-close.ps1` (вернёт сейвы 1:1; урок 2026-10-08 — герой через прогоны дошёл до воды 0); команды — строки в
>    `ue4ss/Mods/KrinikBridge/in.txt` (ответ `out.txt`) и `KrinikWake/wake.txt`; закрывать `CloseMainWindow`; после — сверка
>    сейвов с `D:/Games/Medieval Dynasty Mods/_save-backup/2026-10-08_0045` (sha256, 48 .sav). Перед прогоном — TC в
>    `testcases/`; стенды `tools/test-bridge.lua` (26) и `tools/test-wake.lua` (13) с мутантом. Out-параметры UE4SS — EXP-0177.
> 4а. **Игру агент ОБЯЗАН гонять сам:** `[OWNER]` «Можно и нужно! Запиши в свои руководства!!!!» · «Ты обязан её
>    запускать, перезапускать, загружать, играть, тестироват!» (2026-10-08 ≈09:50) — без вопроса, с голосом, сейвы — копией.
>    Перезапуск с загрузкой последнего сейва — `tools/route-restart-load.ps1` пака (маршрут по координатам, ≈30 с). **Бэклог:**
>    `[OWNER]` «быструю автоматизацию, ала селением по якорям» · «если якори быстро читать не умеешь» · «то на Open CV» · «как я
>    делал с симпле мморпг, найдешь в моем GH» · «чтобы ты БЫСТРО умел ходить по уже изученным ранее тобою путям» — маршруты по
>    якорям: функции виджетов игры через UE4SS (`UI_MainMenu_C:Continue`, `UI_LoadMenu_C` `SelectedSaveSlot`/`ConfirmSelection`,
>    `UI_LoadSaveAcceptation_C:Accept`), запасной глаз — OpenCV; образец — репозиторий владельца Simple MMORPG на GitHub.
>    План — `plans/17_md_anchor_pilot.md`: пилот `KrinikPilot` v1 живьём прошёл 8 шагов из 9 без клавиш (меню → сейв по имени →
>    Соло → экран «Начать игру»); якорь «Начать игру» НАЙДЕН — `UI_NewGameConfigurationMenu_C` (кнопка `StartGame`), 9-й шаг —
>    следующим заходом (план 17, шаг 17.3; отчёт `…-anchor-pilot.md`).
> 4б. **Цветокор — мод `KrinikColor` v2** (живой `color.txt` в папке мода в игре, снимок значений игры `game.txt`); HDR — баг 29.
> 5. **Открыто в фазе 0:** дороги и перепись Долины (все сейвы владельца — Оксбоу), хук сохранения (0.4), игровой поток
>    отдельно от рендера (0.6), шестеро NPC на ступени 0 до 3 км, мир-сервер (после ответа Q6 интервью).

> **Svarog's Dream (на паузе) — передача дел целиком в летописи**, запись 2026-10-08 02:20 («Перенесено из STATUS
> дословно»): «Мастерство» C46–C82, ждёт владельца (кегль, имена, термины, вкус окон), баги 26 и 28, окно выбора героя,
> как водить игру (`tools/run-game.sh`, `h.sh`), эпик 10 (фаза 8 — карта), рулбук UI. Вернуться — прочесть ту запись первой.
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

Файлов без метки DONE — 12 (сверено 2026-10-08 10:58 по `ls bugs | grep -v DONE`):

- ✅ `bugs/30_DONE_md_pilot_buttons_step_stalls_game_thread.md` — шаг `buttons` останавливал поток Lua (нулевой `ParentPanel`); починено и проверено живьём в 10:57.
- 🔴 `bugs/29_md_hdr_menu_washed_after_auto_hdr.md` — HDR: Auto HDR выключен для exe, мир принят, инвентарь (UI) пересвечен.
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
