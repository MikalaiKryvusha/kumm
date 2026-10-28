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

> 🎯 **Сборка Конана 3.0.1 — главное с 2026-10-26 ≈08:30, все прочие игры не в приоритете.** `[OWNER]` «все игры пока не в приоритере, мы
> работаем дат сборкой конана» · «она 1_ должна работать стабильно 2_ моды не должны конфликтовать, должны быть рабочими 3_ не должно быть
> явных просадок производительности из-за модов» · 2026-10-26. Порядок работ — «Where to continue», пункт 0.
>
> **Svarog's Dream — главное до 2026-10-26, с 2026-10-09** (`[OWNER]` «забей на Medieval Dynasty … мы работаем дальше над Сварогом» · 2026-10-09 ≈13:25;
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
21 checks since 2026-10-28 — a new pak's place under `-Only`; all 21 passed on 2026-10-28). Not covered yet: the live Nexus path (Chrome) — Phase 1 in `MASTER_PLAN.md`.

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

- 🎯 **Стрельба из лука «по-обливионски» — поднята владельцем 2026-10-28** (обсуждение, не работа: `[OWNER]` «пока обсуждаем»): скорость стрелы — конановская,
      падение — как в Обливионе. Ванильные `ArrowGravityScale` 0,55 и `ArrowInitialSpeedMultiplier` 5000 (Remastered) найдены; ждёт его выбора — что делает
      натяжка (сила выстрела, как в Remastered, или прямее полёт, как в Конане). Разведка — `researches/conan-archery/README.md`.
- 🧹 Уборка дисков 2026-10-25 — «решать вам» отчётов `C:\REVISIONS\…_ИТОГ.md`, `D:\REVISIONS\…_ИТОГ.md` на владельце (летопись, 2026-10-25 22:15).
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

> **ПЕРВЫМ В НОВОМ ЧАТЕ (закрытие 2026-10-28 23:09):** очередь слов владельца ниже, пункты (0а), (0б), (1) — по порядку. Перед любым прогоном —
> стенд по `HOUSE_RULES.md` §1 «Тестовое окружение» (убрать всех вокруг, цель — по точному классу, простой ввода `wait-input-idle.ps1`). Пак
> Конана после каждого коммита — `git push local main`. Хук `test-after-code` при остановке назовёт открытые кейсы — прогнать или позвать владельца.
> Отчёты вечера: `testcases/reports/2026-10-28_conan-quickloot-width-archery-rollout.md`, `…_conan-clean-stage-ding-arrows-hud-loot-bars.md`.
>
> **ОЧЕРЕДЬ слов владельца (по порядку):** (0) ✅ линии разброса (`[OWNER]` «линии разброса у прицела вернулись - в моде арчери криника - убрать
> их» · 22:59) — теперь прячутся на каждом входе в прицел, B2 pass 23:01 (сам возврат за 3 прицеливания не воспроизвёлся — журнал назовёт его
> строкой «вернулись»); `-Only` ставит новый пак на место по манифесту (стенд, баг 06); (0а) окно лута: после «Забрать все» плашка трупа остаётся (F3 fail —
> пустое окно `Hidden`, а не `Collapsed`; баг 64 п. 35, слово «почему-то подсказка не закрывается»); (0б) `[OWNER]` «у окна квик лута нужно
> местами поменять текста "Забрать всё" и "Удерж."» (п. 34); (1) баг 64 п. 33: (а) «XP» и двоеточие слиплись — вариант правит принятый шаблон перевода
> (интервью #003, 299–300) → показать кадром варианты (узкий пробел перед двоеточием и др.); (в) «k» с одним знаком, мат. округление — формат
> собирает `Get_NumberXP` / `Get_ExperienceOutOfNeeded` (аргументы double в FText), правка — не одно число; (2) кнопка рыбалки (план 35, Б7);
> (3) аксессуары — UI кривой (баг 64 п. 27); (4) хаб — появляющиеся элементы (Б4, п. 26); (5) п. 42 — крупно и на носороге/слоне;
> (6) миникарта; (7) моды Krinik вверху списка в меню паузы; (8) версия 3.0.1 у модов Krinik; (9) физика стрелы; (10) README-PDF — пункты
> модов (план 35, Г11 п. 6). Хук назовёт и старые открытые кейсы: F3–F5, C1 окна лута, T2…X1 матрицы ПКМ 27.10.
> **Кейсы без прогона — первая работа нового чата, до очереди** (хук `test-after-code` остановил закрытие 2026-10-28 23:10 на 15 кейсах):
> `testcases/TC_conan_bow_camera_rmb_matrix_2026-10-27.md` — T2, T3, T5, T8, T10, T11, F5, X1 и др. (многие могли устареть после правок лука
> 27–28.10: прогнать на чистом стенде или закрыть статусом «superseded by <кейс>» с наблюдением); окно лута — F4 (сундук), F5 (1080p), C1
> (контроль на оригинальном паке). Владелец для них не нужен — нужен стенд (`HOUSE_RULES.md` §1) и настоящий ввод после простоя.
>
> **Физика стрелы (не начата):** `[OWNER]` «в новом чате полностью делаем физику в конане, как была в обливионе» (2026-10-28) — полёт стрелы как в Обливионе:
> постоянная гравитация `ProjectileGravityScale` 0,55 (ваниль Remastered), скорость = 5000 × (мин + (1 − мин) × заряд) см/с, где `мин` — НЕ 0,25 Обливиона:
> `[OWNER]` «для мгновенных выстрелов в конане нужно будет какой-то винимум поставить. не такой мелкий, как в обливионе» — настройка, кандидаты 0,4 / 0,5 / 0,6
> (падение на 10 м −0,67 / −0,43 / −0,30 м) на выбор его глазом; кривые `FC_BowProjectileGravCurve_*`
> и ослабление гравитации зарядом — убрать; сперва проверить, не зависит ли урон от скорости. Всё с источниками и таблицей падения —
> `researches/conan-archery/README.md`, раздел «Физика стрелы оригинального Обливиона». Кейсы — новым `testcases/TC_*.md` до кода; приёмка — падение на
> 10/20/30 м по таблице и глаз владельца.
>
> **Хвосты прежних передач (закрытие 2026-10-28 17:47, пп. 2–5; п. 1 и блоки 19:44 и 21:59 — летопись, запись 2026-10-28 23:09):**
> 2. **План 36 п. 14а — правленые паки распухают** (IMM_WAR 359 → 735 МБ, EoT 255 → 604): `retoc pack-raw` пишет `.ucas` без сжатия; место правки —
>    `_tools/src/retoc/retoc/src/iostore_writer.rs:68` (Oodle уже есть в `compression.rs:33`); после — пересобрать все `_krinik-modified` по рецептам
>    их записей манифеста и проверить каждый запуском. Бьёт по томам архива ≤ 700 МБ (план 35, Г10).
> 3. **Показ текстов, внесённых 28.10, в игре не видел никто** (IMM_WAR сообщения, журнал Ironlight, умения и места EoT, имена рыб) — смонтированы,
>    мир грузится; первый случай увидеть — кадр и кейс.
> 4. **Приборы прогона:** `_config/mouse-seq.ps1` (настоящий ввод SendInput, окно игры вперёд), `fov-sampler.lua` (пульт, `lua dofile`), `rmb-case.sh
>    <метка> <мс> "<шаги>"`; вид — `SwitchToFirstPersonCamera()`/`SwitchToThirdPersonCamera()` пультом; лук в руки — `InpActEvt_Shortcut0_…_25`.
>    Не читать пультом массивы структур монтажа (падение 20:29). Отложено владельцем: стрела сквозь рукоять при ходьбе (п. 44, «чинить попозже»).
> 5. **Клавиши:** живой `Saved/Config/Windows/Input.ini` — единственный источник в 3.0.1 (пакетный `_config/Input.ini` — старый, не возится). Сделано
>    при закрытой игре: левый Ctrl — присед, тяжёлая атака — средняя кнопка мыши, чаты с нумпада * и − сняты, уворот — боковая кнопка мыши
>    (владелец). Ждёт владельца: куда перенести сочетания мода камеры с Ctrl (Ctrl+5, Ctrl+/ сброс до заводской) — Alt+нумпад или нумпад . и *.
> 6. **Хвосты вечера:** баг 65 (падение после перезахода — починка подтверждена перезаходом 2026-10-26 23:23; до DONE — 10 мин игры + обход двойников);
>    ночь — свет Severe Weather выключен `dc SW_config disable_custom_GI`, сохранится ли после перезапуска — проверить (п. 40); плавный шаг зума
>    проверен (ZS1); баг 64 п. 27 аксессуары, 28 подписи опыта, 29 мелькание выбора стрел (Arrow Quick Swap?), 30 стрелки голода/жажды (ниже значков; владелец 00:1x «указатели так и не поднял ты» — первым после лука), 31 координаты миникарты — внутрь круга с подложкой, вся миникарта правее и выше, 32 при открытом быстром луте подсказку над трупом сдвигать левее (наложение подсказки обучения — «бог с ним»); п. 39 звон заряда — сделан 28.10 (звук C, п. 1 выше),
>    п. 38 золотой свет. У героя голод и жажда 0 % — читы пульта сняты перезапуском.
>
> **Долги сборки Конана — план 36 (`plans/36_conan_build_debts_plans.md`, с 2026-10-26 20:14):** 35 пунктов с часами, выполняются
> подряд (`[OWNER]` «пот по ним пиши планы» · «и по планам делаем»). Статус каждого — в таблице «Очередь» плана.
>
> Правила сессий Конана (кино, часы, чужие моды нативно, эталон настроек после выхода) — `HOUSE_RULES.md` §1, §6; прежний «Порядок нового чата» 17:40 — летопись, запись 2026-10-27 00:13.
> 0. **Сборка Конана 3.0.1 к релизу 1.0.0 — план 35 (`plans/35_conan_build_turnkey_quality.md`).** Решения владельца 26.10 вечером (план 35: Г5,
>    Г7, Г10–Г12, Б3, Б4, Б7): версия 1.0.0; архив — тома ≤ 700 МБ (8 паков больше 700 МБ → многотомный zip 7-Zip `-tzip -mx0 -v700m`, Г10); README
>    для PlayGround — PDF на «выцветшей старинной бумаге», стр. 1–2 на витрину, в исправлениях благодарность Taurin78 (Г11); крафт в инвентаре
>    на паузе — ускорить (Г12); хаб — без мерцаний и прыжков (Б4). Порядок владельца: техдолги → перевод → прогон по миру → тома и README.
>    Сделанное 26.10 16:54–19:40 (T2b, M2, H9, U7, LM1, S1e) — летопись, запись 2026-10-27 00:13.
>    **Дальше, по порядку (часы):** (1) Ragnar's New Factions: `RNF_Shared_WeightedSpawns` ссылается на 4 плавильщиков `RNF_NPC_WadaiFlesheaters_Smelter1–4`,
>    чьих таблиц спавна нет (ошибка автора): убрать ряды или добавить таблицы, KRINIK MODIFIED — ≈ 1 ч;
>    (2) Г12 крафт: один настоящий крафт «Бечевки» при открытом хабе (пульт крафт не ставит — кейс P1), замер, включить `CRAFT_SPEEDUP` — ≈ 1 ч;
>    (3) Б4: та же съёмка хаба на игре без паков (эталон), эмблема-«поздняк» (bugs/64 п. 26), деление по пакам — ≈ 2–3 ч; Б7: кнопку рыбалки
>    к Hosav и в её вид (вставляет `BPC_EFT_Tuning.Graft` в `ButtonContainerRight`) — ≈ 2 ч; (4) bugs/64 п. 21 ползунок Damage Meter, п. 23 карточки
>    классов EAA (текст нарисован в текстурах) — ≈ 2–4 ч; (5) цена модов q4 A-B-A-B — ≈ 1–2 ч; (6) архив на чистой игре и тома — ≈ 1–2 ч;
>    (7) README-PDF — после 1–6. Приборам: `close-game.ps1` и `long-run.sh` пусть сами закрывают `CrashReportClient` после падения
>    (`[OWNER]` «убирай за собой окна креш репортов, пожалуйста» · 2026-10-26 ≈19:39; правило — `HOUSE_RULES.md` §1) — 0,3 ч. Ждут владельца: интервью #025 (частота засад; прибор `rawf:` готов), «table» на карточке рыбы.
> 1. **Конан, главный поток — очередь замеров** (`[OWNER]` «Замеры ручек подгрузки … Ветка появления NPC … Эталон на чистой игре без паков модов» ·
>    «можно начинать их грузить дальше по дистанции, но больше кадров выделять. У меня много врам и рам»): пачки `ConanExiles/_config/bench-batches/`
>    (README — порядок до/после каждой): q1 (на лету) сделана 02:18 — бюджет подгрузки и пул текстур 8 ГБ в шуме, «без ткани» повтором
>    q3b опровергнут (40 против 36); шум облёта 36–52 рывка — решают только пары A-B-A-B (EXP-0335). Дальше q2 `s.AsyncPostLoadEnabled`,
>    q3 `p.Chaos.EnableAsyncInitBody`, q4 без паков модов. Разбор — `researches/conan-main-thread/README.md` §3–4.
> 2. **План 34 — переписать наши моды Конана** (`plans/34_conan_mods_cpu_respect.md`): по правилам Unliminium — события вместо опроса, общий
>    реестр `KrinikCore`, бюджет на кадр, самозамер; цена модов сейчас ≈ 0,4 мс, перехваты UE4SS ≈ 0. Выбор пути (шаг 3) — владельцу с цифрами.
> 3. Открыто с 25.10: обводка HUD резкая на 2 пикселя (`KrinikHudOutline`, не начато); окно Lore & Loot (и AMR, Emberlight, Pickup+, Horti) голым
>    `ActivateModule` не открывается — открыть их путём игрока; совместимость `ConanExiles/docs/17` (недостающие пакеты, Ancient Civ vs TDI, предмет
>    51420); масштаб DLSS 0,58 — показать владельцу.
>
> Сборка Конана 3.0.1 — 64 пака + 8 Lua-модов, всё монтируется (план 33; прежний «PARKED-ПОРЯДОК» — летопись, 2026-10-25 22:15).
> **Сварог ждёт за Конаном** (по порядку возврата): 00000 — волна багов владельца 2026-10-18 (план 32, баги 55–62, кнопка ⇅; летопись 2026-10-26 19:38);
> 0000–000 — пункты 17.10 (J4, J5, G1, поп-апы, волосы, хранилища, советы, кадры, HUD C3/C4/K1; летопись 2026-10-25 12:07); 00 — план 27
> (`plans/27_svarog_random_hero_traits.md`: починки 8–10 `AuthorBugs.cs` в бою, кейс R8; окно «Новый герой», «Защита Велеса», Staggered, атрибут > 95 → 90).
> Сварог — бюджет процессора, порядок прогона, решение MVP о прыжке: летопись, запись 2026-10-27 21:08 (перенесено дословно).

## Open bugs

Файлов без метки DONE — 29 (2026-10-18 13:45):

- 🔴 `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` — интерфейс модов сборки Конана 3.0.1, 26 пунктов: открыты 4, 5, 6, 12, 13 (частично),
  15–18, 21 (ползунок Damage Meter), 23 (карточки классов EAA — текст в текстурах), 26 (поздняя эмблема в хабе); закрыты кадром 2, 3, 7, 7b, 8–11,
  14, 16, 19, 20, 22, 24, 25 — порядок работ в плане 35.
- 🔴 Баги владельца 55–62 (2026-10-18 13:35–13:43, волна за 5 минут игры) — `bugs/55_…` – `bugs/62_…`; порядок и план 32 — пункт 00000 выше.

- ⏸ Баги игр на паузе (Сварог, GTA SA, Medieval Dynasty) — 15, 28, 29, 38, 40, 41, 44, 45, 47, 48, 49, 50, 51, 52, 54: файлы в `bugs/`, сводка — летопись, запись 2026-10-28 23:10.

- 🔧 `bugs/14_pickcard_exact_name_pins_old_file.md` (починено 2026-10-15, ждёт живого `kumm check`) — `kumm check` держится за старый файл, если автор когда-то
  вписал версию в имя файла (Bosses My New Besties, 02.10). Баг самого движка; план починки и кейс — в документе.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — симптом снят выключением мода, причина не найдена.
- 🔧 `bugs/08_conan_config_overrides_code.md` — починено, ждёт подтверждения владельцем.
- 🔬 `bugs/04_conan_camera_microjitter.md`, `bugs/05_conan_loadasset_delayed_abort.md` — разведка, без починки.

## KAIF — отправка и тикеты

KAIF 2.9 с 2026-10-16 (с 2.7 одним шагом; отчёт `reports/KAIF_UPDATES/KUMM_KAIF_2.9_UPDATE_REPORT.md`): факты проекта — в
`HOUSE_RULES.md`, хуки KAIF подключены в `.claude/settings.json` (клиент читает их при старте сессии). Отправка в KAIF — без спроса
владельца (`AGENT_GUIDE.md` → Notes from the human, его слово 18.09). Тикеты #72, #73, #78–#82 закрыты истоком в 2.8 (`bugs/KAIF/03–08_DONE_*`);
открыты #140 (`bugs/KAIF/09_*`, исток перенёс его в 2.10) и три тикета этого обновления — #150–#152 (`bugs/KAIF/10–12_*`).
#179 (`bugs/KAIF/19_*`, 2026-10-28): `/resume` стоит ≈ 140 тыс. токенов — предложено читать при входе «срез входа» каждого документа; до решения истока
ритуал читается целиком. С 2026-10-28 стоит хук `.claude/hooks/context-budget.mjs`: на 75 % окна — `/end-chat-soft`, на 85 % — `/end-chat-force` (`CLAUDE.md`).
