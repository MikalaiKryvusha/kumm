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

> **Medieval Dynasty — первым делом (эпик 15; фаза 0 закрыта 2026-10-08 16:18, 8 из 8 (№1 — по нашему моду часов, оба читают одно поле — судья 16:35) — `testcases/reports/2026-10-08_md-phase0-phase-report.md`):**
> 1. **Ответы владельца на интервью #010** (`interviews/interview_010_krinik_mod_manager_menu.md`: вид меню KrinikModManager A/B/В
>    и клавиша; макеты пака `docs/mockups/modmanager/`). Ответил — строить меню из Lua тем же способом, что часы
>    (разведка `researches/medieval-dynasty/recon-clock-widget-and-mod-settings.md`: только игровой поток; без `LoadAsset`;
>    кегль — `SetFont`; 1 единица UMG ≈ 0,47 px кадра 1080 на 4K). Схемы настроек — уже в `shared/KrinikMM` (`MM.settings`).
> 2. **План фазы 1 эпика 15** (платформа: книга, часы, хранилище, карта, мост «запись ⇄ актёр») — по лестнице `/plan-epic`;
>    хвосты фазы 0 в него: круг моста «сервер ⇄ игра» не измерен; тик у 78 замороженных жителей; шаги 0.2c, 0.2d, 0.11 плана 16.
> 3. **KARMA, дорожка К2** — проверочные сценарии модели в репозитории `D:/work/ai_sandbox/KARMA` (7 черт и 7 нужд выбраны
>    владельцем 15:38–15:44, интервью #009): «слух о медведе», «невротик в покое»; затем эталон на C#.
> 4. **Как гонять игру** (агент ОБЯЗАН сам: `[OWNER]` «Можно и нужно! … Ты обязан её запускать, перезапускать, загружать, играть,
>    тестироват!» · 2026-10-08 ≈09:50): кейсы файлом ДО запуска (`testcases/TC_*.md`; хук `testcase-gate` ловит `route-*-load.ps1`);
>    `powershell -File <пак>/tools/route-pilot-load.ps1 -Save Autosave2_Ox` (снимок сейвов → якорями → «WORLD LOADED»);
>    **мир ждать по снимку экрана** — «герой есть» приходит на 13–110 с раньше конца загрузки (EXP-0184; часы пишут
>    «экран загрузки: на экране false»); команды — строки в `ue4ss/Mods/KrinikBridge/in.txt` / `KrinikWake/wake.txt`;
>    закрывать ТОЛЬКО `tools/route-close.ps1` (сейвы 1:1). Моды в игру — копией файлов из `_unpacked/` (полная раскатка
>    перезапишет живой `KrinikColor/color.txt` владельца). Кадр — `<пак>/tools/shot-hdr.ps1` + `SvarogsDream/tools/hdr2webp.py`;
>    PresentMon — только `_tools/PresentMon-2.5.1-x64.exe --session_name kumm-pm`. Без UE4SS меню — руками: пробел → F → «Загрузить игру».
> 5. **Моды пака сейчас:** мост `KrinikBridge` v12 (только чтение), `KrinikWake` v11 (действие, `tp`), `KrinikProbe` v3,
>    `KrinikFastStart` v4, `KrinikColor` v2, `KrinikPilot` v1, `KrinikClock` v2.2 (часы на экране + журнал), `shared/KrinikMM` v1.
>    Все журналы подробные на этапе отладки — правило владельца (эпик 15, «Журнал — обязанность каждого модуля»).
> 6. Летопись прошедшего — `PROJECT_HISTORY.md`, записи 2026-10-08 16:34 и 02:20 (вся фаза 0 по шагам, HDR — баг 29, руль, спавн).

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
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (121 случай). Хуки (heredoc, методичка
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
