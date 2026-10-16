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

- Сделанные пункты пула (запуск-гард, круговой ход имён архивов, кейсы `pickCard`, команда `help`) — летопись, запись 2026-10-14 23:22.
- [x] **A fixture pack** — `node tools/fixture-pack.mjs`: пак во временной папке ОС; `-ListMods`, `-Deploy -DryRun`, настоящая
      раскатка `-Deploy` в папку стенда, `-Verify` (удалённый сторожевой файл даёт `[FAIL]` и код 1), паки после `-Only` — 20 проверок
      (коммит `84e4ba4`, 2026-10-15; обе «зелени на пустом» закрыты — `bugs/46_DONE_verify_silent_on_mods_without_checks.md`).
      Прогон 2026-10-16 при обновлении KAIF: все 20 прошли.
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

> Прошлые чаты — летопись; последняя запись — 2026-10-16 10:11 +03:00 (в ней дословно прежний пункт 0).
>
> **ГЛАВНОЕ — бюджет процессора: все моды вместе не дороже 1 мс главного потока в любом кадре** (`[OWNER]` «…НИКОГДА ни при каких
> условиях» · 2026-10-14; `MASTER_PLAN.md`). План — `plans/24_svarog_cpu_budget_1ms.md`. Замер — пульт `h.sh "modcost <сек> 14 bg" …
> "modcostwait"`, только на ЧИСТОМ запуске. **Где действует:** `[OWNER]` «При открытии - насрать. Лаг допустим.» · «Лаги не допустимы в
> игре, когда герой бегает а игрок играет, воюет, при геймплее основном» · 2026-10-14 ≈14:45 — окна вне бюджета, геймплей весь в нём.
> Сейчас (пачка 2, 2026-10-14 22:47, по одному замеру; среднее · худший кадр): **костёр 0,35 · 0,97 · бег 0,36 · 0,75 — впервые в бюджете**;
> перенос между участками 0,50 · 22,7 (пузырь реплики 11,5 + 9,6; трава камеры 2,08, было 20–26); сумка — не мерена в пачке 2 (была 82, вне
> бюджета); бой не мерен. Трава камеры ушла на видеокарту; худший кадр геймплея теперь — первая реплика жителя сразу после переноса.
> 0. **ДАЛЬШЕ — МЕЛОЧИ ПАЧКОЙ И РЕФАКТОРИНГ ПО МЕТОДИЧКЕ, а не прыжки** (`[OWNER]` «почему не фиксишь мелочи пачкой в первую очередь, как я
>    просио» · «почему не рефакторишь моды по нашей методичке, как мы начинали» · «работай автономно по мелочам и рефакторингу час» ·
>    2026-10-16). Порядок: план 25 (мелочи) → эпик 26 (`plans/26_EPIC_svarog_native_refactor.md`, раздел «Ход 2026-10-16») → план 24 (бюджет).
>    Сделано 2026-10-16 (отчёт `testcases/reports/2026-10-16_svarog-batch4-walls-hotbar-savecard-linq.md`, кейсы
>    `testcases/TC_svarog_batch4_linq_and_walls_2026-10-16.md`): баг 49 — стены держат прыжок (у стен домов коллайдеров нет вовсе, стена —
>    край сетки, `PhantomWall`; владелец: «да, сработала», «работает»); ряд быстрых действий держит запасную панель игры после смены оружия
>    (STATUS прежний п. 0(5) — виновник найден, `HudRow.cs`); карточка сейва в «Загрузить игру» — колонка и дата (`SaveCard.cs`); LINQ в
>    покадровых методах мода цвета 26 → 0 (`Shared/CsvList.cs`); переписи материалов на смене участка — кусками по 0,25 мс за кадр у RoofFog,
>    NightParticles, FoliageCoverage, GrassCoverage (каждая 0,66–0,98 мс вместо 1,2–1,6 — без перебора памяти снимка, он в п. (1)); пульт: `active <путь>` читает, пробел в пути — `~`.
>    **В игре сейчас** (2026-10-16 10:10): KrinikFixes `05da363`, KrinikColorRework `7776426` (в `plugins`), KrinikUIRework `42d7b46` (в
>    `scripts`), KrinikDevHarness `88c1604`. Следующее:
>    (1) **перебор памяти снимка** `TerrainWatch.Materials` → `FindObjectsOfTypeAll<Material>` — до 3,84 мс кадра у компонента, спросившего
>    первым (кейс L11): брать материалы подгруженного участка из его рендереров, без перебора всей памяти; затем BillboardFog (≈1,0–1,2) и
>    MatteTerrain (1,9–2,5 — цикл по участкам). Замер: `bash tools/run-game.sh`, через 50 с `h.sh "modcost 10 14 bg" "teleport innGradLocation"
>    "wait 8" "modcostwait"` (мерить в устоявшемся мире — EXP-0282);
>    (2) **пузырь реплики** 11–12 мс после переноса — как показать первую фразу в ≤1 с, вопрос вида владельцу (прежний п. 0(3), летопись);
>    (3) **мелочи плана 25**: имя сейва `saveFile-0` (вопрос владельцу), K1 бага 42 (заголовок навыка), бага 45 (память при горячих выкладках),
>    бага 15 (земля при ходьбе против солнца), вода у Бары W3 (`bugs/51`), «пылевая буря» (прежний п. 0(4), летопись);
>    (4) советы экрана загрузки — короче (`plans/18` раздел 0; таблицей «было | стало» владельцу).
>    **Ловушки дня:** у владельца D — своя клавиша (прячет HUD), панели переключает смена оружия — `callon Player PlayerEquipment SwapWeapons`;
>    `ShowLoadGame` игры лишь запускает корутину `ShowSaveFileAfter` (EXP-0281); не больше двух горячих выкладок `KrinikUIRework` подряд.
> 0б. **GTA SA, баг 48** (`bugs/48_gta_sa_crash_parked_car_generator.md`) — падение «parked car generator» из-за нашего пула OLA 400; по слову
>    владельца: `Vehicles` 200, люди пулы 300 / предел 200 / появление 150/100 / удаление 160/110 / видимость 150, машины видимость 160 /
>    удаление 180/112,5 (досье `games/GTASanAndreas/README.md`, строки 2026-10-14). Ждёт проверки игрой владельца; упадёт снова — смотреть сейв.
> 1. **Прыжок (не мелочь) — прогнать кейсы B1–B5 по выложенным правкам `bugs/47`** (`testcases/TC_svarog_jump_physics_2026-10-14.md`). Владелец
>    сам играл прыжок 2026-10-14 вечером и принёс 4 замечания (`bugs/47_svarog_mvp_jumps_bugs.md`, его слова дословно). П. 1, 4 (прыжок
>    по WASD, а не по скользящему агенту), п. 3 (разбег уводит вверх вдоль склона) — в коде `SvarogsDream/src/KrinikFixes/Jump.cs`, сборка
>    собрана и **выложена 2026-10-15 21:30** (вместе с починкой загрузки мода — EXP-0278); дымовой прыжок `jump #1` на месте, кейсы ниже не
>    прогнаны. Кейсы: B1 тележка у −576,108,−608 (разбег по W, пробел в миг удара); B2 упор в склон + W;
>    B3 склон прыжков №13/15 (старт −594,4,110,8,−570,2 на запад); B4 бег по клику + утёс F12 повторно. П. 2 (бег вниз упёрся в край — не
>    соскальзывает) — не начат: нужен сход с сетки через край (режим «вне сетки», идеи 16, 17).
>    Полный прогон F: F12 утёс и F4 дерево — pass (вечер 2026-10-14; F4 — точка сетки на 2,5 м дальше касания, посмотреть); не сделаны
>    F5, F6 (камень), F13 (старт у ствола), F1 бегом, F11 при Ловкости 0/100 (`fieldon Player PlayerStats Agility N`, потом 30).
>    **Бюджет:** первый прыжок у утёсов после запуска — 1,064 мс (> 1 мс): разогрев при входе в мир не греет сцену форм утёсов.
>    **Ловушка прогона:** после дальнего телепорта игра несколько секунд держит `agent.speed = 0` — в `_harness/jump_run.sh` пауза 5 с.
>    Утёсы рядом с героем — `h.sh "findall SM_Cliff"` (теперь с позицией); ущелье у −612,145,−330, дубы у −573,130,−335.
>    **Вопрос владельцу после прогона:** падение в воду — урон до дна пруда или вода смягчает (`fall.measure-from-apex`).
>    **Баг 49** (прыжок сквозь стены домов) — правка выложена 2026-10-16, стены держат; до DONE — W3 (дверь) и W5 (прыжки вне домов),
>    `testcases/TC_svarog_jump_hidden_wall_2026-10-14.md`. Первый прыжок после запуска — худший кадр 1,6 мс (F15), причина не найдена.
> 2. **Камера** (G14), **плашки повышения** (долг S1), **полосы врагов вдали**, **панель в сумке** — без изменений, летопись 14:41 (блок 13:33).
> 2а. **BepInEx.ConfigurationManager:** #129 (23 перевода + вёрстка кнопки сброса) и #127 (число у ползунка) **приняты** 2026-10-14. Когда
>    выйдет релиз — убрать наш транспайлер ширины числа в `KrinikModMenu` (`researches/bepinex-configmanager-pr125/`).
> 3. **Движок KUMM** (пул ниже): стенд `node tools/fixture-pack.mjs` готов (20 проверок, с раскаткой и `-Verify`); дальше — Engine.ini.
>
> Закрыто мягко 2026-10-16 10:11 (чат с 08:49; летопись — запись 2026-10-16 10:11, в ней дословно прежние пункт 0 и абзац закрытия). Игра
> закрыта; сейв Сварога — на точке `_backups/svarog-saves-2026-10-16_0855-before-batch4` (10 из 10); реестр возвращён (1280×720).
>
> **Порядок прогона:** живой сейв после вечера — состояние владельца (он играл после наших телепортов); перед своим прогоном — новая точка:
> копия `LocalLow/VI Games/Svarog's Dream` в `_backups/svarog-saves-<дата>_<время>-…` + `SAVE_POINT=… save-check.sh` (10 из 10). `bash tools/run-game.sh` → кейсы →
> `h.sh kill` → `SAVE_POINT=<полный путь> bash tools/save-check.sh --restore` (сторож живой игры починен 2026-10-14) → `bash tools/reg-snap.sh restore`.
> `KrinikFixes` живёт в `BepInEx/plugins` — горячая выкладка его не берёт (отказ по GUID): только сборка → копия в `plugins/KrinikFixes` →
> чистый запуск. `KrinikUIRework` — в `scripts`, горячо, не больше двух выкладок подряд. Экран стал виртуальным 1280×720 (`\\.\DISPLAY15`,
> 2026-10-14 14:12, владелец в это время писал в чат — похоже, стрим): такой экран — стрим владельца: запускать только по его слову (2026-10-14 вечером запускали по слову).
>
> **Решено для MVP** (`[OWNER]` «давай примем для MVP, чтобы с чего-то начать» · 2026-10-14): высота прыжка 1 + Ловкость/25 м, безопасная
> высота падения 4 + Ловкость/10 м, урон растёт до смертельной высоты (24 + Ловкость/5 м — `[AI]` по мандату) — идея 17, кейсы F10, F11.
> **Ждёт владельца:** имя «особой кузни» (совет 10); выбор воды по ролику и видео-демо неба — «позже».

1. **Конан, KAIF, Palworld, движок фаза 1, /check-backlog, стражи** — летопись, запись 2026-10-13 23:00 (перенесено дословно).
## Open bugs

Файлов без метки DONE — 20 (2026-10-15 21:36: + 51, − 46):

- 🔧 `bugs/51_svarog_water_reflection_flips_with_camera.md` — вода у Бары: отражение пропадает с углом, дальний пруд мигает, стены изб не
  отражаются; правка выложена 2026-10-15 21:12, проверка W1–W3 не доказана (STATUS пункт 0).
- 🔧 `bugs/50_svarog_camera_sways_with_hero_breathing.md` — камера качалась с дыханием героя; починено и доказано замером (размах 0,0419 → 0),
  выложено; ждёт глаза владельца.
- 🔧 `bugs/49_svarog_jump_through_hidden_house_wall.md` — прыжок сквозь стены домов (у стен нет коллайдеров вовсе); правка `PhantomWall`
  выложена 2026-10-16, владелец: «работает»; до DONE — W3, W5.

- 🔧 `bugs/48_gta_sa_crash_parked_car_generator.md` — GTA SA падала на пуле машин 400 (наша правка 03.10); пулы и дальности переставлены по
  слову владельца, в игре не проверено.

- 🔧 `bugs/47_svarog_mvp_jumps_bugs.md` — прыжок: по WASD, а не вбок/вверх (п. 1, 4), вверх по склону (п. 3) — выложено 2026-10-15, кейсы не прогнаны;
  п. 2 (не соскальзывает с края вниз) — не начат.

- 🔴 `bugs/44_svarog_grass_loses_volume_top_down.md` — трава при камере сверху (≈90°) без объёма и зелени; владелец повторил 2026-10-14
  («тонкий без толщины спрайт»); вся трава теперь рисуется нашими копиями шейдеров — гипотеза и место правки в документе; вкусовое — макеты.
- 🔧 `bugs/45_svarog_hot_reload_leaks_portraits_game_crash.md` — горячие выкладки копили портреты, игра владельца упала 22:24; утечка
  починена (`HeroPortraits.cs`), не проверено, что память не растёт.
- 🔧 `bugs/42_svarog_skill_tip_title_white_then_red.md` — заголовок поп-апа навыка ≈0.5 с белый, потом красный; причина по коду, правка выложена 2026-10-15, в игре не проверена.

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
