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

- [x] **Запуск-гард** — 2026-10-14: диспетчер `kumm.mjs` под `IS_MAIN` (realpath, на Windows без регистра); импорт печатает
      только экспорты, `status`/`close`/неизвестная команда — побайтно как раньше, справка — одна строка комментария другая.
- [x] **Round-trip check for the archive naming scheme** — разбор 08.09 (`test-parse-archive.mjs`), круговой ход 2026-10-14
      (`test-archive-roundtrip.mjs`, 8 случаев): нашёл версию с пробелом («1.2 beta» — имя не читалось назад), запись версии — «_».
- [x] **Cases for `sameFile`/`stamp` and `pickCard`** — 2026-10-14, `test-pick-card.mjs`, 17 случаев, доказан тремя мутациями.
- [~] **A fixture pack** — разовый стенд 08.09 нашёл четыре дефекта переносимости (`bugs/03_DONE_*`, `EXP-0043`). Постоянный
      прибор — `node tools/fixture-pack.mjs` (2026-10-14): пак во временной папке ОС, `-ListMods` и `-Deploy -DryRun` — 10 проверок;
      на копии скрипта с дефектом бага 03 красные ровно две названные. **Осталось**: `-Verify` и боевая раскатка в папку стенда.
      Пробы 14:38 — две «зелени на пустом» в движке: (1) мод без шагов `install` (и не `pak` с `modsDir`) — `[ok] … (0 files)` без
      предупреждения; (2) мод без строк `verify` `-Verify` проверяет молча «никак»: после раскатки 2 файлов — «0 present, 0 missing, Verify
      clean» (сторожевые пути задаёт список `verify` мода — так задумано; дефект — молчание). Баг 46. Стенд даёт модам шаг `install`
      (2 файла кладутся); проверок раскатки и `-Verify` в нём ещё нет.
- [x] **A real `help` command** — 2026-10-14: `help` печатает только шапку (41 строка вместо 109 комментариев файла); шапка —
      источник, switch и таблицу README сверяет `node test-help-commands.mjs` (доказан двумя поломками).
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

> Чаты до 2026-10-14 — летопись; последние — записи 2026-10-14 13:33 и 14:41 +03:00 (в 14:41 дословно перенесён прежний блок 13:33).
>
> **ГЛАВНОЕ — бюджет процессора: все моды вместе не дороже 1 мс главного потока в любом кадре** (`[OWNER]` «…НИКОГДА ни при каких
> условиях» · 2026-10-14; `MASTER_PLAN.md`). План — `plans/24_svarog_cpu_budget_1ms.md`. Замер — пульт `h.sh "modcost <сек> 14 bg" …
> "modcostwait"`, только на ЧИСТОМ запуске. Сейчас: костёр 0,95 мс (pass) · бег 1,13 · окна — худший кадр 69,6 (был 109,7), проход окна
> персонажа 13–17 мс (был 35–73; строки журнала `letter <окно> ms: …`) · перенос героя 24–29. Порядок: (1) окна — проход только при
> изменении окна (что держит повторный проход и чем его заменить — план 24, пункт `KrinikLetter`); (2) поиски по сцене каждый кадр, пока цель
> не найдена: `EquipPlaceholdersTick`, `LootLookTick`, `CompassTick` — сначала `modcost`, правка — корень «UI» и `Transform.Find`
> (перепись — `node SvarogsDream/tools/scene_search_census.mjs`); (3) одна перепись материалов вместо шести; (4) трава — в шейдер; (5) пузырь реплики.
> 1. **ПЕРВЫМ — прыжок и лазание** (идеи 17, 16). Прыжок работает (SvarogsDream `51f338d`; R1–R7 pass, склон на сетке и мышь — не
>    проверены; `testcases/TC_svarog_jump_prototype_2026-10-14.md`). Владелец: полёт — как физика, лазание — как в Conan Exiles и Palworld;
>    прыжок на склон или камень — зацеп в позу лазания, выносливость убывает, пока висит (слова — идеи 16, 17). Шаги: (а) разведка готова —
>    `researches/svarogs-dream/climbing-jump-recon.md` (Oblivion: прыжок от навыка Акробатики, не от Ловкости; сетка навигации не держит
>    уклон круче 60° — на скалах невозможна; рекомендация — один режим «вне сетки»: полёт, зацеп, лазание, выход на уступ); (б) написать
>    методическое пособие по прыжкам и лазанию — просьба владельца `[OWNER]` «ресерч документ, методическое пособие по прыжкам, разанью -
>    напишешь?» · 2026-10-14; образец — `researches/unity-ugui-layout/` (метки `TAG:`, ловушки); (в) кейсы
>    `testcases/TC_svarog_jump_physics_2026-10-14.md` — F0 первым (слои коллайдеров пультом `layers`), потом покадровый полёт.
> 2. **Камера** (G14), **плашки повышения** (долг S1), **полосы врагов вдали**, **панель в сумке** — без изменений, летопись 14:41 (блок 13:33).
> 3. **Движок KUMM** (пул ниже): стенд `node tools/fixture-pack.mjs` — дальше раскатка и `-Verify` с проверками; баг 46; Engine.ini.
>
> Закрыто мягко 2026-10-14 (автономный час 13:42–14:42). Игра закрыта в 14:13, сейв возвращён к точке — 10 из 10, реестр экрана — 3840×2160, режим 1.
>
> **Порядок прогона:** точка сейва — `_backups/svarog-saves-2026-10-14_0832-owner-before-camera-ground` (10 из 10). `bash tools/run-game.sh` → кейсы →
> `h.sh kill` → `SAVE_POINT=<полный путь> bash tools/save-check.sh --restore` (сторож живой игры починен 2026-10-14) → `bash tools/reg-snap.sh restore`.
> `KrinikFixes` живёт в `BepInEx/plugins` — горячая выкладка его не берёт (отказ по GUID): только сборка → копия в `plugins/KrinikFixes` →
> чистый запуск. `KrinikUIRework` — в `scripts`, горячо, не больше двух выкладок подряд. Экран стал виртуальным 1280×720 (`\\.\DISPLAY15`,
> 2026-10-14 14:12, владелец в это время писал в чат — похоже, стрим): такой экран — игру не запускать, запущенную — закрыть.
>
> **Ждёт владельца:** высота прыжка от Ловкости (предложено `[AI]`: 1 + Ловкость/25; разведка проверит, от чего прыжок в Oblivion); имя
> «особой кузни» (совет 10); выбор воды по ролику и видео-демо неба — «позже».

1. **Конан, KAIF, Palworld, движок фаза 1, /check-backlog, стражи** — летопись, запись 2026-10-13 23:00 (перенесено дословно).
## Open bugs

Файлов без метки DONE — 16 (пересчитано `ls bugs/*.md` 2026-10-14 при закрытии; заведён 46):

- 🔴 `bugs/46_verify_silent_on_mods_without_checks.md` — движок: мод без строк `verify` `-Verify` проверяет молча «никак» (`Verify clean`), мод
  без единого файла раскатывается как `[ok]`; найдено стендом `tools/fixture-pack.mjs`, план починки — в документе.

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
