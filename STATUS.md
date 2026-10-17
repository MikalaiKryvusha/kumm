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

The engine works and the owner uses it daily for Palworld. It checks its pure core (the first test since 2026-09-08, four since 2026-10-14):
`node test-parse-archive.mjs`, `test-archive-roundtrip.mjs`, `test-pick-card.mjs`, `test-help-commands.mjs` (exit 0 = green), and the game
half runs on a fake pack — `node tools/fixture-pack.mjs` (`-ListMods`, `-Deploy -DryRun`, a real `-Deploy` and `-Verify`, paks after `-Only`:
20 checks since 2026-10-15, all 20 passed on 2026-10-16). Not covered yet: the live Nexus path (Chrome) — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🟡 in progress | 2026-10-14: four regression tests of the pure core + launch guard + fixture stand; 2026-10-15: the stand deploys and runs `-Verify` (20 checks, bug 46 DONE); left — Engine.ini warning |
| Phase 2 — the second game | 🟢 **доказана на Конане** | движок принял Conan Exiles Enhanced **без единой правки**: слаг `conanexilesenhanced` из манифеста, `game_id` со страницы. Oblivion Remastered остаётся подготовленным (манифест на 168 модов), ждёт патча |
| Phase 3 — compatibility | 🔲 todo | источник конфликтов найден: `UnrealPak -List` из Dev Kit читает любой пак с Oodle (`researches/conan-devkit/`); работа — фаза 3 эпика `plans/06` |
| Phase 4 — optimization presets | 🔲 todo | |

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- Сделанные пункты пула (запуск-гард, круговой ход имён архивов, кейсы `pickCard`, команда `help`, учебный пак на 20 проверок) — летопись,
  записи 2026-10-14 23:22 и 2026-10-16 23:39.
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
- 🧹 **Ревизия диска C 2026-10-12 — долг владельца из шести пунктов** (перезагрузка, DISM, журнал 03, расширения браузеров, `MEMORY.DMP`,
      Python 3.14) — дословно в летописи, запись 2026-10-14 22:17; опись `C:\РЕВИЗИЯ_ДИСКА_C_2026-10-12.md`.
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

> Прошлые чаты — летопись; последние записи — 2026-10-17 16:40 (портреты 29 в игре, карточка выбора по сетке, черты 0–6 и в HUD, волосы),
> 15:19 (иконки 108 черт, биографии, число черт) и 12:37 (окно выбора героя, мод случайных черт).
>
> 000. **НАЧАТЬ С ЭТОГО — по слову владельца 2026-10-17 16:39:** `[OWNER]` «фиксируй находки, в новом чате будем делать». Что делать:
>    (1) **Иконки 105 «Одиночка» и 93 «Пахнет Зверем»** — ответ владельца на вопрос об образе 105 ещё не получен (варианты в чате 16:36:
>    А одинокий волк воет во весь рост — совет агента · Б отшельник со спины · В серая ворона на ветке · Г свой); 93 — тот же образ «нос
>    нюхает», но явно волчий. Просить ChatGPT **ровно 3×3, девять клеток одним списком по номерам**, чинить названное владельцем, а не
>    придумывать новое (EXP-0299). Образец промпта — `SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/19 Нарисовать в ChatGPT/Лист 13.txt`; лист 14 (неудачный) —
>    там же. Нарезка — `python -I SvarogsDream/tools/icon_sheet_cut.py <лист> <папка> <имена…>` (ряды любые, ищет щели). Отладочный Chrome 9223:
>    запуск — `HOUSE_RULES.md` §6, строка `gpt_edit.sh`; аккаунт «Krinik» Free сегодня нарисовал 9 картинок (лимит ~8–10).
>    (2) **Новые черты в мод** — ждут отбора владельца из `ideas/19` и `ideas/20`; разведка сделана 2026-10-17: сейв пишет и читает чужой номер
>    черты, но загрузка падает без нашей записи в `availablePlayerTalents` — свои черты держать в своём файле рядом с сейвом
>    (`researches/svarog-hero-traits-recon` §5, вопрос 1).
>    (3) **Волосы 3D-героев в цвет портрета** — разведка готова (`researches/svarogs-dream/hero-hair-recolor.md`: `DawnShader/HairShader`,
>    `_RootColor`/`_TipColor`, постфикс на `HumanModelSelector.SetCharacterHair`); делать — по слову владельца.
>    (4) **План 29 — окна хранилищ** (`[OWNER]` «во всяких супках павших, сундуках, готовках и прочих - там пиздос» · «нужно будет делать
>    красиво. как сумки павшего делали. инвентарь» · 2026-10-17): клетки всех окон `StaticInterface` — по сетке (`SlotGrid.cs`, проверено в игре);
>    сундук одной панелью с сумкой (`ChestLook.cs`): кайма золотом, без полос, кнопки одного цвета, подпись с пробелами по центру серой
>    полосы — проверено в игре; остаток — поле подписи 24 точки против нормы В1 28; «+»/«=» готовки и алхимии видны. Окна ремёсел — ждут
>    ответа на интервью #020 (цвет полосы ремесла). Прибор — `python -I SvarogsDream/tools/grid_check.py <дамп окна>`; поле подписи — строка
>    журнала `chest label`.
>    (6) **Умный рандом советов загрузки** (`[OWNER]` «нужна система умного рандома, чтобы те советы, которые показывались - получали меньший
>    шанс … и чтобы оно между сессиями запоминалось» · «разведка в сети. как такое делается» · 2026-10-17): разведка —
>    `researches/svarog-loading-tips-smart-random/README.md`; код — `KrinikUIRework/TipsBag.cs` (собран, в игре — 2 выбора при загрузке; кейсы
>    `testcases/TC_svarog_smart_tips_2026-10-17.md`: вызов пультом `call LoadingScreen ShowRandomTip` не находит экран — проверять настоящими загрузками).
>    (7) **Долги владельца вечера 2026-10-17, по порядку:** (а) провал кадров после загрузки — `[OWNER]` «после загрузки очень низкий фпс был» ·
>    «12»; не воспроизведён, кейсы `testcases/TC_svarog_fps_after_load_2026-10-17.md` (PresentMon с запуска); (б) свет над героем — `[OWNER]`
>    «стемнело в 21, а свет над головой загорелся в 23 - плохо» · «нужно чтобы свет над головой начинал загораться медленно с 21 до 22» ·
>    «плавно» · «так же плавно гаснет - да» · «время уточню позже»: игра включает его выключателем `HelpingLightEnabler.Update` (час > 22 или < 6),
>    правка — префикс с плавной силой света; (в) HUD — ряд кнопок с «Меню» справа, подписи над кнопками, щель черт — собраны (`c90eb62` и следом),
>    в игре не смотрены; кейсы `testcases/TC_svarog_hud_row_traits_gap_2026-10-17.md`. Суд вечера — `reports/judge/2026-10-17_svarog-mods-evening.md`.
>    (5) ✅ **Баг 53 закрыт 2026-10-17 вечером** — XUnity: на одном ключе побеждает ПЕРВЫЙ по алфавиту файл; 72 дубля сведены, страж
>    `tools/xunity_dupes.py` в выкладке перевода (`bugs/53_DONE_*`).
>    **Машина общая с KAGO:** игра и нагрузка — только под замком `node D:/work/ai_sandbox/_tools/machine-lock.mjs` (`run-game.sh` берёт сам,
>    `h.sh "kill"` снимает); замок — только на время работы (`HOUSE_RULES.md` §5, «Раздел машины с KAGO»).
>    Сделано в чате с 15:30 — летопись, запись 2026-10-17 16:40. В игре сейчас: портреты `v8-center` (29), `KrinikUIRework` (SvarogsDream
>    `b39efb3`, черты в HUD), `KrinikExtendedHeroesTraits` (`9126424`, 0–6 черт), перевод 16:23. Не прогнаны: C4–C8 черт (0 черт, подсказка слотов
>    4–6, сейв, контроль), G4 и T4 (контроль выключателем). Замечено, не разобрано: после смены героя в прогоне здоровье 1285 / 1175.
> 00. **План 27** (`plans/27_svarog_random_hero_traits.md`): сделанное днём 2026-10-17 — летопись, запись 2026-10-17 15:19. Дальше: (1) починки
>    8–10 `KrinikFixes/AuthorBugs.cs` в бою (кейс R8); (2) окно «Новый герой. Сменить класс?», бафф «Защита Велеса», Staggered, атрибут > 95 → 90.
>
> **ГЛАВНОЕ — бюджет процессора: все моды вместе не дороже 1 мс главного потока в любом кадре** (`[OWNER]` «…НИКОГДА ни при каких
> условиях» · 2026-10-14; `MASTER_PLAN.md`). План — `plans/24_svarog_cpu_budget_1ms.md`. Замер — пульт `h.sh "modcost <сек> 14 bg" …
> "modcostwait"`, только на ЧИСТОМ запуске. **Где действует:** `[OWNER]` «При открытии - насрать. Лаг допустим.» · «Лаги не допустимы в
> игре, когда герой бегает а игрок играет, воюет, при геймплее основном» · 2026-10-14 ≈14:45 — окна вне бюджета, геймплей весь в нём.
> Сейчас (2026-10-17 09:00, отчёт `testcases/reports/2026-10-17_svarog-area-children-terrains.md`; худший
> кадр всех модов): **костёр 0,66–0,85 мс** (замер ночи); бег 400 м из Града туда и обратно — **1,68–2,28 мс** (K6–K7; было 17,9 на западе до
> очереди подгрузки; пик теперь — дети участка со скриптами и перебор памяти), средний расход модов на бегу 0,52–0,54 мс; 720p 1,57 (ночь). Бой не мерен,
> сумка вне бюджета (окно). Замер туда и обратно — `bash SvarogsDream/tools/measure-walk.sh` (EXP-0289).
> 0. **ДАЛЬШЕ — эпик 26 и бюджет: подгрузка участков, затем мелочи плана 25** (`[OWNER]` «почему не фиксишь мелочи пачкой в первую очередь» ·
>    «почему не рефакторишь моды по нашей методичке» · 2026-10-16 — порядок: план 25 → эпик 26 → план 24; прежний пункт 0 — летопись, запись
>    2026-10-17 04:44). Ночь и утро 2026-10-17 — летопись, записи 04:44 и 09:22. Дальше, по порядку:
>    (1) пол худшего кадра бега: дети участка со своими скриптами 1,1–1,7 мс (`HoneyCollector`, частицы `pf_vfx`, волк до 8,56 — их не дробить;
>    пустые контейнеры дробятся, `Humans` 0,52), перебор памяти до 0,91 мс (второй перебор на смену — игра пересоздаёт материалы, причина не
>    найдена, гипотеза «камера пишет дальности» опровергнута), цифра уровня полосы моба 0,74 мс; `SiegeSetup` до 12,7 мс после телепорта;
>    (2) `KrinikLetter` у `ChatCanvas` 0,24 мс раз в 0,5 с — путь (б) плана 26 только с кадрами пяти окон;
>    (3) баг 47: B2, B3d (склон владельца №13 — с разбега `apex +3,49`, п. 3 работает) и B4b pass; B4d — скала поднимает на 2,7 м (интервью 018);
>    B1 — тележку искать `findall cart_base`;
>    (4) баг 45: третья горячая выкладка в отдельном заходе (первая +171 МБ, вторая +9); мелочи плана 25 — баг 15, «пылевая буря», советы экрана загрузки;
>    имя сейва — интервью 017.
>    **В игре сейчас** (2026-10-17 12:34, чистые запуски `bash tools/deploy-cold.sh <Мод>`): KrinikUIRework, KrinikFixes, KrinikExtendedHeroesTraits и
>    перевод (`translation_deploy.sh`) — сборки дня 2026-10-17 (коммит закрытия в SvarogsDream); KrinikCameraRework `3ddb3e4`, KrinikColorRework `949d2f8`,
>    KrinikDevHarness `860dff1` (`walk`, `compsof`), KrinikModMenu `598c161`. Окно выбора героя без смерти — пульт `callon Managers/DataManagers/
>    CharacterSelectionManager CharacterSelectionManager InitializeCharacterSelection False`; переброс без Милостей — `callon UI/CharacterSelection
>    GameUI.CharacterSelectionUI PopulateCharactersAfterPlayerDeath True`; журнал мода пишется с задержкой — читать через 1–2 с. Ловушка: бессмертие пульта (`isGodMode`) ускоряет бег — для замеров движения не включать.
>    **Ловушки ночи:** пульт камеры — только `call KrinikCameraRework.Plugin CamOrbit …`; UI-мод в `scripts` — только парой `.dll` + `.pdb`
>    (`deploy-cold.sh`); голос `voice_say.py` — интерпретатором `F:/KLAS/voice/venv/Scripts/python.exe` и файлом (файл после чтения удаляется).
> 0а. **GTA SA, баг 52 — при следующем запуске игры:** заплатка 1.0 не встала (ждала `31 DB`, в exe `33 DB`), таймеры 10 минут
>    действуют. В `scripts\` лежит 1.1 → `python -I games/GTASanAndreas/tools/check_pickup_patch.py` (только чтение памяти): ждём `jmp` в
>    `PickupOldestFirst.asi`, журнал `scripts\PickupOldestFirst.log` — `1.1 … patched`; итог — в C3–C4 `testcases/TC_gtasa_pickup_oldest_first_2026-10-16.md`,
>    C6 — глаз владельца. Затем удалить `scripts\PickupOldestFirst.asi.v1-wrong-bytes.off`.
> 0б. **GTA SA, баг 48** (`bugs/48_gta_sa_crash_parked_car_generator.md`) — падение «parked car generator» из-за нашего пула OLA 400; по слову
>    владельца: `Vehicles` 200, люди пулы 300 / предел 200 / появление 150/100 / удаление 160/110 / видимость 150, машины видимость 160 /
>    удаление 180/112,5 (досье `games/GTASanAndreas/README.md`, строки 2026-10-14). Ждёт проверки игрой владельца; упадёт снова — смотреть сейв.
> 1. **Прыжок, баги 47 и 49** — открыто: B1 (тележка), п. 2 (сход с края), интервью 018 (скала +2,7 м), W3 и W5, кейсы F5, F6, F13, F1, F11 —
>    подробно в летописи, запись 2026-10-17 15:19, и в `testcases/TC_svarog_yell_refs_jump_b_2026-10-17.md`.
> 2. **Камера** (G14), **плашки повышения** (долг S1), **полосы врагов вдали**, **панель в сумке** — без изменений, летопись 14:41 (блок 13:33).
> 2а. **BepInEx.ConfigurationManager:** #129 (23 перевода + вёрстка кнопки сброса) и #127 (число у ползунка) **приняты** 2026-10-14. Когда
>    выйдет релиз — убрать наш транспайлер ширины числа в `KrinikModMenu` (`researches/bepinex-configmanager-pr125/`).
> 3. **Движок KUMM** (пул ниже): стенд `node tools/fixture-pack.mjs` готов (20 проверок, с раскаткой и `-Verify`); дальше — Engine.ini.
>
> Закрыто мягко 2026-10-17 16:40 (чат с 15:30), после закрытия по слову владельца (`[OWNER]` «постваь сейв в мире, в городе» · «ии в скрипт
> добавь отдаление камеры и наклон» · «чтобы грузануть систему графикой» · 2026-10-17): выбрана Тамара (5 черт), перенесена в Град к таверне,
> сейв записан игрой — **новая точка сверки `_backups/svarog-saves-2026-10-17_1657-town-grad`** (прежняя 16:01 — Подземный мир до выбора).
> `VIEW=far bash tools/run-game.sh` — камера на пределе отдаления, наклон 12° (кейсы `testcases/TC_svarog_save_in_town_far_view_2026-10-17.md`).
> Затем сессия KAGO (настройка кривой видеокарты) прогнала 3 цикла `VIEW=far run-game.sh` 17:02–17:06 — сбросов драйвера (887a0005) нет;
> сейв не откатывала (слова владельца в передаче KAGO: «похуй на сохранения» · «самый последний сейв грузи») — живой сейв новее точки 1657
> (3 файла из 7 отличаются, это автосейвы прогонов). Игра закрыта, реестр экрана возвращён. Отладочный Chrome 9223 с ChatGPT открыт свёрнутым.
>
> **Порядок прогона Сварога** (точка сейвов, запуск, откат, где живут моды, виртуальный экран) — `HOUSE_RULES.md` → §5, строка «Прогон Сварога».
>
> **Решено для MVP** — прыжок и падение: идея 17 (`[OWNER]` «давай примем для MVP, чтобы с чего-то начать» · 2026-10-14); ждут владельца — летопись 15:19.

1. **Конан, KAIF, Palworld, движок фаза 1, /check-backlog, стражи** — летопись, запись 2026-10-13 23:00 (перенесено дословно).
## Open bugs

Файлов без метки DONE — 20 (2026-10-17 03:53: − 42):

- 🔧 `bugs/51_svarog_water_reflection_flips_with_camera.md` — вода у Бары: причина найдена пультом камеры 2026-10-17 (все плоскости делили одну
  камеру отражения Lux по имени `_WaterPlane`), починено; оранжевые полосы под мостками убраны; ждёт глаза владельца.
- 🔧 `bugs/50_svarog_camera_sways_with_hero_breathing.md` — камера качалась с дыханием героя; починено и доказано замером (размах 0,0419 → 0),
  выложено; ждёт глаза владельца.
- 🔧 `bugs/49_svarog_jump_through_hidden_house_wall.md` — прыжок сквозь стены домов (у стен нет коллайдеров вовсе); правка `PhantomWall`
  выложена 2026-10-16, владелец: «работает»; до DONE — W3, W5.

- 🔧 `bugs/52_gta_sa_gang_war_pickups_vanish.md` — вещи в войне банд исчезали (пул пикапов полон); таймеры действуют, заплатка 1.1 ждёт запуска — п. 0а.

- 🔧 `bugs/48_gta_sa_crash_parked_car_generator.md` — GTA SA падала на пуле машин 400 (наша правка 03.10); пулы и дальности переставлены по
  слову владельца, в игре не проверено.

- 🔧 `bugs/47_svarog_mvp_jumps_bugs.md` — прыжок: по WASD (п. 1) и вверх по склону владельца (п. 3) — прогнано 2026-10-17, pass (B2, B3d); бег по
  клику — B4b pass; B1 (тележка, п. 4) — не найдена; скала поднимает на 2,7 м — интервью 018; п. 2 (не соскальзывает с края вниз) — не начат.

- 🔧 `bugs/44_svarog_grass_loses_volume_top_down.md` — трава сверху: починено 2026-10-17 (травинки держат наклон, как у камеры под 55°;
  настройка `Terrain.GrassTopDown`), «до/после» с одного места; ждёт глаза владельца.
- 🔧 `bugs/45_svarog_hot_reload_leaks_portraits_game_crash.md` — горячие выкладки копили портреты, игра владельца упала 22:24; утечка
  починена (`HeroPortraits.cs`); 2026-10-17 две выкладки: +171 / +9 МБ, 62 портрета целы — утечка на каждую выкладку не видна, нужна третья.

- 🔧 `bugs/40_svarog_mountain_reflection_pops_with_camera_angle.md` — горы в воде пропадали при повороте камеры; владелец решил
  (`[OWNER]` «НЕТ, ЭТО НЕПРИЕМЛЕМО!!! Ну НЕЛЬЗЯ НАМ ГРУЗИТЬ ГЛАВНЫЙ ПОТОК» · 2026-10-13 — в баге, строка 3): главный
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
- 🔧 `bugs/14_pickcard_exact_name_pins_old_file.md` (починено 2026-10-15, ждёт живого `kumm check`) — `kumm check` держится за старый файл, если автор когда-то
  вписал версию в имя файла (Bosses My New Besties, 02.10). Баг самого движка; план починки и кейс — в документе.
- 🔧 `bugs/06_deploy_only_truncates_modlist.md` (починено 2026-10-15 на стенде, ждёт живой раскатки `-Only`) — `-Only` молча обрезает `modlist.txt` и выключает остальные
  моды. Баг самого движка (`Deploy-ModPack.ps1`), воспроизводится каждый раз.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — симптом снят выключением мода, причина не найдена.
- 🔧 `bugs/08_conan_config_overrides_code.md` — починено, ждёт подтверждения владельцем.
- 🔬 `bugs/04_conan_camera_microjitter.md`, `bugs/05_conan_loadasset_delayed_abort.md` — разведка, без починки.

## KAIF — отправка и тикеты

KAIF 2.9 с 2026-10-16 (с 2.7 одним шагом; отчёт `reports/KAIF_UPDATES/KUMM_KAIF_2.9_UPDATE_REPORT.md`): факты проекта — в
`HOUSE_RULES.md`, хуки KAIF подключены в `.claude/settings.json` (клиент читает их при старте сессии). Отправка в KAIF — без спроса
владельца (`AGENT_GUIDE.md` → Notes from the human, его слово 18.09). Тикеты #72, #73, #78–#82 закрыты истоком в 2.8 (`bugs/KAIF/03–08_DONE_*`);
открыты #140 (`bugs/KAIF/09_*`, исток перенёс его в 2.10) и три тикета этого обновления — #150–#152 (`bugs/KAIF/10–12_*`).
