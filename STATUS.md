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

> **ПОРЯДОК НОВОГО ЧАТА** (`[OWNER]` «работай автономно 40 минут, затем закрывай чат, завтра продолжим» · 2026-10-26 ≈01:52). Что сделано в ночь
> 25→26.10 (эталон бенча, замеры главного потока, SCSKiller, переводы раскатаны) — летопись, запись 2026-10-26 01:56. Правила ночи — `HOUSE_RULES.md` §1:
> кино — слово «выключено» действует до обратного; наши моды в любой игре — уважительно к процессору.
> 0. **Сборка Конана по трём критериям владельца 2026-10-26** (абзац «Where we are now»): (а) стабильность — журналы и папка падений
>    всех сеансов 3.0.1, затем долгий прогон в фоне; (б) конфликты и работа модов — `ConanExiles/docs/17` (Ancient Civ vs TDI, боссы Bosses
>    vs Heritage/EAA, предмет 51420, 135 недостающих пакетов) и игровая функция каждого мода; (в) цена модов — q4 «без паков» парами
>    A-B-A-B, затем план 34. Пачки q2/q3 ниже (это настройка движка, не модов).
>    **Ход 26.10 (план 35, баг 64 — 18 пунктов):** сделаны камни от третьего лица (мод камеры удлиняет луч и поиск растительности под отдаление,
>    2,5 м), панель быстрых ячеек (наш `hud_pin`), перевод миникарты, панель Exiles Fishing по-русски правкой ассета (KRINIK MODIFIED,
>    `_krinik-modified/3718368769`). Прибор `ConanExiles/_config/devkit/patch-mod-asset.py` + `_tools/src/uaj` + `_tools/retoc-5.8`.
>    **Чат 26.10 закрыт в 14:01 (`[OWNER]` «далее делаем в новом чате, этот закрывай быстро с передачей дел»).** Сделано и проверено в игре:
>    53 строки байткода (Era of Trials, EAA, Hosav, миникарта) в `.locres` (поправка 15:2x: в игре проверены не все — многострочные подсказки
>    школ магии Era of Trials остаются английскими, хэш исходника не совпадает, баг 64 п. 7b); счётчик DPS сворачивается в левый верхний угол (D1); метрики
>    сервера Hosav выключены по умолчанию (D2); панель Exiles Fishing по-русски целиком своим пересчётом байткода (`_config/devkit/kismet.py`,
>    строки `lit:`, T4); «vanilla» = «ваниль» с мягким знаком (41 строка, прибор `_config/devkit/owner-terms-check.py`); `docs/17` п. 2–4 — не
>    потери (слияние таблиц по полям, EXP-0340); Hosav настройки не перечитывает (замер). Правленые паки (KRINIK MODIFIED): рыбалка, Damage
>    Meter, Hosav — `mods/_krinik-modified/<id>/`, команды пересборки — `krinikModified` в `modpack.json`. Игра закрыта, замок машины снят.
>    **Сессия 26.10 с 14:06 (запись 15:11)** (`[OWNER]` «Работай над этим автономно не менее полутора часа» — сборка, тесты, переводы, PDF-путеводитель):
>    путеводитель игрока `ConanExiles/docs/guide/Krinik-Conan-3.0.1-guide.pdf` (9 стр., исходник `guide-3.0.1.html`, поле `guide` манифеста);
>    перевод едет в архив игрока (запись `Krinik Russian Translation`); KRINIK MODIFIED: Simple Modlist (панель меню паузы не накрывает меню,
>    шрифт 15, ширина 680), Player Ignores Follower Collision (окно настроек по-русски; `uaj` теперь видит ряды таблиц), Hosav (HUD в две
>    колонки — урон, броня, вес / температура, еда, вода; «Опыт:» вместо значка XP; «1 HP»); `KrinikHudOutline` 0.2.0 — Roboto Bold ×1.1 (выбор владельца «hudA хорошо»), подпись F1 у свёрнутого счётчика урона; счётчик
>    кадров 16. Прогон: 64/64 паков, 20 мин без падений, журнал без новых классов, рыбалка «Применить на сервере» работает (T5). Кейсы —
>    `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md` (L1, L2, S1, H1–H5, Q1, T5, U1, U2b–U2d, U4b). Открыто новое: план 35 Г2–Г8
>    (Medium из скачанного Roboto, координаты миникарты, кадр панели ячеек без модов, настройки игры и Hosav для выгрузки, номер версии).
>    **ОСТАЛОСЬ ПО СБОРКЕ 3.0.1 — план 35 (`plans/35_conan_build_turnkey_quality.md`), по порядку:**
>    А2 перевод на кадре (подсказки школ магии Era of Trials — вкладка «Параметры»; меню славы, профессии EAA) · А5 меню паузы + Simple Modlist
>    (кадр, шрифт 12 → 15 строкой `prop:ModListBox/WidgetStyle/TextStyle/Font/Size`, место панели без наложения на колонку меню) · Б1 кнопки EAA
>    с длинным русским (шрифт или ширина через `prop:`; переноса склейкой нет) · Б2 полосы здоровья над мобами (модуль `HosavHUD_EnemyHealthbar`,
>    искать в бою) · Б3 кнопка «Настройки интерфейса» Hosav (п. 16, след `IsModuleActive`) · Б4 хаб «пляшет» на Q/E (п. 15, 17) · Б5 подсказка
>    EAA в стиле игры (п. 18) · Б6 сундук Caverns of Set (C1: открыть в пещерах; таблица `Caverns_of_Set_Loot_Chest_Table` отсутствует) ·
>    В1 цена модов — пачка q4 «с паками / без паков» A-B-A-B после слова владельца «кино выключено» · В2 план 34. Не проверено после правки
>    рыбалки: изменение значения и «Применить на сервере». Открытый вопрос владельцу: «table» у карточек рыб переведено «исходно» — оставить?
>    ⚠️ Закрыто силой 2026-10-26 14:01: обряды пропущены (проверка судьёй, обрезка STATUS, README, линтеры витрины) — их долг платит первый
>    /end-chat-soft. Стоящая ложь: нет («Hosav перечитывает настройки» — исправлено в кейсе D2 и в чате).
> 1. **Конан, главный поток — очередь замеров** (`[OWNER]` «Замеры ручек подгрузки … Ветка появления NPC … Эталон на чистой игре без паков модов» ·
>    «можно начинать их грузить дальше по дистанции, но больше кадров выделять. У меня много врам и рам»): пачки `ConanExiles/_config/bench-batches/`
>    (README — порядок до/после каждой): q1 (на лету) сделана 02:18 — бюджет подгрузки и пул текстур 8 ГБ в шуме, «без ткани» повтором
>    q3b опровергнут (40 против 36); шум облёта 36–52 рывка — решают только пары A-B-A-B (EXP-0335). Дальше q2 `s.AsyncPostLoadEnabled`,
>    q3 `p.Chaos.EnableAsyncInitBody`, q4 без паков модов. Разбор — `researches/conan-main-thread/README.md` §3–4.
> 2. **План 34 — переписать наши моды Конана** (`plans/34_conan_mods_cpu_respect.md`): по правилам Unliminium — события вместо опроса, общий
>    реестр `KrinikCore`, бюджет на кадр, самозамер; цена модов сейчас ≈ 0,4 мс, перехваты UE4SS ≈ 0. Выбор пути (шаг 3) — владельцу с цифрами.
> 3. Открыто с вечера 25.10: обводка HUD резкая на 2 пикселя (`KrinikHudOutline`, не начато); перевод — строка 4561 `dm-fish-ru.tsv` переписана,
>    не пересобрано; окна миникарты, Proximity Party, Lore & Loot не открывались (кейс RU2); «протестить наши моды»; совместимость
>    `ConanExiles/docs/17` (недостающие пакеты модов, Ancient Civ vs TDI, предмет 51420); масштаб DLSS 0,58 — показать владельцу.
> 4. **KAGO** (его агенту, не нам): `bugs/154` п.1 — `disarm()` не убирает расписку; перепроверка ⚖️ на драйвере 621.01 по рецепту STATUS KAGO.
>
> Сборка Конана 3.0.1 — 64 пака + 8 Lua-модов, всё монтируется (план 33; прежний «PARKED-ПОРЯДОК» — летопись, 2026-10-25 22:15).
> Сварог (пункт 00000 ниже) ждёт за Конаном; его старые пункты 0000 и 000 — летопись, запись 2026-10-25 12:07.
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
