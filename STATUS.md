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

> **06.10 утро — Svarog's Dream, один шрифт и переверстка:** Manrope (5 весов) во всей игре, включая меню и загрузку;
> «Прогресс» и статы инвентаря переверстаны (`[OWNER]` «да, теперь красиво» · ≈09:00); окно книги — тёмная бумага; перевод —
> аудит качества и единые термины. Vibepollo — баг 19 DONE (4K после отключения). Отчёт —
> `testcases/reports/2026-10-06_svarog-manrope-progress-stats.md`; кадры — `SvarogsDream/gallery/game/2026-10-06_шрифт-и-статы/`.

---

## Where we are now

> 🎯 **Svarog's Dream — снова главное** (`[OWNER]` «в новом чате продолжим со Сварог Дрим» · 2026-10-05 ≈20:55): досье
> `games/SvarogsDream/README.md`; передача дел — блок «Первым делом» ниже (переверстка экранов, Manrope).
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

**Первым делом новому чату — Svarog's Dream: переверстка экранов по чек-листу** (`[OWNER]` «Нужно переверстать все экраны.
Везде поиграться с размерами шрифта, с его весом согласно ЧУВСТВА ПРЕКРАСТНОГОО» · ≈08:22; «в новом чате продолжим с этого места» ·
≈09:16). Чек-лист и экраны со статусами — `testcases/TC_svarog_ui_beauty.md`.
- **Сделано 06.10:** Manrope везде — шрифт TMP у русификатора (`AutoTranslator/Config.ini` → `OverrideFontTextMeshPro=krinik_manrope`,
  копия старого конфига `Config.ini.bak-2026-10-06-rus_font`), старые `UI.Text` и меню — мод (`KrinikUIRework/Fonts.cs`, свой пакет
  `krinik_manrope_ttf`); «Прогресс» (`ProgressLayout.cs`) и статы инвентаря (`StatsLayout.cs`) — стиль принят; окно книги (`Notes.cs`).
- **Пересборка шрифтов** — досье `games/SvarogsDream/README.md`, раздел «Шрифт Manrope».
- **Перевод свой с 10:23** (DeepL выключен, глоссарий, «Помощь», советы, имена умений и талантов) — летопись, запись ниже
  этой даты; порядок работы — досье `games/SvarogsDream/README.md`, раздел «Перевод — свой, по глоссарию».
- **11:27–11:35 — умные карточки** (`TooltipFit.cs`, `ideas/07` раздел «Умные карточки»): не режутся краем, сторона — где
  есть место; проверены карточки «Мастерства», остальные — `[NOT-TESTED]`.
- **13:00–13:38 — карточка навыка своим переводом целиком** (SvarogsDream `81caeca`, `10871dd`): 353 текста базы умений и
  102 имени, правило на шаблон — на любое число, рамка («Рост: Ловкость ×2 за каждые 100 очков», «маны», подсказки), приписки
  «(Порядок)», «(пассивный навык)», «(улучшение)». Видено на 8 карточках Меткого Стрелка; порядок работы — досье, раздел «Перевод».
  Отчёт `testcases/reports/2026-10-06_svarog-skill-card-translation.md` (partial).
- **13:40–14:18:** карточка навыка растёт по тексту (шире, шрифт −5 %, рост вверх, при «особой необходимости» шрифт мельче) —
  видено в игре; совет загрузки — посередине между картинкой и полосой; тексты 62 советов — без тире, с большой буквы; 321
  машинная строка с неверным термином — своим переводом (по словарю 294 → 0), подписи классов. Отчёт
  `testcases/reports/2026-10-06_svarog-skill-card-grow.md` (partial: переводы в игре не смотрены — `[OWNER]` «без отсмотра в игре»).
- **Дальше — первым:** (а) **шрифт «мудрости» Gabriela** — выбран и утверждён (`[OWNER]` «В» · «утверждено» · между 14:03 и 14:18), охват:
  советы, письма, книги, заметки, журнал; технические окна с числами — Manrope; проба — правый нижний угол HUD (`ideas/07` п. 28;
  образцы — `SvarogsDream/gallery/game/2026-10-06_шрифт-мудрости/`); (б) переводы дальше (`[OWNER]` «больше тебе такая
  лингвистическая работа»): имена эффектов — сделаны (38, точными строками в `zz_krinik.txt`, SvarogsDream `f53740b`); дальше — остальные машинные описания предметов;
  (в) показать владельцу имена умений, улучшений и талантов (`glossary_skills.tsv`, `glossary_talents.tsv`, все `[AI]`).
- **Потом по чек-листу:** Альманах (записи) · События (запись) · карта; окно книги — бумага по размеру текста; в меню «Загрузить
  игру» заходит на мазок; иконка поверх «Мировой Порядок: 69%» на странице бога. **Каждую правку перевода смотреть в игре** —
  полное слово может не влезть («Состояние Души» в «Мастерстве» → исключение «Душа:»). Путь в дереве брать из дампа (`dump`).
- **Долги:** кто сдвигает числа «Прогресса» после раскладки — не найдено (не `ForceUIResizing`, опыт 09:31); держит настройка
  `Progress.HoldNumbers`. Проверять после чистого перезапуска игры — горячая перезагрузка оставляет старые компоненты и метки.
- ❓ **Ждёт слова владельца:** (а) имена умений (`translation/glossary_skills.tsv`) и прочие имена глоссария — классы он принял
  (`[OWNER]` «Классы переименованы - да, суппер» · 11:24); (б) баг 20 (щелчок по жителю сквозь меню) — повтор, когда игра свободна.
- Прежняя очередь (часы под картой, настройки модов, совет загрузки, прокачка за 100) — летопись, запись 06.10 09:53.

0а. **Эпик 10 «красота меню»** — фазы 1–6 закрыты, фаза 7 («Квесты») доведена в эпике 13 (строка «Первым делом»), осталась
   фаза 8 (карта) и мелочи — `plans/10_EPIC_svarog_menu_beauty.md`, раздел «На завтра». Прошлое — `PROJECT_HISTORY.md`, запись
   2026-10-06 02:07 +03:00. До DONE бага 15 — увидеть подмену земли при ходьбе; FPS — проверить пробуждение дальних при подходе героя.
   Шейдер пересобирается: `E:\Unity\2020.3.49f1\Editor\Unity.exe -batchmode -nographics -quit -projectPath
   SvarogsDream/unity/KrinikShaders -executeMethod KrinikBuild.Bundles` (≈30 с).
0. **Svarog's Dream — переработка UI** (глобальная миссия владельца; план, пункты и статусы — `ideas/07_svarog_mods.md`;
   канон мода — рулбук `SvarogsDream/docs/UI_RULEBOOK.md`, черновик агента, ждёт «да» владельца).
   Значки в мире — `Icons.cs` (`ideas/09`): один размер на кадр от приближения камеры, вблизи +30% (кадром не проверено),
   жители и станции — строго сверху, предметы и травы — вверх-влево; настройки — раздел «Icons» в меню модов.
   Тикеты: `bugs/20` (щелчок сквозь меню). Лист обхода — `SvarogsDream/gallery/game/2026-10-04_вкладки-меню/index.html`. Пути пульта:
   `click UI/Enablers/InfoPanel` · вкладки `UI/InfoPanel/InfoPanelHeader/<Map|Quests|Progress|Logs|Almanac|Help>Header` ·
   `click UI/Enablers/CharacterPanel` · `UI/CharacterPanel/CharacterPanelHeader/<Devotion|Attributes|Mastery>Header`.
   Замеры: `tools/contrast.py` (WCAG) и `tools/textrows.py` (высота строк). Реплика героя по требованию —
   `h.sh "call PlayerCommentsManager MakeComment Bara 1"`.
   Открыто: п. 22 — совет на экране загрузки выше; п. 25 — записка: тёмная бумага есть (06.10), бумага по тексту — нет; окно жителя — пустая бумага под ответами и отступ под портрет (спрошено, ответа нет); шрифт с
   широким набором знаков — найден: Manrope (`[OWNER]` «мне нравится манропе» · 06.10); не проверены в игре —
   ярлыки «Надето» / «У торговца», колонки разной ширины, толщина жирного; п. 17 — весь HUD крупнее, «но это позже».
   **Как работаю с игрой сам** — досье `games/SvarogsDream/README.md` (пульт, запуск, мышь, кадры, голос, слоты сумки).
   Перевод (пункт 0а): `translation/untranslated.txt` (~11 000 строк) и `translation/translated.tsv` (переводить заново по
   английскому); имя мода — `KrinikRussianLocalosation` или `…Localization` (уточнить у владельца, когда возьмёмся).
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

- 🔴 `bugs/20_svarog_world_click_through_open_menu.md` — щелчок по жителю сквозь открытое меню начинает разговор.
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
