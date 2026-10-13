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
> **Mafia II** — на паузе, досье `games/Mafia2/README.md` (раздел «Дальше»); сюжет агенту не начинать.
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
      1. Владелец перезагружается: Windows ждёт перезагрузки, чтобы выключить WSL, «Платформу виртуальных машин» и Hyper-V
         (`[OWNER]` «выруби wsl в системе, я им больше не пользуюсь, и удали нахуй его остатки» · «да, выключай» · 2026-10-13; Docker удалён
         им 12.10, KLAS заброшен). Остатков WSL на диске и в реестре нет; записи уведомлений WSL, Docker, BlueStacks удалены (копии
         `%TEMP%\notif-*.reg`); гипервизор при загрузке и так выключен (`hypervisorlaunchtype Off`), VBS выключен. Машина Claude Cowork
         (`…\Claude_pzs8sxrjxfjjc\…\vm_bundles\claudevm.bundle`, чистый образ без данных) удалена 2026-10-13 15:42, −9,42 ГБ; служба
         `CoworkVMService` осталась на автозапуске (пакетную службу менять нельзя: «Access is denied»), если машина появится снова — удалить.
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

> Утро 2026-10-13 (08:10–09:36, C52–C85) — летопись, запись 2026-10-13 11:51; чат 10:43–13:11 (цвета, перевод, баг 43) — запись 13:11;
> чат 13:30–15:50 (квесты, советы, карты игры, методичка русского, WSL) — запись 2026-10-13 15:49.
>
> **НОВЫЙ ЧАТ ПЕРВЫМ — Сварог:**
> 0а. **Советы экрана загрузки — встроить и проверить в игре** (`[OWNER]` «согласованы твои правки советов - внедряй» · 2026-10-13). Сделано:
>    код `KrinikUIRework/LoadingTips.cs` (дописывает 35 советов к 61 авторскому в `LoadingScreen.loadingTips`, «Tip N:» → «Совет N:» у
>    N > 61; настройка `Loading/ExtraTips`), `LoadingLayout.cs` (`PatchLoadingTip`: подпись, потом вёрстка), `Restore.cs`
>    (`BindLoadingTips`); мод СОБРАН (`src/KrinikUIRework/bin/Release`), но В ИГРУ НЕ ПОЛОЖЕН. Перевод выложен: лист
>    `translation/loading_tips_ru.tsv` → `tools/loading_tips_build.py` → `_config/krinik_loading_tips_ru.txt` → корень игры (шаг в
>    `translation_deploy.sh`); 14 правок авторских — в `zz_krinik_tips.txt` (лист `translation/loading_tips_author_proposal.tsv`), исключения
>    терминов — `glossary_exceptions_tips.tsv`. Шаги: игра закрыта → `cp src/KrinikUIRework/bin/Release/KrinikUIRework.dll` в
>    `BepInEx/plugins/KrinikUIRework/` → кейсы L2–L5, K1 `testcases/TC_svarog_loading_tips_2026-10-13.md` (L1 выкладка — выход 0, 15:47).
>    Сейвы: живые записаны 13:04 (после отката к 10/10); копию — до запуска. В листе — 11 кандидатов в новые советы, ждут выбора владельца;
>    имя «особой кузни» до 10-го качества (совет 10) — спросить. Сборщик советов `loading_tips_build.py` на сломанном листе (тире) не проверен.
> 0б. **Отчёт «игра под капотом» — md → PDF владельцу** (`[OWNER]` «Напиши мне отчёт о том, как устроена игра под капотом, какие есть
>    механики - мне нужно понимание её глубины нативной, и что я хочу модифицировать. Отчет в md срендеренном в pdf» · 2026-10-13). Материал
>    собран: `researches/svarogs-dream/report-materials-2026-10-13.md` (две сводки: устройство с числами, его желания с цитатами) +
>    `games/SvarogsDream/GAME_ARCHITECTURE_INTERNAL_MAP.md` (≈50 механик). Писать по `researches/russian-writing/RUSSIAN_RULES.md`
>    (хук `russian-gate`), вычитка чистым агентом, PDF — pandoc → Chrome (память `show-docs-as-link-or-pdf`), открыть владельцу.
> 1. **Цвета по смыслу — второй срез.** Первый принят (`[OWNER]` «отсмотрел картинку - выглядит суппер!» · 2026-10-13). Правила — рулбук
>    Сварога §6 (знак, смешанная строка, абзацы, прибавки над героем, особые свойства); код — `KrinikUIRework/EffectTags.cs` (знак → цвет) и
>    метка `KrinikSignColor` (иначе `Letters.Lift` делает любой красный `#FF4A4A`, EXP-0241); перепись — `SvarogsDream/docs/COLOUR_TAGS_CENSUS.md`
>    §2–4. Осталось: подписи черт под значками и окно выбора героя (T3), числа навыка `#008914` (S1), «Преданность» D2–D4, сообщения «Черта
>    получена/снята» (T4, T5 — патч `UISugestionManager`), урон по герою красным (F1), экран смерти (X1). Кейсы — дописывать в
>    `testcases/TC_svarog_colour_tags_2026-10-13.md` (C1–C29); лист «было → стало» — `SvarogsDream/tools/colour_scene.sh old|new` (старая сборка —
>    `git worktree` на коммит до правки). Не видено: красный 1–2 в «Преданности». Подробности сессии — летопись, запись 2026-10-13 13:11.
> 2. **Баг 42** — заголовок навыка белый ≈0.5 с при переходе с навыка на навык (C72; видео `_harness/c72/hover.mkv`).
> 3. **Альманах** — ширина карточки и рамка портрета у разных богов разные (C83 partial); табличка даты «События» — колонки (C81).
> 4. Не проверено: C60 «Промокший» (нужен дождь), C61 прочие склейки, C62/C63 вода днём, C64 предметы с особым эффектом, C78 окно баффа
>    закрывает верх полосы «Здоровье», подсказка баффа «висела» после ухода мыши (одно наблюдение, 09:05).
> Порядок: `bash tools/run-game.sh` → кейс → итог строкой → `h.sh kill` → `save-check.sh --restore` (точка `_backups/svarog-saves-2026-10-13_0049-quit`)
> → `reg-snap.sh restore`. **Вердикт — только после перезапуска игры, не после горячей выкладки** (EXP-0239). Щелчок пульта не доказывает
> нажатия — проверять смену состояния (EXP-0238). Проценты тонировки — на глаз, формула `Seen()` (EXP-0237). Игра закрыта 13:04, сейв 10/10.
>
> **Квесты (184), таверна/готовка/священник** — в словарях игры, в журнале глазом не смотрены (летопись 2026-10-13 15:49).
>
> **Ждёт владельца:** выбор воды по ролику `SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/10 Вода - поверхность, варианты/3 видео…` (А и Б дня и закат
> с браком — переснять: ничего не открывать на экране во время записи, останавливать по PID родителя-цикла, ночь не снята).
>
> **Правила прогона** — память и летопись, запись 2026-10-13 15:49 (блок «Правила, которые держать»).
>
> **Дальше по беклогу Сварога:**
> 1. Баг 28 — остаток переписи данных (`tools/data_census.py` → `translation/data_census.tsv`): квесты 482, подписи префабов 521 (разобрать с
>    игрой, что видит игрок), 66 описаний умений — скорее ложные (число в цветном теге, сверить по `spells_ru.tsv`); имена Flamekeeper,
>    Frostshaper, Trapper, Execute — нет в глоссарии.
> 2. HUD, идея 15: тексты над ячейками — **Б** (план в `ideas/15`, раздел «К Ф2»), Ф2 — строка ячеек по центру, клавиши под ячейками, кнопки
>    меню с ореолами; хвосты Ф1 — C3, C4, C9, C11 (перестройка холста — development-плеер), C12, C33.
> 3. Вода: цвет неба меняется с приближением (`[OWNER]` · 2026-10-13; гипотезы — летопись 01:27); пересъёмка вариантов; баг 40.
> 4. Баг 41 — найти, что пересоздаёт материалы (дымка). Баг 38 — сильно позже.
> 5. Близнецы прыжков (проверять самому кадрами), настройки по Esc (колонку меню не трогать, рулбук §9).

1. **Конан, KAIF, Palworld, перевод (баг 28), «Преданность»** — летопись, запись 2026-10-13 15:49 (перенесено дословно).
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Девять файлов в `bugs/` без метки DONE (2026-10-11 14:50), статусы — раздел «Open bugs»
   ниже. Открытые баги самого движка — 06 (`-Only` обрезает `modlist.txt`) и 14 (`kumm check` держится за старый файл).
4. **Стражи:** тронул любой — `node tools/test-guards.mjs` (146 из 146, 2026-10-13 15:3x); хуки — `AGENT_GUIDE.md` → Tools (подробно — летопись 15:49).
## Open bugs

Файлов без метки DONE — 14 (2026-10-13 12:41: 43 закрыт):

- 🔴 `bugs/42_svarog_skill_tip_title_white_then_red.md` — заголовок поп-апа навыка ≈0.5 с белый, потом красный (переход с навыка на навык); причина не найдена.

- 🔧 `bugs/39_svarog_frame_hitch_twice_per_second.md` — рывок раз в 0.5 с от мода воды; починено и измерено 21:39–21:44, ждёт глаза владельца.
- 🔧 `bugs/40_svarog_mountain_reflection_pops_with_camera_angle.md` — горы в воде пропадали при повороте камеры; владелец решил: главный
  поток не грузить — отражение экраном (SSPR) включено по умолчанию, камера Lux снимает только небо; ждёт проверки в игре и его глаза.
- 🔧 `bugs/41_svarog_far_trees_lose_haze_when_game_recreates_materials.md` — дымка на дальних деревьях слетала, когда игра пересоздаёт
  материалы; сторож своих материалов с одним пересканом, починено 22:02; что пересоздаёт — не найдено; ждёт глаза владельца за сеанс.
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
