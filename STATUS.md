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

> Чаты 2026-10-13 до 17:27 — летопись; чат 17:38–18:46 — летопись, запись 2026-10-13 18:46; чат 19:39–21:50 — летопись, запись 2026-10-13 21:50;
> чат 21:54–23:00 — летопись, запись 2026-10-13 23:00.
>
> **НОВЫЙ ЧАТ ПЕРВЫМ — долги пункта 0а ниже; затем Сварог, лист `testcases/TC_svarog_owner_remarks_2026-10-13_evening.md`** (E1–E40). Правило: найденный баг чинится
> сразу — кейсы → правка → прогон → итог. Модель неба: `SvarogsDream/src/KrinikColorRework/SunModel.cs` (одна высота солнца; разведка
> `researches/svarogs-dream/sky-optics-dawn-dusk.md` §8; интервью #014 — В1, В2, В3 все «А»; `[OWNER]` «можем отходить от научной
> достоверности во благо стилю игры»). Мир — Польша, Чехия, Словакия, 50° с. ш. (досье игры).
> 0. **Диск солнца в отражении воды стоит не там (E39, E40) — первым.** `[OWNER]` «на очень сильном наклоне камеры, когда зайчик лучей за
>    водой - на берегу» · «то видно диск солнца в отрыве от центра зайчика» · 2026-10-13. Свет уже из модели солнца (d1c4a94: `LightCycle.ToSun`,
>    высота света = высоте солнца). Снимок экрана 2026-10-13 21:50 (`SvarogsDream/_harness/now4.webp`, 10:17 игры, камера 51,7°, солнце 46,9°)
>    с крестом расчётной точки зеркала (пульт `call KrinikUIRework.SunMirror Show true`, `Where` — числа): **крест на зайчике — зайчик верный;
>    диск на воде ≈450 точек в стороне — врёт диск неба в отражении.** Первая гипотеза «небо — сетка вокруг главной камеры, параллакс» НЕВЕРНА:
>    небо — скайбокс (`RenderSettings.skybox`, `Sky.cs:150–151`; шейдер `unity/KrinikShaders/Assets/Shaders/KrinikSkyGradient.shader:187` —
>    вершина сферы = направление взгляда). Гипотеза 2 (не проверена): камера отражения Lux (`_WaterPlaneReflectionCamera`) задаёт зеркальную
>    `worldToCameraMatrix`, а скайбокс Unity рисует по повороту её transform — небо в отражении сдвинуто, сдвиг растёт с наклоном. Опыт, чинить,
>    приёмка — критерий E39 (центр зайчика внутри круга диска, полдень и низкое солнце, контроль — сборка до правки). Кадры воды снимать
>    по шагам: камера мышью (колесо зажато) к солнцу с наклоном «высота + 5–10°», герой клавишами к берегу (EXP-0252).
> 0а. **ДОЛГИ ЧАТА 2026-10-13 21:54–23:00 — ПЕРВЫМИ** (`[OWNER]` «в новом чате продолжим чинить долги» · 2026-10-13). Живые замечания
>    владельца в его игре; лист `testcases/TC_svarog_loot_window_2026-10-13.md` (каждая строка — его цитата, правка, замер), сборка
>    SvarogsDream до `33fd1bd` + незакоммиченная правка `ItemWindow.cs` (ниже). Мод `KrinikUIRework`, выкладка — `bash tools/deploy-hot.sh
>    KrinikUIRework`; **после каждой выкладки — `h.sh "perf 4"`** (EXP-0254: моя заплатка уронила FPS 77 → 14) и **не больше нескольких горячих
>    выкладок подряд** (EXP-0253, `bugs/45`: игра владельца упала от утечки портретов, утечка починена). Долги по порядку:
>    1. **F5 — карточка сравнения появляется резко** (одиночная — фейдом; `[OWNER]` «нет, всё равно резко сравнение появляется» · 23:01).
>       Правка «второй вызов построения не обрывает проявление» в игре с 22:59 — НЕ помогла. Правка «новое окно — выключенным» собрана и
>       закоммичена, не выложена. Причина не найдена: сначала вернуть в `ItemWindowView.Build`/`LateUpdate` строку журнала на каждое
>       построение и конец угасания (было `fade build: active= shown= a= tip= f=`), навести на вещь со сравнением — по журналу найти, кто
>       ставит альфу 1 или включает окно мимо `Build` (кандидаты: вложенная карточка сравнения игры `ComparisonTooltip`, `Compare.cs`).
>    2. **Полоса моба** (`MobBars.cs`): N17 — откат, вся полоса ×1.44 равномерно, ромб ×1.5 (`[AI]` 1.44 — число владелец не назвал); кадра с
>       мобом ещё нет. «Прозрачная полоса» (N12) — на кадрах агента не видна, ждёт кадра владельца.
>    3. **Плашка подобранного предмета — шрифт не наш** (`[OWNER]` «когда предмет поднимаешь, шрифты не наши» · 2026-10-13 23:0x, кадр
>       «Броня Бронзового / Сердца» на фиолетовой плашке): `UISkillUp.textLevel` (UGUI Text) — шрифтом чисел и надписей HUD (Manrope, как
>       `Hud.HudNumber`), имя в одну строку, фон под текст (`Popups.cs` KeepOnScreen уже тянет фоны).
>    3а. **Плашка повышения навыка — только число** (`[OWNER]` «Это что такое?» · «баг» · 2026-10-13 23:0x, кадр: ступка алхимии и «9» на
>       жёлтой плашке без названия навыка). Игра пишет `$"{level} {skillSufix}"` (`UISkillUp.ShowNewLevel`): проверить дампом `textLevel`
>       (текст целиком? перенос на вторую строку и обрез по высоте? пустой перевод суффикса?) и связь с правкой фонов `Popups.cs` (выкладка 24).
>    3б. **Экран торговли — переделать, как окно поверженного** (`[OWNER]` «экран торговли некрасивый, тоже переделываем» · 2026-10-13, кадр:
>       сетка товаров торговца слева от сумки). Близнец добычи (`LootLook.cs`): красная полоса справа (вероятно `Background (2)`), каймы нет,
>       к сумке не приклеен; поле «Золото: 100593з» — серый мазок, рыжие цифры с хвостом «з» — языком «Золото · Вес» сумки (`Purse.cs`,
>       `ItemWindowView.LabeledBox`); пустое место под сеткой. Дамп пульта `UI/Inventory/InventoryCanvas/Equipment+Canvas/Trade+Canvas`
>       при открытой торговле → один код с `LootLook` (класс, а не копия — рулбук К1).
>    4. Ждут кадра/глаза: справка «?» без обреза (H1r — высота по `textBounds`), сетка сумки по центру (S1), цифры стопок еды и зелья белым
>       (Q1), крестик сумки (X1), плашка навыка под текст (T3).
>    5. Открыто: синяя пустая полоса `EquipmentScreen/Popup` над сумкой (P1, `UIImageEnabler` игры); трава сверху без объёма (`bugs/44`,
>       разведка шейдера); `bugs/45` — проверить, что память не растёт от горячих выкладок; 720p и 2K окна поверженного (L6).
>    6. После долгов — пункт 0 (диск солнца в отражении).
> 1. **HUD — кнопки меню справа внизу по макету, строкой, с переносом ореолов** (`ideas/15`, «Hud.cs → FollowGlow»; `[OWNER]` «в справа внизу
>    кнопки меню когда будешь делать как по макету?» · «с переносом корректным ореолов?» · 2026-10-13).
> 2. **Небо на модели солнца, E3/E10, HUD фаза 2, ошибки автора, 286 квестов** — летопись, запись 2026-10-13 23:00 (перенесено дословно).
>
> **Порядок прогона:** точка сейва — `_backups/svarog-saves-2026-10-13_1801-owner-exit-after-dawn-test` (после игры владельца 13.10 в 18:00;
> в ней промотано ≈сутки опытами: день 9, ≈3:50 — владелец знает, прежняя `…_1720-owner-played` — день 8). `bash tools/run-game.sh` → кейс
> → итог строкой → `h.sh kill` → `SAVE_POINT=<полный путь /d/work/ai_sandbox/_backups/…> bash tools/save-check.sh --restore` →
> `reg-snap.sh restore`. Ночь в лесу — `h.sh "static WorldState isGodMode True"`. Замер света — `tools/light_capture.sh` или ffmpeg
> `ddagrab` 2 кадра/с + `tools/light_lum.py <папка>`. Мышь — `tools/mouse.ps1` в точках кадра `shot` (игра сейчас 3840×2160: ячейка 1 ≈ 1330, 2080, ячейка 3 ≈ 1560, 2080;
> прежняя запись «точки 1280×720» верна только при игре в 720p).
> Если владелец сам играл в запущенную агентом игру — сейв не откатывать, снять новую точку. **2026-10-13 23:00 игра открыта у владельца**
> (перезагружена в 22:57 с его сейва 21:56:35 по его слову «Перезагружаем сейчас»; копии — `_backups/svarog-saves-2026-10-13_2226-…` и
> `…_2256-owner-before-reload`) — в новом чате сначала снять новую точку с его сейва.
>
> **Ждёт владельца:** имя «особой кузни» (совет 10; 11 кандидатов приняты — советы 36–46); выбор воды по ролику — «позже»; видео-демо неба — «позже».
> Письмо разработчику и письмо в Steam — отправлены (`[OWNER]` «отправлено» · 2026-10-13). Баги 39, 40, 41 проверяет агент сам
> (`[OWNER]` «твои дела, не мои. Тестить фиксы ты должен» · 2026-10-13).

1. **Конан, KAIF, Palworld, движок фаза 1, /check-backlog, стражи** — летопись, запись 2026-10-13 23:00 (перенесено дословно).
## Open bugs

Файлов без метки DONE — 16 (2026-10-13 23:00: заведены 44 и 45):

- 🔴 `bugs/44_svarog_grass_loses_volume_top_down.md` — трава при камере сверху (≈90°) без объёма и зелени; разведка шейдера не начата.
- 🔧 `bugs/45_svarog_hot_reload_leaks_portraits_game_crash.md` — горячие выкладки копили портреты, игра владельца упала 22:24; утечка
  починена (`HeroPortraits.cs`), не проверено, что память не растёт.
- 🔴 `bugs/42_svarog_skill_tip_title_white_then_red.md` — заголовок поп-апа навыка ≈0.5 с белый, потом красный (переход с навыка на навык); причина не найдена.

- ✅ `bugs/39_DONE_svarog_frame_hitch_twice_per_second.md` — рывок раз в 0.5 с от мода воды; закрыт 2026-10-13 замером PresentMon (0 кадров дольше 33 мс за 30 с).
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
