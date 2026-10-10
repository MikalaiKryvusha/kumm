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

> 07–08.10 и Medieval Dynasty до паузы; Сварог 09.10 день и небо до 10.10 02:03 — летопись, запись 2026-10-10 03:38.
---

## Where we are now

> 🎯 **Svarog's Dream — главное с 2026-10-09** (`[OWNER]` «забей на Medieval Dynasty … мы работаем дальше над Сварогом» · ≈13:25;
> масштаб: 16:9 на 720p, 1080p, 2K, 4K — `MASTER_PLAN.md`). Medieval Dynasty — на паузе, абзац ниже — для возврата.
>
> **Medieval Dynasty (на паузе)** — пак `D:/work/ai_sandbox/MedievalDynasty`, эпик 15 (`plans/15_…`, фаза 0 — `plans/16_…`),
> баг 29 (HDR) открыт; чек-лист возврата — летопись, записи 2026-10-09 19:41 и 2026-10-10 03:38.
>
> **Svarog's Dream — снова в работе** с 2026-10-09 (`[OWNER]` «продолжаем делать Сварог Дрим» · «грумим беклог, смотрим, какие
> простбы, баги, идеи остались не выполнеными, обсуждаем» · до 08:32): досье `games/SvarogsDream/README.md`; передача дел — летопись,
> запись 2026-10-08 02:20; **беклог после груминга 09.10 — чек-лист `plans/18_svarog_backlog_checklist.md`** (идти по нему). Medieval Dynasty при этом не закрыт (интервью #010 ждёт).
> **2026-10-10 01:31–02:52 — по слову владельца** («работай автономно два часа» → «до 4 утра»; владелец ушёл спать ≈02:16).
> - **Баг 32 DONE** — синий фронт у Бора: дальняя граница камеры по высотам участков, не по плоскости через героя
>   (`bugs/32_DONE_…`, EXP-0197). Владелец: «бак ушел».
> - **Экран карты** — правая колонка блоками на одной линии, мазок убран; 4 разрешения
>   (`SvarogsDream/gallery/game/2026-10-10_карта/`).
> - **Небо:**
>   - падающие звёзды трёх типов (были невидимы — хвост по хорде уходил под сферу);
>   - светила стоят в мире, не едут за наклоном камеры;
>   - облака только над настоящим горизонтом — кандидат на «белую полосу и мерцание ночью», по заказу не воспроизведено.
>
>   Отчёт `testcases/reports/2026-10-10_svarog-meteors-moon-dx12.md`.
> - **Эпик-мод 19 «разгрузить главный поток»** (`plans/19_EPIC_svarog_main_thread_offload.md`):
>   - разведка 651 строка;
>   - DX12 — минус 1 мс, не включать;
>   - наш UI-мод давал рывок раз в секунду — убран, low 1 % 14 → 46 FPS;
>   - цена наших дальностей: трава 2.3 мс, тени 1.1 мс — сравнено 2026-10-10 09:42–09:48, оставлены 500 м и ×3 (пункт 1 ниже).
>
>   Отчёт `…/2026-10-10_svarog-main-thread-phase1.md`, EXP-0198.
> - **Режим «Железного человека»** пишет сейв сам (выход, таймер, смерть). Промот ночи в лесу убил героя — откат на копию; ночь
>   проверять только на `timescale 0` или в деревне (память `svarog-ironman-night-skip-kills-hero`).
> - **«Преданность»** — блок «Отношения» под описанием «Божьего Вмешательства» у всех восьми богов, 4K и 720p
>   (`testcases/reports/2026-10-10_svarog-devotion-overlap.md`).
> - **Судьи ночи** — 03:02 (работа до 02:56) и 03:36 (работа 03:02–03:30): оба «проверено с оговорками», оговорки исправлены по месту.
> - Точка сверки сейва — `_backups/svarog-saves-2026-10-10_0216-owner` (его выход перед сном, Бор, ночь). Реестр — 4K, как у
>   владельца.
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

> **Medieval Dynasty (на паузе) — чек-лист возврата (интервью #010, план фазы 1, KARMA К2, как гонять игру, моды пака, долг
> закрытия 16:35) — летопись, запись 2026-10-09 19:41, раздел «Перенесено из STATUS дословно».**
>
> **Svarog's Dream — ждёт слова владельца (после ночи 2026-10-10):**
> 1. **Трава и тени — сравнено 09:42–09:48** (`SvarogsDream/gallery/game/2026-10-10_трава-тени/`):
>    - трава 300 м — −2.4 мс к среднему трёх замеров 500 м (400 м — −0.9), но даль желтеет и лысеет — по условию владельца не берём, оставлено 500; путь — шейдерная трава гуще (план 18,
>      «Ночь — что показало демо»);
>    - тени ×2 днём без выигрыша, лес вдали плоский — оставлено ×3. Лист — владельцу на глаз.
> 2. ~~Подпись «Быстрое Перемещение»~~ — `[OWNER]` «так и оставить. Можно нопку сделать шире» · 2026-10-10 ≈09:10 — сделано 09:36: колонка шире,
>    кегль игры, 4 разрешения (SvarogsDream `352168b`).
> 3. **Демо в 4K — v1 готово 10:04** (`SvarogsDream/gallery/game/2026-10-10_демо-4K/демо-4K-v1.mp4`, 55 с, 11 сцен) — `[OWNER]` «давай
>    демо запишем … по 10 секунд на сцену … по 5 секунл на сцену» · 2026-10-10 ≈09:10. Ночь показала: **белая полоса есть** (туман); «луна срезана справа» — ошибка агента, это фаза первой четверти (поправка ≈10:24 по кадру `sky_cs`);
>    птицы, дождь, сияние, падающие звёзды не вошли — переснять после починки (план 18, «Ночь — что показало демо»).
>    **v2 — небо, 10:52** (`…/демо-небо-4K-v2.mp4`, 102 с, 17 сцен по 6 с): `[OWNER]` «ДОЛГИЕ сцены … ночное небо! Разного цвета луны в
>    небе, аура разного цвета! а ты в бору крыши и лес снимал!» · 2026-10-10. Сделано: пять палитр сияния и пять оттенков луны на ночь
>    (шейдер + `Sky.cs`), часы игры стоят (`fieldon`), камера отвязана и смотрит в небо. Рассвет и закаты на записи экрана белые (кадры
>    движка пастельные) — не вошли; какую картинку видит владелец на экране — не проверено (EXP-0200).
>    Падающие звёзды (11:26): голова не застывает, хвост короткий за головой и гаснет на месте, болиды 0.8–2.1 с — по слову владельца.
>    **Опыт URO (11:29) — без выигрыша:** анимация дальних раз в 4 кадра даёт −36 % сдвинутых трансформов, а главный поток тот же; цена
>    дальних — сами жители (EXP-0203). Следующий опыт — разложить жителя по частям (план 19).
> 4. **Эпик 19 — карта потока снята в одной сцене из трёх** (Бор ночью, по стадиям PlayerLoop; лес ночью и бой — нет; development-плеер
>    вручную, `tools/player-swap.sh`; отчёт `testcases/reports/2026-10-10_svarog-devplayer-map.md`):
>    - жители дальше 150 м — утренние ≈3–4 мс были со старой службой значков; после её правки 24 дальних стоят **−0.85 мс**, почти всё —
>      агент навигации (пишет позицию каждый кадр); коллайдеры, рендеры, скрипты, аниматоры — 0 (`testcases/reports/2026-10-10_svarog-far-parts.md`,
>      EXP-0205). Сон ради кадров не нужен. Навигация (0.97 мс — синхронизация трансформов агентов, поиск пути ≈0): правка «вне кадра —
>      позиция реже» выигрыша не дала, откатана — цена у видимых в 40–80 м (EXP-0206, `…/2026-10-10_svarog-offscreen-agents.md`);
>    - профиль после правок (12:39): кадр 19.40 → 15.85 мс; верх теперь у игры — трава 1.53, навигация 1.22, холсты 1.29; рельеф
>      инстансингом у игры уже включён (`…/2026-10-10_svarog-profile-after-icons.md`). Владелец играл 13:35–14:35 в 720p — копия сейва
>      `_backups/svarog-saves-2026-10-10_1440-owner` (новая точка сверки), реестр 1280/720/1 оставлен как у него;
>    - значки UI-мода — **переписаны по правилам Unity 12:09–12:22** (`[OWNER]` «ну так переделывай правильно!» · 2026-10-10):
>      камера стоит — главный поток 16.3–16.6 → 13.1–13.6 мс, 61 → 68–76 FPS, сдвигов интерфейса 187 → 6; вид тот же на 720p–4K
>      (`testcases/reports/2026-10-10_svarog-icons-service.md`); лучи камеры — по движению, −0.09 мс. Сторож `tools/rest-check.sh`
>      в `deploy-hot.sh` (EXP-0204). Наведение на значок не меняло курсор — причина шире: 40 лучей мыши игры бьют на 100 м, а наше
>      отдаление ставит камеру на 123.8 м (курсор, щелчки, заклинания, питомцы) — мод камеры 1.3.1 удлиняет их ×`MaxZoomFactor`, сторож
>      `tools/ray-reach-check.sh` в `run-game.sh`; **мышью не проверено** — прогон, когда владельца нет у экрана (баг 33);
>    - `[OWNER]` «и нахуй ПО НОВОМУ скомпилироватьт!» · 2026-10-10 ≈09:16 — три ступени в плане 19.
> 5. **Перевод:** баг 28 — остаток 65 строк (эпитафии и итоги — склейки игры; проверка в игре — только смертью героя на КОПИИ сейва,
>    при владельце: «Железный человек»), `bugs/28_…`; 34 имени ждут слова владельца — `SvarogsDream/translation/names_pending_owner.tsv`.
> 6. **«Преданность»:** «Перезарядка» поверх портрета — контур не лёг (C4 fail, откатано), план 18; вкус места — владелец.

1. **Конан на 2.2.3 — хвосты переезда.** Досье, раздел «✅ 2026-10-02»: графика на 4K — глазом владельца,
   Doubled Storage Size своим модом (шаг 6а), PauseGame — вернуть, если автор перевыложит. Старая 2.1.1 удалена.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Одиннадцать файлов в `bugs/` без метки DONE, статусы — раздел «Open bugs»
   ниже. Единственный открытый баг самого движка — 06 (`-Only` обрезает `modlist.txt`).
4. **Следующее обновление KAIF** — после прохода `node tools/kaif-update-sweep.mjs <старый бандл> <новый бандл>`,
   пока исток не закрыл #72; навыки с нашими заполнениями сливает `node tools/kaif-update-merge-skills.mjs` (#73).
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (138 случаев). Хуки (heredoc, методичка
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
- 🔧 `bugs/33_svarog_mouse_rays_100m_at_zoom_out.md` — 40 лучей мыши игры на 100 м против камеры на 123.8 м: правка 1.3.1 выложена,
  места сходятся с переписью; наведение и щелчок мышью не прогнаны (владелец был у экрана).
- 🔴 `bugs/29_md_hdr_menu_washed_after_auto_hdr.md` — HDR: Auto HDR выключен для exe, мир принят, инвентарь (UI) пересвечен.
- 🔴 `bugs/28_svarog_code_strings_outside_all_dictionaries.md` — строки кода игры вне всех словарей (класс бага 27): 1106 → 65 (63 уник., только склейки — нужны правила r:/sr:); судья 19:45 —
  с оговорками; C7 перевода богов в игре не прогнан.
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
