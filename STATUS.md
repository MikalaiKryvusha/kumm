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
> **Svarog's Dream** — досье `games/SvarogsDream/README.md`, беклог `plans/18_svarog_backlog_checklist.md`. Правила прогона — `HOUSE_RULES.md`
> §5 «Прогон Сварога»: с 2026-10-18 сейвы в распоряжении агента (владелец не играет на прохождение, интервью #022, Q5), после `h.sh kill` —
> `bash tools/reg-snap.sh restore`; читы пульта — только внутри прогона, с плашкой (Q6); время не останавливать (память
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
- 🧹 **Уборка дисков 2026-10-25 почти закрыта** — итоги и «решать вам»: `C:\REVISIONS\РЕВИЗИЯ_C_2026-10-25_ИТОГ.md`,
      `D:\REVISIONS\РЕВИЗИЯ_D_2026-10-25_ИТОГ.md` (C 28,9 → 263 ГБ свободно; D 47 → 179 ГБ, на 18:30; J: импорт `J:\FTP` в
      `J:\OLD_HDD\Pic\Фото`, `FTP` удалена). TEMP/TMP пользователя → `D:\Temp` (вечером, слово владельца), `.claude` → `F:\Claude\.claude`
      ссылкой, дамп → `D:\dump`. Шаги после перезагрузки сделаны 18:48 — пункт 0 «Где продолжить»; на владельце — «решать вам» отчётов.
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

> Прошлые чаты — летопись; последние записи — 2026-10-18 01:35 (ночь: панель, полоса, черепа, вести, свет), 2026-10-17 20:01 (вещи на панели ссылками, поп-апы к одной норме), 16:40 (портреты 29, черты 0–6
> и в HUD) и 15:19 (иконки 108 черт, биографии).
>
> **ПОРЯДОК НОВОГО ЧАТА** (`[OWNER]` «с этого продолжим в новом чате после перезагрузки компа и завершения уборки на компе · соберём
> рабочий DS2 - и затем вернёмся к сборке по Конану» · 2026-10-25 18:2x):
> 0. ✅ **Уборка после перезагрузки сделана 2026-10-25 18:48:** `C:\dump\MEMORY.DMP` удалён (дамп — `D:\dump`, 8 ГБ), старая `Temp` на C и
>    `F:\Temp` пусты (17 213 файлов по файлу; ссылку `node_modules` черновика KUIPS сняли саму, цель цела), DISM — код 0; `$env:TEMP` = `D:\Temp`,
>    `.claude` → `F:\Claude\.claude`, ссылки `_devtools` живы. Свободно: C 272,4 · D 172,1 · F 187,1 · J 188,1 ГБ. Мерцание окон при входе:
>    KAGO при каждом входе повторял откат безопасного режима дисков по расписке от 13.09 — расписка в архиве, баг агенту KAGO
>    `KAGO/bugs/154_…`; видимы ли были окна и чьи (NVIDIA app `OAWrapper` ×21, HDSentinel `cscript`, ASUS `AsRyzenMaster`) — не установлено.
>    KAGO: профиль карты «Optimised» отвергается при каждом входе с 2026-10-22 22:34 (доказан на драйвере 617.42, драйвер 621.01 встал
>    22.10 между 22:10 и 22:34) — карта стояла на заводских 300 Вт, а трей показывал ⚖️. Владелец: «ПОЧИНИТЬ!» → правило KAGO 25.10
>    (`KAGO/ЗАКАЗ.md` §11, коммит KAGO `84de5f0`): драйвер новее отметки — режим ставится, трей «не проверен на драйвере N»; не включился —
>    заводской и ошибка в трее; ПКМ по трею — режимы и «Закрыть KAGO». С 19:00 на карте ⚖️ 250 Вт, не проверен на 621.01.
> 1. **Dungeon Siege II на современных библиотеках** — 4K на весь экран с крупным интерфейсом, без Lossless Scaling. Разведка сделана:
>    руководство сообщества github.com/GenesisFR/DS2TroubleshootingGuide — dgVoodoo2 (`D3D9.dll` + `dgVoodoo.conf`, вкладка DirectX:
>    видеокарта «GeForce FX 5700 Ultra», разрешение = родное), игра в 720p–1080p, dgVoodoo растягивает → интерфейс крупный; DXVK там не
>    описан. Пробовать на КОПИИ папки, рабочая сборка (`enshrouded.exe` в окне 1366×768 + Lossless Scaling, `_PORTABLE\README.txt`,
>    `ВОССТАНОВИТЬ.bat`) не трогается; победителя — в `restore.ps1`. Кадры владельцу на отсмотр.
> 2. Затем Конан — ниже.
>
> PARKED-ПОРЯДОК 2026-10-25: **Конан 3.0.1** по слову владельца того дня («собрать сборку Krinik'a на этой версии …
>    провестировать, что все моды запускаются»). Сборка на 3.0.1 работает (план 33, отчёт `testcases/reports/2026-10-25_conan-3.0.1-pereezd.md`);
>    UE4SS 1181 стоит. На 2026-10-25 12:07: в игре **63 пака** (43 + 13 модов Мастерской + Era of Trials + 6 модов удобства), все
>    монтируются, меню живое. **Вечер 25.10:** новый кит в `F:\CEUE5Devkit`, `KrinikRU` 7 147 записей; Severe Weather в сборке (64 пака), туман
>    выключен по глазу владельца; графика владельца возвращена в 3.0.1, `r.NGX.DLSS.Preset=13` ронял игру — баг 63, исправлено; HUD Hosav —
>    чёрная обводка 2 точки (выбор владельца), мод `KrinikHudOutline` проверен в мире. **Что делать — план 33, «Следующая сессия», пункты 4а (HUD, счётчик кадров, `KrinikConanHarness`), 2, 3, 5.**
>    Сварог (пункт 00000 ниже) ждёт за Конаном; его старые пункты 0000 и 000 — летопись, запись 2026-10-25 12:07.
>
> 00000. **НАЧАТЬ С ЭТОГО — волна багов владельца 2026-10-18 13:35–13:43 и план процесса.** `[OWNER]` «чинить будем в новом чате, этот закрывай» ·
>    2026-10-18 13:43. Порядок: (1) **план 32** `plans/32_svarog_process_owner_bug_wave_2026-10-18.md` — разбор «как ты разрабатываешь и как
>    тестируешь»; его шаги Ш2–Ш4 (стражи К7 латиница, В4 наложение, К2 прыжок вкладок) доказываются красным на багах ниже ДО их починки;
>    (2) **баги владельца 55–62** (`bugs/55_…` – `bugs/62_…`, план 31 строки 20б–28): 55 «Таланты» — названия налезают; 56 неполнота переводов
>    («What a waste.», «Scaling: … per 100 points.», «Piercing weapons and blunt damage.»); 57 подсказка навыка секунду английская (возврат 06.10) —
>    корень найден и правка в `InstantTranslate.cs` (буква шаблона `[{][{][A-Z][}][}]` в правилах словаря = любое число), в игре НЕ проверена;
>    58 числа в подсказке таланта без цвета; 59 «Отслеживать квест» на границе поля; 60 текст заголовков не по середине мазка; 61 «Прогресс» —
>    разный кегль, прыгает при смене вкладок; 62 окно событий — пробел в начале строк, список без поля, «Ема/Эма»; (3) кнопка ⇅ — меньше,
>    полупрозрачная подложка в цвет ячеек первого набора (план 31, 20б).
>    **Сделано днём 13:04–13:35** (отчёт `testcases/reports/2026-10-18_svarog-day-buff-strip-passes1-5.md`, кейсы
>    `testcases/TC_svarog_buff_strip_order_wrap_2026-10-18.md`): интервью #024 отвечено (Q1 — баг 54 DONE 25.10, если красное не вернётся; Q2 —
>    долг владельца; Q5 — бумага остаётся); полоса над карточкой — пассивки всегда ярко (прогнан набор без лука; «совсем без оружия» — нет), порядок «черты · пассивки · временные», перенос вверх в 2–3
>    строки, добор ячеек сверх 10 игровых, мгновенный выключатель, возврат полосы игре с размером — в игре pass; цифра перезарядки по центру
>    (E `dy 0`); ряд круглых кнопок на 720p — pass; подсказка значка над значком — левый край pass, зазор после правки `Bounds` по кайме НЕ проверен
>    (кейсы S10c, R1). Падение игры в драйвере после `hdr.ps1 on` при открытой игре — страж в `hdr.ps1`, EXP-0318.
>    **Запуск:** точка `_backups/svarog-saves-2026-10-18_1303-live-before-day-run` (= ночная 0225) — `SAFE_SPOT="-590,96,1863" bash tools/run-game.sh`;
>    оружие игра убирает через 1–2 с после загрузки — `isEquiped` читать после `wait 2`, потом щелчок «Оружие». Живой сейв после 13:35 — игра
>    владельца (3 файла отличаются от точки). Долг из #023: новые черты — показать владельцу; значки 105 и 93 — рисуем вместе. Прежний текст
>    пункта — летопись, запись 2026-10-18 13:45.
>
> 0000–000. Открытые пункты Сварога от 17.10 (кейсы J4, J5, G1, поп-апы, волосы героев, окна хранилищ, рандом советов, провал кадров, HUD C3/C4/K1)
>    — летопись, запись 2026-10-25 12:07 (перенесено дословно).
> 00. **План 27** (`plans/27_svarog_random_hero_traits.md`): сделанное днём 2026-10-17 — летопись, запись 2026-10-17 15:19. Дальше: (1) починки
>    8–10 `KrinikFixes/AuthorBugs.cs` в бою (кейс R8); (2) окно «Новый герой. Сменить класс?», бафф «Защита Велеса», Staggered, атрибут > 95 → 90.
>
> Сварог: бюджет процессора 1 мс (замеры 17.10), пункты 0/2/3 от 17.10 и точка сверки сейвов — летопись, запись 2026-10-25 18:30 (дословно); правило бюджета — `MASTER_PLAN.md`.
>
> **Порядок прогона Сварога** (точка сейвов, запуск, откат, где живут моды, виртуальный экран) — `HOUSE_RULES.md` → §5, строка «Прогон Сварога».
>
> **Решено для MVP** — прыжок и падение: идея 17 (`[OWNER]` «давай примем для MVP, чтобы с чего-то начать» · 2026-10-14); ждут владельца — летопись 15:19.

## Open bugs

Файлов без метки DONE — 29 (2026-10-18 13:45):

- 🔴 Баги владельца 55–62 (2026-10-18 13:35–13:43, волна за 5 минут игры) — `bugs/55_…` – `bugs/62_…`; порядок и план 32 — пункт 00000 выше.

- 🔧 `bugs/54_svarog_second_set_red_after_first_swap.md` — красная ячейка второго набора после первой смены: воспроизведено и правка подтверждена
  2026-10-18 (B1–B3 на видео, B0 и B4 — пультом и кадром; `PatchStaleCooldown`); владелец путь «вся панель» не помнит (интервью #024, Q1 — «1 А»):
  DONE 2026-10-25, если за неделю его игры красное не вернётся.

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
- 🔧 `bugs/45_svarog_hot_reload_leaks_portraits_game_crash.md` — горячие выкладки копили портреты; 2026-10-17 вечером несколько выкладок подряд:
  через 3 с +373 МБ (выше предела кейса M1), через 1,5 мин — ниже исходной; утечки не видно, критерий M1 — пересмотреть, нужен второй вечер.

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
