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

The engine works and the owner uses it daily for Palworld. Since 2026-10-14 it checks its pure core: `node test-parse-archive.mjs`,
`test-archive-roundtrip.mjs`, `test-pick-card.mjs`, `test-help-commands.mjs` (exit 0 = green), and the game half runs on a fake pack —
`node tools/fixture-pack.mjs` (`-ListMods`, `-Deploy -DryRun`). Not covered yet: deploy and `-Verify` checks on the stand (bug 46), the live
Nexus path (Chrome) — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🟡 in progress | 2026-10-14: four regression tests of the pure core + launch guard + fixture stand (`-ListMods`, `-DryRun`); left — deploy/`-Verify` on the stand (bug 46), Engine.ini warning |
| Phase 2 — the second game | 🟢 **доказана на Конане** | движок принял Conan Exiles Enhanced **без единой правки**: слаг `conanexilesenhanced` из манифеста, `game_id` со страницы. Oblivion Remastered остаётся подготовленным (манифест на 168 модов), ждёт патча |
| Phase 3 — compatibility | 🔲 todo | источник конфликтов найден: `UnrealPak -List` из Dev Kit читает любой пак с Oodle (`researches/conan-devkit/`); работа — фаза 3 эпика `plans/06` |
| Phase 4 — optimization presets | 🔲 todo | |

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- Сделанные пункты пула (запуск-гард, круговой ход имён архивов, кейсы `pickCard`, команда `help`) — летопись, запись 2026-10-14 23:22.
- [~] **A fixture pack** — разовый стенд 08.09 нашёл четыре дефекта переносимости (`bugs/03_DONE_*`, `EXP-0043`). Постоянный
      прибор — `node tools/fixture-pack.mjs` (2026-10-14): пак во временной папке ОС, `-ListMods` и `-Deploy -DryRun` — 10 проверок;
      на копии скрипта с дефектом бага 03 красные ровно две названные. **Осталось**: `-Verify` и боевая раскатка в папку стенда.
      Пробы 14:38 — две «зелени на пустом» в движке: (1) мод без шагов `install` (и не `pak` с `modsDir`) — `[ok] … (0 files)` без
      предупреждения; (2) мод без строк `verify` `-Verify` проверяет молча «никак»: после раскатки 2 файлов — «0 present, 0 missing, Verify
      clean» (сторожевые пути задаёт список `verify` мода — так задумано; дефект — молчание). Баг 46. Стенд даёт модам шаг `install`
      (2 файла кладутся); проверок раскатки и `-Verify` в нём ещё нет.
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

> Чаты до 2026-10-14 — летопись; последние — записи 2026-10-14 14:41 и 15:39 +03:00 (в 14:41 дословно перенесён прежний блок 13:33).
>
> **ГЛАВНОЕ — бюджет процессора: все моды вместе не дороже 1 мс главного потока в любом кадре** (`[OWNER]` «…НИКОГДА ни при каких
> условиях» · 2026-10-14; `MASTER_PLAN.md`). План — `plans/24_svarog_cpu_budget_1ms.md`. Замер — пульт `h.sh "modcost <сек> 14 bg" …
> "modcostwait"`, только на ЧИСТОМ запуске. **Где действует:** `[OWNER]` «При открытии - насрать. Лаг допустим.» · «Лаги не допустимы в
> игре, когда герой бегает а игрок играет, воюет, при геймплее основном» · 2026-10-14 ≈14:45 — окна вне бюджета, геймплей весь в нём.
> Сейчас (пачка 2, 2026-10-14 22:47, по одному замеру; среднее · худший кадр): **костёр 0,35 · 0,97 · бег 0,36 · 0,75 — впервые в бюджете**;
> перенос между участками 0,50 · 22,7 (пузырь реплики 11,5 + 9,6; трава камеры 2,08, было 20–26); сумка — не мерена в пачке 2 (была 82, вне
> бюджета); бой не мерен. Трава камеры ушла на видеокарту; худший кадр геймплея теперь — первая реплика жителя сразу после переноса.
> 0. **НОВЫЙ ЧАТ — ЭПИК 26, ПАЧКА 3** (`[OWNER]` «Продолжим завтра делать с того места, где остановишься» · 2026-10-14). Пачка 2 сделана и прогнана
>    девятью чистыми запусками — `testcases/reports/2026-10-14_svarog-refactor-batch2.md`, кейсы `testcases/TC_svarog_native_refactor_batch2_2026-10-14.md`,
>    план 26 раздел «Пачки». **В игре сейчас** (сверено md5 23:20): UIRework `274648d` (запас плашек), ColorRework `e7c63a6` + шейдеры 22:43
>    (`GrassGround`, высота травы), CameraRework `534f437` (высота травы глобалом, баг 50), ModMenu — пачки 1; KrinikFixes — НЕ выложен (баг 47).
>    В репозитории сборки новее игры: `GrassCoverage` без LINQ (`fd626e1`, `6b3c84e`) — собрано, не прогнано. Ритм — `[OWNER]` «сразу пиши, а
>    потом запускай и пачкой тестируй, потом фикси пачкой, опять пачкой тестируй». Порядок:
>    (1) **пузырь реплики** — первая фраза после переноса 10,5 мс, размазано поровну по частям (EXP-0276: это момент, а не часть); обычный
>    первый показ 2,15 мс, из них переподвешивание плашки к холсту 1,3 — разобрать, чем занят кадр после переноса и почему `SetParent`
>    дорог; глазом проверить вид плашки из запаса (B6 blocked — говорящий был вне кадра); (2) `ScanGrassMaterials` камеры — 2 мс на смену
>    участков; (3) окна (письма, `Fonts`, ForceRebuild); (4) замеры по три на сцену, бой и сумка. Долги пачки 1: кейсы R3, R7–R9, R11, R12,
>    R14–R16; R13 — «Сортировать» после горячей выкладки. Приборы: `node SvarogsDream/tools/refactor_inventory.mjs --check` (храповик опущен:
>    в кадре поисков 8, LINQ 26), `bash SvarogsDream/_harness/deploy_set.sh <корень>`, `bash SvarogsDream/_harness/batch2_run.sh` (кадры травы,
>    `modcost` трёх сцен, журнал), пульт `call KrinikCameraRework.Plugin GrassProtoReport` / `CamSwayStart 10` → `CamSwayResult`; шейдеры травы —
>    `KrinikShaders`, сборка `Unity.exe -batchmode … -executeMethod KrinikBuild.Bundles`. Перед кодом — `arch-gate` и `ui-gate` (как прежде).
>    **Время в текст — только из `date`** (хук `stamp-gate` дважды поймал угаданную минуту в этом чате).
> 0б. **GTA SA, баг 48** (`bugs/48_gta_sa_crash_parked_car_generator.md`) — падение «parked car generator» из-за нашего пула OLA 400; по слову
>    владельца: `Vehicles` 200, люди пулы 300 / предел 200 / появление 150/100 / удаление 160/110 / видимость 150, машины видимость 160 /
>    удаление 180/112,5 (досье `games/GTASanAndreas/README.md`, строки 2026-10-14). Ждёт проверки игрой владельца; упадёт снова — смотреть сейв.
> 0а. **Потом — мелкие баги пачкой** — `[OWNER]` «в новом чате начнём с того, что сразу мелкобаги будем чинить, которые
>    быстро чинятся и быстро тестятся» · «сразу пачкой много» · 2026-10-14 ≈20:48. Порядок: собрать список мелких (правка на час, проверка
>    кадром или строкой журнала) → тест-кейсы на все сразу → все правки → ОДНА сборка → ОДИН чистый запуск → все кейсы подряд → итог каждому.
>    **Список — `plans/25_svarog_small_bugs_batch.md`.** Сверка с кодом: 11 пунктов беклога, висящих открытыми, уже сделаны —
>    первым шагом `/check-backlog`; открыто на деле 8 (`bugs/42`, 45, 15, 06, 46, 14, пульт, C5); главный источник пачки — что владелец видит в игре.
> 1. **Прыжок (не мелочь) — выложить правки по `bugs/47` и прогнать кейсы B1–B5** (`testcases/TC_svarog_jump_physics_2026-10-14.md`). Владелец
>    сам играл прыжок 2026-10-14 вечером и принёс 4 замечания (`bugs/47_svarog_mvp_jumps_bugs.md`, его слова дословно). П. 1, 4 (прыжок
>    по WASD, а не по скользящему агенту), п. 3 (разбег уводит вверх вдоль склона) — в коде `SvarogsDream/src/KrinikFixes/Jump.cs`, сборка
>    собрана, **в игру НЕ выложена** (прогон эпика 26 `KrinikFixes` не трогал; прежняя причина «владелец был в игре» неверна — игра была
>    прогоном агента). Выкладка: сборка → копия `.dll`+`.pdb` в
>    `plugins/KrinikFixes` → чистый запуск. Кейсы: B1 тележка у −576,108,−608 (разбег по W, пробел в миг удара); B2 упор в склон + W;
>    B3 склон прыжков №13/15 (старт −594,4,110,8,−570,2 на запад); B4 бег по клику + утёс F12 повторно. П. 2 (бег вниз упёрся в край — не
>    соскальзывает) — не начат: нужен сход с сетки через край (режим «вне сетки», идеи 16, 17).
>    Полный прогон F: F12 утёс и F4 дерево — pass (вечер 2026-10-14; F4 — точка сетки на 2,5 м дальше касания, посмотреть); не сделаны
>    F5, F6 (камень), F13 (старт у ствола), F1 бегом, F11 при Ловкости 0/100 (`fieldon Player PlayerStats Agility N`, потом 30).
>    **Бюджет:** первый прыжок у утёсов после запуска — 1,064 мс (> 1 мс): разогрев при входе в мир не греет сцену форм утёсов.
>    **Ловушка прогона:** после дальнего телепорта игра несколько секунд держит `agent.speed = 0` — в `_harness/jump_run.sh` пауза 5 с.
>    Утёсы рядом с героем — `h.sh "findall SM_Cliff"` (теперь с позицией); ущелье у −612,145,−330, дубы у −573,130,−335.
>    **Вопрос владельцу после прогона:** падение в воду — урон до дна пруда или вода смягчает (`fall.measure-from-apex`).
>    **В тот же заход — баг 49** (прыжок сквозь стену дома, скрытую игрой): причина по коду — `HouseVisibility` выключает наружный вид дома с
>    коллайдерами; путь правки и кейсы W1–W6 — `bugs/49`, `testcases/TC_svarog_jump_hidden_wall_2026-10-14.md`.
> 2. **Камера** (G14), **плашки повышения** (долг S1), **полосы врагов вдали**, **панель в сумке** — без изменений, летопись 14:41 (блок 13:33).
> 2а. **BepInEx.ConfigurationManager:** #129 (23 перевода + вёрстка кнопки сброса) и #127 (число у ползунка) **приняты** 2026-10-14. Когда
>    выйдет релиз — убрать наш транспайлер ширины числа в `KrinikModMenu` (`researches/bepinex-configmanager-pr125/`).
> 3. **Движок KUMM** (пул ниже): стенд `node tools/fixture-pack.mjs` — дальше раскатка и `-Verify` с проверками; баг 46; Engine.ini.
>
> Закрыто мягко 2026-10-14 23:22 (чат с 22:25; летопись — запись того же времени, в ней дословно прежний пункт 0). Игра закрыта; сейв
> Сварога — на точке `_backups/svarog-saves-2026-10-14_2236-before-batch2` (10 из 10).
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

Файлов без метки DONE — 20 (2026-10-14 23:22: + 49, 50):

- 🔧 `bugs/50_svarog_camera_sways_with_hero_breathing.md` — камера качалась с дыханием героя; починено и доказано замером (размах 0,0419 → 0),
  выложено; ждёт глаза владельца.
- 🔴 `bugs/49_svarog_jump_through_hidden_house_wall.md` — прыжок сквозь стену дома, скрытую игрой; причина по коду найдена, путь правки и
  кейсы записаны, кода нет.

- 🔧 `bugs/48_gta_sa_crash_parked_car_generator.md` — GTA SA падала на пуле машин 400 (наша правка 03.10); пулы и дальности переставлены по
  слову владельца, в игре не проверено.

- 🔧 `bugs/47_svarog_mvp_jumps_bugs.md` — прыжок: по WASD, а не вбок/вверх (п. 1, 4), вверх по склону (п. 3) — починено в коде, не выложено;
  п. 2 (не соскальзывает с края вниз) — не начат.

- 🔴 `bugs/46_verify_silent_on_mods_without_checks.md` — движок: мод без строк `verify` `-Verify` проверяет молча «никак» (`Verify clean`), мод
  без единого файла раскатывается как `[ok]`; найдено стендом `tools/fixture-pack.mjs`, план починки — в документе.

- 🔴 `bugs/44_svarog_grass_loses_volume_top_down.md` — трава при камере сверху (≈90°) без объёма и зелени; владелец повторил 2026-10-14
  («тонкий без толщины спрайт»); вся трава теперь рисуется нашими копиями шейдеров — гипотеза и место правки в документе; вкусовое — макеты.
- 🔧 `bugs/45_svarog_hot_reload_leaks_portraits_game_crash.md` — горячие выкладки копили портреты, игра владельца упала 22:24; утечка
  починена (`HeroPortraits.cs`), не проверено, что память не растёт.
- 🔴 `bugs/42_svarog_skill_tip_title_white_then_red.md` — заголовок поп-апа навыка ≈0.5 с белый, потом красный (переход с навыка на навык); причина не найдена.

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
