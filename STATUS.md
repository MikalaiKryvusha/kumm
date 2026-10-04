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

> **05.10 01:05–02:20 — Svarog's Dream, лаг и белёсость:** упор игры — один главный поток процессора (69–81 % ядра, всего
> ≈2 ядра из 16, видеокарта 12–35 %). Сделано: значки только в 100 м от героя (до горизонта стоили до 17 мс), кости
> невидимых не двигаются, персонажи дальше 300 м спят — вариант А владельца (`researches/svarogs-dream/simulation.md` —
> как устроены ИИ и живой мир игры). Тяжёлый состав мира: 18.7 → 59.6 FPS. «Лаг через минуту» — перескок центра
> подгрузки 5×5 на границе участков. Баг 15: белеет сама земля, ведущая версия — френель стандартного шейдера; Unity
> 2020.3.49f1 установлен под свой шейдер. Отчёт `testcases/reports/2026-10-05_svarog-perf-icons-characters.md`, сборка
> `89a0629`. Владелец: «понял. закрываем чат. Спасибо».

---

## Where we are now

> 🎯 **Последняя сессия (05.10) — Svarog's Dream**: досье `games/SvarogsDream/README.md`; передача дел — пункт 0а.
>
> **Conan Exiles Enhanced 2.2.3** (пак `D:\work\ai_sandbox\ConanExiles`, игра
> `D:\Games\Conan Exiles 2.2.3\Conan Exiles`, подробности — досье `games/ConanExiles/README.md`). Переезд сделан
> 02.10; старая 2.1.1 (`D:\Games\Conan Exiles`) удалена по слову владельца «можешь удалять старый конан». Palworld — в
> ежедневном пользовании владельца, правок не ждёт. **Oblivion Remastered запаркован до патча —
> игры на диске нет**, не ходить туда и не предлагать по ней работу, пока владелец не скажет.

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
      **Свежий довод из практики:** `r.ViewDistanceScale` живёт в ЧЕТЫРЁХ местах с ТРЕМЯ разными
      значениями (мод 1.0, `_config/Engine.ini.SystemSettings-tuned.ini` 2.6,
      `_config/Krinik-Palworld-UE5-Engine.ini` 2.2), и побеждает мод. Это конкретный автономный
      кусок Phase 3 (`MASTER_PLAN.md`).
      **И второй довод, из Конана 08.09.2026: соперник бывает не мод, а САМА ИГРА.** Прибор
      `ConanExiles/_config/check-conflicts.py` показал, что игра ставит `r.ViewDistanceScale` и
      `grass.CullDistanceScale` из групп качества, применяемых ПОЗЖЕ нашей секции, — то есть наши
      значения проигрывали молча. Прибор простой (сверка нашего ini со снимком журнала игры) и
      просится в движок как общая проверка, а не как скрипт одного пака.

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

0а. **▶ ПЕРВЫМ В НОВОМ ЧАТЕ — баг 15, свой шейдер земли** (`[OWNER]` «шейдер будем завтра компилировать. Сегодня только
   установи юнити» · 2026-10-05 ≈02:10). Готово: Unity 2020.3.49f1 (сборка игры `18249dd5551b`) в `E:\Unity\2020.3.49f1`,
   Unity Hub в `C:\Program Files\Unity Hub`. **Сначала спросить владельца, вошёл ли он в Unity Hub** (лицензия Personal —
   только входом в Hub, ручной активации нет); проверка — есть ли `C:\ProgramData\Unity\Unity_lic.ulf`. Затем: пультом
   `call` узнать `Camera.actualRenderingPath` (forward / deferred — решает, какой шейдер подменять: террейна или общей
   модели освещения) → проект Unity в `SvarogsDream` (вне `src` модов), шейдер без френеля, сборка пакета ресурсов
   пакетным режимом (`Unity.exe -batchmode -nographics -projectPath … -executeMethod … -quit -logFile …`) → загрузка модом
   (KrinikColorRework) → пара кадров при застывшем солнце (`timescale 0`, `call WorldTime IncreaseTimeByOneHour true`,
   `call WorldTime SetInstantSungAngle`, `TestFaceSun 15 0`). Всё по багу — `bugs/15` (раздел 2026-10-05, источники
   сообщества); блеск слоёв и трава опровергнуты, блики на воде владелец хочет сохранить.
   **FPS:** сделано (значки 100 м, кости, сон дальних 300 м — настройки в меню модов «Icons» и «Дальность»). Не проверено:
   пробуждение дальних при подходе героя и исключения сна в деле (спутники, задания) — посмотреть при игре. Следующее после
   шейдера — эпик «мир живёт без героя»: разведка и архитектура с кодом — `researches/svarogs-dream/living-world/` (README — пять выводов), мета-план `plans/12_EPIC_*`, **ждут ответа владельца** три вопроса `interviews/interview_005_living_world.md`. Приборы: пульт `perf`,
   `prof`, `animcull`, `particles`, `farchars`, `terrainshader`, `timescale`; потоки игры —
   `powershell -File SvarogsDream/tools/threads.ps1 -Seconds 6`; правки сравнивать переключением в одном мире (EXP-0139).
   Список «На завтра» эпика 10 — пункт 0, после шейдера.
0. **Svarog's Dream — переработка UI** (глобальная миссия владельца; план, пункты и статусы — `ideas/07_svarog_mods.md`;
   канон мода — рулбук `SvarogsDream/docs/UI_RULEBOOK.md`, черновик агента, ждёт «да» владельца).
   **▶ ЭПИК 10 «красота меню»** — `plans/10_EPIC_svarog_menu_beauty.md` (одобрен: `[OWNER]` «да, суппер план!» · 2026-10-04
   ≈23:40; порядок — «80% ценности за 20% усилий», остатки — тикетами). ✅ фазы 1–5: читаемость, окно персонажа на тёмной
   бумаге, спокойная радуга (`[OWNER]` «оставь радугу, все же это задумка автора. можно пестрость снизить» · 2026-10-05),
   таблицы «Прогресс» и «Атрибуты» (`Tables.cs`), подсказка навыка (сплошная, без дыры, «Цена:» / «Откат:»); 🔧 фаза 6 —
   сделана страница бога в «Преданности». Отчёты — `testcases/reports/2026-10-0[45]_svarog-epic10-*`.
   **▶ ПОСЛЕ ШЕЙДЕРА (пункт 0а)** — список «На завтра» в эпике (`plans/10`, раздел в конце; `[OWNER]` «остальное - в планы,
   завтра будем делать» · 2026-10-05): остаток фазы 6 (подсказки «Выберите…», страница бога в «Альманахе», полоса под
   вкладками), фазы 7 (квесты) и 8 (карта), мелочи. Перед этим — две проверки глазом: пузырь у здания поверх крыши
   (`ideas/07` п. 27, правка `40c118f`) и значки над головами (зазор 1.2 м, `6fd2f02` — кадром с жителем не снято).
   Значки в мире — `Icons.cs` (`ideas/09`): один размер на кадр от приближения камеры, вблизи +30% (кадром не проверено),
   жители и станции — строго сверху, предметы и травы — вверх-влево; настройки — раздел «Icons» в меню модов.
   Тикеты: `bugs/18` (подсказка мини-карты), `bugs/19` (Vibepollo: проверить на конце следующей сессии стрима — в
   журнале помощника `%APPDATA%\Sunshine\logs\sunshine_display_helper-*.log` строка `success=true` без «golden snapshot
   remains pending»). Лист обхода — `SvarogsDream/gallery/game/2026-10-04_вкладки-меню/index.html`. Пути пульта:
   `click UI/Enablers/InfoPanel` · вкладки `UI/InfoPanel/InfoPanelHeader/<Map|Quests|Progress|Logs|Almanac|Help>Header` ·
   `click UI/Enablers/CharacterPanel` · `UI/CharacterPanel/CharacterPanelHeader/<Devotion|Attributes|Mastery>Header`.
   Замеры: `tools/contrast.py` (WCAG) и `tools/textrows.py` (высота строк). Реплика героя по требованию —
   `h.sh "call PlayerCommentsManager MakeComment Bara 1"`.
   Открыто: п. 22 — совет на экране загрузки выше; п. 25 — записка (светлая бумага, мелкий серый текст); окно жителя — пустая бумага под ответами и отступ под портрет (спрошено, ответа нет); шрифт с
   широким набором знаков (`[OWNER]` «найти какой-нибудь шрифт красивый, в котором много символов»); не проверены в игре —
   ярлыки «Надето» / «У торговца», колонки разной ширины, толщина жирного; баг 15 (белёсость против солнца); п. 17 — весь
   HUD крупнее, «но это позже».
   **Как работаю с игрой сам** — досье `games/SvarogsDream/README.md` (пульт, запуск, мышь, кадры, голос, слоты сумки).
   Решения владельца ждут: **(а)** преследование врагов у него на СКМ (`gameSettings` KeyCodes[38] = Mouse2) —
   переназначить в «Управлении», камеру на 4/5 или развести модом; **(б)** свой перевод ~11 000 строк
   (`translation/untranslated.txt`, DeepL русификатора отвечает «Too many requests») силами Claude — дорогой, только по
   слову; имя мода — `KrinikRussianLocalosation` или `…Localization` (уточнить); перевод — две задачи, не одна
   (`ideas/07`, раздел «Перевод — на будущее»).
1. **Конан на 2.2.3 — хвосты переезда.** Досье, раздел «✅ 2026-10-02»: графика на 4K — глазом владельца,
   Doubled Storage Size своим модом (шаг 6а), PauseGame — вернуть, если автор перевыложит. Старая 2.1.1 удалена.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Шесть файлов в `bugs/` без метки DONE, статусы — раздел «Open bugs»
   ниже. Единственный открытый баг самого движка — 06 (`-Only` обрезает `modlist.txt`).
4. **Следующее обновление KAIF** — после прохода `node tools/kaif-update-sweep.mjs <старый бандл> <новый бандл>`,
   пока исток не закрыл #72; навыки с нашими заполнениями сливает `node tools/kaif-update-merge-skills.mjs` (#73).
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (36 случаев). Хук Bash подключён в
   местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
6. **Palworld** — в ежедневном пользовании, правок не ждёт. Досье `games/Palworld/README.md`; три замороженных
   опыта и правила замера — `PROJECT_HISTORY.md`, запись 12.09. **Oblivion** запаркован до патча.
7. **Два линтера KAIF красные по старым долгам, не по этой сессии.** `kaif-attribution-lint` — 11 мест, где слово
   владельца пересказано без цитаты (летопись, идеи 01/04/05, план 01, `researches/conan-devkit`), базы нет;
   `kaif-scenario-lint` — 2 (`plans/02`:38, `ideas/04`:160). Чинить цитатой из архива или принять базу
   `--write-baseline` — решение следующей сессии; `check` и `check --gate-budgets` при этом зелёные.

## Open bugs

Одиннадцать файлов без метки DONE (сверено 04.10 23:38 по `ls bugs`, плюс 18 и 19; 16 и 17 закрыты в этот вечер):

- 🔴 `bugs/18_svarog_minimap_tooltip_overlap.md` — подсказка мини-карты: «Направления» налезает на «1077м», курсив (тикет).
- 🔧 `bugs/19_vibepollo_stale_golden_snapshot.md` — Vibepollo: снимок экрана переписан под текущий экран, ждёт проверки
  концом сессии стрима.
- 🔬 `bugs/15_svarog_whitish_world_against_low_sun.md` — белеет сама земля против низкого солнца; ведущая версия — френель стандартного шейдера; свой шейдер — пункт 0а.
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
